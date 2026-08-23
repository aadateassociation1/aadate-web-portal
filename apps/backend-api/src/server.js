import cors from "cors";
import crypto from "node:crypto";
import express from "express";
import fs from "node:fs/promises";
import multer from "multer";
import path from "node:path";
import webPush from "web-push";
import { config } from "./config.js";
import { pingDatabase, pool } from "./db.js";

const app = express();
const otpStore = new Map();
const passwordResetStore = new Map();
const SESSION_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;
const PERSISTENT_UPLOAD_ROOT = path.resolve(process.cwd(), config.uploads.root);
const UPLOAD_ROOT = path.join(PERSISTENT_UPLOAD_ROOT, "trader-documents");
const MOBILE_CHANGE_UPLOAD_ROOT = path.join(PERSISTENT_UPLOAD_ROOT, "mobile-change-documents");
const COMPLAINT_UPLOAD_ROOT = path.join(PERSISTENT_UPLOAD_ROOT, "complaint-documents");
const POST_UPLOAD_ROOT = path.join(PERSISTENT_UPLOAD_ROOT, "post-documents");
const CONTENT_UPLOAD_ROOT = path.join(PERSISTENT_UPLOAD_ROOT, "content-documents");
const COMMITTEE_UPLOAD_ROOT = path.join(PERSISTENT_UPLOAD_ROOT, "committee-photos");
const MAX_MEDIA_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_DOCUMENT_UPLOAD_BYTES = 5 * 1024 * 1024;
const REQUIRED_TRADER_DASHBOARD_DOCUMENT_TYPES = ["profile_photo", "aadhaar_masked", "pan", "market_registration"];
const DATA_RETENTION_DAYS = 7;
const DATA_RETENTION_MS = DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const RISK_NOTIFICATION_RETENTION_DAYS = 90;
const RISK_NOTIFICATION_RETENTION_MS = RISK_NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const DATA_RETENTION_CHECK_INTERVAL_MS = 10 * 60 * 1000;
const DOCUMENT_TYPE_LABELS = {
  profile_photo: "Profile photo",
  shop_allotment: "Gala ownership document",
  market_registration: "Market license",
  aadhaar_masked: "ID proof Aadhaar",
  pan: "PAN card",
  other: "Other document",
};
const MARKET_PRICE_CATEGORIES = new Set(["vegetable", "fruit"]);
const MARKET_PRICE_UNITS = new Set(["Kg", "Quintal", "Dozen", "Piece", "Bunch", "Bundle", "Crate", "Box", "Tray"]);
const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_UPLOAD_BYTES, files: 1 },
});

function isValidVapidPublicKey(value) {
  if (!value || /\s/.test(value)) return false;
  try {
    const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const buffer = Buffer.from(padded, "base64");
    return buffer.length === 65 && buffer[0] === 4;
  } catch {
    return false;
  }
}

function isValidVapidPrivateKey(value) {
  if (!value || /\s/.test(value)) return false;
  try {
    const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return Buffer.from(padded, "base64").length === 32;
  } catch {
    return false;
  }
}

const webPushReady = isValidVapidPublicKey(config.vapid.publicKey) && isValidVapidPrivateKey(config.vapid.privateKey);
if (webPushReady) {
  webPush.setVapidDetails(config.vapid.subject, config.vapid.publicKey, config.vapid.privateKey);
} else if (config.vapid.publicKey || config.vapid.privateKey) {
  console.warn("Web push VAPID keys are configured but invalid. Generate a new pair with: npx web-push generate-vapid-keys");
}

app.use(cors({
  credentials: true,
  origin(origin, callback) {
    const isLocalDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
    if (!origin || config.corsOrigins.includes(origin) || (config.allowLocalDevOrigins && isLocalDevOrigin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "30mb" }));

function createSessionToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", config.jwtSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", config.jwtSecret).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.expiresAt && Date.now() > payload.expiresAt) return null;
  return payload;
}

function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  return raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.split("=")[1] || "";
}

async function ensureRoleUser(roleCode, username, mobile, fullName) {
  const [[role]] = await pool.query("SELECT id FROM roles WHERE code = :roleCode LIMIT 1", { roleCode });
  if (!role) throw new Error(`${roleCode} role is missing. Import the database schema first.`);

  const [[existing]] = await pool.query("SELECT id FROM users WHERE username = :username OR mobile = :mobile LIMIT 1", { username, mobile });
  if (existing) return existing.id;

  const [result] = await pool.query(
    `INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, status, mobile_verified_at, password_changed_at)
     VALUES (:roleId, :username, :email, :mobile, 'not-for-login', :fullName, 'active', NOW(), NOW())`,
    { roleId: role.id, username, email: `${username}@marketyard.local`, mobile, fullName },
  );

  return result.insertId;
}

function getSessionCookieNameForRoles(roles) {
  return roles.some((role) => role === "MAIN_ADMIN" || role === "USER_ADMIN") ? "admin_session_token" : "trader_session_token";
}

function normalizeRoleCode(role) {
  const value = String(role || "").trim().toUpperCase();
  if (value === "MEMBER" || value === "MEMBERS") return "TRADER";
  return value;
}

function publicRoleCode(role) {
  return role === "TRADER" ? "MEMBER" : role;
}

function clearCookie(name) {
  return `${name}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function createCookie(name, value, maxAgeSeconds) {
  return `${name}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

async function recordLoginEvent({ userId, roleCode, req }) {
  try {
    await pool.query(
      `INSERT INTO login_events (user_id, role_code, ip_address, user_agent)
       VALUES (:userId, :roleCode, :ipAddress, :userAgent)`,
      {
        userId,
        roleCode,
        ipAddress: String(req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim() || null,
        userAgent: String(req.headers["user-agent"] || "").slice(0, 500) || null,
      },
    );
  } catch (error) {
    console.error("Login event logging failed", error);
  }
}

async function getTraderProfilePhotoUrl(traderId) {
  if (!traderId) return null;
  const [[document]] = await pool.query(
    `SELECT id
       FROM trader_documents
      WHERE trader_id = :traderId
        AND document_type = 'profile_photo'
        AND status IN ('uploaded','verified')
      ORDER BY created_at DESC, id DESC
      LIMIT 1`,
    { traderId },
  );
  return document ? `/api/v1/trader/documents/${document.id}/download` : null;
}

function sanitizeFileName(fileName) {
  return String(fileName || "document")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "document";
}

function detectMimeType(buffer) {
  if (buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return "application/pdf";
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a
  ) return "image/png";
  if (
    buffer.length >= 12
    && buffer[0] === 0x52
    && buffer[1] === 0x49
    && buffer[2] === 0x46
    && buffer[3] === 0x46
    && buffer[8] === 0x57
    && buffer[9] === 0x45
    && buffer[10] === 0x42
    && buffer[11] === 0x50
  ) return "image/webp";
  if (
    buffer.length >= 12
    && buffer[4] === 0x66
    && buffer[5] === 0x74
    && buffer[6] === 0x79
    && buffer[7] === 0x70
    && ["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(buffer.subarray(8, 12).toString("ascii"))
  ) return "image/heic";
  return "";
}

function safeJson(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return { details: value || "" };
  }
}

const SUPPORTED_TRANSLATION_LANGUAGES = new Set(["en", "mr"]);

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeTranslationLanguage(value, fallback) {
  const lang = String(value || fallback || "").trim().toLowerCase();
  if (!SUPPORTED_TRANSLATION_LANGUAGES.has(lang)) throw new Error("Only English and Marathi translation is allowed.");
  return lang;
}

async function translateWithGoogle({ text, sourceLang = "en", targetLang = "mr", requireProvider = false }) {
  const source = normalizeTranslationLanguage(sourceLang, "en");
  const target = normalizeTranslationLanguage(targetLang, "mr");
  const cleanText = String(text || "").trim();
  if (!cleanText || source === target) return { translatedText: cleanText, provider: "none", cached: false };

  const sourceHash = crypto.createHash("sha256").update(`${source}:${target}:${cleanText}`).digest("hex");
  const [[cached]] = await pool.query(
    `SELECT target_text
       FROM translation_cache
      WHERE source_lang = :source
        AND target_lang = :target
        AND source_hash = :sourceHash
      LIMIT 1`,
    { source, target, sourceHash },
  );
  if (cached?.target_text) return { translatedText: cached.target_text, provider: "google", cached: true };

  if (!config.googleTranslate.apiKey) {
    if (requireProvider) throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured.");
    return { translatedText: cleanText, provider: "none", cached: false };
  }

  const body = new URLSearchParams({
    q: cleanText,
    source,
    target,
    format: "text",
  });
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(config.googleTranslate.apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = result?.error?.message || "Google Translate request failed.";
    throw new Error(message);
  }

  const translatedText = decodeHtmlEntities(result?.data?.translations?.[0]?.translatedText || cleanText).trim();
  await pool.query(
    `INSERT INTO translation_cache (source_lang, target_lang, source_hash, source_text, target_text, provider)
     VALUES (:source, :target, :sourceHash, :sourceText, :targetText, 'google')
     ON DUPLICATE KEY UPDATE
       target_text = VALUES(target_text),
       provider = VALUES(provider),
       updated_at = CURRENT_TIMESTAMP`,
    { source, target, sourceHash, sourceText: cleanText, targetText: translatedText },
  );
  return { translatedText, provider: "google", cached: false };
}

async function tryTranslateWithGoogle(options) {
  try {
    return await translateWithGoogle(options);
  } catch (error) {
    console.warn("Optional Google translation skipped", error instanceof Error ? error.message : String(error));
    return { translatedText: String(options?.text || "").trim(), provider: "none", cached: false };
  }
}

async function translatePostContentToMarathi({ titleEn, category, details, titleMr = null, contentMr = null }) {
  let translatedTitle = String(titleMr || "").trim() || null;
  if (!translatedTitle) {
    const result = await tryTranslateWithGoogle({ text: titleEn, sourceLang: "en", targetLang: "mr" });
    translatedTitle = result.provider === "google" ? result.translatedText : null;
  }
  let translatedContent = contentMr;
  if (!String(translatedContent || "").trim()) {
    const [translatedCategory, translatedDetails] = await Promise.all([
      tryTranslateWithGoogle({ text: category || "General", sourceLang: "en", targetLang: "mr" }),
      tryTranslateWithGoogle({ text: details || "", sourceLang: "en", targetLang: "mr" }),
    ]);
    translatedContent = translatedCategory.provider === "google" || translatedDetails.provider === "google"
      ? JSON.stringify({
          category: translatedCategory.provider === "google" ? translatedCategory.translatedText : category,
          details: translatedDetails.provider === "google" ? translatedDetails.translatedText : details,
        })
      : null;
  }
  return { titleMr: translatedTitle, contentMr: translatedContent };
}

function validateDocumentMetadata({ documentType, originalFilename, claimedMimeType, detectedMimeType }) {
  if (!DOCUMENT_TYPE_LABELS[documentType]) throw new Error("Invalid document type.");
  const extension = path.extname(String(originalFilename || "")).toLowerCase();
  const allowedExtensions = documentType === "profile_photo" ? new Set([".jpg", ".jpeg", ".png", ".webp"]) : new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"]);
  const allowedMimeTypes = documentType === "profile_photo" ? new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]) : new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]);
  if ([".heic", ".heif"].includes(extension) || ["image/heic", "image/heif"].includes(claimedMimeType) || detectedMimeType === "image/heic") {
    throw new Error("HEIC/HEIF photos are not supported yet. Please set your camera to Most Compatible or upload JPG, PNG, or WebP.");
  }
  if (!allowedExtensions.has(extension)) {
    throw new Error(`${DOCUMENT_TYPE_LABELS[documentType]} must be ${documentType === "profile_photo" ? "JPG, PNG, or WebP" : "JPG, PNG, WebP, or PDF"}.`);
  }
  const normalizedClaimedMimeType = claimedMimeType === "image/jpg" ? "image/jpeg" : claimedMimeType;
  const normalizedDetectedMimeType = detectedMimeType === "image/jpg" ? "image/jpeg" : detectedMimeType;
  if (!allowedMimeTypes.has(claimedMimeType) || !allowedMimeTypes.has(detectedMimeType) || normalizedClaimedMimeType !== normalizedDetectedMimeType) {
    throw new Error(`${DOCUMENT_TYPE_LABELS[documentType]} file content does not match its file type.`);
  }
}

function resolveStoredFilePath(storageKey) {
  return path.isAbsolute(String(storageKey || ""))
    ? path.resolve(storageKey)
    : path.resolve(process.cwd(), storageKey);
}

async function resolveExistingStoredFilePath(storageKey) {
  const key = String(storageKey || "");
  const candidates = [resolveStoredFilePath(key)];
  if (key.startsWith("uploads/") || key.startsWith("uploads\\")) {
    candidates.push(path.resolve(PERSISTENT_UPLOAD_ROOT, key.replace(/^uploads[\\/]/, "")));
  }

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next known storage location.
    }
  }
  return candidates[0];
}

function isPathInside(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function sendStoredFile(res, {
  storageKey,
  storage_key: storageKeyFromDb,
  originalFilename,
  original_filename: originalFilenameFromDb,
  mimeType,
  mime_type: mimeTypeFromDb,
  disposition = "inline",
  missingMessage = "File is missing on the server.",
}) {
  const filePath = await resolveExistingStoredFilePath(storageKey || storageKeyFromDb);
  const allowedRoots = [PERSISTENT_UPLOAD_ROOT, path.resolve(process.cwd(), "uploads")];
  if (!allowedRoots.some((root) => isPathInside(filePath, root))) {
    res.status(403).json({ ok: false, error: "File path is not allowed." });
    return;
  }
  res.setHeader("Content-Type", mimeType || mimeTypeFromDb || "application/octet-stream");
  res.setHeader("Content-Disposition", `${disposition}; filename="${String(originalFilename || originalFilenameFromDb || "download").replace(/"/g, "")}"`);
  res.sendFile(filePath, (error) => {
    if (!error) return;
    if (!res.headersSent) {
      res.status(error.code === "ENOENT" ? 404 : 500).json({ ok: false, error: missingMessage });
    }
  });
}

async function saveTraderDocumentBuffer({ traderId, documentType, originalFilename, mimeType, buffer }) {
  const safeMimeType = mimeType || "application/octet-stream";
  if (!Buffer.isBuffer(buffer)) throw new Error("Invalid document upload payload.");
  if (buffer.length <= 0 || buffer.length > MAX_DOCUMENT_UPLOAD_BYTES) {
    throw new Error("Each document must be between 1 byte and 5 MB.");
  }
  if (safeMimeType.startsWith("image/") && buffer.length > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error("Image uploads must be 1 MB or smaller.");
  }
  const detectedMimeType = detectMimeType(buffer);
  validateDocumentMetadata({ documentType, originalFilename, claimedMimeType: safeMimeType, detectedMimeType });

  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${traderId}-${documentType}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(UPLOAD_ROOT, storageFileName);
  await fs.writeFile(storagePath, buffer);

  return {
    storageKey: path.relative(process.cwd(), storagePath),
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
    documentHash: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

async function saveTraderDocumentFile({ traderId, documentType, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid document upload payload.");
  const [, encodedMimeType, base64] = match;
  return saveTraderDocumentBuffer({
    traderId,
    documentType,
    originalFilename,
    mimeType: mimeType || encodedMimeType,
    buffer: Buffer.from(base64, "base64"),
  });
}

async function saveMobileChangeDocumentFile({ requestId, documentType, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid document upload payload.");
  const [, encodedMimeType, base64] = match;
  const safeMimeType = mimeType || encodedMimeType;
  const buffer = Buffer.from(base64, "base64");
  if (buffer.length <= 0 || buffer.length > 5 * 1024 * 1024) {
    throw new Error("Each document must be between 1 byte and 5 MB.");
  }
  if (safeMimeType.startsWith("image/") && buffer.length > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error("Image uploads must be 1 MB or smaller.");
  }
  const detectedMimeType = detectMimeType(buffer);
  validateDocumentMetadata({ documentType: "other", originalFilename, claimedMimeType: safeMimeType, detectedMimeType });

  await fs.mkdir(MOBILE_CHANGE_UPLOAD_ROOT, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${requestId}-${documentType}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(MOBILE_CHANGE_UPLOAD_ROOT, storageFileName);
  await fs.writeFile(storagePath, buffer);

  return {
    storageKey: `uploads/mobile-change-documents/${storageFileName}`,
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
    checksumSha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

async function saveComplaintAttachmentFile({ complaintId, attachmentType, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid attachment upload payload.");
  const [, encodedMimeType, base64] = match;
  const safeMimeType = mimeType || encodedMimeType;
  const buffer = Buffer.from(base64, "base64");
  const allowed = attachmentType === "video"
    ? new Set(["video/mp4", "video/webm", "video/quicktime"])
    : new Set(["image/jpeg", "image/png", "image/webp"]);
  const extensions = attachmentType === "video" ? new Set([".mp4", ".webm", ".mov"]) : new Set([".jpg", ".jpeg", ".png", ".webp"]);
  if (buffer.length <= 0 || buffer.length > MAX_MEDIA_UPLOAD_BYTES) throw new Error("Each complaint image or video must be 5 MB or smaller.");
  if (!allowed.has(safeMimeType) || !extensions.has(path.extname(String(originalFilename || "")).toLowerCase())) {
    throw new Error(`${attachmentType === "video" ? "Video" : "Image"} attachment type is not supported.`);
  }
  await fs.mkdir(COMPLAINT_UPLOAD_ROOT, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${complaintId}-${attachmentType}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(COMPLAINT_UPLOAD_ROOT, storageFileName);
  await fs.writeFile(storagePath, buffer);
  return {
    storageKey: path.relative(process.cwd(), storagePath),
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
    checksumSha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

async function savePostAttachmentFile({ postId, attachmentType, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid post attachment upload payload.");
  const [, encodedMimeType, base64] = match;
  const safeMimeType = mimeType || encodedMimeType;
  const buffer = Buffer.from(base64, "base64");
  const allowed = attachmentType === "video"
    ? new Set(["video/mp4", "video/webm", "video/quicktime"])
    : new Set(["image/jpeg", "image/png", "image/webp"]);
  const extensions = attachmentType === "video" ? new Set([".mp4", ".webm", ".mov"]) : new Set([".jpg", ".jpeg", ".png", ".webp"]);
  if (buffer.length <= 0 || buffer.length > MAX_MEDIA_UPLOAD_BYTES) throw new Error("Each post image or video must be 1 MB or smaller.");
  if (!allowed.has(safeMimeType) || !extensions.has(path.extname(String(originalFilename || "")).toLowerCase())) {
    throw new Error(`${attachmentType === "video" ? "Video" : "Image"} attachment type is not supported.`);
  }
  await fs.mkdir(POST_UPLOAD_ROOT, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${postId}-${attachmentType}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(POST_UPLOAD_ROOT, storageFileName);
  await fs.writeFile(storagePath, buffer);
  return {
    storageKey: `uploads/post-documents/${storageFileName}`,
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
    checksumSha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

async function saveContentAttachmentFile({ postId, attachmentType, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid content attachment upload payload.");
  const [, encodedMimeType, base64] = match;
  const safeMimeType = mimeType || encodedMimeType;
  const buffer = Buffer.from(base64, "base64");
  const extension = path.extname(String(originalFilename || "")).toLowerCase();
  const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4", "video/webm", "video/quicktime"]);
  const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf", ".mp4", ".webm", ".mov"]);
  if (buffer.length <= 0 || buffer.length > (safeMimeType.startsWith("image/") || safeMimeType.startsWith("video/") ? MAX_MEDIA_UPLOAD_BYTES : 25 * 1024 * 1024)) {
    throw new Error(safeMimeType.startsWith("image/") || safeMimeType.startsWith("video/") ? "Each image or video must be 1 MB or smaller." : "Each document must be between 1 byte and 25 MB.");
  }
  if (!allowedMimeTypes.has(safeMimeType) || !allowedExtensions.has(extension)) throw new Error("Attachment type is not supported.");
  await fs.mkdir(CONTENT_UPLOAD_ROOT, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${postId}-${attachmentType}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(CONTENT_UPLOAD_ROOT, storageFileName);
  await fs.writeFile(storagePath, buffer);
  return {
    storageKey: `uploads/content-documents/${storageFileName}`,
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
    checksumSha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

async function saveCommitteePhotoFile({ memberId, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid photo upload payload.");
  const [, encodedMimeType, base64] = match;
  const safeMimeType = mimeType || encodedMimeType;
  const buffer = Buffer.from(base64, "base64");
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  if (buffer.length <= 0 || buffer.length > MAX_MEDIA_UPLOAD_BYTES) throw new Error("Committee photo must be 5 MB or smaller.");
  if (!allowed.has(safeMimeType) || !extensions.has(path.extname(String(originalFilename || "")).toLowerCase())) {
    throw new Error("Committee photo must be JPG, PNG, or WEBP.");
  }
  await fs.mkdir(COMMITTEE_UPLOAD_ROOT, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${memberId}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(COMMITTEE_UPLOAD_ROOT, storageFileName);
  await fs.writeFile(storagePath, buffer);
  return {
    storageKey: path.relative(process.cwd(), storagePath),
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
  };
}

async function saveRatingAttachmentFile({ ratingId, attachmentType, originalFilename, mimeType, dataUrl }) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid rating attachment payload.");
  const [, encodedMimeType, base64] = match;
  const safeMimeType = mimeType || encodedMimeType;
  const buffer = Buffer.from(base64, "base64");
  const allowed = attachmentType === "video"
    ? new Set(["video/mp4", "video/webm", "video/quicktime"])
    : new Set(["image/jpeg", "image/png", "image/webp"]);
  const extensions = attachmentType === "video" ? new Set([".mp4", ".webm", ".mov"]) : new Set([".jpg", ".jpeg", ".png", ".webp"]);
  if (buffer.length <= 0 || buffer.length > MAX_MEDIA_UPLOAD_BYTES) throw new Error("Each review image or video must be 1 MB or smaller.");
  if (!allowed.has(safeMimeType) || !extensions.has(path.extname(String(originalFilename || "")).toLowerCase())) {
    throw new Error(`${attachmentType === "video" ? "Video" : "Image"} attachment type is not supported.`);
  }
  const ratingUploadRoot = path.resolve(process.cwd(), "uploads", "rating-attachments");
  await fs.mkdir(ratingUploadRoot, { recursive: true });
  const safeFileName = sanitizeFileName(originalFilename);
  const storageFileName = `${ratingId}-${attachmentType}-${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;
  const storagePath = path.join(ratingUploadRoot, storageFileName);
  await fs.writeFile(storagePath, buffer);
  return {
    storageKey: `uploads/rating-attachments/${storageFileName}`,
    originalFilename: safeFileName,
    mimeType: safeMimeType,
    fileSizeBytes: buffer.length,
    checksumSha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

async function getRequestUser(req, roles = []) {
  const cookieNames = roles.some((role) => role === "MAIN_ADMIN" || role === "USER_ADMIN") && roles.includes("TRADER")
    ? ["admin_session_token", "trader_session_token"]
    : [getSessionCookieNameForRoles(roles)];

  for (const cookieName of cookieNames) {
    const session = verifySessionToken(getCookie(req, cookieName));
    if (!session?.userId) continue;

    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.mobile, u.full_name, u.status, r.code AS role,
              t.id AS trader_id, t.verification_status AS trader_status
         FROM users u
         JOIN roles r ON r.id = u.role_id
         LEFT JOIN traders t ON t.user_id = u.id
        WHERE u.id = :userId
      LIMIT 1`,
      { userId: session.userId },
    );
    if (rows[0]) return rows[0];
  }

  return null;
}

function requireRoles(...roles) {
  return async (req, res, next) => {
    try {
      const user = await getRequestUser(req, roles);
      if (!user) {
        res.status(401).json({ ok: false, error: "Authentication required." });
        return;
      }
      if (user.status !== "active") {
        res.status(403).json({ ok: false, error: "Account is not active." });
        return;
      }
      if (!roles.includes(user.role)) {
        res.status(403).json({ ok: false, error: "Role is not allowed for this action." });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

async function getOptionalRequestUser(req) {
  const adminUser = await getRequestUser(req, ["MAIN_ADMIN", "USER_ADMIN"]);
  if (adminUser) return adminUser;
  return getRequestUser(req, ["TRADER"]);
}

function detectPwaPlatform(userAgent) {
  const value = String(userAgent || "").toLowerCase();
  if (/android/.test(value)) return "android";
  if (/iphone|ipad|ipod/.test(value)) return "ios";
  if (/windows|macintosh|linux|cros/.test(value)) return "desktop";
  return "other";
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password || "")).digest("hex");
}

const traderRequestSelect = `
  SELECT t.*, u.full_name, u.full_name_en, u.mobile, u.email, u.status AS user_status,
         mg.gala_number, bc.name_en AS business_category
    FROM traders t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN market_galas mg ON mg.id = t.gala_id
    LEFT JOIN business_categories bc ON bc.id = t.business_category_id
`;

async function writeAudit({ req, action, module, entityType = null, entityId = null, oldValues = null, newValues = null }) {
  await pool.query(
    `INSERT INTO audit_logs (actor_user_id, action, module, entity_type, entity_id, old_values, new_values, ip_address, user_agent, request_id)
     VALUES (:actorUserId, :action, :module, :entityType, :entityId, :oldValues, :newValues, :ipAddress, :userAgent, :requestId)`,
    {
      actorUserId: req.user?.id || null,
      action,
      module,
      entityType,
      entityId,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
      requestId: req.headers["x-request-id"] || crypto.randomUUID(),
    },
  );
}

async function createMemberNotifications(connection, {
  type,
  title,
  message,
  relatedEntityType = null,
  relatedEntityId = null,
  actionUrl = null,
  priority = "normal",
  excludeUserId = null,
}) {
  const [result] = await connection.query(
    `INSERT INTO notifications (
        user_id, notification_type, title, message, related_entity_type,
        related_entity_id, action_url, priority, channel, delivery_status, sent_at
      )
      SELECT u.id, :type, :title, :message, :relatedEntityType,
             :relatedEntityId, :actionUrl, :priority, 'in_app', 'sent', NOW()
        FROM users u
        JOIN roles r ON r.id = u.role_id
        JOIN traders t ON t.user_id = u.id
       WHERE r.code = 'TRADER'
         AND u.status = 'active'
         AND t.verification_status = 'approved'
         AND (:excludeUserId IS NULL OR u.id <> :excludeUserId)`,
    {
      type,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
      actionUrl,
      priority,
      excludeUserId,
    },
  );
  return result.affectedRows || 0;
}

function sanitizePushFailureReason(error) {
  const raw = error?.body || error?.message || String(error || "Push failed");
  return String(raw).replace(/\s+/g, " ").slice(0, 500);
}

function isWebPushConfigured() {
  return webPushReady;
}

async function sendPushToSubscriptions({ subscriptions, payload, notificationId = null }) {
  if (!isWebPushConfigured() || subscriptions.length === 0) return { sent: 0, failed: 0, skipped: !isWebPushConfigured() };
  let sent = 0;
  let failed = 0;
  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh_key,
            auth: subscription.auth_key,
          },
        },
        JSON.stringify(payload),
      );
      sent += 1;
      await pool.query(
        "UPDATE push_subscriptions SET is_active = 1, last_success_at = NOW(), last_failure_at = NULL WHERE id = :id",
        { id: subscription.id },
      );
      await pool.query(
        `INSERT INTO push_delivery_logs (notification_id, subscription_id, status, provider_status_code)
         VALUES (:notificationId, :subscriptionId, 'sent', NULL)`,
        { notificationId, subscriptionId: subscription.id },
      );
    } catch (error) {
      failed += 1;
      const statusCode = Number(error?.statusCode || error?.status || 0) || null;
      const shouldDisable = statusCode === 404 || statusCode === 410;
      await pool.query(
        `UPDATE push_subscriptions
            SET last_failure_at = NOW(),
                is_active = IF(:shouldDisable = 1, 0, is_active)
          WHERE id = :id`,
        { id: subscription.id, shouldDisable: shouldDisable ? 1 : 0 },
      );
      await pool.query(
        `INSERT INTO push_delivery_logs (notification_id, subscription_id, status, provider_status_code, failure_reason)
         VALUES (:notificationId, :subscriptionId, 'failed', :statusCode, :failureReason)`,
        {
          notificationId,
          subscriptionId: subscription.id,
          statusCode,
          failureReason: sanitizePushFailureReason(error),
        },
      );
    }
  }));
  return { sent, failed, skipped: false };
}

async function sendPushToUser({ userId, title, body, url, type, entityId = null, priority = "normal", notificationId = null }) {
  const [subscriptions] = await pool.query(
    `SELECT id, endpoint, p256dh_key, auth_key
       FROM push_subscriptions
      WHERE user_id = :userId
        AND is_active = 1`,
    { userId },
  );
  return sendPushToSubscriptions({
    subscriptions,
    notificationId,
    payload: {
      title: String(title || "Market Yard").slice(0, 120),
      body: String(body || "A new update is available.").slice(0, 180),
      url: url || "/member/notifications",
      type: type || "notification",
      entityId,
      priority,
      sound: "/sounds/notification-alert.mp3",
    },
  });
}

async function sendPushToAllMembers({ title, body, url, type, entityId, priority = "normal", notificationId = null }) {
  const [subscriptions] = await pool.query(
    `SELECT ps.id, ps.endpoint, ps.p256dh_key, ps.auth_key
       FROM push_subscriptions ps
       JOIN users u ON u.id = ps.user_id
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
      WHERE ps.is_active = 1
        AND u.status = 'active'
        AND r.code = 'TRADER'
        AND (t.id IS NULL OR t.verification_status = 'approved')`,
  );
  return sendPushToSubscriptions({
    subscriptions,
    notificationId,
    payload: {
      title: String(title || "Market Yard").slice(0, 120),
      body: String(body || "A new update is available.").slice(0, 180),
      url: url || "/member/notifications",
      type: type || "notification",
      entityId: entityId || null,
      priority,
      sound: "/sounds/notification-alert.mp3",
    },
  });
}

function getPostNotificationMeta(postType) {
  if (postType === "notice" || postType === "circular") {
    return {
      type: "notice",
      title: "New notice published",
      actionUrl: "/member/notices",
      priority: "high",
    };
  }
  if (postType === "news" || postType === "event") {
    return {
      type: "market_update",
      title: "New market update",
      actionUrl: "/member/updates",
      priority: "normal",
    };
  }
  if (postType === "gallery") {
    return {
      type: "gallery",
      title: "New gallery post",
      actionUrl: "/gallery",
      priority: "normal",
    };
  }
  return {
    type: "post",
    title: "New member post",
    actionUrl: "/member/shared-posts",
    priority: "normal",
  };
}

async function notifyMembersAboutPublishedPost(connection, { postId, postType, titleEn, details, excludeUserId = null }) {
  const meta = getPostNotificationMeta(postType);
  const cleanTitle = String(titleEn || "").trim();
  const cleanDetails = String(details || "").trim();
  await createMemberNotifications(connection, {
    type: meta.type,
    title: meta.title,
    message: cleanDetails ? `${cleanTitle} - ${cleanDetails}` : cleanTitle,
    relatedEntityType: "posts",
    relatedEntityId: postId,
    actionUrl: meta.actionUrl,
    priority: meta.priority,
    excludeUserId,
  });
}

async function sendPublishedPostPush({ postId, postType, titleEn, details }) {
  try {
    const meta = getPostNotificationMeta(postType);
    await sendPushToAllMembers({
      title: meta.title,
      body: String(titleEn || details || "A new Market Yard update is available.").slice(0, 180),
      url: meta.actionUrl,
      type: meta.type,
      entityId: postId,
      priority: meta.priority,
    });
  } catch (error) {
    console.error("Post push notification failed", {
      postId,
      postType,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

async function notifyAllMembersNow({ type, title, message, actionUrl, relatedEntityType = null, relatedEntityId = null, priority = "normal" }) {
  await createMemberNotifications(pool, {
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
    actionUrl,
    priority,
  });
  setImmediate(() => {
    sendPushToAllMembers({
      title,
      body: message,
      url: actionUrl,
      type,
      entityId: relatedEntityId,
      priority,
    }).catch((error) => {
      console.error("Member broadcast push notification failed", {
        type,
        relatedEntityId,
        message: error instanceof Error ? error.message : String(error),
      });
    });
  });
}

async function sendRiskAlertPush({ warningId, customerName, amount }) {
  try {
    await sendPushToAllMembers({
      title: "Payment Risk Alert",
      body: `${customerName} has a new market-wide payment warning for Rs. ${Number(amount || 0).toLocaleString("en-IN")}.`,
      url: "/member/notifications",
      type: "risk_alert",
      entityId: warningId,
      priority: "critical",
    });
  } catch (error) {
    console.error("Risk alert push notification failed", {
      warningId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

async function sendRiskClearedPush({ warningId, customerName }) {
  try {
    await sendPushToAllMembers({
      title: "Payment Cleared",
      body: `${customerName} has cleared the pending payment warning and is no longer marked high risk for that case.`,
      url: "/member/kyc",
      type: "risk_cleared",
      entityId: warningId,
      priority: "high",
    });
  } catch (error) {
    console.error("Risk cleared push notification failed", {
      warningId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

async function recordDownloadEvent({ sourceTable, sourceId, req }) {
  await pool.query(
    `INSERT INTO file_download_events (source_table, source_id, downloaded_by_user_id, downloaded_by_role, ip_address, user_agent)
     VALUES (:sourceTable, :sourceId, :downloadedByUserId, :downloadedByRole, :ipAddress, :userAgent)`,
    {
      sourceTable,
      sourceId,
      downloadedByUserId: req.user?.id || null,
      downloadedByRole: req.user?.role || "PUBLIC",
      ipAddress: req.ip || null,
      userAgent: req.headers["user-agent"] || null,
    },
  );
}

async function ensureGalaAndCategory(connection, { gala, section, category }) {
  await connection.query(
    `INSERT INTO market_galas (gala_number, section_name, status)
     VALUES (:gala, :section, 'occupied')
     ON DUPLICATE KEY UPDATE section_name = COALESCE(VALUES(section_name), section_name), status = 'occupied'`,
    { gala, section },
  );
  const [[galaRow]] = await connection.query("SELECT id FROM market_galas WHERE gala_number = :gala LIMIT 1", { gala });

  await connection.query(
    `INSERT INTO business_categories (name_en, status)
     VALUES (:category, 'active')
     ON DUPLICATE KEY UPDATE name_en = VALUES(name_en)`,
    { category },
  ).catch(async () => {
    const [[existingCategory]] = await connection.query("SELECT id FROM business_categories WHERE name_en = :category LIMIT 1", { category });
    if (!existingCategory) throw new Error("Could not create business category.");
  });
  const [[categoryRow]] = await connection.query("SELECT id FROM business_categories WHERE name_en = :category LIMIT 1", { category });

  return { galaId: galaRow.id, categoryId: categoryRow?.id || null };
}

async function addTraderGala(connection, {
  traderId,
  galaId,
  businessName,
  marketSection,
  categoryId,
  marketRegistrationNumber = null,
  licenceNumber = null,
  associationSequenceNumber = null,
  associationRegistrationNumber = null,
  status = "submitted",
  isPrimary = false,
}) {
  const [result] = await connection.query(
    `INSERT INTO trader_galas (
       trader_id, gala_id, business_name, market_section, business_category_id,
       market_registration_number, licence_number, association_sequence_number,
       association_registration_number, status, is_primary
     )
     VALUES (
       :traderId, :galaId, :businessName, :marketSection, :categoryId,
       :marketRegistrationNumber, :licenceNumber, :associationSequenceNumber,
       :associationRegistrationNumber, :status, :isPrimary
     )`,
    {
      traderId,
      galaId,
      businessName,
      marketSection,
      categoryId,
      marketRegistrationNumber,
      licenceNumber,
      associationSequenceNumber,
      associationRegistrationNumber,
      status,
      isPrimary: isPrimary ? 1 : 0,
    },
  );
  return result.insertId;
}

async function addColumnIfMissing(tableName, columnName, ddl) {
  const [[column]] = await pool.query(
    `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND COLUMN_NAME = :columnName
      LIMIT 1`,
    { tableName, columnName },
  );
  if (!column) await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${ddl}`);
}

async function addIndexIfMissing(tableName, indexName, ddl) {
  const [[index]] = await pool.query(
    `SELECT INDEX_NAME
       FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND INDEX_NAME = :indexName
      LIMIT 1`,
    { tableName, indexName },
  );
  if (!index) await pool.query(`ALTER TABLE ${tableName} ADD INDEX ${ddl}`);
}

async function removeStorageFiles(storageKeys = []) {
  await Promise.all(storageKeys.map(async (storageKey) => {
    const filePath = storageKey ? resolveStoredFilePath(storageKey) : null;
    if (!filePath) return;
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (String(error?.code || "") !== "ENOENT") throw error;
    }
  }));
}

async function cleanRetainedContent() {
  const cutoff = new Date(Date.now() - DATA_RETENTION_MS);
  const riskNotificationCutoff = new Date(Date.now() - RISK_NOTIFICATION_RETENTION_MS);
  const cleanupResults = {
    postsRemoved: 0,
    marketPricesRemoved: 0,
    complaintsRemoved: 0,
    notificationsRemoved: 0,
    filesRemoved: 0,
  };

  const [postRows] = await pool.query(
    `SELECT p.id
       FROM posts p
      WHERE p.status = 'published'
        AND p.published_at IS NOT NULL
        AND p.published_at < :cutoff
        AND p.post_type IN ('news', 'notice', 'circular', 'event', 'gallery', 'announcement')
      ORDER BY p.published_at ASC
      LIMIT 200`,
    { cutoff },
  );
  if (postRows.length > 0) {
    const [postFiles] = await pool.query(
      `SELECT storage_key FROM content_attachments WHERE post_id IN (:ids)
       UNION ALL
       SELECT storage_key FROM post_attachments WHERE post_id IN (:ids)`,
      { ids: postRows.map((row) => row.id) },
    );
    const postFileKeys = postFiles.map((row) => row.storage_key).filter(Boolean);
    await pool.query(`DELETE FROM posts WHERE id IN (:ids)`, { ids: postRows.map((row) => row.id) });
    await removeStorageFiles(postFileKeys);
    cleanupResults.postsRemoved = postRows.length;
    cleanupResults.filesRemoved += postFileKeys.length;
  }

  const [priceRows] = await pool.query(
    `SELECT id
       FROM market_prices
      WHERE status = 'published'
        AND published_at IS NOT NULL
        AND published_at < :cutoff
      ORDER BY published_at ASC
      LIMIT 500`,
    { cutoff },
  );
  if (priceRows.length > 0) {
    await pool.query(`DELETE FROM market_prices WHERE id IN (:ids)`, { ids: priceRows.map((row) => row.id) });
    cleanupResults.marketPricesRemoved = priceRows.length;
  }

  const [complaintRows] = await pool.query(
    `SELECT id
       FROM support_tickets
      WHERE status IN ('resolved', 'closed')
        AND COALESCE(resolved_at, updated_at) < :cutoff
      ORDER BY COALESCE(resolved_at, updated_at) ASC
      LIMIT 200`,
    { cutoff },
  );
  if (complaintRows.length > 0) {
    const [complaintFiles] = await pool.query(
      `SELECT storage_key
         FROM complaint_attachments
        WHERE complaint_id IN (:ids)`,
      { ids: complaintRows.map((row) => row.id) },
    );
    await pool.query(`DELETE FROM support_tickets WHERE id IN (:ids)`, { ids: complaintRows.map((row) => row.id) });
    await removeStorageFiles(complaintFiles.map((row) => row.storage_key));
    cleanupResults.complaintsRemoved = complaintRows.length;
    cleanupResults.filesRemoved += complaintFiles.length;
  }

  const [notificationResult] = await pool.query(
    `DELETE FROM notifications
      WHERE (
          notification_type NOT IN ('risk_alert', 'risk_cleared')
          AND COALESCE(read_at, sent_at, created_at) < :cutoff
        )
         OR (
          notification_type IN ('risk_alert', 'risk_cleared')
          AND COALESCE(read_at, sent_at, created_at) < :riskNotificationCutoff
        )`,
    { cutoff, riskNotificationCutoff },
  );
  cleanupResults.notificationsRemoved = notificationResult.affectedRows || 0;

  return cleanupResults;
}

function scheduleRetentionCleanup() {
  const runCleanup = async () => {
    try {
      const result = await cleanRetainedContent();
      if (result.postsRemoved || result.marketPricesRemoved || result.complaintsRemoved || result.notificationsRemoved) {
        console.log(
          `Retention cleanup removed ${result.postsRemoved} posts, ${result.marketPricesRemoved} market prices, ${result.complaintsRemoved} complaints, ${result.notificationsRemoved} notifications, and ${result.filesRemoved} files.`,
        );
      }
    } catch (error) {
      console.error("Retention cleanup failed", error);
    }
  };

  runCleanup();
  setInterval(runCleanup, DATA_RETENTION_CHECK_INTERVAL_MS);
}

async function ensurePlatformExtensions() {
  await addColumnIfMissing("users", "full_name_en", "full_name_en VARCHAR(180) NULL AFTER full_name");
  await addColumnIfMissing("traders", "business_name_en", "business_name_en VARCHAR(220) NULL AFTER business_name");
  await addColumnIfMissing("trader_galas", "business_name_en", "business_name_en VARCHAR(220) NULL AFTER business_name");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS translation_cache (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      source_lang ENUM('en','mr') NOT NULL,
      target_lang ENUM('en','mr') NOT NULL,
      source_hash CHAR(64) NOT NULL,
      source_text TEXT NOT NULL,
      target_text TEXT NOT NULL,
      provider VARCHAR(40) NOT NULL DEFAULT 'google',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_translation_cache_pair_hash (source_lang, target_lang, source_hash),
      INDEX idx_translation_cache_langs (source_lang, target_lang, updated_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      notification_type VARCHAR(80) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      related_entity_type VARCHAR(80) NULL,
      related_entity_id BIGINT UNSIGNED NULL,
      action_url VARCHAR(500) NULL,
      priority ENUM('normal','high','critical') NOT NULL DEFAULT 'normal',
      channel ENUM('in_app','push','sms','whatsapp','email') NOT NULL DEFAULT 'in_app',
      delivery_status ENUM('queued','sent','delivered','failed','read') NOT NULL DEFAULT 'queued',
      read_at DATETIME NULL,
      sent_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_notifications_user_status (user_id, delivery_status, created_at),
      INDEX idx_notifications_user_created (user_id, created_at),
      INDEX idx_notifications_entity (related_entity_type, related_entity_id),
      CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  await addColumnIfMissing("notifications", "action_url", "action_url VARCHAR(500) NULL AFTER related_entity_id");
  await addColumnIfMissing("notifications", "priority", "priority ENUM('normal','high','critical') NOT NULL DEFAULT 'normal' AFTER action_url");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NULL,
      endpoint VARCHAR(600) NOT NULL,
      p256dh_key VARCHAR(255) NOT NULL,
      auth_key VARCHAR(255) NOT NULL,
      device_label VARCHAR(120) NULL,
      user_agent VARCHAR(500) NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      last_success_at DATETIME NULL,
      last_failure_at DATETIME NULL,
      UNIQUE KEY uq_push_subscriptions_endpoint (endpoint),
      INDEX idx_push_subscriptions_user_active (user_id, is_active),
      INDEX idx_push_subscriptions_active_updated (is_active, updated_at),
      CONSTRAINT fk_push_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_delivery_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      notification_id BIGINT UNSIGNED NULL,
      subscription_id BIGINT UNSIGNED NOT NULL,
      status ENUM('sent','failed') NOT NULL,
      provider_status_code INT NULL,
      failure_reason VARCHAR(500) NULL,
      sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_push_logs_notification (notification_id, sent_at),
      INDEX idx_push_logs_subscription (subscription_id, sent_at),
      CONSTRAINT fk_push_logs_notification FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE SET NULL,
      CONSTRAINT fk_push_logs_subscription FOREIGN KEY (subscription_id) REFERENCES push_subscriptions(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pwa_installs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NULL,
      device_id VARCHAR(255) NULL,
      platform VARCHAR(40) NOT NULL DEFAULT 'other',
      ip_address VARCHAR(80) NULL,
      user_agent TEXT NULL,
      installed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_pwa_installs_device (device_id),
      INDEX idx_pwa_installs_installed_at (installed_at),
      INDEX idx_pwa_installs_platform (platform, installed_at),
      INDEX idx_pwa_installs_user (user_id),
      CONSTRAINT fk_pwa_installs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS file_download_events (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      source_table VARCHAR(80) NOT NULL,
      source_id BIGINT UNSIGNED NOT NULL,
      downloaded_by_user_id BIGINT UNSIGNED NULL,
      downloaded_by_role VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
      ip_address VARCHAR(80) NULL,
      user_agent VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_file_download_events_source (source_table, source_id, created_at),
      INDEX idx_file_download_events_created_at (created_at),
      INDEX idx_file_download_events_role_created (downloaded_by_role, created_at),
      CONSTRAINT fk_file_download_events_user FOREIGN KEY (downloaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      trader_id BIGINT UNSIGNED NOT NULL,
      customer_id BIGINT UNSIGNED NULL,
      reviewer_user_id BIGINT UNSIGNED NULL,
      rating_scope VARCHAR(40) NOT NULL DEFAULT 'portal',
      reviewer_type VARCHAR(20) NOT NULL DEFAULT 'trader',
      reviewer_name VARCHAR(160) NULL,
      reviewer_mobile VARCHAR(20) NULL,
      rating_value TINYINT UNSIGNED NOT NULL,
      review_text TEXT NULL,
      moderation_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
      moderation_remarks VARCHAR(500) NULL,
      moderated_by_user_id BIGINT UNSIGNED NULL,
      moderated_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_ratings_trader_status (trader_id, moderation_status),
      INDEX idx_ratings_status_created (moderation_status, created_at),
      INDEX idx_ratings_customer (customer_id),
      INDEX idx_ratings_scope_status (rating_scope, moderation_status, created_at),
      CONSTRAINT fk_ratings_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
      CONSTRAINT fk_ratings_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_ratings_moderator FOREIGN KEY (moderated_by_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  await addColumnIfMissing("ratings", "moderation_remarks", "moderation_remarks VARCHAR(500) NULL");
  await addColumnIfMissing("ratings", "moderated_by_user_id", "moderated_by_user_id BIGINT UNSIGNED NULL");
  await addColumnIfMissing("ratings", "moderated_at", "moderated_at DATETIME NULL");
  await addColumnIfMissing("ratings", "customer_id", "customer_id BIGINT UNSIGNED NULL");
  await addColumnIfMissing("ratings", "rating_scope", "rating_scope VARCHAR(40) NOT NULL DEFAULT 'portal'");
  await addColumnIfMissing("ratings", "reviewer_type", "reviewer_type VARCHAR(20) NOT NULL DEFAULT 'trader'");
  await addColumnIfMissing("ratings", "reviewer_name", "reviewer_name VARCHAR(160) NULL");
  await addColumnIfMissing("ratings", "reviewer_mobile", "reviewer_mobile VARCHAR(20) NULL");
  await addIndexIfMissing("ratings", "idx_ratings_status_created", "idx_ratings_status_created (moderation_status, created_at)");
  await addIndexIfMissing("ratings", "idx_ratings_customer", "idx_ratings_customer (customer_id)");
  await addIndexIfMissing("ratings", "idx_ratings_scope_status", "idx_ratings_scope_status (rating_scope, moderation_status, created_at)");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rating_attachments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      rating_id BIGINT UNSIGNED NOT NULL,
      attachment_type ENUM('image','video') NOT NULL,
      storage_key VARCHAR(500) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size_bytes BIGINT UNSIGNED NOT NULL,
      checksum_sha256 CHAR(64) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_rating_attachments_rating (rating_id),
      CONSTRAINT fk_rating_attachments_rating FOREIGN KEY (rating_id) REFERENCES ratings(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  await addColumnIfMissing("traders", "aadhaar_masked", "aadhaar_masked VARCHAR(20) NULL");
  await addColumnIfMissing("traders", "aadhaar_hash", "aadhaar_hash CHAR(64) NULL");
  await addColumnIfMissing("traders", "blood_group", "blood_group VARCHAR(5) NULL");
  await addColumnIfMissing("traders", "licence_number", "licence_number VARCHAR(100) NULL");
  await addColumnIfMissing("traders", "association_sequence_number", "association_sequence_number VARCHAR(50) NULL");
  await addColumnIfMissing("traders", "association_registration_number", "association_registration_number VARCHAR(50) NULL");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trader_galas (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      trader_id BIGINT UNSIGNED NOT NULL,
      gala_id BIGINT UNSIGNED NOT NULL,
      business_name VARCHAR(180) NOT NULL,
      market_section VARCHAR(120) NULL,
      business_category_id BIGINT UNSIGNED NULL,
      market_registration_number VARCHAR(100) NULL,
      licence_number VARCHAR(100) NULL,
      association_sequence_number VARCHAR(50) NULL,
      association_registration_number VARCHAR(50) NULL,
      status ENUM('submitted','under_review','correction_required','approved','rejected','suspended','deactivated') NOT NULL DEFAULT 'submitted',
      is_primary TINYINT(1) NOT NULL DEFAULT 0,
      admin_remarks TEXT NULL,
      verified_by BIGINT UNSIGNED NULL,
      verified_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_trader_galas_trader_gala (trader_id, gala_id),
      UNIQUE KEY uq_trader_galas_registration (market_registration_number),
      INDEX idx_trader_galas_trader_status (trader_id, status),
      INDEX idx_trader_galas_gala (gala_id),
      INDEX idx_trader_galas_primary (trader_id, is_primary),
      CONSTRAINT fk_trader_galas_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
      CONSTRAINT fk_trader_galas_gala FOREIGN KEY (gala_id) REFERENCES market_galas(id) ON DELETE CASCADE,
      CONSTRAINT fk_trader_galas_category FOREIGN KEY (business_category_id) REFERENCES business_categories(id) ON DELETE SET NULL,
      CONSTRAINT fk_trader_galas_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    INSERT IGNORE INTO trader_galas (
      trader_id, gala_id, business_name, market_section, business_category_id,
      market_registration_number, licence_number, association_sequence_number,
      association_registration_number, status, is_primary, verified_at
    )
    SELECT t.id, t.gala_id, t.business_name, mg.section_name, t.business_category_id,
           t.market_registration_number, t.licence_number, t.association_sequence_number,
           t.association_registration_number,
           CASE WHEN t.verification_status IN ('draft') THEN 'submitted' ELSE t.verification_status END,
           1, t.verified_at
      FROM traders t
      JOIN market_galas mg ON mg.id = t.gala_id
     WHERE t.gala_id IS NOT NULL
  `);
  await addColumnIfMissing("posts", "share_audience", "share_audience VARCHAR(30) NOT NULL DEFAULT 'all'");
  await addColumnIfMissing("posts", "share_category_id", "share_category_id BIGINT UNSIGNED NULL");
  await addIndexIfMissing("posts", "idx_posts_share_audience", "idx_posts_share_audience (share_audience, share_category_id, status, post_type)");
  await addColumnIfMissing("support_tickets", "resolved_at", "resolved_at DATETIME NULL");
  await addIndexIfMissing("support_tickets", "idx_tickets_status_resolved", "idx_tickets_status_resolved (status, resolved_at)");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mobile_change_requests (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      request_code VARCHAR(30) NOT NULL UNIQUE,
      trader_id BIGINT UNSIGNED NOT NULL,
      old_mobile VARCHAR(20) NOT NULL,
      new_mobile VARCHAR(20) NOT NULL,
      alternate_mobile VARCHAR(20) NULL,
      reason VARCHAR(120) NOT NULL,
      application_note TEXT NOT NULL,
      status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
      admin_remarks VARCHAR(500) NULL,
      decided_by_user_id BIGINT UNSIGNED NULL,
      decided_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_mobile_change_trader_status (trader_id, status),
      INDEX idx_mobile_change_status_created (status, created_at),
      CONSTRAINT fk_mobile_change_trader FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
      CONSTRAINT fk_mobile_change_decided_by FOREIGN KEY (decided_by_user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mobile_change_documents (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      request_id BIGINT UNSIGNED NOT NULL,
      document_type ENUM('id_proof','mobile_proof') NOT NULL,
      storage_key VARCHAR(500) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size_bytes BIGINT UNSIGNED NOT NULL,
      checksum_sha256 CHAR(64) NOT NULL,
      uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_mobile_change_docs_request (request_id),
      CONSTRAINT fk_mobile_change_docs_request FOREIGN KEY (request_id) REFERENCES mobile_change_requests(id) ON DELETE CASCADE,
      CONSTRAINT fk_mobile_change_docs_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS complaint_status_history (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      complaint_id BIGINT UNSIGNED NOT NULL,
      old_status VARCHAR(40) NULL,
      new_status VARCHAR(40) NOT NULL,
      remarks VARCHAR(500) NULL,
      changed_by_user_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_complaint_history_ticket (complaint_id, created_at),
      CONSTRAINT fk_complaint_history_ticket FOREIGN KEY (complaint_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
      CONSTRAINT fk_complaint_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS complaint_attachments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      complaint_id BIGINT UNSIGNED NOT NULL,
      attachment_type ENUM('image','video') NOT NULL,
      storage_key VARCHAR(500) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size_bytes BIGINT UNSIGNED NOT NULL,
      checksum_sha256 CHAR(64) NOT NULL,
      uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_complaint_attachments_ticket (complaint_id),
      CONSTRAINT fk_complaint_attachments_ticket FOREIGN KEY (complaint_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
      CONSTRAINT fk_complaint_attachments_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS post_attachments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      post_id BIGINT UNSIGNED NOT NULL,
      attachment_type ENUM('image','video') NOT NULL,
      storage_key VARCHAR(500) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size_bytes BIGINT UNSIGNED NOT NULL,
      checksum_sha256 CHAR(64) NOT NULL,
      uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_post_attachments_post (post_id),
      CONSTRAINT fk_post_attachments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      CONSTRAINT fk_post_attachments_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS content_attachments (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      post_id BIGINT UNSIGNED NOT NULL,
      attachment_type ENUM('image','video','document') NOT NULL,
      storage_key VARCHAR(500) NOT NULL,
      original_filename VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      file_size_bytes BIGINT UNSIGNED NOT NULL,
      checksum_sha256 CHAR(64) NOT NULL,
      uploaded_by_user_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_content_attachments_post (post_id),
      CONSTRAINT fk_content_attachments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      CONSTRAINT fk_content_attachments_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_events (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED NOT NULL,
      role_code VARCHAR(30) NOT NULL,
      ip_address VARCHAR(80) NULL,
      user_agent VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_login_events_created_at (created_at),
      INDEX idx_login_events_user_created (user_id, created_at),
      CONSTRAINT fk_login_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS committee_members (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(160) NOT NULL,
      name_mr VARCHAR(160) NULL,
      designation VARCHAR(100) NOT NULL,
      gala_number VARCHAR(40) NULL,
      term_label VARCHAR(80) NULL,
      message TEXT NULL,
      photo_storage_key VARCHAR(500) NULL,
      photo_original_filename VARCHAR(255) NULL,
      photo_mime_type VARCHAR(100) NULL,
      photo_file_size_bytes BIGINT UNSIGNED NULL,
      display_order INT NOT NULL DEFAULT 100,
      status ENUM('active','inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_committee_status_order (status, display_order)
    ) ENGINE=InnoDB
  `);
  const [[committeeCount]] = await pool.query("SELECT COUNT(*) AS count FROM committee_members");
  if (Number(committeeCount?.count || 0) === 0) {
    await pool.query(
      `INSERT INTO committee_members (full_name, name_mr, designation, gala_number, term_label, message, display_order, status)
       VALUES
       ('Shri. Sourabh Kunjir', 'श्री. सौरभ कुंजीर', 'Chairman', NULL, '2026-2031', 'Together we are building a transparent, digital and service-focused market yard for every member.', 1, 'active'),
       ('Shri. Ashok Deshmukh', NULL, 'Lobby Chairman', NULL, '2026-2031', 'Our lobby team coordinates member needs, daily market operations and association support.', 2, 'active')`,
    );
  }
  for (const column of [
    ["photo_storage_key", "VARCHAR(500) NULL"],
    ["photo_original_filename", "VARCHAR(255) NULL"],
    ["photo_mime_type", "VARCHAR(100) NULL"],
    ["photo_file_size_bytes", "BIGINT UNSIGNED NULL"],
  ]) {
    try {
      await pool.query(`ALTER TABLE committee_members ADD COLUMN ${column[0]} ${column[1]}`);
    } catch (error) {
      if (!String(error.message || "").includes("Duplicate column name")) throw error;
    }
  }
  await ensureMarketPriceTables();
}

async function ensureMarketPriceTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS market_items (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      category ENUM('vegetable','fruit') NOT NULL,
      name_en VARCHAR(120) NOT NULL,
      name_mr VARCHAR(120) NOT NULL,
      variety VARCHAR(120) NULL,
      default_unit VARCHAR(40) NOT NULL DEFAULT 'Kg',
      display_order INT NOT NULL DEFAULT 100,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_by BIGINT UNSIGNED NULL,
      updated_by BIGINT UNSIGNED NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at DATETIME NULL,
      UNIQUE KEY uq_market_item_name (category, name_en, variety),
      INDEX idx_market_items_category_active (category, is_active, deleted_at, display_order),
      INDEX idx_market_items_active_order (is_active, deleted_at, display_order),
      CONSTRAINT fk_market_items_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_market_items_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS market_prices (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      market_item_id BIGINT UNSIGNED NOT NULL,
      price_date DATE NOT NULL,
      min_price DECIMAL(10,2) NOT NULL,
      max_price DECIMAL(10,2) NOT NULL,
      modal_price DECIMAL(10,2) NOT NULL,
      unit VARCHAR(40) NOT NULL,
      arrival_quantity DECIMAL(12,2) NULL,
      arrival_unit VARCHAR(40) NULL,
      quality_grade VARCHAR(80) NULL,
      notes TEXT NULL,
      status ENUM('draft','published') NOT NULL DEFAULT 'draft',
      created_by BIGINT UNSIGNED NULL,
      updated_by BIGINT UNSIGNED NULL,
      published_by BIGINT UNSIGNED NULL,
      published_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_market_price_item_date (market_item_id, price_date),
      INDEX idx_market_prices_date_status (price_date, status),
      INDEX idx_market_prices_status_published (status, published_at),
      INDEX idx_market_prices_item_date (market_item_id, price_date),
      CONSTRAINT fk_market_prices_item FOREIGN KEY (market_item_id) REFERENCES market_items(id) ON DELETE CASCADE,
      CONSTRAINT fk_market_prices_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_market_prices_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_market_prices_published_by FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT chk_market_prices_non_negative CHECK (min_price >= 0 AND max_price >= 0 AND modal_price >= 0),
      CONSTRAINT chk_market_prices_range CHECK (max_price >= min_price)
    ) ENGINE=InnoDB
  `);
  const [[count]] = await pool.query("SELECT COUNT(*) AS count FROM market_items WHERE deleted_at IS NULL");
  if (Number(count?.count || 0) > 0) return;
  await pool.query(
    `INSERT INTO market_items (category, name_en, name_mr, default_unit, display_order, is_active)
     VALUES
     ('vegetable','Tomato','टोमॅटो','Kg',1,1),
     ('vegetable','Onion','कांदा','Kg',2,1),
     ('vegetable','Potato','बटाटा','Kg',3,1),
     ('vegetable','Brinjal','वांगी','Kg',4,1),
     ('vegetable','Cabbage','कोबी','Kg',5,1),
     ('vegetable','Cauliflower','फ्लॉवर','Kg',6,1),
     ('vegetable','Green Chilli','हिरवी मिरची','Kg',7,1),
     ('vegetable','Capsicum','ढोबळी मिरची','Kg',8,1),
     ('vegetable','Lady Finger','भेंडी','Kg',9,1),
     ('vegetable','Cucumber','काकडी','Kg',10,1),
     ('vegetable','Carrot','गाजर','Kg',11,1),
     ('vegetable','Beetroot','बीट','Kg',12,1),
     ('vegetable','Bitter Gourd','कारले','Kg',13,1),
     ('vegetable','Bottle Gourd','दुधी भोपळा','Kg',14,1),
     ('vegetable','Ridge Gourd','दोडका','Kg',15,1),
     ('vegetable','Pumpkin','भोपळा','Kg',16,1),
     ('vegetable','Green Peas','मटार','Kg',17,1),
     ('vegetable','Spinach','पालक','Bunch',18,1),
     ('vegetable','Coriander','कोथिंबीर','Bunch',19,1),
     ('vegetable','Fenugreek','मेथी','Bunch',20,1),
     ('vegetable','Drumstick','शेवगा','Kg',21,1),
     ('vegetable','Garlic','लसूण','Kg',22,1),
     ('vegetable','Ginger','आले','Kg',23,1),
     ('vegetable','Sweet Corn','स्वीट कॉर्न','Piece',24,1),
     ('fruit','Apple','सफरचंद','Kg',101,1),
     ('fruit','Banana','केळी','Dozen',102,1),
     ('fruit','Orange','संत्री','Kg',103,1),
     ('fruit','Pomegranate','डाळिंब','Kg',104,1),
     ('fruit','Grapes','द्राक्षे','Kg',105,1),
     ('fruit','Papaya','पपई','Kg',106,1),
     ('fruit','Watermelon','कलिंगड','Kg',107,1),
     ('fruit','Muskmelon','खरबूज','Kg',108,1),
     ('fruit','Guava','पेरू','Kg',109,1),
     ('fruit','Pineapple','अननस','Piece',110,1),
     ('fruit','Mango','आंबा','Kg',111,1),
     ('fruit','Sweet Lime','मोसंबी','Kg',112,1),
     ('fruit','Chikoo','चिकू','Kg',113,1),
     ('fruit','Custard Apple','सीताफळ','Kg',114,1),
     ('fruit','Coconut','नारळ','Piece',115,1)`
  );
}

app.get("/api/health", async (_req, res) => {
  try {
    const db = await pingDatabase();
    res.json({
      ok: true,
      service: "market-yard-portal-backend",
      database: db.database_name,
      mysqlVersion: db.mysql_version,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      service: "market-yard-portal-backend",
      error: error.message,
    });
  }
});

app.get("/api/v1/health", async (_req, res) => {
  try {
    const db = await pingDatabase();
    res.json({
      ok: true,
      service: "market-yard-backend-api",
      database: db.database_name,
      mysqlVersion: db.mysql_version,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      service: "market-yard-backend-api",
      error: error.message,
    });
  }
});

async function sendOtpHandler(req, res) {
  const mobile = String(req.body?.mobile || "").trim();
  if (!/^\d{10}$/.test(mobile)) {
    res.status(400).json({ ok: false, error: "Enter a valid 10 digit mobile number." });
    return;
  }

  const otp = String(crypto.randomInt(100000, 999999));
  otpStore.set(mobile, { otpHash: crypto.createHash("sha256").update(otp).digest("hex"), expiresAt: Date.now() + 5 * 60 * 1000 });

  if (!config.msg91.authKey || !config.msg91.templateId) {
    res.json({ ok: true, mode: "local-dev", message: "OTP generated locally because MSG91 env vars are not configured.", devOtp: otp });
    return;
  }

  res.json({ ok: true, mode: "msg91", message: "OTP request accepted." });
}

app.post("/api/v1/auth/send-otp", sendOtpHandler);

app.post("/api/v1/auth/trader/send-otp", sendOtpHandler);

async function verifyOtpHandler(req, res) {
  const mobile = String(req.body?.mobile || "").trim();
  const otp = String(req.body?.otp || "").trim();
  const record = otpStore.get(mobile);

  if (!record || record.expiresAt < Date.now()) {
    res.status(400).json({ ok: false, error: "OTP expired or not found." });
    return;
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== record.otpHash) {
    res.status(400).json({ ok: false, error: "Incorrect OTP." });
    return;
  }

  otpStore.delete(mobile);
  const [users] = await pool.query(
    `SELECT u.id, u.username, u.mobile, u.full_name, u.status, r.code AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
      WHERE u.mobile = :mobile
      LIMIT 1`,
    { mobile },
  );
  const user = users[0] || { id: null, username: null, mobile, full_name: "New User", status: "pending", role: "TRADER" };
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = createSessionToken({ userId: user.id, mobile, role: user.role, expiresAt });

  res.setHeader("Set-Cookie", [
    createCookie("trader_session_token", token, SESSION_MAX_AGE_SECONDS),
    clearCookie("session_token"),
  ]);
  res.json({ ok: true, user });
}

app.post("/api/v1/auth/verify-otp", verifyOtpHandler);

app.post("/api/v1/auth/trader/verify-otp", verifyOtpHandler);

async function sendPasswordResetOtpHandler(req, res) {
  const mobile = String(req.body?.mobile || "").trim();
  if (!/^\d{10}$/.test(mobile)) {
    res.status(400).json({ ok: false, error: "Enter a valid 10 digit mobile number." });
    return;
  }
  const [[user]] = await pool.query(
    `SELECT u.id, u.status, r.code AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
      WHERE u.mobile = :mobile
        AND r.code = 'TRADER'
      LIMIT 1`,
    { mobile },
  );
  if (!user || user.status !== "active") {
    res.status(404).json({ ok: false, error: "Member account not found." });
    return;
  }

  const otp = String(crypto.randomInt(100000, 999999));
  passwordResetStore.set(mobile, {
    otpHash: crypto.createHash("sha256").update(otp).digest("hex"),
    expiresAt: Date.now() + 10 * 60 * 1000,
    verified: false,
    userId: user.id,
  });

  if (!config.msg91.authKey || !config.msg91.templateId) {
    res.json({ ok: true, mode: "local-dev", message: "Password reset OTP generated locally.", devOtp: otp });
    return;
  }

  res.json({ ok: true, mode: "msg91", message: "Password reset OTP request accepted." });
}

app.post("/api/v1/auth/trader/password-reset/send-otp", sendPasswordResetOtpHandler);

async function verifyPasswordResetOtpHandler(req, res) {
  const mobile = String(req.body?.mobile || "").trim();
  const otp = String(req.body?.otp || "").trim();
  const record = passwordResetStore.get(mobile);
  if (!record || record.expiresAt < Date.now()) {
    res.status(400).json({ ok: false, error: "OTP expired or not found." });
    return;
  }
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  if (otpHash !== record.otpHash) {
    res.status(400).json({ ok: false, error: "Incorrect OTP." });
    return;
  }
  const resetToken = crypto.randomUUID();
  passwordResetStore.set(resetToken, {
    mobile,
    userId: record.userId,
    expiresAt: Date.now() + 10 * 60 * 1000,
    verified: true,
  });
  passwordResetStore.delete(mobile);
  res.json({ ok: true, resetToken });
}

app.post("/api/v1/auth/trader/password-reset/verify-otp", verifyPasswordResetOtpHandler);

app.post("/api/v1/auth/trader/password-reset/confirm", async (req, res) => {
  const resetToken = String(req.body?.resetToken || "").trim();
  const newPassword = String(req.body?.newPassword || "");
  const record = passwordResetStore.get(resetToken);
  if (!record || !record.verified || record.expiresAt < Date.now()) {
    res.status(400).json({ ok: false, error: "Password reset session expired. Please request OTP again." });
    return;
  }
  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ ok: false, error: "New password must be at least 6 characters." });
    return;
  }
  const passwordHash = crypto.createHash("sha256").update(newPassword).digest("hex");
  await pool.query(
    "UPDATE users SET password_hash = :passwordHash, password_changed_at = NOW() WHERE id = :userId",
    { passwordHash, userId: record.userId },
  );
  passwordResetStore.delete(resetToken);
  res.json({ ok: true });
});

async function loginHandler(req, res) {
  const identifier = String(req.body?.identifier || "").trim();
  const password = String(req.body?.password || "");
  const expectedRole = normalizeRoleCode(req.body?.role);

  if (!identifier || !password || !["MAIN_ADMIN", "USER_ADMIN", "TRADER"].includes(expectedRole)) {
    res.status(400).json({ ok: false, error: "Mobile number / username, password, and valid role are required." });
    return;
  }

  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.mobile, u.full_name, u.status, u.password_hash, r.code AS role,
            t.id AS trader_id, t.verification_status AS trader_status
       FROM users u
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
      WHERE (u.username = :identifier OR u.mobile = :identifier OR u.email = :identifier)
        AND r.code = :expectedRole
      LIMIT 1`,
    { identifier, expectedRole },
  );

  const user = rows[0];
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  if (!user || user.password_hash !== passwordHash) {
    res.status(401).json({ ok: false, error: "Mobile number / username or password is incorrect." });
    return;
  }

  if (user.status !== "active") {
    res.status(403).json({ ok: false, error: "Account is not active." });
    return;
  }

  if (user.role === "TRADER" && user.trader_status !== "approved") {
    res.status(403).json({ ok: false, error: "Member account is not approved yet." });
    return;
  }

  const photoUrl = user.role === "TRADER" ? await getTraderProfilePhotoUrl(user.trader_id) : null;
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = createSessionToken({ userId: user.id, mobile: user.mobile, role: user.role, traderId: user.trader_id, expiresAt });
  const cookieName = user.role === "TRADER" ? "trader_session_token" : "admin_session_token";
  res.setHeader("Set-Cookie", [
    createCookie(cookieName, token, SESSION_MAX_AGE_SECONDS),
    clearCookie("session_token"),
  ]);
  await pool.query("UPDATE users SET last_login_at = NOW() WHERE id = :userId", { userId: user.id });
  await recordLoginEvent({ userId: user.id, roleCode: user.role, req });

  res.json({
    ok: true,
    user: {
      id: user.id,
      username: user.username,
      mobile: user.mobile,
      name: user.full_name,
      role: publicRoleCode(user.role),
      traderId: user.trader_id,
      photoUrl,
    },
  });
}

app.post("/api/v1/auth/login", loginHandler);

app.post("/api/v1/auth/trader/login", async (req, res) => {
  req.body = { ...req.body, role: "TRADER" };
  await loginHandler(req, res);
});

async function traderRegisterHandler(req, res) {
  const {
    name,
    username,
    email = null,
    mobile,
    password,
    business,
    gala,
    category = "Other",
    address = "",
    section = null,
    license = null,
    associationSequenceNumber = null,
    associationRegistrationNumber = null,
    documents = [],
  } = req.body || {};

  if (!name || !username || !/^\d{10}$/.test(String(mobile || "")) || !password || !business || !gala || !String(section || "").trim()) {
    res.status(400).json({ ok: false, error: "Firm name, member name, address/gala, department, contact, username, and password are required." });
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    res.status(400).json({ ok: false, error: "Email address is invalid." });
    return;
  }
  if (String(password).length < 8 || !/[0-9]/.test(String(password)) || !/[^A-Za-z0-9]/.test(String(password))) {
    res.status(400).json({ ok: false, error: "Password must be at least 8 characters and include a number and symbol." });
    return;
  }

  const [[existingMobileUser]] = await pool.query(
    `SELECT u.id, u.full_name, t.trader_code
       FROM users u
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
      WHERE u.mobile = :mobile AND r.code = 'TRADER'
      LIMIT 1`,
    { mobile },
  );
  if (existingMobileUser) {
    res.status(409).json({
      ok: false,
      duplicateMobile: true,
      error: "This mobile number is already registered. Add another Gala / Shop to this member account.",
      memberName: existingMobileUser.full_name,
      traderCode: existingMobileUser.trader_code,
    });
    return;
  }

  const [[traderRole]] = await pool.query("SELECT id FROM roles WHERE code = 'TRADER' LIMIT 1");
  if (!traderRole) {
    res.status(500).json({ ok: false, error: "TRADER role is missing. Import the database schema first." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const passwordHash = hashPassword(password);
    const [userResult] = await connection.query(
      `INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, status)
       VALUES (:roleId, :username, :email, :mobile, :passwordHash, :name, 'pending')`,
      { roleId: traderRole.id, username, email: email || null, mobile, passwordHash, name },
    );

    const { galaId, categoryId } = await ensureGalaAndCategory(connection, { gala, section, category });

    const traderCode = `TRD-${String(userResult.insertId).padStart(5, "0")}`;
    const [traderResult] = await connection.query(
      `INSERT INTO traders (
         user_id, trader_code, business_name, market_registration_number, gala_id, business_category_id,
         address_line1, village_city, district, licence_number, association_sequence_number,
         association_registration_number, verification_status
       )
       VALUES (
         :userId, :traderCode, :business, :license, :galaId, :categoryId,
         :addressLine1, :villageCity, :district, :licenceNumber, :associationSequenceNumber,
         :associationRegistrationNumber, 'submitted'
       )`,
      {
        userId: userResult.insertId,
        traderCode,
        business,
        license: license || null,
        licenceNumber: license || null,
        associationSequenceNumber: String(associationSequenceNumber || "").trim() || null,
        associationRegistrationNumber: String(associationRegistrationNumber || "").trim() || null,
        galaId,
        categoryId,
        addressLine1: address || gala,
        villageCity: "Saswad",
        district: "Pune",
      },
    );

    await addTraderGala(connection, {
      traderId: traderResult.insertId,
      galaId,
      businessName: business,
      marketSection: section,
      categoryId,
      marketRegistrationNumber: license || null,
      licenceNumber: license || null,
      associationSequenceNumber: String(associationSequenceNumber || "").trim() || null,
      associationRegistrationNumber: String(associationRegistrationNumber || "").trim() || null,
      status: "submitted",
      isPrimary: true,
    });

    const allowedDocumentTypes = new Set(Object.keys(DOCUMENT_TYPE_LABELS));
    const safeDocuments = Array.isArray(documents) ? documents.slice(0, 6) : [];
    for (const document of safeDocuments) {
      const documentType = String(document?.documentType || "");
      if (!allowedDocumentTypes.has(documentType)) continue;
      const saved = await saveTraderDocumentFile({
        traderId: traderResult.insertId,
        documentType,
        originalFilename: document.originalFilename,
        mimeType: document.mimeType,
        dataUrl: document.dataUrl,
      });
      await connection.query(
        `INSERT INTO trader_documents (
           trader_id, document_type, document_hash, storage_key, original_filename,
           mime_type, file_size_bytes, status, uploaded_by
         )
         VALUES (
           :traderId, :documentType, :documentHash, :storageKey, :originalFilename,
           :mimeType, :fileSizeBytes, 'uploaded', :uploadedBy
         )`,
        {
          traderId: traderResult.insertId,
          documentType,
          documentHash: saved.documentHash,
          storageKey: saved.storageKey,
          originalFilename: saved.originalFilename,
          mimeType: saved.mimeType,
          fileSizeBytes: saved.fileSizeBytes,
          uploadedBy: userResult.insertId,
        },
      );
    }

    await connection.query(
      `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
       VALUES (:traderId, NULL, 'submitted', 'Member registration submitted', :userId)`,
      { traderId: traderResult.insertId, userId: userResult.insertId },
    ).catch(() => undefined);
    await connection.commit();
    await writeAudit({ req, action: "trader.registration_submitted", module: "traders", entityType: "traders", newValues: { traderCode, mobile, username } }).catch(() => undefined);
    res.status(201).json({ ok: true, applicationId: traderCode, traderId: traderResult.insertId, status: "submitted" });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ ok: false, error: "Username, contact number, registration number, or gala/shop number is already registered." });
      return;
    }
    throw error;
  } finally {
    connection.release();
  }
}

app.post("/api/v1/auth/trader-register", traderRegisterHandler);

app.post("/api/v1/auth/trader/register", traderRegisterHandler);

app.post("/api/v1/auth/trader/add-gala", async (req, res) => {
  const {
    mobile,
    password,
    business,
    gala,
    category = "Other",
    section = null,
    license = null,
    associationSequenceNumber = null,
    associationRegistrationNumber = null,
  } = req.body || {};

  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(cleanMobile) || !password || !business || !gala || !String(section || "").trim()) {
    res.status(400).json({ ok: false, error: "Existing mobile, password, firm name, gala/shop number, and market section are required." });
    return;
  }

  const [[member]] = await pool.query(
    `SELECT u.id AS user_id, u.full_name, u.password_hash, u.status AS user_status,
            t.id AS trader_id, t.trader_code
       FROM users u
       JOIN roles r ON r.id = u.role_id
       JOIN traders t ON t.user_id = u.id
      WHERE u.mobile = :mobile AND r.code = 'TRADER'
      LIMIT 1`,
    { mobile: cleanMobile },
  );
  if (!member || member.password_hash !== hashPassword(password)) {
    res.status(401).json({ ok: false, error: "Existing mobile number or password is incorrect." });
    return;
  }
  if (member.user_status !== "active" && member.user_status !== "pending") {
    res.status(403).json({ ok: false, error: "Member account is not active for adding another gala/shop." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { galaId, categoryId } = await ensureGalaAndCategory(connection, { gala, section, category });
    const [[existingGala]] = await connection.query(
      "SELECT id, status FROM trader_galas WHERE trader_id = :traderId AND gala_id = :galaId LIMIT 1",
      { traderId: member.trader_id, galaId },
    );
    if (existingGala) {
      await connection.rollback();
      res.status(409).json({ ok: false, error: "This gala/shop is already linked to this member account." });
      return;
    }

    const galaRecordId = await addTraderGala(connection, {
      traderId: member.trader_id,
      galaId,
      businessName: business,
      marketSection: section,
      categoryId,
      marketRegistrationNumber: license || null,
      licenceNumber: license || null,
      associationSequenceNumber: String(associationSequenceNumber || "").trim() || null,
      associationRegistrationNumber: String(associationRegistrationNumber || "").trim() || null,
      status: "submitted",
      isPrimary: false,
    });
    await connection.query(
      `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
       VALUES (:traderId, NULL, 'submitted', :remarks, :userId)`,
      {
        traderId: member.trader_id,
        remarks: `Additional gala/shop submitted: ${gala}`,
        userId: member.user_id,
      },
    ).catch(() => undefined);
    await connection.commit();
    await writeAudit({ req, action: "trader.gala_submitted", module: "traders", entityType: "trader_galas", entityId: galaRecordId, newValues: { traderId: member.trader_id, gala, mobile: cleanMobile } }).catch(() => undefined);
    res.status(201).json({ ok: true, applicationId: `${member.trader_code}-G${galaRecordId}`, traderId: member.trader_id, galaRecordId, status: "submitted" });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ ok: false, error: "Registration number or gala/shop number is already linked." });
      return;
    }
    throw error;
  } finally {
    connection.release();
  }
});

app.get("/api/v1/auth/trader/application-status", async (req, res) => {
  const mobile = String(req.query.mobile || "").trim();
  const applicationNumber = String(req.query.applicationNumber || req.query.application_number || "").trim();
  if (!mobile && !applicationNumber) {
    res.status(400).json({ ok: false, error: "mobile or applicationNumber is required." });
    return;
  }

  const [rows] = await pool.query(
    `${traderRequestSelect}
      WHERE (:mobile = '' OR u.mobile = :mobile)
        AND (:applicationNumber = '' OR t.trader_code = :applicationNumber)
      LIMIT 1`,
    { mobile, applicationNumber },
  );
  const trader = rows[0];
  if (!trader) {
    res.status(404).json({ ok: false, error: "Application not found." });
    return;
  }
  res.json({ ok: true, application: trader });
});

app.get("/api/v1/auth/me", async (req, res) => {
  const requestedRole = normalizeRoleCode(req.query.role);
  const preferredCookie = requestedRole === "TRADER" ? "trader_session_token" : "admin_session_token";
  const session = verifySessionToken(getCookie(req, preferredCookie));
  if (!session) {
    res.status(401).json({ ok: false, error: "Not authenticated." });
    return;
  }

  try {
    const [rows] = await pool.query(
    `SELECT u.id, u.username, u.mobile, u.full_name, u.status, r.code AS role,
            t.id AS trader_id, t.verification_status AS trader_status
       FROM users u
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
      WHERE u.id = :userId
      LIMIT 1`,
      { userId: session.userId },
    );
    const user = rows[0];
    if (!user || user.status !== "active") {
      res.status(401).json({ ok: false, error: "Session is no longer active." });
      return;
    }
    if (requestedRole === "TRADER" && user.role !== "TRADER") {
      res.status(403).json({ ok: false, error: "Role is not allowed for this session." });
      return;
    }
    if (requestedRole !== "TRADER" && !["MAIN_ADMIN", "USER_ADMIN"].includes(user.role)) {
      res.status(403).json({ ok: false, error: "Role is not allowed for this session." });
      return;
    }
    const photoUrl = user.role === "TRADER" ? await getTraderProfilePhotoUrl(user.trader_id) : null;
    res.json({
      ok: true,
      session,
      user: {
        id: user.id,
        username: user.username,
        mobile: user.mobile,
        name: user.full_name,
        role: publicRoleCode(user.role),
        traderId: user.trader_id,
        photoUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/v1/auth/logout", (req, res) => {
  const role = normalizeRoleCode(req.body?.role);
  const cookies = [clearCookie("session_token")];
  if (role === "TRADER") cookies.push(clearCookie("trader_session_token"));
  else if (role === "MAIN_ADMIN" || role === "USER_ADMIN") cookies.push(clearCookie("admin_session_token"));
  else cookies.push(clearCookie("admin_session_token"), clearCookie("trader_session_token"));
  res.setHeader("Set-Cookie", cookies);
  res.json({ ok: true });
});

app.post("/api/v1/media/signed-upload", (req, res) => {
  const fileName = String(req.body?.fileName || "").trim();
  const mimeType = String(req.body?.mimeType || "").trim();
  const fileSizeBytes = Number(req.body?.fileSizeBytes || 0);
  const allowed = ["image/jpeg", "image/png", "application/pdf", "video/mp4", "audio/mpeg", "audio/webm"];

  if (!fileName || !allowed.includes(mimeType) || fileSizeBytes <= 0 || fileSizeBytes > 100 * 1024 * 1024) {
    res.status(400).json({ ok: false, error: "Invalid file name, type, or size." });
    return;
  }

  if (!config.r2.accountId || !config.r2.accessKeyId || !config.r2.secretAccessKey || !config.r2.bucket) {
    res.status(501).json({ ok: false, error: "Cloudflare R2 env vars are not configured yet." });
    return;
  }

  res.status(501).json({ ok: false, error: "R2 signed URL generation is ready for SDK wiring once credentials are configured." });
});

app.post("/api/v1/notifications/whatsapp", (req, res) => {
  const mobile = String(req.body?.mobile || "").trim();
  const eventName = String(req.body?.eventName || "").trim();

  if (!/^\d{10}$/.test(mobile) || !eventName) {
    res.status(400).json({ ok: false, error: "Valid mobile and eventName are required." });
    return;
  }

  if (!config.aisensy.apiKey || !config.aisensy.campaignName) {
    res.status(501).json({ ok: false, error: "AiSensy env vars are not configured yet." });
    return;
  }

  res.status(202).json({ ok: true, message: "WhatsApp notification queued." });
});

app.get("/api/db/tables", async (_req, res) => {
  const [rows] = await pool.query("SHOW FULL TABLES");
  res.json({ ok: true, tables: rows });
});

app.get("/api/admin/summary", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM vw_admin_dashboard_summary");
  res.json({ ok: true, summary: rows[0] || null });
});

async function recordPwaInstall(req, res) {
  const deviceId = String(req.body?.deviceId || req.body?.device_id || "").trim().slice(0, 255) || null;
  const userAgent = String(req.headers["user-agent"] || "").slice(0, 2000) || null;
  const platform = String(req.body?.platform || detectPwaPlatform(userAgent)).trim().slice(0, 40) || "other";
  const ipAddress = String(req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim().slice(0, 80) || null;
  const user = await getOptionalRequestUser(req).catch(() => null);

  await pool.query(
    `INSERT INTO pwa_installs (user_id, device_id, platform, ip_address, user_agent)
     VALUES (:userId, :deviceId, :platform, :ipAddress, :userAgent)
     ON DUPLICATE KEY UPDATE
       user_id = COALESCE(VALUES(user_id), user_id),
       platform = VALUES(platform),
       ip_address = VALUES(ip_address),
       user_agent = VALUES(user_agent),
       updated_at = CURRENT_TIMESTAMP`,
    {
      userId: user?.id || null,
      deviceId,
      platform,
      ipAddress,
      userAgent,
    },
  );

  res.status(201).json({ ok: true });
}

app.post("/api/analytics/pwa-install", recordPwaInstall);
app.post("/api/v1/analytics/pwa-install", recordPwaInstall);

app.get("/api/v1/push/public-key", (_req, res) => {
  res.json({ ok: true, publicKey: config.vapid.publicKey || "", configured: isWebPushConfigured() });
});

app.get("/api/v1/push/status", requireRoles("MAIN_ADMIN", "USER_ADMIN", "TRADER"), async (req, res) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS activeCount FROM push_subscriptions WHERE user_id = :userId AND is_active = 1",
    { userId: req.user.id },
  );
  res.json({
    ok: true,
    configured: isWebPushConfigured(),
    activeCount: Number(rows[0]?.activeCount || 0),
  });
});

app.post("/api/v1/push/test", requireRoles("TRADER"), async (req, res) => {
  if (!isWebPushConfigured()) {
    res.status(503).json({ ok: false, message: "Push notifications are not configured on the server." });
    return;
  }

  const result = await sendPushToUser({
    userId: req.user.id,
    title: "Test notification",
    body: "Market Yard phone notifications are working on this device.",
    url: "/member/notifications",
    type: "test_notification",
    priority: "critical",
  });

  if (result.sent === 0) {
    res.status(404).json({
      ok: false,
      message: result.failed > 0
        ? "Test notification failed. Check push delivery logs."
        : "No active phone notification subscription found. Click Enable Notifications again on this phone.",
      result,
    });
    return;
  }

  res.json({ ok: true, message: "Test notification sent to this phone.", result });
});

app.post("/api/v1/push/subscribe", requireRoles("MAIN_ADMIN", "USER_ADMIN", "TRADER"), async (req, res) => {
  const endpoint = String(req.body?.endpoint || "").trim();
  const p256dh = String(req.body?.keys?.p256dh || "").trim();
  const auth = String(req.body?.keys?.auth || "").trim();
  if (!isWebPushConfigured()) {
    res.status(503).json({ ok: false, message: "Push notifications are not configured on the server." });
    return;
  }
  if (!endpoint || !p256dh || !auth || !endpoint.startsWith("https://")) {
    res.status(400).json({ ok: false, message: "Invalid push subscription." });
    return;
  }
  await pool.query(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh_key, auth_key, device_label, user_agent, is_active)
     VALUES (:userId, :endpoint, :p256dh, :auth, :deviceLabel, :userAgent, 1)
     ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       p256dh_key = VALUES(p256dh_key),
       auth_key = VALUES(auth_key),
       device_label = VALUES(device_label),
       user_agent = VALUES(user_agent),
       is_active = 1,
       updated_at = CURRENT_TIMESTAMP`,
    {
      userId: req.user.id,
      endpoint,
      p256dh,
      auth,
      deviceLabel: String(req.body?.deviceLabel || "").slice(0, 120) || null,
      userAgent: String(req.headers["user-agent"] || "").slice(0, 500) || null,
    },
  );
  res.status(201).json({ ok: true, message: "Notifications enabled on this device." });
});

app.post("/api/v1/push/unsubscribe", requireRoles("MAIN_ADMIN", "USER_ADMIN", "TRADER"), async (req, res) => {
  const endpoint = String(req.body?.endpoint || "").trim();
  if (!endpoint) {
    res.status(400).json({ ok: false, message: "Subscription endpoint is required." });
    return;
  }
  await pool.query(
    "UPDATE push_subscriptions SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE endpoint = :endpoint AND user_id = :userId",
    { endpoint, userId: req.user.id },
  );
  res.json({ ok: true, message: "Notifications disabled on this device." });
});

app.post("/api/v1/admin/translate", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const text = String(req.body?.text || "").trim();
  const sourceLang = normalizeTranslationLanguage(req.body?.sourceLang || "en", "en");
  const targetLang = normalizeTranslationLanguage(req.body?.targetLang || "mr", "mr");
  if (!text) {
    res.status(400).json({ ok: false, error: "Text is required." });
    return;
  }
  if (text.length > 10000) {
    res.status(400).json({ ok: false, error: "Translate up to 10,000 characters at a time." });
    return;
  }

  const result = await translateWithGoogle({ text, sourceLang, targetLang, requireProvider: true });
  res.json({ ok: true, ...result, sourceLang, targetLang });
});

app.get("/api/v1/trader/notifications", requireRoles("TRADER"), async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit || 80), 1), 150);
  const [notifications] = await pool.query(
    `SELECT id, notification_type, title, message, related_entity_type, related_entity_id,
            action_url, priority, delivery_status, read_at, sent_at, created_at
       FROM notifications
      WHERE user_id = :userId
        AND channel = 'in_app'
      ORDER BY created_at DESC, id DESC
      LIMIT :limit`,
    { userId: req.user.id, limit },
  );
  const [[unread]] = await pool.query(
    `SELECT COUNT(*) AS count
       FROM notifications
      WHERE user_id = :userId
        AND channel = 'in_app'
        AND read_at IS NULL
        AND delivery_status <> 'read'`,
    { userId: req.user.id },
  );
  res.json({ ok: true, notifications, unreadCount: Number(unread.count || 0) });
});

app.get("/api/v1/trader/notification-counts", requireRoles("TRADER"), async (req, res) => {
  const [[unread]] = await pool.query(
    `SELECT COUNT(*) AS count
       FROM notifications
      WHERE user_id = :userId
        AND channel = 'in_app'
        AND read_at IS NULL
        AND delivery_status <> 'read'`,
    { userId: req.user.id },
  );
  res.json({ ok: true, unreadCount: Number(unread.count || 0) });
});

app.patch("/api/v1/trader/notifications/:id/read", requireRoles("TRADER"), async (req, res) => {
  const notificationId = Number(req.params.id);
  if (!notificationId) {
    res.status(400).json({ ok: false, error: "Valid notification id is required." });
    return;
  }
  const [result] = await pool.query(
    `UPDATE notifications
        SET delivery_status = 'read',
            read_at = COALESCE(read_at, NOW())
      WHERE id = :notificationId
        AND user_id = :userId`,
    { notificationId, userId: req.user.id },
  );
  if (!result.affectedRows) {
    res.status(404).json({ ok: false, error: "Notification not found." });
    return;
  }
  res.json({ ok: true, notificationId });
});

app.patch("/api/v1/trader/notifications/read-all", requireRoles("TRADER"), async (req, res) => {
  const [result] = await pool.query(
    `UPDATE notifications
        SET delivery_status = 'read',
            read_at = COALESCE(read_at, NOW())
      WHERE user_id = :userId
        AND channel = 'in_app'
        AND read_at IS NULL`,
    { userId: req.user.id },
  );
  res.json({ ok: true, updated: result.affectedRows || 0 });
});

app.delete("/api/v1/trader/notifications/read", requireRoles("TRADER"), async (req, res) => {
  const [result] = await pool.query(
    `DELETE FROM notifications
      WHERE user_id = :userId
        AND channel = 'in_app'
        AND (delivery_status = 'read' OR read_at IS NOT NULL)
        AND notification_type NOT IN ('risk_alert', 'risk_cleared')`,
    { userId: req.user.id },
  );
  res.json({ ok: true, deleted: result.affectedRows || 0 });
});

async function attachContentFiles(rows) {
  const ids = rows.map((row) => row.id);
  if (ids.length === 0) return rows.map((row) => ({ ...row, parsed: safeJson(row.content_en), attachments: [] }));
  const [attachments] = await pool.query(
    `SELECT id, post_id, attachment_type, original_filename, mime_type, file_size_bytes
       FROM content_attachments
      WHERE post_id IN (:ids)
      ORDER BY created_at ASC`,
    { ids },
  );
  const byPost = attachments.reduce((acc, attachment) => {
    acc[attachment.post_id] = acc[attachment.post_id] || [];
    acc[attachment.post_id].push(attachment);
    return acc;
  }, {});
  return rows.map((row) => ({ ...row, parsed: safeJson(row.content_en), attachments: byPost[row.id] || [] }));
}

app.get("/api/v1/public/posts", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, post_type, title_en, title_mr, content_en, content_mr, published_at, created_at FROM posts WHERE status = 'published' AND post_type IN ('news','event') ORDER BY published_at DESC, id DESC LIMIT 100",
  );
  res.json({ ok: true, posts: await attachContentFiles(rows) });
});

app.get("/api/v1/public/notices", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, post_type, title_en, title_mr, content_en, content_mr, published_at, created_at FROM posts WHERE status = 'published' AND post_type IN ('notice', 'circular') ORDER BY published_at DESC, id DESC LIMIT 100",
  );
  res.json({ ok: true, notices: await attachContentFiles(rows) });
});

app.get("/api/v1/public/gallery", async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, post_type, title_en, title_mr, content_en, content_mr, published_at, created_at FROM posts WHERE status = 'published' AND post_type = 'gallery' ORDER BY published_at DESC, id DESC LIMIT 100",
  );
  res.json({ ok: true, items: await attachContentFiles(rows) });
});

app.get("/api/v1/public/committee", async (_req, res) => {
  const [members] = await pool.query(
    `SELECT id, full_name, name_mr, designation, gala_number, term_label, message,
            photo_original_filename, photo_mime_type, photo_file_size_bytes,
            CASE WHEN photo_storage_key IS NULL THEN NULL ELSE CONCAT('/api/v1/public/committee/', id, '/photo') END AS photo_url,
            display_order, status, updated_at
       FROM committee_members
      WHERE status = 'active'
      ORDER BY display_order ASC, id ASC`,
  );
  res.json({ ok: true, members });
});

app.get("/api/v1/public/committee/:id/photo", async (req, res) => {
  const memberId = Number(req.params.id);
  const [[member]] = await pool.query(
    `SELECT photo_storage_key, photo_original_filename, photo_mime_type
       FROM committee_members
      WHERE id = :memberId AND status = 'active' AND photo_storage_key IS NOT NULL
      LIMIT 1`,
    { memberId },
  );
  if (!member) {
    res.status(404).json({ ok: false, error: "Photo not found." });
    return;
  }
  const photoPath = await resolveExistingStoredFilePath(member.photo_storage_key);
  res.setHeader("Content-Type", member.photo_mime_type || "image/jpeg");
  res.setHeader("Content-Disposition", `inline; filename="${String(member.photo_original_filename || "committee-photo").replace(/"/g, "")}"`);
  await recordDownloadEvent({ sourceTable: "committee_members", sourceId: memberId, req });
  res.sendFile(photoPath, (error) => {
    if (error && !res.headersSent) {
      res.status(404).json({ ok: false, error: "Photo file is missing on the server." });
    }
  });
});

app.get("/api/v1/public/content-attachments/:id/download", async (req, res) => {
  const attachmentId = Number(req.params.id);
  const [[attachment]] = await pool.query(
    `SELECT ca.storage_key, ca.original_filename, ca.mime_type
       FROM content_attachments ca
       JOIN posts p ON p.id = ca.post_id
      WHERE ca.id = :attachmentId AND p.status = 'published'
      LIMIT 1`,
    { attachmentId },
  );
  if (!attachment) {
    res.status(404).json({ ok: false, error: "Attachment not found." });
    return;
  }
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "content_attachments", sourceId: attachmentId, req });
  await sendStoredFile(res, { ...attachment, disposition, missingMessage: "Attachment file is missing on the server." });
});

function normalizeMarketDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error("Date must be in YYYY-MM-DD format.");
  return raw;
}

function todayMarketDate() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function parseMarketNumber(value, label, { required = true } = {}) {
  if (value === null || value === undefined || value === "") {
    if (required) throw new Error(`${label} is required.`);
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} must be a valid non-negative number.`);
  return number;
}

function validateMarketCategory(category) {
  const normalized = String(category || "").trim().toLowerCase();
  if (!MARKET_PRICE_CATEGORIES.has(normalized)) throw new Error("Valid category is required.");
  return normalized;
}

function validateMarketUnit(unit) {
  const normalized = String(unit || "").trim();
  if (!MARKET_PRICE_UNITS.has(normalized)) throw new Error("Valid unit is required.");
  return normalized;
}

function decorateMarketPriceRows(rows) {
  return rows.map((row) => {
    const modal = row.modal_price === null || row.modal_price === undefined ? null : Number(row.modal_price);
    const previous = row.previous_price === null || row.previous_price === undefined ? null : Number(row.previous_price);
    const changeAmount = modal !== null && previous !== null ? Number((modal - previous).toFixed(2)) : null;
    const changePercent = changeAmount !== null && previous > 0 ? Number(((changeAmount / previous) * 100).toFixed(2)) : null;
    return {
      ...row,
      min_price: row.min_price === null || row.min_price === undefined ? null : Number(row.min_price),
      max_price: row.max_price === null || row.max_price === undefined ? null : Number(row.max_price),
      modal_price: modal,
      previous_price: previous,
      arrival_quantity: row.arrival_quantity === null || row.arrival_quantity === undefined ? null : Number(row.arrival_quantity),
      change_amount: changeAmount,
      change_percent: changePercent,
      change_direction: changeAmount === null ? "none" : changeAmount > 0 ? "up" : changeAmount < 0 ? "down" : "same",
    };
  });
}

async function getLatestPublishedMarketDate() {
  const [[row]] = await pool.query("SELECT DATE_FORMAT(MAX(price_date), '%Y-%m-%d') AS price_date FROM market_prices WHERE status = 'published'");
  return row?.price_date || null;
}

async function getMarketPriceRows({ date, category = "all", search = "", publicOnly = true, includeInactive = false }) {
  const params = {
    date,
    category,
    search: `%${String(search || "").trim()}%`,
  };
  const filters = [
    "mi.deleted_at IS NULL",
    "mi.category IN ('vegetable','fruit')",
    category === "all" ? "1=1" : "mi.category = :category",
    String(search || "").trim() ? "(mi.name_en LIKE :search OR mi.name_mr LIKE :search OR mi.variety LIKE :search)" : "1=1",
    includeInactive ? "1=1" : "mi.is_active = 1",
  ];
  const priceJoinStatus = publicOnly ? "AND mp.status = 'published'" : "";
  const [rows] = await pool.query(
    `SELECT mi.id AS item_id, mi.category, mi.name_en, mi.name_mr, mi.variety, mi.default_unit,
            mi.display_order, mi.is_active,
            mp.id AS price_id, mp.price_date, mp.min_price, mp.max_price, mp.modal_price, mp.unit,
            mp.arrival_quantity, mp.arrival_unit, mp.quality_grade, mp.notes, mp.status,
            mp.published_at, mp.updated_at AS price_updated_at,
            (SELECT p2.modal_price
               FROM market_prices p2
              WHERE p2.market_item_id = mi.id
                AND p2.price_date < :date
                AND p2.status = 'published'
              ORDER BY p2.price_date DESC
              LIMIT 1) AS previous_price
       FROM market_items mi
       LEFT JOIN market_prices mp
         ON mp.market_item_id = mi.id
        AND mp.price_date = :date
        ${priceJoinStatus}
      WHERE ${filters.join(" AND ")}
      ORDER BY mi.category ASC, mi.display_order ASC, mi.name_en ASC`,
    params,
  );
  return decorateMarketPriceRows(rows);
}

async function getMarketSummary(date) {
  const [[summary]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM market_items WHERE deleted_at IS NULL AND is_active = 1 AND category IN ('vegetable','fruit')) AS total_items,
       (SELECT COUNT(DISTINCT market_item_id) FROM market_prices WHERE price_date = :date) AS updated_today,
       (SELECT COUNT(*) FROM market_items WHERE deleted_at IS NULL AND is_active = 1 AND category IN ('vegetable','fruit'))
         - (SELECT COUNT(DISTINCT market_item_id) FROM market_prices WHERE price_date = :date) AS pending_update,
       (SELECT MAX(published_at) FROM market_prices WHERE status = 'published') AS last_published
     `,
    { date },
  );
  return summary || { total_items: 0, updated_today: 0, pending_update: 0, last_published: null };
}

app.get("/api/v1/public/market-prices/today", async (_req, res) => {
  const date = todayMarketDate();
  const prices = await getMarketPriceRows({ date, publicOnly: true });
  const published = prices.filter((price) => price.price_id);
  const [[last]] = await pool.query("SELECT MAX(published_at) AS last_published FROM market_prices WHERE price_date = :date AND status = 'published'", { date });
  res.json({ ok: true, date, lastPublished: last?.last_published || null, prices: published });
});

app.get("/api/v1/public/market-prices", async (req, res) => {
  const latestDate = req.query.date ? normalizeMarketDate(req.query.date) : await getLatestPublishedMarketDate();
  if (!latestDate) {
    res.json({ ok: true, date: null, lastPublished: null, prices: [] });
    return;
  }
  const category = String(req.query.category || "all").toLowerCase();
  const safeCategory = category === "all" ? "all" : validateMarketCategory(category);
  const prices = await getMarketPriceRows({ date: latestDate, category: safeCategory, search: req.query.search || "", publicOnly: true });
  const published = prices.filter((price) => price.price_id);
  const [[last]] = await pool.query("SELECT MAX(published_at) AS last_published FROM market_prices WHERE price_date = :date AND status = 'published'", { date: latestDate });
  res.json({ ok: true, date: latestDate, lastPublished: last?.last_published || null, prices: published });
});

app.get("/api/v1/public/market-prices/:itemId/history", async (req, res) => {
  const itemId = Number(req.params.itemId);
  const [rows] = await pool.query(
    `SELECT mp.id AS price_id, mp.price_date, mp.min_price, mp.max_price, mp.modal_price, mp.unit,
            mp.arrival_quantity, mp.arrival_unit, mp.quality_grade, mp.notes, mp.published_at,
            mi.id AS item_id, mi.category, mi.name_en, mi.name_mr, mi.variety
       FROM market_prices mp
       JOIN market_items mi ON mi.id = mp.market_item_id
      WHERE mp.market_item_id = :itemId
        AND mp.status = 'published'
        AND mi.deleted_at IS NULL
      ORDER BY mp.price_date DESC
      LIMIT 30`,
    { itemId },
  );
  res.json({ ok: true, history: decorateMarketPriceRows(rows) });
});

app.get("/api/v1/admin/market-items", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [items] = await pool.query(
    `SELECT id, category, name_en, name_mr, variety, default_unit, display_order, is_active, created_at, updated_at
       FROM market_items
      WHERE deleted_at IS NULL
      ORDER BY category ASC, display_order ASC, name_en ASC`,
  );
  res.json({ ok: true, items });
});

app.post("/api/v1/admin/market-items", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const category = validateMarketCategory(req.body?.category);
  const nameEn = String(req.body?.nameEn || "").trim();
  const nameMr = String(req.body?.nameMr || "").trim();
  const variety = String(req.body?.variety || "").trim() || null;
  const defaultUnit = validateMarketUnit(req.body?.defaultUnit || "Kg");
  const displayOrder = Number.isFinite(Number(req.body?.displayOrder)) ? Number(req.body.displayOrder) : 100;
  const isActive = req.body?.isActive === false ? 0 : 1;
  if (!nameEn || !nameMr) throw new Error("English and Marathi item names are required.");
  const [result] = await pool.query(
    `INSERT INTO market_items (category, name_en, name_mr, variety, default_unit, display_order, is_active, created_by, updated_by)
     VALUES (:category, :nameEn, :nameMr, :variety, :defaultUnit, :displayOrder, :isActive, :userId, :userId)`,
    { category, nameEn, nameMr, variety, defaultUnit, displayOrder, isActive, userId: req.user.id },
  );
  await writeAudit({ req, action: "market_item.create", module: "market_prices", entityType: "market_items", entityId: result.insertId, newValues: req.body });
  res.status(201).json({ ok: true, itemId: result.insertId });
});

app.put("/api/v1/admin/market-items/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const itemId = Number(req.params.id);
  const [[before]] = await pool.query("SELECT * FROM market_items WHERE id = :itemId AND deleted_at IS NULL", { itemId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Market item not found." });
    return;
  }
  const category = validateMarketCategory(req.body?.category || before.category);
  const nameEn = String(req.body?.nameEn || before.name_en).trim();
  const nameMr = String(req.body?.nameMr || before.name_mr).trim();
  const variety = String(req.body?.variety ?? before.variety ?? "").trim() || null;
  const defaultUnit = validateMarketUnit(req.body?.defaultUnit || before.default_unit);
  const displayOrder = Number.isFinite(Number(req.body?.displayOrder)) ? Number(req.body.displayOrder) : before.display_order;
  const isActive = req.body?.isActive === false ? 0 : 1;
  await pool.query(
    `UPDATE market_items
        SET category = :category, name_en = :nameEn, name_mr = :nameMr, variety = :variety,
            default_unit = :defaultUnit, display_order = :displayOrder, is_active = :isActive,
            updated_by = :userId
      WHERE id = :itemId`,
    { itemId, category, nameEn, nameMr, variety, defaultUnit, displayOrder, isActive, userId: req.user.id },
  );
  await writeAudit({ req, action: "market_item.update", module: "market_prices", entityType: "market_items", entityId: itemId, oldValues: before, newValues: req.body });
  res.json({ ok: true });
});

app.delete("/api/v1/admin/market-items/:id", requireRoles("MAIN_ADMIN"), async (req, res) => {
  const itemId = Number(req.params.id);
  const [[before]] = await pool.query("SELECT * FROM market_items WHERE id = :itemId AND deleted_at IS NULL", { itemId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Market item not found." });
    return;
  }
  await pool.query("UPDATE market_items SET is_active = 0, deleted_at = NOW(), updated_by = :userId WHERE id = :itemId", { itemId, userId: req.user.id });
  await writeAudit({ req, action: "market_item.archive", module: "market_prices", entityType: "market_items", entityId: itemId, oldValues: before });
  res.json({ ok: true });
});

app.get("/api/v1/admin/market-prices", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const date = normalizeMarketDate(req.query.date);
  const category = String(req.query.category || "all").toLowerCase();
  const safeCategory = category === "all" ? "all" : validateMarketCategory(category);
  const prices = await getMarketPriceRows({ date, category: safeCategory, search: req.query.search || "", publicOnly: false, includeInactive: true });
  const summary = await getMarketSummary(date);
  res.json({ ok: true, date, summary, prices });
});

app.post("/api/v1/admin/market-prices/bulk-save", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const date = normalizeMarketDate(req.body?.date);
  const status = req.body?.status === "published" ? "published" : "draft";
  const records = Array.isArray(req.body?.records) ? req.body.records : [];
  if (records.length === 0) throw new Error("At least one price record is required.");
  const errors = [];
  const normalized = [];
  for (const [index, record] of records.entries()) {
    try {
      const itemId = Number(record.itemId);
      if (!Number.isInteger(itemId) || itemId <= 0) throw new Error("Item required.");
      const minPrice = parseMarketNumber(record.minPrice, "Minimum price");
      const maxPrice = parseMarketNumber(record.maxPrice, "Maximum price");
      const modalPrice = parseMarketNumber(record.modalPrice === "" || record.modalPrice === undefined ? (minPrice + maxPrice) / 2 : record.modalPrice, "Average price");
      if (maxPrice < minPrice) throw new Error("Maximum price cannot be below minimum price.");
      if (modalPrice < minPrice || modalPrice > maxPrice) throw new Error("Average price should be between minimum and maximum price.");
      normalized.push({
        itemId,
        minPrice,
        maxPrice,
        modalPrice,
        unit: validateMarketUnit(record.unit || "Kg"),
        arrivalQuantity: parseMarketNumber(record.arrivalQuantity, "Arrival quantity", { required: false }),
        arrivalUnit: String(record.arrivalUnit || "").trim() || null,
        qualityGrade: String(record.qualityGrade || "").trim() || null,
        notes: String(record.notes || "").trim() || null,
      });
    } catch (error) {
      errors.push({ index, error: error.message });
    }
  }
  if (errors.length > 0) {
    res.status(400).json({ ok: false, error: "Please correct price rows.", rowErrors: errors });
    return;
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const record of normalized) {
      const [[item]] = await connection.query("SELECT id FROM market_items WHERE id = :itemId AND deleted_at IS NULL AND is_active = 1", { itemId: record.itemId });
      if (!item) throw new Error(`Market item ${record.itemId} is not active.`);
      await connection.query(
        `INSERT INTO market_prices (
           market_item_id, price_date, min_price, max_price, modal_price, unit,
           arrival_quantity, arrival_unit, quality_grade, notes, status,
           created_by, updated_by, published_by, published_at
         )
         VALUES (
           :itemId, :date, :minPrice, :maxPrice, :modalPrice, :unit,
           :arrivalQuantity, :arrivalUnit, :qualityGrade, :notes, :status,
           :userId, :userId, :publishedBy, :publishedAt
         )
         ON DUPLICATE KEY UPDATE
           min_price = VALUES(min_price),
           max_price = VALUES(max_price),
           modal_price = VALUES(modal_price),
           unit = VALUES(unit),
           arrival_quantity = VALUES(arrival_quantity),
           arrival_unit = VALUES(arrival_unit),
           quality_grade = VALUES(quality_grade),
           notes = VALUES(notes),
           status = VALUES(status),
           updated_by = VALUES(updated_by),
           published_by = VALUES(published_by),
           published_at = VALUES(published_at)`,
        {
          ...record,
          date,
          status,
          userId: req.user.id,
          publishedBy: status === "published" ? req.user.id : null,
          publishedAt: status === "published" ? new Date() : null,
        },
      );
    }
    await connection.commit();
    await writeAudit({ req, action: status === "published" ? "market_prices.publish_bulk" : "market_prices.save_draft", module: "market_prices", entityType: "market_prices", newValues: { date, count: normalized.length, status } });
    if (status === "published") {
      await notifyAllMembersNow({
        type: "market_price",
        title: "Daily market prices updated",
        message: `Market prices for ${date} have been published by the association.`,
        actionUrl: "/member/market-prices",
        relatedEntityType: "market_prices",
        relatedEntityId: null,
        priority: "normal",
      });
    }
    res.json({ ok: true, saved: normalized.length, status });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.post("/api/v1/admin/market-prices/copy-previous", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const date = normalizeMarketDate(req.body?.date);
  const [result] = await pool.query(
    `INSERT INTO market_prices (
       market_item_id, price_date, min_price, max_price, modal_price, unit,
       arrival_quantity, arrival_unit, quality_grade, notes, status, created_by, updated_by
     )
     SELECT mi.id, :date, prev.min_price, prev.max_price, prev.modal_price, prev.unit,
            prev.arrival_quantity, prev.arrival_unit, prev.quality_grade, prev.notes, 'draft', :userId, :userId
       FROM market_items mi
       JOIN market_prices prev
         ON prev.id = (
           SELECT p2.id
             FROM market_prices p2
            WHERE p2.market_item_id = mi.id
              AND p2.price_date < :date
              AND p2.status = 'published'
            ORDER BY p2.price_date DESC
            LIMIT 1
         )
      WHERE mi.deleted_at IS NULL
        AND mi.is_active = 1
        AND NOT EXISTS (
          SELECT 1 FROM market_prices today
           WHERE today.market_item_id = mi.id
             AND today.price_date = :date
        )`,
    { date, userId: req.user.id },
  );
  await writeAudit({ req, action: "market_prices.copy_previous", module: "market_prices", entityType: "market_prices", newValues: { date, inserted: result.affectedRows } });
  res.json({ ok: true, copied: result.affectedRows || 0 });
});

app.get("/api/v1/admin/market-prices/export", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const date = normalizeMarketDate(req.query.date);
  const rows = await getMarketPriceRows({ date, publicOnly: false, includeInactive: true });
  const csv = [
    ["Date", "Category", "English Name", "Marathi Name", "Variety", "Min Price", "Max Price", "Modal Price", "Unit", "Previous Price", "Change", "Arrival", "Grade"].join(","),
    ...rows.filter((row) => row.price_id).map((row) => [
      row.price_date || date,
      row.category,
      row.name_en,
      row.name_mr,
      row.variety || "",
      row.min_price ?? "",
      row.max_price ?? "",
      row.modal_price ?? "",
      row.unit || row.default_unit,
      row.previous_price ?? "",
      row.change_amount ?? "",
      row.arrival_quantity ? `${row.arrival_quantity} ${row.arrival_unit || ""}`.trim() : "",
      row.quality_grade || "",
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  res.setHeader("Content-Type", "text/csv;charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="market-prices-${date}.csv"`);
  res.send(csv);
});

app.get("/api/v1/admin/market-prices/:itemId/history", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const itemId = Number(req.params.itemId);
  const [rows] = await pool.query(
    `SELECT mp.id AS price_id, mp.price_date, mp.min_price, mp.max_price, mp.modal_price, mp.unit,
            mp.arrival_quantity, mp.arrival_unit, mp.quality_grade, mp.notes, mp.status, mp.published_at,
            mi.id AS item_id, mi.category, mi.name_en, mi.name_mr, mi.variety
       FROM market_prices mp
       JOIN market_items mi ON mi.id = mp.market_item_id
      WHERE mp.market_item_id = :itemId
      ORDER BY mp.price_date DESC
      LIMIT 60`,
    { itemId },
  );
  res.json({ ok: true, history: decorateMarketPriceRows(rows) });
});

app.get("/api/v1/admin/dashboard-summary", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM vw_admin_dashboard_summary");
  res.json({ ok: true, summary: rows[0] || null });
});

app.get("/api/v1/admin/committee", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [members] = await pool.query(
    `SELECT id, full_name, name_mr, designation, gala_number, term_label, message,
            photo_original_filename, photo_mime_type, photo_file_size_bytes,
            CASE WHEN photo_storage_key IS NULL THEN NULL ELSE CONCAT('/api/v1/public/committee/', id, '/photo') END AS photo_url,
            display_order, status, updated_at
       FROM committee_members
      ORDER BY display_order ASC, id ASC`,
  );
  res.json({ ok: true, members });
});

function normalizeCommitteePayload(body) {
  const fullName = String(body?.fullName || body?.full_name || "").trim();
  const designation = String(body?.designation || "").trim();
  if (!fullName) throw new Error("Full name is required.");
  if (!designation) throw new Error("Designation is required.");
  return {
    fullName,
    nameMr: String(body?.nameMr || body?.name_mr || "").trim() || null,
    designation,
    galaNumber: String(body?.galaNumber || body?.gala_number || "").trim() || null,
    termLabel: String(body?.termLabel || body?.term_label || "").trim() || null,
    message: String(body?.message || "").trim() || null,
    displayOrder: Number.isFinite(Number(body?.displayOrder ?? body?.display_order)) ? Number(body?.displayOrder ?? body?.display_order) : 100,
    status: body?.status === "inactive" ? "inactive" : "active",
  };
}

app.post("/api/v1/admin/committee", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  try {
    const payload = normalizeCommitteePayload(req.body);
    const [result] = await pool.query(
      `INSERT INTO committee_members (full_name, name_mr, designation, gala_number, term_label, message, display_order, status)
       VALUES (:fullName, :nameMr, :designation, :galaNumber, :termLabel, :message, :displayOrder, :status)`,
      payload,
    );
    if (req.body?.photo?.dataUrl) {
      const saved = await saveCommitteePhotoFile({
        memberId: result.insertId,
        originalFilename: req.body.photo.originalFilename,
        mimeType: req.body.photo.mimeType,
        dataUrl: req.body.photo.dataUrl,
      });
      await pool.query(
        `UPDATE committee_members
            SET photo_storage_key = :storageKey,
                photo_original_filename = :originalFilename,
                photo_mime_type = :mimeType,
                photo_file_size_bytes = :fileSizeBytes
          WHERE id = :memberId`,
        { ...saved, memberId: result.insertId },
      );
    }
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.patch("/api/v1/admin/committee/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const memberId = Number(req.params.id);
  if (!memberId) {
    res.status(400).json({ ok: false, error: "Invalid member id." });
    return;
  }
  try {
    const payload = normalizeCommitteePayload(req.body);
    let photoSql = "";
    let photoPayload = {};
    if (req.body?.photo?.dataUrl) {
      const saved = await saveCommitteePhotoFile({
        memberId,
        originalFilename: req.body.photo.originalFilename,
        mimeType: req.body.photo.mimeType,
        dataUrl: req.body.photo.dataUrl,
      });
      photoSql = `,
              photo_storage_key = :storageKey,
              photo_original_filename = :originalFilename,
              photo_mime_type = :mimeType,
              photo_file_size_bytes = :fileSizeBytes`;
      photoPayload = saved;
    }
    const [result] = await pool.query(
      `UPDATE committee_members
          SET full_name = :fullName,
              name_mr = :nameMr,
              designation = :designation,
              gala_number = :galaNumber,
              term_label = :termLabel,
              message = :message,
              display_order = :displayOrder,
              status = :status
              ${photoSql}
        WHERE id = :memberId`,
      { ...payload, ...photoPayload, memberId },
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ ok: false, error: "Committee member not found." });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.delete("/api/v1/admin/committee/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const memberId = Number(req.params.id);
  if (!memberId) {
    res.status(400).json({ ok: false, error: "Invalid member id." });
    return;
  }
  const [result] = await pool.query("DELETE FROM committee_members WHERE id = :memberId", { memberId });
  if (result.affectedRows === 0) {
    res.status(404).json({ ok: false, error: "Committee member not found." });
    return;
  }
  res.json({ ok: true });
});

async function ensureSystemPublisherUser() {
  const [[role]] = await pool.query("SELECT id FROM roles WHERE code = 'MAIN_ADMIN' LIMIT 1");
  if (!role) throw new Error("MAIN_ADMIN role is missing. Import the database schema first.");

  const [[existing]] = await pool.query(
    `SELECT id
       FROM users
      WHERE username = 'system.publisher'
         OR email = 'publisher@marketyard.local'
         OR mobile = '9000000999'
      LIMIT 1`,
  );
  if (existing) {
    await pool.query(
      `UPDATE users
          SET role_id = :roleId,
              username = 'system.publisher',
              email = 'publisher@marketyard.local',
              mobile = '9000000999',
              full_name = 'System Publisher',
              status = 'active'
        WHERE id = :userId`,
      { roleId: role.id, userId: existing.id },
    );
    return existing.id;
  }

  const [result] = await pool.query(
    `INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, status, mobile_verified_at, password_changed_at)
     VALUES (:roleId, 'system.publisher', 'publisher@marketyard.local', '9000000999', 'not-for-login', 'System Publisher', 'active', NOW(), NOW())`,
    { roleId: role.id },
  );

  return result.insertId;
}

app.post("/api/v1/admin/posts", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const {
    postType = "announcement",
    titleEn,
    titleMr = null,
    contentEn = null,
    contentMr = null,
    status = "published",
    category = "General",
    attachments = [],
  } = req.body || {};

  if (!titleEn || !String(titleEn).trim()) {
    res.status(400).json({ ok: false, error: "titleEn is required." });
    return;
  }

  const allowedTypes = new Set(["news", "notice", "circular", "event", "gallery", "announcement"]);
  const safePostType = allowedTypes.has(postType) ? postType : "announcement";
  const safeStatus = status === "draft" ? "draft" : "published";
  const publisherId = await ensureSystemPublisherUser();
  const safeTitleEn = String(titleEn).trim();
  const safeCategory = String(category || "General").trim() || "General";
  const safeDetails = String(contentEn || "").trim();
  const translated = await translatePostContentToMarathi({
    titleEn: safeTitleEn,
    category: safeCategory,
    details: safeDetails,
    titleMr,
    contentMr,
  });

  const body = JSON.stringify({ category: safeCategory, details: safeDetails });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
    `INSERT INTO posts (post_type, title_en, title_mr, content_en, content_mr, status, published_at, created_by_user_id)
     VALUES (:postType, :titleEn, :titleMr, :contentEn, :contentMr, :status, IF(:status = 'published', NOW(), NULL), :publisherId)`,
    {
      postType: safePostType,
      titleEn: safeTitleEn,
      titleMr: translated.titleMr,
      contentEn: body,
      contentMr: translated.contentMr,
      status: safeStatus,
      publisherId,
    },
  );
    const postId = result.insertId;
    for (const attachment of Array.isArray(attachments) ? attachments.slice(0, 8) : []) {
      const attachmentType = attachment.mimeType?.startsWith("image/") ? "image" : attachment.mimeType?.startsWith("video/") ? "video" : "document";
      const saved = await saveContentAttachmentFile({ postId, attachmentType, originalFilename: attachment.originalFilename, mimeType: attachment.mimeType, dataUrl: attachment.dataUrl });
      await connection.query(
        `INSERT INTO content_attachments (post_id, attachment_type, storage_key, original_filename, mime_type, file_size_bytes, checksum_sha256, uploaded_by_user_id)
         VALUES (:postId, :attachmentType, :storageKey, :originalFilename, :mimeType, :fileSizeBytes, :checksumSha256, :userId)`,
        { postId, attachmentType, storageKey: saved.storageKey, originalFilename: saved.originalFilename, mimeType: saved.mimeType, fileSizeBytes: saved.fileSizeBytes, checksumSha256: saved.checksumSha256, userId: publisherId },
      );
    }
    if (safeStatus === "published") {
      await notifyMembersAboutPublishedPost(connection, {
        postId,
        postType: safePostType,
        titleEn: safeTitleEn,
        details: safeDetails,
        excludeUserId: req.user.id,
      });
    }
    await connection.commit();
    if (safeStatus === "published") {
      setImmediate(() => {
        sendPublishedPostPush({ postId, postType: safePostType, titleEn: safeTitleEn, details: safeDetails });
      });
    }
    res.status(201).json({ ok: true, postId, titleMr: translated.titleMr, contentMr: translated.contentMr });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.put("/api/v1/admin/posts/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const postId = Number(req.params.id);
  if (!postId) {
    res.status(400).json({ ok: false, error: "Valid post id is required." });
    return;
  }

  const [[before]] = await pool.query("SELECT * FROM posts WHERE id = :postId AND status <> 'archived' LIMIT 1", { postId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Post not found." });
    return;
  }

  const titleEn = String(req.body?.titleEn ?? before.title_en ?? "").trim();
  const requestedTitleMr = req.body?.titleMr ?? before.title_mr;
  const requestedContentMr = req.body?.contentMr ?? before.content_mr;
  const parsed = safeJson(before.content_en);
  const category = String(req.body?.category ?? parsed.category ?? "General").trim() || "General";
  const details = String(req.body?.contentEn ?? parsed.details ?? "").trim();
  const allowedTypes = new Set(["news", "notice", "circular", "event", "gallery", "announcement"]);
  const postType = allowedTypes.has(req.body?.postType) ? req.body.postType : before.post_type;
  const status = req.body?.status === "draft" ? "draft" : "published";

  if (!titleEn) {
    res.status(400).json({ ok: false, error: "Title is required." });
    return;
  }

  const contentEn = JSON.stringify({ category, details });
  const translated = await translatePostContentToMarathi({
    titleEn,
    category,
    details,
    titleMr: requestedTitleMr,
    contentMr: requestedContentMr,
  });
  await pool.query(
    `UPDATE posts
        SET post_type = :postType,
            title_en = :titleEn,
            title_mr = :titleMr,
            content_en = :contentEn,
            content_mr = :contentMr,
            status = :status,
            published_at = IF(:status = 'published', COALESCE(published_at, NOW()), NULL),
            updated_by_user_id = :userId
      WHERE id = :postId`,
    { postId, postType, titleEn, titleMr: translated.titleMr, contentEn, contentMr: translated.contentMr, status, userId: req.user.id },
  );
  if (before.status !== "published" && status === "published") {
    await notifyMembersAboutPublishedPost(pool, {
      postId,
      postType,
      titleEn,
      details,
      excludeUserId: req.user.id,
    });
    setImmediate(() => {
      sendPublishedPostPush({ postId, postType, titleEn, details });
    });
  }
  await writeAudit({ req, action: "post.update", module: "posts", entityType: "posts", entityId: postId, oldValues: before, newValues: { postType, titleEn, titleMr: translated.titleMr, category, details, contentMr: translated.contentMr, status } });
  res.json({ ok: true, postId, status, titleMr: translated.titleMr, contentMr: translated.contentMr });
});

app.get("/api/v1/admin/trader-kyc", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "submitted");
  const [rows] = await pool.query(
    `SELECT DISTINCT t.*, u.full_name, u.full_name_en, u.mobile, u.email, u.status AS user_status,
            (SELECT COUNT(*)
               FROM trader_galas tg
              WHERE tg.trader_id = t.id
                AND tg.status IN ('submitted','under_review','correction_required')
                AND (t.verification_status <> 'approved' OR tg.is_primary = 0)) AS pending_gala_count
       FROM traders t
       JOIN users u ON u.id = t.user_id
      WHERE (:status = 'all'
             OR t.verification_status = :status
             OR (:status = 'submitted' AND EXISTS (
                  SELECT 1 FROM trader_galas tg
                   WHERE tg.trader_id = t.id
                     AND tg.status IN ('submitted','under_review','correction_required')
                     AND (t.verification_status <> 'approved' OR tg.is_primary = 0)
             )))
      ORDER BY t.created_at DESC
      LIMIT 100`,
    { status },
  );
  res.json({ ok: true, traders: rows });
});

app.get("/api/v1/admin/trader-requests", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "submitted");
  const search = String(req.query.search || "").trim();
  const [rows] = await pool.query(
    `${traderRequestSelect}
      WHERE (:status = 'all' OR t.verification_status = :status)
        AND (
          :search = ''
          OR u.full_name LIKE :likeSearch
          OR u.mobile = :search
          OR t.trader_code = :search
          OR t.business_name LIKE :likeSearch
          OR t.market_registration_number = :search
        )
      ORDER BY t.created_at DESC
      LIMIT 100`,
    { status, search, likeSearch: `%${search}%` },
  );
  const [stats] = await pool.query(
    `SELECT verification_status, COUNT(*) AS count FROM traders GROUP BY verification_status`,
  );
  res.json({ ok: true, requests: rows, stats });
});

app.get("/api/v1/admin/trader-requests/:applicationNumber", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const [rows] = await pool.query(
    `${traderRequestSelect} WHERE t.trader_code = :applicationNumber LIMIT 1`,
    { applicationNumber: req.params.applicationNumber },
  );
  if (!rows[0]) {
    res.status(404).json({ ok: false, error: "Member application not found." });
    return;
  }
  const [history] = await pool.query("SELECT * FROM trader_verification_history WHERE trader_id = :traderId ORDER BY created_at DESC", { traderId: rows[0].id });
  const [documents] = await pool.query("SELECT id, document_type, original_filename, mime_type, file_size_bytes, status, rejection_reason, verified_at, created_at FROM trader_documents WHERE trader_id = :traderId ORDER BY created_at DESC", { traderId: rows[0].id });
  const [galas] = await pool.query(
    `SELECT tg.id, tg.business_name, tg.market_section, tg.market_registration_number,
            tg.licence_number, tg.association_sequence_number, tg.association_registration_number,
            tg.status, tg.is_primary, tg.admin_remarks, tg.verified_at, tg.created_at,
            mg.gala_number, bc.name_en AS business_category,
            tg.business_name_en
       FROM trader_galas tg
       JOIN market_galas mg ON mg.id = tg.gala_id
       LEFT JOIN business_categories bc ON bc.id = tg.business_category_id
      WHERE tg.trader_id = :traderId
      ORDER BY tg.is_primary DESC, tg.created_at ASC, tg.id ASC`,
    { traderId: rows[0].id },
  );
  res.json({ ok: true, application: rows[0], history, documents, galas });
});

app.patch("/api/v1/admin/trader-galas/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const galaRecordId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const remarks = String(req.body?.remarks || "").trim();
  const nextStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "";
  if (!galaRecordId || !nextStatus || (nextStatus === "rejected" && !remarks)) {
    res.status(400).json({ ok: false, error: "Valid gala/shop id, decision, and rejection reason are required." });
    return;
  }

  const [[galaRecord]] = await pool.query("SELECT id, trader_id, status FROM trader_galas WHERE id = :galaRecordId LIMIT 1", { galaRecordId });
  if (!galaRecord) {
    res.status(404).json({ ok: false, error: "Gala/shop record not found." });
    return;
  }

  await pool.query(
    `UPDATE trader_galas
        SET status = :nextStatus,
            admin_remarks = :remarks,
            verified_by = :userId,
            verified_at = IF(:nextStatus = 'approved', NOW(), verified_at)
      WHERE id = :galaRecordId`,
    { nextStatus, remarks: remarks || null, userId: req.user.id, galaRecordId },
  );
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, :nextStatus, :remarks, :userId)`,
    {
      traderId: galaRecord.trader_id,
      oldStatus: `gala:${galaRecord.status}`,
      nextStatus: `gala:${nextStatus}`,
      remarks: remarks || `Gala/shop ${nextStatus}`,
      userId: req.user.id,
    },
  ).catch(() => undefined);
  await writeAudit({ req, action: `trader.gala_${decision}`, module: "traders", entityType: "trader_galas", entityId: galaRecordId, oldValues: { status: galaRecord.status }, newValues: { status: nextStatus, remarks } });
  res.json({ ok: true, galaRecordId, status: nextStatus });
});

app.get("/api/v1/admin/trader-documents/:id/download", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const documentId = Number(req.params.id);
  const [[document]] = await pool.query("SELECT storage_key, original_filename, mime_type FROM trader_documents WHERE id = :documentId", { documentId });
  if (!document) {
    res.status(404).json({ ok: false, error: "Document not found." });
    return;
  }
  const resolvedPath = resolveStoredFilePath(document.storage_key);
  if (!isPathInside(resolvedPath, UPLOAD_ROOT)) {
    res.status(403).json({ ok: false, error: "Document path is not allowed." });
    return;
  }
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "trader_documents", sourceId: documentId, req });
  res.setHeader("Content-Type", document.mime_type);
  res.setHeader("Content-Disposition", `${disposition}; filename="${sanitizeFileName(document.original_filename)}"`);
  res.sendFile(resolvedPath);
});

app.patch("/api/v1/admin/trader-documents/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const documentId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const remarks = String(req.body?.remarks || "").trim();
  const nextStatus = decision === "verify" ? "verified" : decision === "reject" ? "rejected" : "";

  if (!documentId || !nextStatus || (nextStatus === "rejected" && !remarks)) {
    res.status(400).json({ ok: false, error: "Valid document id, decision, and rejection reason are required." });
    return;
  }

  const [[document]] = await pool.query("SELECT id, trader_id, status FROM trader_documents WHERE id = :documentId", { documentId });
  if (!document) {
    res.status(404).json({ ok: false, error: "Document not found." });
    return;
  }

  await pool.query(
    `UPDATE trader_documents
        SET status = :nextStatus,
            verified_by = :userId,
            verified_at = IF(:nextStatus = 'verified', NOW(), verified_at),
            rejection_reason = IF(:nextStatus = 'rejected', :remarks, NULL)
      WHERE id = :documentId`,
    { nextStatus, userId: req.user.id, remarks, documentId },
  );
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, :nextStatus, :remarks, :userId)`,
    {
      traderId: document.trader_id,
      oldStatus: `document:${document.status}`,
      nextStatus: `document:${nextStatus}`,
      remarks: remarks || `Document ${nextStatus}`,
      userId: req.user.id,
    },
  );
  await writeAudit({
    req,
    action: `trader_document.${decision}`,
    module: "traders",
    entityType: "trader_documents",
    entityId: documentId,
    oldValues: { status: document.status },
    newValues: { status: nextStatus, remarks },
  });
  res.json({ ok: true, documentId, status: nextStatus });
});

app.patch("/api/v1/admin/trader-kyc/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const remarks = String(req.body?.remarks || "").trim();
  const nextStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "";

  if (!traderId || !nextStatus || (nextStatus === "rejected" && !remarks)) {
    res.status(400).json({ ok: false, error: "Valid member id, decision, and rejection reason are required." });
    return;
  }

  const [[before]] = await pool.query("SELECT verification_status FROM traders WHERE id = :traderId", { traderId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  if (nextStatus === "approved" && before.verification_status === "approved") {
    res.json({ ok: true, traderId, status: "approved" });
    return;
  }
  await pool.query(
    `UPDATE traders
        SET verification_status = :nextStatus,
            verified_by = :userId,
            verified_at = IF(:nextStatus = 'approved', NOW(), verified_at),
            rejection_reason = IF(:nextStatus = 'rejected', :remarks, NULL)
      WHERE id = :traderId`,
    { nextStatus, userId: req.user.id, remarks, traderId },
  );
  await pool.query(
    `UPDATE users u
       JOIN traders t ON t.user_id = u.id
        SET u.status = IF(:nextStatus = 'approved', 'active', 'rejected')
      WHERE t.id = :traderId`,
    { nextStatus, traderId },
  );
  if (nextStatus === "approved") {
    await pool.query(
      `UPDATE trader_galas
          SET status = 'approved',
              verified_by = :userId,
              verified_at = COALESCE(verified_at, NOW()),
              admin_remarks = NULL
        WHERE trader_id = :traderId
          AND is_primary = 1
          AND status IN ('submitted','under_review','correction_required')`,
      { userId: req.user.id, traderId },
    );
  }
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, :nextStatus, :remarks, :userId)`,
    { traderId, oldStatus: before.verification_status, nextStatus, remarks, userId: req.user.id },
  );
  await writeAudit({ req, action: `trader_kyc.${decision}`, module: "traders", entityType: "traders", entityId: traderId, oldValues: before, newValues: { verification_status: nextStatus, remarks } });

  res.json({ ok: true, traderId, status: nextStatus });
});

app.patch("/api/v1/admin/trader-requests/:id/start-review", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const [[before]] = await pool.query("SELECT verification_status FROM traders WHERE id = :traderId", { traderId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  if (!["submitted", "correction_required"].includes(before.verification_status)) {
    res.status(409).json({ ok: false, error: "Application cannot be moved to review from current status." });
    return;
  }
  await pool.query("UPDATE traders SET verification_status = 'under_review', verified_by = :userId WHERE id = :traderId", { userId: req.user.id, traderId });
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, 'under_review', 'Review started', :userId)`,
    { traderId, oldStatus: before.verification_status, userId: req.user.id },
  );
  await writeAudit({ req, action: "trader.review_started", module: "traders", entityType: "traders", entityId: traderId, oldValues: before, newValues: { verification_status: "under_review" } });
  res.json({ ok: true, traderId, status: "under_review" });
});

app.patch("/api/v1/admin/trader-requests/:id/request-correction", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const remarks = String(req.body?.remarks || "").trim();
  if (!remarks) {
    res.status(400).json({ ok: false, error: "Correction remarks are required." });
    return;
  }
  const [[before]] = await pool.query("SELECT verification_status FROM traders WHERE id = :traderId", { traderId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  await pool.query("UPDATE traders SET verification_status = 'correction_required', rejection_reason = :remarks WHERE id = :traderId", { remarks, traderId });
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, 'correction_required', :remarks, :userId)`,
    { traderId, oldStatus: before.verification_status, remarks, userId: req.user.id },
  );
  await writeAudit({ req, action: "trader.correction_requested", module: "traders", entityType: "traders", entityId: traderId, oldValues: before, newValues: { verification_status: "correction_required", remarks } });
  res.json({ ok: true, traderId, status: "correction_required" });
});

app.patch("/api/v1/admin/trader-requests/:id/reject", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  req.body = { ...req.body, decision: "reject", remarks: req.body?.remarks || "Rejected by admin" };
  const decisionReq = { ...req, params: { id: String(traderId) } };
  const [[before]] = await pool.query("SELECT verification_status FROM traders WHERE id = :traderId", { traderId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  await pool.query("UPDATE traders SET verification_status = 'rejected', rejection_reason = :remarks WHERE id = :traderId", { remarks: req.body.remarks, traderId });
  await pool.query("UPDATE users u JOIN traders t ON t.user_id = u.id SET u.status = 'rejected' WHERE t.id = :traderId", { traderId });
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, 'rejected', :remarks, :userId)`,
    { traderId, oldStatus: before.verification_status, remarks: req.body.remarks, userId: req.user.id },
  );
  await writeAudit({ req: decisionReq, action: "trader.reject", module: "traders", entityType: "traders", entityId: traderId, oldValues: before, newValues: { verification_status: "rejected" } });
  res.json({ ok: true, traderId, status: "rejected" });
});

app.patch("/api/v1/admin/trader-requests/:id/approve", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const [[before]] = await pool.query("SELECT verification_status FROM traders WHERE id = :traderId", { traderId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  if (before.verification_status === "approved") {
    res.json({ ok: true, traderId, status: "approved" });
    return;
  }
  await pool.query("UPDATE traders SET verification_status = 'approved', verified_by = :userId, verified_at = NOW(), rejection_reason = NULL WHERE id = :traderId", { userId: req.user.id, traderId });
  await pool.query("UPDATE users u JOIN traders t ON t.user_id = u.id SET u.status = 'active' WHERE t.id = :traderId", { traderId });
  await pool.query(
    `UPDATE trader_galas
        SET status = 'approved',
            verified_by = :userId,
            verified_at = COALESCE(verified_at, NOW()),
            admin_remarks = NULL
      WHERE trader_id = :traderId
        AND is_primary = 1
        AND status IN ('submitted','under_review','correction_required')`,
    { userId: req.user.id, traderId },
  );
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, 'approved', 'Approved by admin', :userId)`,
    { traderId, oldStatus: before.verification_status, userId: req.user.id },
  );
  await writeAudit({ req, action: "trader.approve", module: "traders", entityType: "traders", entityId: traderId, oldValues: before, newValues: { verification_status: "approved", user_status: "active" } });
  res.json({ ok: true, traderId, status: "approved" });
});

app.patch("/api/v1/admin/trader-kyc/bulk-approve", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const ids = Array.isArray(req.body?.traderIds) ? req.body.traderIds.map(Number).filter(Boolean) : [];
  if (ids.length === 0) {
    res.status(400).json({ ok: false, error: "traderIds must contain at least one id." });
    return;
  }
  await pool.query(
    `UPDATE traders SET verification_status = 'approved', verified_by = :userId, verified_at = NOW()
      WHERE id IN (:ids) AND verification_status IN ('submitted','under_review','correction_required')`,
    { userId: req.user.id, ids },
  );
  await pool.query(
    `UPDATE users u
       JOIN traders t ON t.user_id = u.id
        SET u.status = 'active'
      WHERE t.id IN (:ids)`,
    { ids },
  );
  await pool.query(
    `UPDATE trader_galas
        SET status = 'approved',
            verified_by = :userId,
            verified_at = COALESCE(verified_at, NOW()),
            admin_remarks = NULL
      WHERE trader_id IN (:ids)
        AND is_primary = 1
        AND status IN ('submitted','under_review','correction_required')`,
    { userId: req.user.id, ids },
  );
  await writeAudit({ req, action: "trader_kyc.bulk_approve", module: "traders", entityType: "traders", newValues: { traderIds: ids } });
  res.json({ ok: true, approvedIds: ids });
});

app.get("/api/v1/admin/traders", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "approved");
  const search = String(req.query.search || "").trim();
  const statusCountsWhere = search
    ? `WHERE (
          t.trader_code = :search
          OR u.full_name LIKE :likeSearch
          OR u.full_name_en LIKE :likeSearch
          OR u.mobile = :search
          OR t.business_name LIKE :likeSearch
          OR t.business_name_en LIKE :likeSearch
          OR mg.gala_number = :search
          OR t.market_registration_number = :search
        )`
    : "";
  const [rows] = await pool.query(
    `${traderRequestSelect}
      WHERE (:status = 'all' OR t.verification_status = :status)
        AND (
          :search = ''
          OR t.trader_code = :search
          OR u.full_name LIKE :likeSearch
          OR u.full_name_en LIKE :likeSearch
          OR u.mobile = :search
          OR t.business_name LIKE :likeSearch
          OR t.business_name_en LIKE :likeSearch
          OR mg.gala_number = :search
          OR t.market_registration_number = :search
        )
      ORDER BY t.verified_at DESC, t.created_at DESC
      LIMIT 1000`,
    { status, search, likeSearch: `%${search}%` },
  );
  const [statusCounts] = await pool.query(
    `SELECT t.verification_status, COUNT(DISTINCT t.id) AS count
       FROM traders t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       ${statusCountsWhere}
      GROUP BY t.verification_status`,
    { search, likeSearch: `%${search}%` },
  );
  res.json({ ok: true, traders: rows, stats: statusCounts });
});

app.get("/api/v1/admin/traders/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const [rows] = await pool.query(`${traderRequestSelect} WHERE t.id = :traderId LIMIT 1`, { traderId });
  if (!rows[0]) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  const [documents] = await pool.query(
    "SELECT id, document_type, original_filename, mime_type, file_size_bytes, status, rejection_reason, verified_at, created_at FROM trader_documents WHERE trader_id = :traderId ORDER BY created_at DESC",
    { traderId },
  );
  res.json({ ok: true, trader: rows[0], documents });
});

app.get("/api/v1/admin/traders/:id/history", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const [history] = await pool.query("SELECT * FROM trader_verification_history WHERE trader_id = :traderId ORDER BY created_at DESC", { traderId });
  res.json({ ok: true, history });
});

async function setTraderLifecycle(req, res, nextStatus, nextUserStatus, action) {
  const traderId = Number(req.params.id);
  const remarks = String(req.body?.remarks || `${action} by admin`).trim();
  const [[before]] = await pool.query("SELECT verification_status FROM traders WHERE id = :traderId", { traderId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  await pool.query("UPDATE traders SET verification_status = :nextStatus, rejection_reason = :remarks WHERE id = :traderId", { nextStatus, remarks, traderId });
  await pool.query("UPDATE users u JOIN traders t ON t.user_id = u.id SET u.status = :nextUserStatus WHERE t.id = :traderId", { nextUserStatus, traderId });
  await pool.query(
    `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
     VALUES (:traderId, :oldStatus, :nextStatus, :remarks, :userId)`,
    { traderId, oldStatus: before.verification_status, nextStatus, remarks, userId: req.user.id },
  );
  await writeAudit({ req, action: `trader.${action}`, module: "traders", entityType: "traders", entityId: traderId, oldValues: before, newValues: { verification_status: nextStatus, user_status: nextUserStatus, remarks } });
  res.json({ ok: true, traderId, status: nextStatus });
}

app.patch("/api/v1/admin/traders/:id/suspend", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => setTraderLifecycle(req, res, "suspended", "suspended", "suspend"));
app.patch("/api/v1/admin/traders/:id/reactivate", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => setTraderLifecycle(req, res, "approved", "active", "reactivate"));
app.patch("/api/v1/admin/traders/:id/deactivate", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => setTraderLifecycle(req, res, "deactivated", "deactivated", "deactivate"));

app.get("/api/v1/public/traders/:id", async (req, res) => {
  const traderId = Number(req.params.id);
  const [rows] = await pool.query(
    `${traderRequestSelect}
      WHERE t.id = :traderId
        AND t.verification_status = 'approved'
        AND u.status = 'active'
      LIMIT 1`,
    { traderId },
  );
  if (!rows[0]) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const [[ratingSummary]] = await pool.query(
    `SELECT COUNT(*) AS review_count, ROUND(AVG(rating_value), 2) AS average_rating
      FROM ratings
      WHERE trader_id = :traderId
        AND moderation_status = 'approved'
        AND rating_scope = 'trader_profile'`,
    { traderId },
  );
  res.json({ ok: true, trader: rows[0], ratingSummary });
});

app.get("/api/v1/trader/my-ratings", requireRoles("TRADER"), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ra.id, ra.rating_scope, ra.reviewer_type, ra.rating_value, ra.review_text, ra.moderation_status, ra.moderation_remarks,
            ra.created_at, ra.moderated_at, ra.reviewer_name, ra.reviewer_mobile,
            c.customer_code, c.full_name AS customer_name,
            t.id AS trader_id, t.trader_code, t.business_name, u.full_name AS trader_name, mg.gala_number
       FROM ratings ra
       JOIN traders t ON t.id = ra.trader_id
       JOIN users u ON u.id = t.user_id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       LEFT JOIN customers c ON c.id = ra.customer_id
      WHERE ra.trader_id = :traderId
        AND ra.rating_scope = 'portal'
      ORDER BY ra.created_at DESC
      LIMIT 100`,
    { traderId: req.user.trader_id },
  );
  const ratingIds = rows.map((row) => row.id);
  let attachmentsByRating = {};
  if (ratingIds.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, rating_id, attachment_type, original_filename, mime_type, file_size_bytes
         FROM rating_attachments
        WHERE rating_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids: ratingIds },
    );
    attachmentsByRating = attachments.reduce((acc, attachment) => {
      acc[attachment.rating_id] = acc[attachment.rating_id] || [];
      acc[attachment.rating_id].push(attachment);
      return acc;
    }, {});
  }
  res.json({ ok: true, ratings: rows.map((row) => ({ ...row, attachments: attachmentsByRating[row.id] || [] })) });
});

app.get("/api/v1/trader/customers", requireRoles("TRADER"), async (req, res) => {
  const traderId = req.user.trader_id;
  if (!traderId) {
    res.json({ ok: true, customers: [], warning: "Member profile is not created yet." });
    return;
  }
  const [rows] = await pool.query(
    `SELECT c.id, c.customer_code, c.full_name, c.mobile, c.kyc_status, c.risk_status, c.created_at,
            aadhaar.masked_value AS aadhaar_masked,
            pan.masked_value AS pan_masked,
            tc.relationship_status,
            MAX(tc.linked_at) AS linked_at,
            COUNT(CASE WHEN wc.status IN ('approved','active','partially_paid','disputed') AND wc.visibility = 'market_summary' THEN wc.id END) AS active_market_warning_count,
            COALESCE(SUM(CASE WHEN wc.status IN ('approved','active','partially_paid','disputed') AND wc.visibility = 'market_summary' THEN wc.current_outstanding_amount ELSE 0 END), 0) AS verified_market_outstanding,
            latest_wc.id AS latest_warning_id,
            latest_wc.trader_statement AS latest_warning_note,
            latest_trader.business_name AS latest_warning_trader,
            latest_wc.trader_id = :traderId AS can_clear_latest_warning
       FROM trader_customers tc
       JOIN customers c ON c.id = tc.customer_id
       LEFT JOIN customer_identifiers aadhaar ON aadhaar.customer_id = c.id AND aadhaar.identifier_type = 'aadhaar'
       LEFT JOIN customer_identifiers pan ON pan.customer_id = c.id AND pan.identifier_type = 'pan'
       LEFT JOIN warning_cases wc ON wc.customer_id = c.id
       LEFT JOIN warning_cases latest_wc ON latest_wc.id = (
         SELECT wc2.id FROM warning_cases wc2
          WHERE wc2.customer_id = c.id
            AND wc2.status IN ('approved','active','partially_paid','disputed')
            AND wc2.visibility = 'market_summary'
          ORDER BY wc2.updated_at DESC, wc2.id DESC
          LIMIT 1
       )
       LEFT JOIN traders latest_trader ON latest_trader.id = latest_wc.trader_id
      WHERE tc.trader_id = :traderId
      GROUP BY c.id, c.customer_code, c.full_name, c.mobile, c.kyc_status, c.risk_status, c.created_at,
               aadhaar.masked_value, pan.masked_value, tc.relationship_status, latest_wc.id, latest_wc.trader_id, latest_wc.trader_statement, latest_trader.business_name
      ORDER BY linked_at DESC`,
    { traderId },
  );
  res.json({ ok: true, customers: rows });
});

app.get("/api/v1/trader/profile", requireRoles("TRADER"), async (req, res) => {
  if (!req.user.trader_id) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const [rows] = await pool.query(`${traderRequestSelect} WHERE t.id = :traderId LIMIT 1`, { traderId: req.user.trader_id });
  const [documents] = await pool.query(
    "SELECT id, document_type, original_filename, mime_type, file_size_bytes, status, rejection_reason, verified_at, created_at FROM trader_documents WHERE trader_id = :traderId ORDER BY created_at DESC",
    { traderId: req.user.trader_id },
  );
  const [galas] = await pool.query(
    `SELECT tg.id, tg.business_name, tg.market_section, tg.market_registration_number,
            tg.licence_number, tg.association_sequence_number, tg.association_registration_number,
            tg.status, tg.is_primary, tg.admin_remarks, tg.verified_at, tg.created_at,
            mg.gala_number, bc.name_en AS business_category,
            tg.business_name_en
       FROM trader_galas tg
       JOIN market_galas mg ON mg.id = tg.gala_id
       LEFT JOIN business_categories bc ON bc.id = tg.business_category_id
      WHERE tg.trader_id = :traderId
      ORDER BY tg.is_primary DESC, tg.created_at ASC, tg.id ASC`,
    { traderId: req.user.trader_id },
  );
  const activeDocumentTypes = new Set(documents.filter((document) => document.status !== "replaced").map((document) => document.document_type));
  const missingRequiredDocuments = REQUIRED_TRADER_DASHBOARD_DOCUMENT_TYPES.filter((documentType) => !activeDocumentTypes.has(documentType));
  res.json({
    ok: true,
    trader: rows[0],
    galas,
    documents,
    requiredDocuments: REQUIRED_TRADER_DASHBOARD_DOCUMENT_TYPES.map((documentType) => ({ documentType, label: DOCUMENT_TYPE_LABELS[documentType] })),
    missingRequiredDocuments,
  });
});

app.patch("/api/v1/trader/profile", requireRoles("TRADER"), async (req, res) => {
  if (!req.user.trader_id) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const {
    alternateMobile = null,
    addressLine1 = null,
    addressLine2 = null,
    villageCity = null,
    taluka = null,
    district = null,
    pincode = null,
    aadhaar = null,
    pan = null,
    bloodGroup = null,
    licenceNumber = null,
  } = req.body || {};
  const cleanAadhaar = String(aadhaar || "").replace(/\D/g, "");
  const cleanPan = String(pan || "").trim().toUpperCase();
  const cleanBloodGroup = String(bloodGroup || "").trim().toUpperCase();
  const cleanLicenceNumber = String(licenceNumber || "").trim();
  if (cleanAadhaar && !/^\d{12}$/.test(cleanAadhaar)) {
    res.status(400).json({ ok: false, error: "Aadhaar number must be 12 digits." });
    return;
  }
  if (cleanPan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(cleanPan)) {
    res.status(400).json({ ok: false, error: "PAN number is invalid." });
    return;
  }
  if (cleanBloodGroup && !/^(A|B|AB|O)[+-]$/.test(cleanBloodGroup)) {
    res.status(400).json({ ok: false, error: "Select a valid blood group." });
    return;
  }
  await pool.query(
    `UPDATE traders
        SET alternate_mobile = COALESCE(:alternateMobile, alternate_mobile),
            address_line1 = COALESCE(:addressLine1, address_line1),
            address_line2 = COALESCE(:addressLine2, address_line2),
            village_city = COALESCE(:villageCity, village_city),
            taluka = COALESCE(:taluka, taluka),
            district = COALESCE(:district, district),
            pincode = COALESCE(:pincode, pincode),
            aadhaar_masked = COALESCE(:aadhaarMasked, aadhaar_masked),
            aadhaar_hash = COALESCE(:aadhaarHash, aadhaar_hash),
            pan_masked = COALESCE(:panMasked, pan_masked),
            pan_hash = COALESCE(:panHash, pan_hash),
            blood_group = COALESCE(:bloodGroup, blood_group),
            licence_number = COALESCE(:licenceNumber, licence_number),
            market_registration_number = COALESCE(:licenceNumber, market_registration_number)
      WHERE id = :traderId`,
    {
      alternateMobile,
      addressLine1,
      addressLine2,
      villageCity,
      taluka,
      district,
      pincode,
      aadhaarMasked: cleanAadhaar ? maskIdentifier(cleanAadhaar) : null,
      aadhaarHash: cleanAadhaar ? hashIdentifier(cleanAadhaar) : null,
      panMasked: cleanPan ? maskIdentifier(cleanPan) : null,
      panHash: cleanPan ? hashIdentifier(cleanPan) : null,
      bloodGroup: cleanBloodGroup || null,
      licenceNumber: cleanLicenceNumber || null,
      traderId: req.user.trader_id,
    },
  );
  await writeAudit({ req, action: "trader.profile_update", module: "traders", entityType: "traders", entityId: req.user.trader_id, newValues: { ...req.body, aadhaar: cleanAadhaar ? "********" : undefined, pan: cleanPan ? "********" : undefined } });
  res.json({ ok: true });
});

app.patch("/api/v1/trader/galas/:id", requireRoles("TRADER"), async (req, res) => {
  const galaRecordId = Number(req.params.id);
  const {
    galaNumber,
    businessName,
    marketSection,
    category = "Other",
    marketRegistrationNumber = null,
    licenceNumber = null,
    associationSequenceNumber = null,
    associationRegistrationNumber = null,
  } = req.body || {};

  const cleanGalaNumber = String(galaNumber || "").trim();
  const cleanBusinessName = String(businessName || "").trim();
  const cleanMarketSection = String(marketSection || "").trim();
  if (!req.user.trader_id || !galaRecordId || !cleanGalaNumber || !cleanBusinessName || !cleanMarketSection) {
    res.status(400).json({ ok: false, error: "Gala/shop number, firm name, and market section are required." });
    return;
  }

  const [[existing]] = await pool.query(
    "SELECT id, trader_id, status FROM trader_galas WHERE id = :galaRecordId AND trader_id = :traderId LIMIT 1",
    { galaRecordId, traderId: req.user.trader_id },
  );
  if (!existing) {
    res.status(404).json({ ok: false, error: "Gala/shop record not found." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { galaId, categoryId } = await ensureGalaAndCategory(connection, {
      gala: cleanGalaNumber,
      section: cleanMarketSection,
      category: String(category || cleanMarketSection || "Other").trim() || "Other",
    });
    const [[duplicate]] = await connection.query(
      "SELECT id FROM trader_galas WHERE trader_id = :traderId AND gala_id = :galaId AND id <> :galaRecordId LIMIT 1",
      { traderId: req.user.trader_id, galaId, galaRecordId },
    );
    if (duplicate) {
      await connection.rollback();
      res.status(409).json({ ok: false, error: "This gala/shop is already linked to your account." });
      return;
    }

    await connection.query(
      `UPDATE trader_galas
          SET gala_id = :galaId,
              business_name = :businessName,
              market_section = :marketSection,
              business_category_id = :categoryId,
              market_registration_number = NULLIF(:marketRegistrationNumber, ''),
              licence_number = NULLIF(:licenceNumber, ''),
              association_sequence_number = NULLIF(:associationSequenceNumber, ''),
              association_registration_number = NULLIF(:associationRegistrationNumber, ''),
              status = 'submitted',
              admin_remarks = NULL,
              verified_by = NULL,
              verified_at = NULL
        WHERE id = :galaRecordId AND trader_id = :traderId`,
      {
        galaId,
        businessName: cleanBusinessName,
        marketSection: cleanMarketSection,
        categoryId,
        marketRegistrationNumber: String(marketRegistrationNumber || "").trim(),
        licenceNumber: String(licenceNumber || "").trim(),
        associationSequenceNumber: String(associationSequenceNumber || "").trim(),
        associationRegistrationNumber: String(associationRegistrationNumber || "").trim(),
        galaRecordId,
        traderId: req.user.trader_id,
      },
    );
    await connection.query(
      `INSERT INTO trader_verification_history (trader_id, old_status, new_status, remarks, changed_by)
       VALUES (:traderId, :oldStatus, 'gala:submitted', :remarks, :userId)`,
      {
        traderId: req.user.trader_id,
        oldStatus: `gala:${existing.status}`,
        remarks: `Gala/shop details updated: ${cleanGalaNumber}`,
        userId: req.user.id,
      },
    ).catch(() => undefined);
    await connection.commit();
    await writeAudit({ req, action: "trader.gala_update_submitted", module: "traders", entityType: "trader_galas", entityId: galaRecordId, oldValues: { status: existing.status }, newValues: { galaNumber: cleanGalaNumber, businessName: cleanBusinessName, marketSection: cleanMarketSection, status: "submitted" } }).catch(() => undefined);
    res.json({ ok: true, galaRecordId, status: "submitted" });
  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ ok: false, error: "Registration number or gala/shop number is already linked." });
      return;
    }
    throw error;
  } finally {
    connection.release();
  }
});

function uploadTraderDocumentMiddleware(req, res, next) {
  documentUpload.single("file")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Each document must be 5 MB or smaller."
      : "Could not read uploaded file.";
    console.warn("Trader document upload rejected", {
      userId: req.user?.id || null,
      traderId: req.user?.trader_id || null,
      code: error.code || "UPLOAD_ERROR",
      message,
    });
    res.status(400).json({ ok: false, message, error: message });
  });
}

app.post("/api/v1/trader/documents", requireRoles("TRADER"), uploadTraderDocumentMiddleware, async (req, res) => {
  if (!req.user.trader_id) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const documentType = String(req.body?.documentType || "");
  if (!DOCUMENT_TYPE_LABELS[documentType]) {
    res.status(400).json({ ok: false, error: "Invalid document type." });
    return;
  }
  let saved;
  try {
    saved = req.file
      ? await saveTraderDocumentBuffer({
          traderId: req.user.trader_id,
          documentType,
          originalFilename: req.file.originalname,
          mimeType: req.file.mimetype,
          buffer: req.file.buffer,
        })
      : await saveTraderDocumentFile({
          traderId: req.user.trader_id,
          documentType,
          originalFilename: req.body?.originalFilename,
          mimeType: req.body?.mimeType,
          dataUrl: req.body?.dataUrl,
        });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Document upload failed.";
    console.warn("Trader document validation failed", {
      userId: req.user.id,
      traderId: req.user.trader_id,
      documentType,
      message,
    });
    res.status(400).json({ ok: false, message, error: message });
    return;
  }
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `UPDATE trader_documents
          SET status = 'replaced'
        WHERE trader_id = :traderId
          AND document_type = :documentType
          AND status IN ('uploaded','verified','rejected')`,
      { traderId: req.user.trader_id, documentType },
    );
    const [result] = await connection.query(
      `INSERT INTO trader_documents (
         trader_id, document_type, document_hash, storage_key, original_filename,
         mime_type, file_size_bytes, status, uploaded_by
       )
       VALUES (
         :traderId, :documentType, :documentHash, :storageKey, :originalFilename,
         :mimeType, :fileSizeBytes, 'uploaded', :uploadedBy
       )`,
      {
        traderId: req.user.trader_id,
        documentType,
        documentHash: saved.documentHash,
        storageKey: saved.storageKey,
        originalFilename: saved.originalFilename,
        mimeType: saved.mimeType,
        fileSizeBytes: saved.fileSizeBytes,
        uploadedBy: req.user.id,
      },
    );
    await connection.commit();
    await writeAudit({ req, action: "trader.document_upload", module: "traders", entityType: "trader_documents", entityId: result.insertId, newValues: { documentType } });
    res.status(201).json({
      ok: true,
      message: `${DOCUMENT_TYPE_LABELS[documentType]} uploaded successfully`,
      documentId: result.insertId,
      status: "uploaded",
      file: {
        id: result.insertId,
        url: `/api/v1/trader/documents/${result.insertId}/download`,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Trader document upload failed", {
      userId: req.user.id,
      traderId: req.user.trader_id,
      documentType,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  } finally {
    connection.release();
  }
});

app.get("/api/v1/trader/documents/:id/download", requireRoles("TRADER"), async (req, res) => {
  const documentId = Number(req.params.id);
  const [[document]] = await pool.query(
    "SELECT storage_key, original_filename, mime_type FROM trader_documents WHERE id = :documentId AND trader_id = :traderId",
    { documentId, traderId: req.user.trader_id || 0 },
  );
  if (!document) {
    res.status(404).json({ ok: false, error: "Document not found." });
    return;
  }
  const resolvedPath = resolveStoredFilePath(document.storage_key);
  if (!isPathInside(resolvedPath, UPLOAD_ROOT)) {
    res.status(403).json({ ok: false, error: "Document path is not allowed." });
    return;
  }
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "trader_documents", sourceId: documentId, req });
  res.setHeader("Content-Type", document.mime_type);
  res.setHeader("Content-Disposition", `${disposition}; filename="${sanitizeFileName(document.original_filename)}"`);
  res.sendFile(resolvedPath);
});

app.get("/api/v1/trader/application-status", requireRoles("TRADER"), async (req, res) => {
  const [rows] = await pool.query(`${traderRequestSelect} WHERE u.id = :userId LIMIT 1`, { userId: req.user.id });
  res.json({ ok: true, application: rows[0] || null });
});

app.get("/api/v1/trader/dashboard", requireRoles("TRADER"), async (req, res) => {
  if (!req.user.trader_id) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const traderId = req.user.trader_id;
  const [[profile]] = await pool.query(`${traderRequestSelect} WHERE t.id = :traderId LIMIT 1`, { traderId });
  const [[customers]] = await pool.query(
    `SELECT
       COUNT(*) AS total_customers,
       SUM(c.kyc_status = 'verified') AS verified_customers,
       SUM(c.kyc_status <> 'verified') AS kyc_pending
     FROM trader_customers tc
     JOIN customers c ON c.id = tc.customer_id
     WHERE tc.trader_id = :traderId`,
    { traderId },
  );
  const [[finance]] = await pool.query(
    `SELECT
       COUNT(*) AS total_invoices,
       COALESCE(SUM(total_amount), 0) AS total_billed,
       COALESCE(SUM(paid_amount), 0) AS total_received,
       COALESCE(SUM(outstanding_amount), 0) AS total_outstanding,
       COALESCE(SUM(CASE WHEN due_date = CURDATE() AND outstanding_amount > 0 THEN outstanding_amount ELSE 0 END), 0) AS due_today,
       COALESCE(SUM(CASE WHEN due_date < CURDATE() AND outstanding_amount > 0 THEN outstanding_amount ELSE 0 END), 0) AS overdue_amount
     FROM invoices
     WHERE trader_id = :traderId AND deleted_at IS NULL`,
    { traderId },
  );
  const [[warnings]] = await pool.query(
    `SELECT
       SUM(warning_stage = 'warning_1') AS warning_1_count,
       SUM(warning_stage = 'warning_2') AS warning_2_count
     FROM warning_cases
     WHERE trader_id = :traderId`,
    { traderId },
  );
  const [documents] = await pool.query(
    "SELECT id, document_type, original_filename, mime_type, file_size_bytes, status, rejection_reason, verified_at, created_at FROM trader_documents WHERE trader_id = :traderId ORDER BY created_at DESC",
    { traderId },
  );
  const [galas] = await pool.query(
    `SELECT tg.id, tg.business_name, tg.market_section, tg.market_registration_number,
            tg.licence_number, tg.association_sequence_number, tg.association_registration_number,
            tg.status, tg.is_primary, tg.admin_remarks, tg.verified_at, tg.created_at,
            mg.gala_number, bc.name_en AS business_category,
            tg.business_name_en
       FROM trader_galas tg
       JOIN market_galas mg ON mg.id = tg.gala_id
       LEFT JOIN business_categories bc ON bc.id = tg.business_category_id
      WHERE tg.trader_id = :traderId
      ORDER BY tg.is_primary DESC, tg.created_at ASC, tg.id ASC`,
    { traderId },
  );
  const activeDocumentTypes = new Set(documents.filter((document) => document.status !== "replaced").map((document) => document.document_type));
  const missingRequiredDocuments = REQUIRED_TRADER_DASHBOARD_DOCUMENT_TYPES.filter((documentType) => !activeDocumentTypes.has(documentType));
  res.json({
    ok: true,
    profile,
    galas,
    documents,
    requiredDocuments: REQUIRED_TRADER_DASHBOARD_DOCUMENT_TYPES.map((documentType) => ({ documentType, label: DOCUMENT_TYPE_LABELS[documentType] })),
    missingRequiredDocuments,
    metrics: {
      totalCustomers: Number(customers.total_customers || 0),
      verifiedCustomers: Number(customers.verified_customers || 0),
      kycPending: Number(customers.kyc_pending || 0),
      totalInvoices: Number(finance.total_invoices || 0),
      totalBilled: Number(finance.total_billed || 0),
      totalReceived: Number(finance.total_received || 0),
      totalOutstanding: Number(finance.total_outstanding || 0),
      dueToday: Number(finance.due_today || 0),
      overdueAmount: Number(finance.overdue_amount || 0),
      warning1Count: Number(warnings.warning_1_count || 0),
      warning2Count: Number(warnings.warning_2_count || 0),
    },
    recentTransactions: [],
    recentPayments: [],
  });
});

app.post("/api/v1/trader/customers", requireRoles("TRADER"), async (req, res) => {
  const {
    fullName,
    mobile,
    aadhaar,
    pan,
    addressLine1,
    villageCity,
    district,
    dateOfBirth = null,
    occupationBusiness = null,
  } = req.body || {};

  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  const cleanAadhaar = String(aadhaar || "").replace(/\D/g, "");
  const cleanPan = String(pan || "").trim().toUpperCase();

  if (!fullName || !/^\d{10}$/.test(cleanMobile) || !/^\d{12}$/.test(cleanAadhaar) || !/^[A-Z]{5}\d{4}[A-Z]$/.test(cleanPan) || !addressLine1 || !villageCity || !district) {
    res.status(400).json({ ok: false, error: "fullName, valid mobile, Aadhaar, PAN, addressLine1, villageCity, and district are required." });
    return;
  }

  const traderId = req.user.trader_id;
  if (!traderId) {
    res.status(403).json({ ok: false, error: "Logged-in member profile is missing." });
    return;
  }

  const [[traderProfile]] = await pool.query(
    `SELECT u.full_name, u.mobile
       FROM traders t
       JOIN users u ON u.id = t.user_id
      WHERE t.id = :traderId
      LIMIT 1`,
    { traderId },
  );
  if (traderProfile && (cleanMobile === String(traderProfile.mobile || "") || String(fullName).trim().toLowerCase() === String(traderProfile.full_name || "").trim().toLowerCase())) {
    res.status(400).json({ ok: false, error: "Member cannot be added as their own customer. Add only real customer details." });
    return;
  }

  const aadhaarHash = hashIdentifier(cleanAadhaar);
  const panHash = hashIdentifier(cleanPan);
  const normalizedFullName = String(fullName || "").trim().toLowerCase();
  const [[sameMemberCustomer]] = await pool.query(
    `SELECT c.id, c.customer_code, c.full_name
       FROM customers c
       JOIN trader_customers tc ON tc.customer_id = c.id
      WHERE tc.trader_id = :traderId
        AND c.deleted_at IS NULL
        AND c.mobile = :mobile
        AND LOWER(TRIM(c.full_name)) = :fullName
      LIMIT 1`,
    { traderId, mobile: cleanMobile, fullName: normalizedFullName },
  );
  if (sameMemberCustomer) {
    res.status(409).json({
      ok: false,
      duplicateCustomer: true,
      customerId: sameMemberCustomer.id,
      customerCode: sameMemberCustomer.customer_code,
      error: `${sameMemberCustomer.full_name} with this phone number already exists in your Customer KYC records.`,
    });
    return;
  }

  const [[existingCustomer]] = await pool.query(
    `SELECT c.id, c.customer_code, c.full_name, c.kyc_status
       FROM customers c
       LEFT JOIN customer_identifiers ci
         ON ci.customer_id = c.id
        AND ci.value_hash IN (:aadhaarHash, :panHash)
      WHERE c.deleted_at IS NULL
        AND (c.mobile = :mobile OR ci.id IS NOT NULL)
      ORDER BY c.kyc_status = 'verified' DESC, c.updated_at DESC, c.id DESC
      LIMIT 1`,
    { mobile: cleanMobile, aadhaarHash, panHash },
  );
  if (existingCustomer) {
    await pool.query(
      `INSERT INTO trader_customers (trader_id, customer_id, relationship_status, linked_by_user_id)
       VALUES (:traderId, :customerId, :relationshipStatus, :userId)
       ON DUPLICATE KEY UPDATE
         relationship_status = IF(relationship_status = 'closed', VALUES(relationship_status), relationship_status),
         linked_by_user_id = VALUES(linked_by_user_id)`,
      {
        traderId,
        customerId: existingCustomer.id,
        relationshipStatus: existingCustomer.kyc_status === "verified" ? "active" : "pending",
        userId: req.user.id,
      },
    );
    await writeAudit({ req, action: "customer_kyc.reuse_existing", module: "customers", entityType: "customers", entityId: existingCustomer.id, newValues: { traderId, customerCode: existingCustomer.customer_code } });
    res.status(200).json({ ok: true, reused: true, customerId: existingCustomer.id, customerCode: existingCustomer.customer_code, customerName: existingCustomer.full_name });
    return;
  }

  const customerCode = `CUST-${Date.now().toString().slice(-8)}`;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [customerResult] = await connection.query(
      `INSERT INTO customers (customer_code, full_name, mobile, date_of_birth, occupation_business, address_line1, village_city, district, kyc_status, created_by_trader_id, created_by_user_id)
       VALUES (:customerCode, :fullName, :mobile, :dateOfBirth, :occupationBusiness, :addressLine1, :villageCity, :district, 'submitted', :traderId, :userId)`,
      { customerCode, fullName, mobile: cleanMobile, dateOfBirth, occupationBusiness, addressLine1, villageCity, district, traderId, userId: req.user.id },
    );
    await connection.query(
      `INSERT INTO customer_identifiers (customer_id, identifier_type, masked_value, value_hash, last_four, is_primary)
       VALUES
       (:customerId, 'aadhaar', :aadhaarMasked, :aadhaarHash, :aadhaarLast4, TRUE),
       (:customerId, 'pan', :panMasked, :panHash, :panLast4, FALSE)`,
      {
        customerId: customerResult.insertId,
        aadhaarMasked: maskIdentifier(cleanAadhaar),
        aadhaarHash,
        aadhaarLast4: cleanAadhaar.slice(-4),
        panMasked: maskIdentifier(cleanPan),
        panHash,
        panLast4: cleanPan.slice(-4),
      },
    );
    await connection.query(
      `INSERT INTO trader_customers (trader_id, customer_id, relationship_status, linked_by_user_id)
       VALUES (:traderId, :customerId, 'pending', :userId)`,
      { traderId, customerId: customerResult.insertId, userId: req.user.id },
    );
    await connection.commit();
    await writeAudit({ req, action: "customer_kyc.submit", module: "customers", entityType: "customers", entityId: customerResult.insertId, newValues: { customerCode, fullName, mobile: cleanMobile } });
    res.status(201).json({ ok: true, customerId: customerResult.insertId, customerCode });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

function hashIdentifier(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function maskIdentifier(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (raw.length <= 4) return raw;
  return `${"*".repeat(Math.max(0, raw.length - 4))}${raw.slice(-4)}`;
}

app.get("/api/v1/admin/customer-kyc", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "submitted");
  const [rows] = await pool.query(
    `SELECT c.*,
            t.trader_code,
            t.business_name,
            mg.gala_number,
            u.full_name AS trader_name,
            aadhaar.masked_value AS aadhaar_masked,
            pan.masked_value AS pan_masked
       FROM customers c
       LEFT JOIN traders t ON t.id = c.created_by_trader_id
       LEFT JOIN users u ON u.id = t.user_id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       LEFT JOIN customer_identifiers aadhaar ON aadhaar.customer_id = c.id AND aadhaar.identifier_type = 'aadhaar'
       LEFT JOIN customer_identifiers pan ON pan.customer_id = c.id AND pan.identifier_type = 'pan'
      WHERE (:status = 'all' OR c.kyc_status = :status)
      ORDER BY c.created_at DESC
      LIMIT 100`,
    { status },
  );
  res.json({ ok: true, customers: rows });
});

app.post("/api/v1/admin/traders/:id/customers", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const traderId = Number(req.params.id);
  const {
    fullName,
    mobile,
    aadhaar,
    pan,
    addressLine1,
    villageCity,
    district,
    dateOfBirth = null,
    occupationBusiness = null,
  } = req.body || {};

  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  const cleanAadhaar = String(aadhaar || "").replace(/\D/g, "");
  const cleanPan = String(pan || "").trim().toUpperCase();

  if (
    !traderId ||
    !String(fullName || "").trim() ||
    !/^\d{10}$/.test(cleanMobile) ||
    !/^\d{12}$/.test(cleanAadhaar) ||
    !/^[A-Z]{5}\d{4}[A-Z]$/.test(cleanPan) ||
    !String(addressLine1 || "").trim() ||
    !String(villageCity || "").trim() ||
    !String(district || "").trim()
  ) {
    res.status(400).json({ ok: false, error: "Member, customer name, mobile, Aadhaar, PAN, address, city, and district are required." });
    return;
  }

  const [[trader]] = await pool.query(
    "SELECT id, trader_code, verification_status FROM traders WHERE id = :traderId LIMIT 1",
    { traderId },
  );
  if (!trader) {
    res.status(404).json({ ok: false, error: "Member not found." });
    return;
  }
  if (trader.verification_status !== "approved") {
    res.status(400).json({ ok: false, error: "Customer KYC can be added only for approved members." });
    return;
  }

  const [[traderUser]] = await pool.query(
    `SELECT u.full_name, u.mobile
       FROM traders t
       JOIN users u ON u.id = t.user_id
      WHERE t.id = :traderId
      LIMIT 1`,
    { traderId },
  );
  if (traderUser && (cleanMobile === String(traderUser.mobile || "") || String(fullName).trim().toLowerCase() === String(traderUser.full_name || "").trim().toLowerCase())) {
    res.status(400).json({ ok: false, error: "Member cannot be added as their own customer. Add only real customer details." });
    return;
  }

  const [[sameMemberCustomer]] = await pool.query(
    `SELECT c.id, c.customer_code, c.full_name
       FROM customers c
       JOIN trader_customers tc ON tc.customer_id = c.id
      WHERE tc.trader_id = :traderId
        AND c.deleted_at IS NULL
        AND c.mobile = :mobile
        AND LOWER(TRIM(c.full_name)) = :fullName
      LIMIT 1`,
    { traderId, mobile: cleanMobile, fullName: String(fullName || "").trim().toLowerCase() },
  );
  if (sameMemberCustomer) {
    res.status(409).json({
      ok: false,
      duplicateCustomer: true,
      customerId: sameMemberCustomer.id,
      customerCode: sameMemberCustomer.customer_code,
      error: `${sameMemberCustomer.full_name} with this phone number already exists in this member's Customer KYC records.`,
    });
    return;
  }

  const customerCode = `KYC-${Date.now().toString().slice(-8)}`;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [customerResult] = await connection.query(
      `INSERT INTO customers (customer_code, full_name, mobile, date_of_birth, occupation_business, address_line1, village_city, district, kyc_status, created_by_trader_id, created_by_user_id)
       VALUES (:customerCode, :fullName, :mobile, :dateOfBirth, :occupationBusiness, :addressLine1, :villageCity, :district, 'verified', :traderId, :userId)`,
      {
        customerCode,
        fullName: String(fullName).trim(),
        mobile: cleanMobile,
        dateOfBirth,
        occupationBusiness,
        addressLine1: String(addressLine1).trim(),
        villageCity: String(villageCity).trim(),
        district: String(district).trim(),
        traderId,
        userId: req.user.id,
      },
    );
    await connection.query(
      `INSERT INTO customer_identifiers (customer_id, identifier_type, masked_value, value_hash, last_four, is_primary, verified_at)
       VALUES
       (:customerId, 'aadhaar', :aadhaarMasked, :aadhaarHash, :aadhaarLast4, TRUE, NOW()),
       (:customerId, 'pan', :panMasked, :panHash, :panLast4, FALSE, NOW())`,
      {
        customerId: customerResult.insertId,
        aadhaarMasked: maskIdentifier(cleanAadhaar),
        aadhaarHash: hashIdentifier(cleanAadhaar),
        aadhaarLast4: cleanAadhaar.slice(-4),
        panMasked: maskIdentifier(cleanPan),
        panHash: hashIdentifier(cleanPan),
        panLast4: cleanPan.slice(-4),
      },
    );
    await connection.query(
      `INSERT INTO trader_customers (trader_id, customer_id, relationship_status, linked_by_user_id)
       VALUES (:traderId, :customerId, 'active', :userId)`,
      { traderId, customerId: customerResult.insertId, userId: req.user.id },
    );
    await connection.commit();
    await writeAudit({
      req,
      action: "customer_kyc.admin_create",
      module: "customers",
      entityType: "customers",
      entityId: customerResult.insertId,
      newValues: { customerCode, fullName, mobile: cleanMobile, traderId },
    });
    res.status(201).json({ ok: true, customerId: customerResult.insertId, customerCode });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.patch("/api/v1/admin/customer-kyc/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const customerId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const remarks = String(req.body?.remarks || "").trim();
  const nextStatus = decision === "approve" ? "verified" : decision === "reject" ? "rejected" : "";
  if (!customerId || !nextStatus || (nextStatus === "rejected" && !remarks)) {
    res.status(400).json({ ok: false, error: "Valid customer id, decision, and rejection reason are required." });
    return;
  }

  const [[before]] = await pool.query("SELECT kyc_status FROM customers WHERE id = :customerId", { customerId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Customer not found." });
    return;
  }
  await pool.query(
    `UPDATE customers SET kyc_status = :nextStatus, verified_by = :userId, verified_at = IF(:nextStatus = 'verified', NOW(), verified_at)
      WHERE id = :customerId`,
    { nextStatus, userId: req.user.id, customerId },
  );
  await pool.query(
    `INSERT INTO customer_kyc_history (customer_id, old_status, new_status, remarks, changed_by_user_id)
     VALUES (:customerId, :oldStatus, :nextStatus, :remarks, :userId)`,
    { customerId, oldStatus: before.kyc_status, nextStatus, remarks, userId: req.user.id },
  );
  await writeAudit({ req, action: `customer_kyc.${decision}`, module: "customers", entityType: "customers", entityId: customerId, oldValues: before, newValues: { kyc_status: nextStatus, remarks } });
  res.json({ ok: true, customerId, status: nextStatus });
});

app.get("/api/v1/trader/posts", requireRoles("TRADER"), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, post_type, title_en, content_en, status, published_at, created_at
       FROM posts
      WHERE created_by_user_id = :userId
      ORDER BY created_at DESC
      LIMIT 50`,
    { userId: req.user.id },
  );
  res.json({ ok: true, posts: rows.map((post) => ({ ...post, parsed: safeJson(post.content_en) })) });
});

app.get("/api/v1/trader/shared-posts", requireRoles("TRADER"), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.post_type, p.title_en, p.content_en, p.status, p.published_at, p.created_at,
            p.share_audience, p.share_category_id, target_category.name_en AS share_category_name,
            u.full_name AS created_by_name,
            t.business_name,
            t.trader_code,
            mg.gala_number,
            mg.section_name
       FROM posts p
       JOIN users u ON u.id = p.created_by_user_id
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       LEFT JOIN business_categories target_category ON target_category.id = p.share_category_id
       LEFT JOIN traders viewer ON viewer.id = :viewerTraderId
       LEFT JOIN business_categories viewer_category ON viewer_category.id = viewer.business_category_id
      WHERE p.status = 'published'
        AND p.post_type = 'announcement'
        AND r.code = 'TRADER'
        AND (
          COALESCE(p.share_audience, 'all') = 'all'
          OR (
            p.share_audience = 'category'
            AND (
              p.share_category_id = viewer.business_category_id
              OR (target_category.name_en IS NOT NULL AND target_category.name_en = viewer_category.name_en)
            )
          )
        )
      ORDER BY p.published_at DESC, p.created_at DESC
      LIMIT 100`,
    { viewerTraderId: req.user.trader_id || 0 },
  );
  const ids = rows.map((row) => row.id);
  let attachmentsByPost = {};
  if (ids.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, post_id, attachment_type, original_filename, mime_type, file_size_bytes
         FROM post_attachments
        WHERE post_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids },
    );
    attachmentsByPost = attachments.reduce((acc, attachment) => {
      acc[attachment.post_id] = acc[attachment.post_id] || [];
      acc[attachment.post_id].push(attachment);
      return acc;
    }, {});
  }
  res.json({ ok: true, posts: rows.map((post) => ({ ...post, parsed: safeJson(post.content_en), attachments: attachmentsByPost[post.id] || [] })) });
});

app.post("/api/v1/trader/posts", requireRoles("TRADER"), async (req, res) => {
  const { titleEn, contentEn = "", category = "General Request", attachments = {} } = req.body || {};
  const title = String(titleEn || "").trim();
  const details = String(contentEn || "").trim();
  if (!title || !details) {
    res.status(400).json({ ok: false, error: "Post title and details are required." });
    return;
  }
  const files = [
    ...(Array.isArray(attachments.images) ? attachments.images.map((file) => ({ type: "image", file })) : []),
    ...(Array.isArray(attachments.videos) ? attachments.videos.map((file) => ({ type: "video", file })) : []),
  ].slice(0, 8);
  const body = JSON.stringify({ category: String(category || "General Request").trim(), details });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO posts (post_type, title_en, content_en, status, created_by_user_id)
       VALUES ('announcement', :titleEn, :contentEn, 'draft', :userId)`,
      { titleEn: title, contentEn: body, userId: req.user.id },
    );
    const postId = result.insertId;
    for (const upload of files) {
      const saved = await savePostAttachmentFile({
        postId,
        attachmentType: upload.type,
        originalFilename: upload.file.originalFilename,
        mimeType: upload.file.mimeType,
        dataUrl: upload.file.dataUrl,
      });
      await connection.query(
        `INSERT INTO post_attachments (post_id, attachment_type, storage_key, original_filename, mime_type, file_size_bytes, checksum_sha256, uploaded_by_user_id)
         VALUES (:postId, :attachmentType, :storageKey, :originalFilename, :mimeType, :fileSizeBytes, :checksumSha256, :userId)`,
        { postId, attachmentType: upload.type, storageKey: saved.storageKey, originalFilename: saved.originalFilename, mimeType: saved.mimeType, fileSizeBytes: saved.fileSizeBytes, checksumSha256: saved.checksumSha256, userId: req.user.id },
      );
    }
    await connection.commit();
    await writeAudit({ req, action: "post.submit", module: "posts", entityType: "posts", entityId: postId, newValues: { titleEn: title, status: "draft" } });
    res.status(201).json({ ok: true, postId, status: "pending_review" });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.get("/api/v1/trader/mobile-change-requests", requireRoles("TRADER"), async (req, res) => {
  if (!req.user.trader_id) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const [rows] = await pool.query(
    `SELECT id, request_code, old_mobile, new_mobile, alternate_mobile, reason, application_note, status, admin_remarks, decided_at, created_at
       FROM mobile_change_requests
      WHERE trader_id = :traderId
      ORDER BY created_at DESC
      LIMIT 20`,
    { traderId: req.user.trader_id },
  );
  res.json({ ok: true, requests: rows });
});

app.post("/api/v1/trader/mobile-change-requests", requireRoles("TRADER"), async (req, res) => {
  if (!req.user.trader_id) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  const newMobile = String(req.body?.newMobile || "").replace(/\D/g, "");
  const alternateMobile = String(req.body?.alternateMobile || "").replace(/\D/g, "") || null;
  const reason = String(req.body?.reason || "").trim();
  const applicationNote = String(req.body?.applicationNote || "").trim();
  const documents = req.body?.documents || {};
  const idProof = documents.idProof || null;
  const mobileProof = documents.mobileProof || null;
  if (!/^\d{10}$/.test(newMobile) || (alternateMobile && !/^\d{10}$/.test(alternateMobile)) || !reason) {
    res.status(400).json({ ok: false, error: "Valid new mobile and reason are required." });
    return;
  }
  if (!idProof?.dataUrl || !idProof?.originalFilename) {
    res.status(400).json({ ok: false, error: "ID proof document is required." });
    return;
  }
  if (newMobile === String(req.user.mobile || "")) {
    res.status(400).json({ ok: false, error: "New mobile number must be different from current mobile." });
    return;
  }
  const [[existing]] = await pool.query(
    "SELECT id FROM mobile_change_requests WHERE trader_id = :traderId AND status = 'pending' LIMIT 1",
    { traderId: req.user.trader_id },
  );
  if (existing) {
    res.status(409).json({ ok: false, error: "A pending mobile change request already exists." });
    return;
  }

  const requestCode = `MCR-${Date.now().toString().slice(-8)}`;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO mobile_change_requests (request_code, trader_id, old_mobile, new_mobile, alternate_mobile, reason, application_note)
       VALUES (:requestCode, :traderId, :oldMobile, :newMobile, :alternateMobile, :reason, :applicationNote)`,
      { requestCode, traderId: req.user.trader_id, oldMobile: req.user.mobile, newMobile, alternateMobile, reason, applicationNote },
    );
    const requestId = result.insertId;
    const uploads = [
      { type: "id_proof", document: idProof },
      ...(mobileProof?.dataUrl ? [{ type: "mobile_proof", document: mobileProof }] : []),
    ];
    for (const upload of uploads) {
      const saved = await saveMobileChangeDocumentFile({
        requestId,
        documentType: upload.type,
        originalFilename: upload.document.originalFilename,
        mimeType: upload.document.mimeType,
        dataUrl: upload.document.dataUrl,
      });
      await connection.query(
        `INSERT INTO mobile_change_documents (request_id, document_type, storage_key, original_filename, mime_type, file_size_bytes, checksum_sha256, uploaded_by_user_id)
         VALUES (:requestId, :documentType, :storageKey, :originalFilename, :mimeType, :fileSizeBytes, :checksumSha256, :userId)`,
        { requestId, documentType: upload.type, storageKey: saved.storageKey, originalFilename: saved.originalFilename, mimeType: saved.mimeType, fileSizeBytes: saved.fileSizeBytes, checksumSha256: saved.checksumSha256, userId: req.user.id },
      );
    }
    await connection.commit();
    await writeAudit({ req, action: "mobile_change.submit", module: "mobile_change_requests", entityType: "mobile_change_requests", entityId: requestId, newValues: { requestCode, newMobile, reason } });
    res.status(201).json({ ok: true, requestId, requestCode });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.get("/api/v1/admin/mobile-change-requests", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "all");
  const [rows] = await pool.query(
    `SELECT mcr.*,
            t.trader_code,
            t.business_name,
            mg.gala_number,
            u.full_name AS trader_name,
            u.email AS trader_email
       FROM mobile_change_requests mcr
       JOIN traders t ON t.id = mcr.trader_id
       JOIN users u ON u.id = t.user_id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
      WHERE (:status = 'all' OR mcr.status = :status)
      ORDER BY mcr.created_at DESC
      LIMIT 200`,
    { status },
  );
  const ids = rows.map((row) => row.id);
  let documentsByRequest = {};
  if (ids.length > 0) {
    const [documents] = await pool.query(
      `SELECT id, request_id, document_type, original_filename, mime_type, file_size_bytes, created_at
         FROM mobile_change_documents
        WHERE request_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids },
    );
    documentsByRequest = documents.reduce((acc, document) => {
      acc[document.request_id] = acc[document.request_id] || [];
      acc[document.request_id].push(document);
      return acc;
    }, {});
  }
  res.json({ ok: true, requests: rows.map((row) => ({ ...row, documents: documentsByRequest[row.id] || [] })) });
});

app.get("/api/v1/admin/mobile-change-documents/:id/download", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const documentId = Number(req.params.id);
  const [[document]] = await pool.query("SELECT storage_key, original_filename, mime_type FROM mobile_change_documents WHERE id = :documentId", { documentId });
  if (!document) {
    res.status(404).json({ ok: false, error: "Document not found." });
    return;
  }
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "mobile_change_documents", sourceId: documentId, req });
  await sendStoredFile(res, { ...document, disposition, missingMessage: "Document file is missing on the server." });
});

app.patch("/api/v1/admin/mobile-change-requests/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const requestId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const remarks = String(req.body?.remarks || "").trim();
  const nextStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "";
  if (!requestId || !nextStatus || (nextStatus === "rejected" && !remarks)) {
    res.status(400).json({ ok: false, error: "Valid request id, decision, and rejection reason are required." });
    return;
  }
  const [[request]] = await pool.query("SELECT * FROM mobile_change_requests WHERE id = :requestId LIMIT 1", { requestId });
  if (!request) {
    res.status(404).json({ ok: false, error: "Mobile change request not found." });
    return;
  }
  if (request.status !== "pending") {
    res.status(409).json({ ok: false, error: "Request is already decided." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `UPDATE mobile_change_requests
          SET status = :nextStatus, admin_remarks = :remarks, decided_by_user_id = :userId, decided_at = NOW()
        WHERE id = :requestId`,
      { nextStatus, remarks: remarks || `${decision}d by admin`, userId: req.user.id, requestId },
    );
    if (nextStatus === "approved") {
      await connection.query(
        `UPDATE users u
           JOIN traders t ON t.user_id = u.id
            SET u.mobile = :newMobile
          WHERE t.id = :traderId`,
        { newMobile: request.new_mobile, traderId: request.trader_id },
      );
      await connection.query(
        `DELETE us
           FROM user_sessions us
           JOIN traders t ON t.user_id = us.user_id
          WHERE t.id = :traderId`,
        { traderId: request.trader_id },
      );
    }
    await connection.commit();
    await writeAudit({ req, action: `mobile_change.${decision}`, module: "mobile_change_requests", entityType: "mobile_change_requests", entityId: requestId, oldValues: { status: request.status, mobile: request.old_mobile }, newValues: { status: nextStatus, mobile: nextStatus === "approved" ? request.new_mobile : request.old_mobile, remarks } });
    res.json({ ok: true, requestId, status: nextStatus });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.get("/api/v1/admin/notification-counts", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [[registrations]] = await pool.query("SELECT COUNT(*) AS count FROM traders WHERE verification_status IN ('submitted','under_review','correction_required')");
  const [[memberKyc]] = await pool.query(
    `SELECT COUNT(DISTINCT t.id) AS count
       FROM traders t
      WHERE t.verification_status = 'submitted'
         OR EXISTS (
              SELECT 1 FROM trader_galas tg
               WHERE tg.trader_id = t.id
                 AND tg.status IN ('submitted','under_review','correction_required')
            )`,
  );
  const [[mobileRequests]] = await pool.query("SELECT COUNT(*) AS count FROM mobile_change_requests WHERE status = 'pending'");
  const [[posts]] = await pool.query("SELECT COUNT(*) AS count FROM posts WHERE status IN ('draft','scheduled')");
  const [[complaints]] = await pool.query("SELECT COUNT(*) AS count FROM support_tickets WHERE status IN ('open','in_progress','waiting_user')");
  const [[reviews]] = await pool.query("SELECT COUNT(*) AS count FROM ratings WHERE rating_scope = 'portal' AND moderation_status = 'pending'");
  res.json({
    ok: true,
    counts: {
      "/admin/registrations": Number(registrations.count || 0),
      "/admin/kyc": Number(memberKyc.count || 0),
      "/admin/mobile-requests": Number(mobileRequests.count || 0),
      "/admin/posts": Number(posts.count || 0),
      "/admin/complaints": Number(complaints.count || 0),
      "/admin/reviews": Number(reviews.count || 0),
    },
  });
});

app.get("/api/v1/admin/business-categories", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [categories] = await pool.query(
    `SELECT MIN(id) AS id, name_en, MIN(name_mr) AS name_mr
       FROM business_categories
      WHERE status = 'active'
      GROUP BY name_en
      ORDER BY name_en ASC`,
  );
  res.json({ ok: true, categories });
});

app.get("/api/v1/admin/post-queue", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "review");
  const statusWhere = status === "all" ? "p.status IN ('draft','scheduled','published','archived')" : "p.status IN ('draft','scheduled')";
  const [rows] = await pool.query(
    `SELECT p.*, target_category.name_en AS share_category_name,
            u.full_name AS created_by_name, r.code AS created_by_role,
            t.business_name,
            t.trader_code,
            mg.gala_number,
            mg.section_name
       FROM posts p
       JOIN users u ON u.id = p.created_by_user_id
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       LEFT JOIN business_categories target_category ON target_category.id = p.share_category_id
      WHERE ${statusWhere}
        AND p.post_type = 'announcement'
        AND r.code = 'TRADER'
      ORDER BY p.created_at DESC
      LIMIT 100`,
  );
  const ids = rows.map((row) => row.id);
  let attachmentsByPost = {};
  if (ids.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, post_id, attachment_type, original_filename, mime_type, file_size_bytes
         FROM post_attachments
        WHERE post_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids },
    );
    attachmentsByPost = attachments.reduce((acc, attachment) => {
      acc[attachment.post_id] = acc[attachment.post_id] || [];
      acc[attachment.post_id].push(attachment);
      return acc;
    }, {});
  }
  res.json({ ok: true, posts: rows.map((post) => ({ ...post, parsed: safeJson(post.content_en), attachments: attachmentsByPost[post.id] || [] })) });
});

app.get("/api/v1/admin/post-attachments/:id/download", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const attachmentId = Number(req.params.id);
  const [[attachment]] = await pool.query("SELECT storage_key, original_filename, mime_type FROM post_attachments WHERE id = :attachmentId", { attachmentId });
  if (!attachment) {
    res.status(404).json({ ok: false, error: "Post attachment not found." });
    return;
  }
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "post_attachments", sourceId: attachmentId, req });
  await sendStoredFile(res, { ...attachment, disposition, missingMessage: "Post attachment file is missing on the server." });
});

app.get("/api/v1/trader/post-attachments/:id/download", requireRoles("TRADER"), async (req, res) => {
  const attachmentId = Number(req.params.id);
  const [[attachment]] = await pool.query(
    `SELECT pa.storage_key, pa.original_filename, pa.mime_type
       FROM post_attachments pa
       JOIN posts p ON p.id = pa.post_id
       JOIN users u ON u.id = p.created_by_user_id
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders viewer ON viewer.id = :viewerTraderId
       LEFT JOIN business_categories viewer_category ON viewer_category.id = viewer.business_category_id
       LEFT JOIN business_categories target_category ON target_category.id = p.share_category_id
      WHERE pa.id = :attachmentId
        AND p.status = 'published'
        AND p.post_type = 'announcement'
        AND r.code = 'TRADER'
        AND (
          COALESCE(p.share_audience, 'all') = 'all'
          OR (
            p.share_audience = 'category'
            AND (
              p.share_category_id = viewer.business_category_id
              OR (target_category.name_en IS NOT NULL AND target_category.name_en = viewer_category.name_en)
            )
          )
        )
      LIMIT 1`,
    { attachmentId, viewerTraderId: req.user.trader_id || 0 },
  );
  if (!attachment) {
    res.status(404).json({ ok: false, error: "Post attachment not found." });
    return;
  }
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "post_attachments", sourceId: attachmentId, req });
  await sendStoredFile(res, { ...attachment, disposition, missingMessage: "Post attachment file is missing on the server." });
});

app.patch("/api/v1/admin/posts/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const postId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const shareAudience = String(req.body?.shareAudience || "all");
  const shareCategoryId = shareAudience === "category" ? Number(req.body?.shareCategoryId) : null;
  const nextStatus = decision === "approve" ? "published" : decision === "reject" ? "archived" : "";
  if (!postId || !nextStatus) {
    res.status(400).json({ ok: false, error: "Valid post id and decision are required." });
    return;
  }
  if (decision === "approve" && !["all", "category"].includes(shareAudience)) {
    res.status(400).json({ ok: false, error: "Valid share audience is required." });
    return;
  }
  if (decision === "approve" && shareAudience === "category") {
    const [[category]] = await pool.query("SELECT id FROM business_categories WHERE id = :shareCategoryId AND status = 'active' LIMIT 1", { shareCategoryId });
    if (!category) {
      res.status(400).json({ ok: false, error: "Select a valid member category for this post." });
      return;
    }
  }
  const [[before]] = await pool.query("SELECT status, post_type, title_en, content_en FROM posts WHERE id = :postId", { postId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Post not found." });
    return;
  }
  await pool.query(
    `UPDATE posts
        SET status = :nextStatus,
            share_audience = IF(:nextStatus = 'published', :shareAudience, share_audience),
            share_category_id = IF(:nextStatus = 'published', :shareCategoryId, share_category_id),
            published_at = IF(:nextStatus = 'published', NOW(), published_at),
            updated_by_user_id = :userId
      WHERE id = :postId`,
    { nextStatus, shareAudience, shareCategoryId, userId: req.user.id, postId },
  );
  await writeAudit({ req, action: `post.${decision}`, module: "posts", entityType: "posts", entityId: postId, oldValues: before, newValues: { status: nextStatus, shareAudience, shareCategoryId } });
  if (nextStatus === "published") {
    const parsed = safeJson(before.content_en);
    const details = parsed?.details || before.content_en || "";
    await notifyMembersAboutPublishedPost(pool, {
      postId,
      postType: before.post_type,
      titleEn: before.title_en,
      details,
    });
    setImmediate(() => {
      sendPublishedPostPush({
        postId,
        postType: before.post_type,
        titleEn: before.title_en,
        details,
      });
    });
  }
  res.json({ ok: true, postId, status: nextStatus });
});

app.delete("/api/v1/admin/posts/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const postId = Number(req.params.id);
  if (!postId) {
    res.status(400).json({ ok: false, error: "Valid post id is required." });
    return;
  }
  const [[before]] = await pool.query("SELECT status, title_en FROM posts WHERE id = :postId", { postId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Post not found." });
    return;
  }
  await pool.query(
    `UPDATE posts
        SET status = 'archived', published_at = NULL, updated_by_user_id = :userId
      WHERE id = :postId`,
    { userId: req.user.id, postId },
  );
  await writeAudit({ req, action: "post.delete", module: "posts", entityType: "posts", entityId: postId, oldValues: before, newValues: { status: "archived" } });
  res.json({ ok: true, postId, status: "archived" });
});

app.post("/api/v1/complaints", requireRoles("TRADER"), async (req, res) => {
  const { subject, description, priority = "medium", category = "general", visibility = "admin-only", payment = null, attachments = {} } = req.body || {};
  if (!subject || !description) {
    res.status(400).json({ ok: false, error: "subject and description are required." });
    return;
  }
  const ticketNumber = `CMP-${Date.now().toString().slice(-8)}`;
  const body = JSON.stringify({ category, visibility, description, payment });
  const files = [
    ...(Array.isArray(attachments.images) ? attachments.images.map((file) => ({ type: "image", file })) : []),
    ...(Array.isArray(attachments.videos) ? attachments.videos.map((file) => ({ type: "video", file })) : []),
  ].slice(0, 8);
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO support_tickets (ticket_number, created_by_user_id, subject, description, priority, status)
       VALUES (:ticketNumber, :userId, :subject, :body, :priority, 'open')`,
      { ticketNumber, userId: req.user.id, subject, body, priority },
    );
    for (const item of files) {
      if (!item.file?.dataUrl || !item.file?.originalFilename) continue;
      const saved = await saveComplaintAttachmentFile({ complaintId: result.insertId, attachmentType: item.type, originalFilename: item.file.originalFilename, mimeType: item.file.mimeType, dataUrl: item.file.dataUrl });
      await connection.query(
        `INSERT INTO complaint_attachments (complaint_id, attachment_type, storage_key, original_filename, mime_type, file_size_bytes, checksum_sha256, uploaded_by_user_id)
         VALUES (:complaintId, :attachmentType, :storageKey, :originalFilename, :mimeType, :fileSizeBytes, :checksumSha256, :userId)`,
        { complaintId: result.insertId, attachmentType: item.type, storageKey: saved.storageKey, originalFilename: saved.originalFilename, mimeType: saved.mimeType, fileSizeBytes: saved.fileSizeBytes, checksumSha256: saved.checksumSha256, userId: req.user.id },
      );
    }
    await connection.query(
      `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, remarks, changed_by_user_id)
       VALUES (:complaintId, NULL, 'open', 'Complaint submitted by member', :userId)`,
      { complaintId: result.insertId, userId: req.user.id },
    );
    await connection.commit();
    await writeAudit({ req, action: "complaint.create", module: "complaints", entityType: "support_tickets", entityId: result.insertId, newValues: { ticketNumber, subject, category, visibility, payment, attachmentCount: files.length } });
    res.status(201).json({ ok: true, complaintId: result.insertId, ticketNumber });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.get("/api/v1/trader/complaints", requireRoles("TRADER"), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT st.*
       FROM support_tickets st
      WHERE st.created_by_user_id = :userId
      ORDER BY st.created_at DESC
      LIMIT 100`,
    { userId: req.user.id },
  );
  const ids = rows.map((row) => row.id);
  let historyByTicket = {};
  if (ids.length > 0) {
    const [history] = await pool.query(
      `SELECT csh.*, u.full_name AS changed_by_name
         FROM complaint_status_history csh
         JOIN users u ON u.id = csh.changed_by_user_id
        WHERE csh.complaint_id IN (:ids)
        ORDER BY csh.created_at DESC`,
      { ids },
    );
    historyByTicket = history.reduce((acc, item) => {
      acc[item.complaint_id] = acc[item.complaint_id] || [];
      acc[item.complaint_id].push(item);
      return acc;
    }, {});
  }
  res.json({ ok: true, complaints: rows.map((row) => ({ ...row, parsed: JSON.parse(row.description || "{}"), history: historyByTicket[row.id] || [] })) });
});

app.get("/api/v1/admin/complaints", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT st.*, u.full_name AS created_by_name, u.mobile AS created_by_mobile, r.code AS created_by_role,
            t.trader_code, t.business_name, mg.gala_number
       FROM support_tickets st
       JOIN users u ON u.id = st.created_by_user_id
       JOIN roles r ON r.id = u.role_id
       LEFT JOIN traders t ON t.user_id = u.id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
      ORDER BY st.created_at DESC
      LIMIT 100`,
  );
  const ids = rows.map((row) => row.id);
  let attachmentsByTicket = {};
  if (ids.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, complaint_id, attachment_type, original_filename, mime_type, file_size_bytes, created_at
         FROM complaint_attachments
        WHERE complaint_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids },
    );
    attachmentsByTicket = attachments.reduce((acc, item) => {
      acc[item.complaint_id] = acc[item.complaint_id] || [];
      acc[item.complaint_id].push(item);
      return acc;
    }, {});
  }
  res.json({ ok: true, complaints: rows.map((row) => ({ ...row, parsed: JSON.parse(row.description || "{}"), attachments: attachmentsByTicket[row.id] || [] })) });
});

app.get("/api/v1/admin/complaint-attachments/:id/download", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const attachmentId = Number(req.params.id);
  const [[attachment]] = await pool.query("SELECT storage_key, original_filename, mime_type FROM complaint_attachments WHERE id = :attachmentId", { attachmentId });
  if (!attachment) {
    res.status(404).json({ ok: false, error: "Attachment not found." });
    return;
  }
  const filePath = await resolveExistingStoredFilePath(attachment.storage_key);
  const disposition = String(req.query.download || "") === "1" ? "attachment" : "inline";
  await recordDownloadEvent({ sourceTable: "complaint_attachments", sourceId: attachmentId, req });
  res.setHeader("Content-Type", attachment.mime_type);
  res.setHeader("Content-Disposition", `${disposition}; filename="${String(attachment.original_filename || "complaint-attachment").replace(/"/g, "")}"`);
  res.sendFile(filePath, (error) => {
    if (error && !res.headersSent) {
      res.status(404).json({ ok: false, error: "Attachment file is missing on the server." });
    }
  });
});

app.patch("/api/v1/admin/complaints/:id/status", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const complaintId = Number(req.params.id);
  const status = String(req.body?.status || "");
  const remarks = String(req.body?.remarks || "").trim();
  const allowed = new Set(["open", "in_progress", "waiting_user", "resolved", "closed"]);
  if (!complaintId || !allowed.has(status)) {
    res.status(400).json({ ok: false, error: "Valid complaint id and status are required." });
    return;
  }
  const [[before]] = await pool.query("SELECT status FROM support_tickets WHERE id = :complaintId LIMIT 1", { complaintId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Complaint not found." });
    return;
  }
  await pool.query(
    `UPDATE support_tickets
        SET status = :status,
            assigned_to_user_id = :userId,
            resolved_at = CASE
              WHEN :status IN ('resolved', 'closed') AND status NOT IN ('resolved', 'closed') THEN NOW()
              WHEN :status NOT IN ('resolved', 'closed') THEN NULL
              ELSE resolved_at
            END
      WHERE id = :complaintId`,
    { status, userId: req.user.id, complaintId },
  );
  await pool.query(
    `INSERT INTO complaint_status_history (complaint_id, old_status, new_status, remarks, changed_by_user_id)
     VALUES (:complaintId, :oldStatus, :status, :remarks, :userId)`,
    { complaintId, oldStatus: before.status, status, remarks: remarks || `Status updated to ${status}`, userId: req.user.id },
  );
  await writeAudit({ req, action: "complaint.status_update", module: "complaints", entityType: "support_tickets", entityId: complaintId, newValues: { status } });
  res.json({ ok: true, complaintId, status });
});

app.post("/api/v1/ratings", requireRoles("TRADER"), async (req, res) => {
  const traderId = Number(req.user.trader_id);
  const reviewerType = String(req.body?.reviewerType || "trader").toLowerCase();
  const customerId = reviewerType === "customer" ? Number(req.body?.customerId) : null;
  const ratingValue = Number(req.body?.ratingValue);
  const reviewText = req.body?.reviewText ? String(req.body.reviewText).trim().slice(0, 1000) : null;
  const attachments = req.body?.attachments || {};
  if (!traderId || !["trader", "customer"].includes(reviewerType) || ratingValue < 1 || ratingValue > 5 || !reviewText) {
    res.status(400).json({ ok: false, error: "Reviewer type, rating value 1-5, and review text are required." });
    return;
  }
  const [[trader]] = await pool.query(
    `SELECT t.id, u.full_name, u.mobile
       FROM traders t
       JOIN users u ON u.id = t.user_id
      WHERE t.id = :traderId
        AND t.verification_status = 'approved'
      LIMIT 1`,
    { traderId },
  );
  if (!trader) {
    res.status(404).json({ ok: false, error: "Member profile not found." });
    return;
  }
  let reviewerName = trader.full_name;
  let reviewerMobile = trader.mobile;
  if (reviewerType === "customer") {
    const [[customer]] = await pool.query(
      `SELECT c.id, c.full_name, c.mobile
         FROM trader_customers tc
         JOIN customers c ON c.id = tc.customer_id
        WHERE tc.trader_id = :traderId
          AND c.id = :customerId
          AND tc.relationship_status IN ('active','pending')
        LIMIT 1`,
      { traderId, customerId },
    );
    if (!customer) {
      res.status(400).json({ ok: false, error: "Select a customer linked to your member account." });
      return;
    }
    reviewerName = customer.full_name;
    reviewerMobile = customer.mobile;
  }
  const [result] = await pool.query(
    `INSERT INTO ratings (trader_id, customer_id, reviewer_user_id, rating_scope, reviewer_type, reviewer_name, reviewer_mobile, rating_value, review_text, moderation_status)
     VALUES (:traderId, :customerId, :userId, 'portal', :reviewerType, :reviewerName, :reviewerMobile, :ratingValue, :reviewText, 'pending')`,
    { traderId, customerId, userId: req.user.id, reviewerType, reviewerName, reviewerMobile, ratingValue, reviewText },
  );
  const ratingAttachments = [
    ...(Array.isArray(attachments.images) ? attachments.images.map((file) => ({ type: "image", file })) : []),
    ...(Array.isArray(attachments.videos) ? attachments.videos.map((file) => ({ type: "video", file })) : []),
  ].slice(0, 6);
  for (const upload of ratingAttachments) {
    if (!upload.file?.dataUrl || !upload.file?.originalFilename) continue;
    const saved = await saveRatingAttachmentFile({
      ratingId: result.insertId,
      attachmentType: upload.type,
      originalFilename: upload.file.originalFilename,
      mimeType: upload.file.mimeType,
      dataUrl: upload.file.dataUrl,
    });
    await pool.query(
      `INSERT INTO rating_attachments (rating_id, attachment_type, storage_key, original_filename, mime_type, file_size_bytes, checksum_sha256)
       VALUES (:ratingId, :attachmentType, :storageKey, :originalFilename, :mimeType, :fileSizeBytes, :checksumSha256)`,
      { ratingId: result.insertId, attachmentType: upload.type, storageKey: saved.storageKey, originalFilename: saved.originalFilename, mimeType: saved.mimeType, fileSizeBytes: saved.fileSizeBytes, checksumSha256: saved.checksumSha256 },
    );
  }
  await writeAudit({ req, action: "rating.submit", module: "ratings", entityType: "ratings", entityId: result.insertId, newValues: { traderId, customerId, reviewerType, ratingValue, hasReviewText: Boolean(reviewText) } });
  res.status(201).json({ ok: true, ratingId: result.insertId, status: "pending" });
});

app.get("/api/v1/public/ratings", async (_req, res) => {
  const [[summary]] = await pool.query(
    `SELECT COUNT(*) AS review_count, ROUND(AVG(rating_value), 2) AS average_rating
       FROM ratings
      WHERE rating_scope = 'portal'
        AND moderation_status = 'approved'`,
  );
  const [reviews] = await pool.query(
    `SELECT ra.id, ra.rating_value, ra.review_text, ra.created_at, ra.reviewer_type,
            COALESCE(ra.reviewer_name, 'Portal user') AS reviewer_name,
            t.trader_code, t.business_name, trader_user.full_name AS trader_name,
            mg.gala_number, c.customer_code
       FROM ratings ra
       JOIN traders t ON t.id = ra.trader_id
       JOIN users trader_user ON trader_user.id = t.user_id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       LEFT JOIN customers c ON c.id = ra.customer_id
      WHERE ra.rating_scope = 'portal'
        AND ra.moderation_status = 'approved'
      ORDER BY ra.moderated_at DESC, ra.created_at DESC
      LIMIT 12`,
  );
  const reviewIds = reviews.map((review) => review.id);
  let attachmentsByRating = {};
  if (reviewIds.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, rating_id, attachment_type, original_filename, mime_type, file_size_bytes
         FROM rating_attachments
        WHERE rating_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids: reviewIds },
    );
    attachmentsByRating = attachments.reduce((acc, attachment) => {
      acc[attachment.rating_id] = acc[attachment.rating_id] || [];
      acc[attachment.rating_id].push(attachment);
      return acc;
    }, {});
  }
  res.json({ ok: true, summary, reviews: reviews.map((review) => ({ ...review, attachments: attachmentsByRating[review.id] || [] })) });
});

app.get("/api/v1/public/rating-attachments/:id/download", async (req, res) => {
  const attachmentId = Number(req.params.id);
  const [[attachment]] = await pool.query(
    `SELECT ra.storage_key, ra.original_filename, ra.mime_type
       FROM rating_attachments ra
       JOIN ratings r ON r.id = ra.rating_id
      WHERE ra.id = :attachmentId
        AND r.moderation_status = 'approved'
      LIMIT 1`,
    { attachmentId },
  );
  if (!attachment) {
    res.status(404).json({ ok: false, error: "Attachment not found." });
    return;
  }
  const filePath = path.resolve(process.cwd(), attachment.storage_key);
  if (!filePath.startsWith(path.resolve(process.cwd(), "uploads", "rating-attachments"))) {
    res.status(403).json({ ok: false, error: "Attachment path is not allowed." });
    return;
  }
  res.setHeader("Content-Type", attachment.mime_type);
  res.setHeader("Content-Disposition", `inline; filename="${attachment.original_filename.replace(/"/g, "")}"`);
  res.sendFile(filePath);
});

app.get("/api/v1/admin/rating-attachments/:id/download", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const attachmentId = Number(req.params.id);
  const [[attachment]] = await pool.query(
    `SELECT storage_key, original_filename, mime_type
       FROM rating_attachments
      WHERE id = :attachmentId
      LIMIT 1`,
    { attachmentId },
  );
  if (!attachment) {
    res.status(404).json({ ok: false, error: "Attachment not found." });
    return;
  }
  const filePath = path.resolve(process.cwd(), attachment.storage_key);
  if (!filePath.startsWith(path.resolve(process.cwd(), "uploads", "rating-attachments"))) {
    res.status(403).json({ ok: false, error: "Attachment path is not allowed." });
    return;
  }
  res.setHeader("Content-Type", attachment.mime_type);
  res.setHeader("Content-Disposition", `inline; filename="${attachment.original_filename.replace(/"/g, "")}"`);
  res.sendFile(filePath);
});

app.get("/api/v1/public/traders/:id/ratings", async (req, res) => {
  const traderId = Number(req.params.id);
  const [[summary]] = await pool.query(
    `SELECT COUNT(*) AS review_count, ROUND(AVG(rating_value), 2) AS average_rating
       FROM ratings WHERE trader_id = :traderId AND moderation_status = 'approved' AND rating_scope = 'trader_profile'`,
    { traderId },
  );
  const [reviews] = await pool.query(
    `SELECT ra.rating_value, ra.review_text, ra.created_at, COALESCE(ra.reviewer_name, u.full_name, 'Customer') AS reviewer_name
       FROM ratings ra
       LEFT JOIN users u ON u.id = ra.reviewer_user_id
      WHERE ra.trader_id = :traderId AND ra.moderation_status = 'approved' AND ra.rating_scope = 'trader_profile'
      ORDER BY ra.created_at DESC LIMIT 20`,
    { traderId },
  );
  const reviewIds = reviews.map((review) => review.id);
  let attachmentsByRating = {};
  if (reviewIds.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, rating_id, attachment_type, original_filename, mime_type, file_size_bytes
         FROM rating_attachments
        WHERE rating_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids: reviewIds },
    );
    attachmentsByRating = attachments.reduce((acc, attachment) => {
      acc[attachment.rating_id] = acc[attachment.rating_id] || [];
      acc[attachment.rating_id].push(attachment);
      return acc;
    }, {});
  }
  res.json({ ok: true, summary, reviews: reviews.map((review) => ({ ...review, attachments: attachmentsByRating[review.id] || [] })) });
});

app.get("/api/v1/admin/ratings", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const status = String(req.query.status || "pending");
  const allowed = new Set(["pending", "approved", "rejected", "all"]);
  if (!allowed.has(status)) {
    res.status(400).json({ ok: false, error: "Invalid review status." });
    return;
  }
  const [ratings] = await pool.query(
    `SELECT ra.*, COALESCE(ra.reviewer_name, reviewer.full_name, 'Portal user') AS reviewer_name,
            COALESCE(ra.reviewer_mobile, reviewer.mobile) AS reviewer_mobile,
            t.trader_code, t.business_name, trader_user.full_name AS trader_name,
            mg.gala_number, moderator.full_name AS moderator_name, c.customer_code
       FROM ratings ra
       JOIN traders t ON t.id = ra.trader_id
       JOIN users trader_user ON trader_user.id = t.user_id
       LEFT JOIN market_galas mg ON mg.id = t.gala_id
       LEFT JOIN users reviewer ON reviewer.id = ra.reviewer_user_id
       LEFT JOIN users moderator ON moderator.id = ra.moderated_by_user_id
       LEFT JOIN customers c ON c.id = ra.customer_id
      WHERE ra.rating_scope = 'portal'
        AND (:status = 'all' OR ra.moderation_status = :status)
      ORDER BY ra.created_at DESC
      LIMIT 200`,
    { status },
  );
  const reviewIds = ratings.map((review) => review.id);
  let attachmentsByRating = {};
  if (reviewIds.length > 0) {
    const [attachments] = await pool.query(
      `SELECT id, rating_id, attachment_type, original_filename, mime_type, file_size_bytes
         FROM rating_attachments
        WHERE rating_id IN (:ids)
        ORDER BY created_at ASC`,
      { ids: reviewIds },
    );
    attachmentsByRating = attachments.reduce((acc, attachment) => {
      acc[attachment.rating_id] = acc[attachment.rating_id] || [];
      acc[attachment.rating_id].push(attachment);
      return acc;
    }, {});
  }
  res.json({ ok: true, ratings: ratings.map((rating) => ({ ...rating, attachments: attachmentsByRating[rating.id] || [] })) });
});

app.patch("/api/v1/admin/ratings/:id/decision", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const ratingId = Number(req.params.id);
  const decision = String(req.body?.decision || "");
  const moderationRemarks = String(req.body?.remarks || "").trim().slice(0, 500) || null;
  const nextStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "";
  if (!ratingId || !nextStatus) {
    res.status(400).json({ ok: false, error: "Valid rating id and decision are required." });
    return;
  }
  const [[before]] = await pool.query("SELECT moderation_status FROM ratings WHERE id = :ratingId LIMIT 1", { ratingId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Review not found." });
    return;
  }
  await pool.query(
    `UPDATE ratings
        SET moderation_status = :nextStatus,
            moderation_remarks = :moderationRemarks,
            moderated_by_user_id = :userId,
            moderated_at = NOW()
      WHERE id = :ratingId`,
    { nextStatus, moderationRemarks, userId: req.user.id, ratingId },
  );
  await writeAudit({ req, action: `rating.${decision}`, module: "ratings", entityType: "ratings", entityId: ratingId, oldValues: before, newValues: { moderation_status: nextStatus, moderation_remarks: moderationRemarks } });
  res.json({ ok: true, ratingId, status: nextStatus });
});

app.delete("/api/v1/admin/ratings/:id", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (req, res) => {
  const ratingId = Number(req.params.id);
  if (!ratingId) {
    res.status(400).json({ ok: false, error: "Valid rating id is required." });
    return;
  }
  const [[before]] = await pool.query("SELECT id, moderation_status, rating_scope, review_text FROM ratings WHERE id = :ratingId LIMIT 1", { ratingId });
  if (!before) {
    res.status(404).json({ ok: false, error: "Review not found." });
    return;
  }
  const [attachments] = await pool.query("SELECT storage_key FROM rating_attachments WHERE rating_id = :ratingId", { ratingId });
  await pool.query("DELETE FROM ratings WHERE id = :ratingId", { ratingId });
  for (const attachment of attachments) {
    const filePath = await resolveExistingStoredFilePath(attachment.storage_key);
    if (isPathInside(filePath, PERSISTENT_UPLOAD_ROOT) || isPathInside(filePath, path.resolve(process.cwd(), "uploads"))) {
      fs.unlink(filePath).catch(() => undefined);
    }
  }
  await writeAudit({ req, action: "rating.delete", module: "ratings", entityType: "ratings", entityId: ratingId, oldValues: before });
  res.json({ ok: true, ratingId, deleted: true });
});

app.get("/api/v1/admin/reports/analytics", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [[summary]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM login_events WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS portal_logins_30d,
      (SELECT COUNT(*) FROM file_download_events) AS file_downloads,
      (SELECT COUNT(*) FROM pwa_installs) AS pwa_installs_total,
      (SELECT COUNT(*) FROM pwa_installs WHERE DATE(installed_at) = CURDATE()) AS pwa_installs_today,
      (SELECT COUNT(*) FROM pwa_installs WHERE installed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS pwa_installs_week,
      (SELECT COUNT(*) FROM pwa_installs WHERE installed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS pwa_installs_month,
      (SELECT COUNT(DISTINCT user_id) FROM pwa_installs WHERE user_id IS NOT NULL) AS pwa_installs_registered_users,
      (SELECT COUNT(*) FROM pwa_installs WHERE platform IN ('android','ios')) AS pwa_installs_mobile,
      (SELECT COUNT(*) FROM pwa_installs WHERE platform = 'desktop') AS pwa_installs_desktop,
      (SELECT COUNT(*) FROM pwa_installs WHERE platform NOT IN ('android','ios','desktop')) AS pwa_installs_other,
      (
        (SELECT COUNT(*) FROM trader_documents)
        + (SELECT COUNT(*) FROM content_attachments)
        + (SELECT COUNT(*) FROM mobile_change_documents)
        + (SELECT COUNT(*) FROM complaint_attachments)
        + (SELECT COUNT(*) FROM post_attachments)
      ) AS downloadable_files,
      (SELECT COUNT(*) FROM support_tickets WHERE status NOT IN ('resolved','closed','rejected')) AS active_complaints,
      (SELECT COUNT(*) FROM support_tickets WHERE status IN ('resolved','closed')) AS resolved_complaints,
      (SELECT COUNT(*) FROM support_tickets WHERE priority = 'emergency' AND status NOT IN ('resolved','closed','rejected')) AS emergency_complaints,
      (SELECT COUNT(*) FROM posts WHERE post_type IN ('notice','circular') AND status = 'published') AS published_notices,
      (SELECT COUNT(*) FROM traders) AS total_traders,
      (SELECT COUNT(*) FROM traders WHERE verification_status = 'approved') AS approved_traders,
      (SELECT COUNT(*) FROM traders WHERE verification_status IN ('submitted','under_review','correction_required')) AS pending_traders,
      (SELECT COUNT(*) FROM traders WHERE verification_status = 'rejected') AS rejected_traders,
      (SELECT COUNT(*) FROM traders WHERE verification_status IN ('suspended','deactivated')) AS suspended_traders,
      (SELECT COUNT(*) FROM posts WHERE status = 'published') AS published_content
  `);

  const [registrations] = await pool.query(`
    SELECT DATE_FORMAT(created_at, '%b') AS month, COUNT(*) AS count
      FROM traders
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
     GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
     ORDER BY YEAR(created_at), MONTH(created_at)
  `);

  const [downloads] = await pool.query(`
    SELECT month, SUM(downloads) AS downloads
      FROM (
        SELECT DATE_FORMAT(created_at, '%b') AS month, YEAR(created_at) AS year_no, MONTH(created_at) AS month_no, COUNT(*) AS downloads FROM file_download_events WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY year_no, month_no, month
      ) files
     GROUP BY year_no, month_no, month
     ORDER BY year_no, month_no
  `);

  const [pwaInstalls] = await pool.query(`
    SELECT DATE_FORMAT(installed_at, '%b') AS month, COUNT(*) AS installs
      FROM pwa_installs
     WHERE installed_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
     GROUP BY YEAR(installed_at), MONTH(installed_at), DATE_FORMAT(installed_at, '%b')
     ORDER BY YEAR(installed_at), MONTH(installed_at)
  `);

  const [pwaPlatforms] = await pool.query(`
    SELECT platform, COUNT(*) AS count
      FROM pwa_installs
     GROUP BY platform
     ORDER BY count DESC
  `);

  const [complaintsByCategory] = await pool.query(`
    SELECT CASE
             WHEN JSON_VALID(description) THEN COALESCE(JSON_UNQUOTE(JSON_EXTRACT(description, '$.category')), 'General')
             ELSE 'General'
           END AS category,
           COUNT(*) AS count
      FROM support_tickets
     GROUP BY CASE
                WHEN JSON_VALID(description) THEN COALESCE(JSON_UNQUOTE(JSON_EXTRACT(description, '$.category')), 'General')
                ELSE 'General'
              END
     ORDER BY count DESC
     LIMIT 8
  `);

  const [complaintsByStatus] = await pool.query(
    "SELECT status, COUNT(*) AS count FROM support_tickets GROUP BY status ORDER BY count DESC",
  );
  const [contentByStatus] = await pool.query(
    "SELECT status, COUNT(*) AS count FROM posts GROUP BY status ORDER BY count DESC",
  );

  res.json({
    ok: true,
    summary,
    charts: {
      registrations,
      downloads,
      pwaInstalls,
      pwaPlatforms,
      complaintsByCategory,
      complaintsByStatus,
      contentByStatus,
    },
  });
});

app.get("/api/v1/admin/audit-logs", requireRoles("MAIN_ADMIN", "USER_ADMIN"), async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT al.*, u.full_name AS actor_name
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.actor_user_id
      ORDER BY al.created_at DESC
      LIMIT 100`,
  );
  res.json({ ok: true, auditLogs: rows });
});

app.get("/api/v1/trader/customer-risk-search", requireRoles("TRADER"), async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (q.length < 2) {
    res.status(400).json({ ok: false, error: "Search query must be at least 2 characters." });
    return;
  }

  const [rows] = await pool.query(
    `SELECT c.id, c.customer_code, c.full_name, c.mobile, c.kyc_status, c.verified_at, c.risk_status,
            c.address_line1, c.village_city, c.district,
            COUNT(CASE WHEN wc.status IN ('approved','active','partially_paid','disputed') AND wc.visibility = 'market_summary' THEN wc.id END) AS active_market_warning_count,
            COALESCE(SUM(CASE WHEN wc.status IN ('approved','active','partially_paid','disputed') AND wc.visibility = 'market_summary' THEN wc.current_outstanding_amount ELSE 0 END), 0) AS verified_market_outstanding,
            MIN(CASE WHEN wc.status IN ('approved','active','partially_paid','disputed') AND wc.visibility = 'market_summary' THEN wc.due_date END) AS oldest_active_due_date,
            MAX(CASE WHEN wc.status IN ('approved','active','partially_paid','disputed') AND wc.visibility = 'market_summary' THEN wc.updated_at END) AS risk_last_updated_at,
            latest_wc.id AS latest_warning_id,
            latest_wc.trader_statement AS latest_warning_note,
            latest_trader.business_name AS latest_warning_trader,
            latest_wc.trader_id = :traderId AS can_clear_latest_warning,
            linked.id IS NOT NULL AS linked_to_me
       FROM customers c
       LEFT JOIN warning_cases wc ON wc.customer_id = c.id
       LEFT JOIN warning_cases latest_wc ON latest_wc.id = (
          SELECT wc2.id
            FROM warning_cases wc2
           WHERE wc2.customer_id = c.id
             AND wc2.status IN ('approved','active','partially_paid','disputed')
             AND wc2.visibility = 'market_summary'
           ORDER BY wc2.updated_at DESC, wc2.id DESC
           LIMIT 1
       )
       LEFT JOIN traders latest_trader ON latest_trader.id = latest_wc.trader_id
       LEFT JOIN trader_customers linked ON linked.customer_id = c.id AND linked.trader_id = :traderId
      WHERE c.deleted_at IS NULL
        AND (c.customer_code = :q OR c.full_name LIKE :likeQuery OR c.mobile LIKE :likeQuery)
      GROUP BY c.id, c.customer_code, c.full_name, c.mobile, c.kyc_status, c.verified_at, c.risk_status,
               c.address_line1, c.village_city, c.district, latest_wc.id, latest_wc.trader_id, latest_wc.trader_statement, latest_trader.business_name, linked.id
      ORDER BY active_market_warning_count DESC, c.full_name ASC
      LIMIT 20`,
    { q, likeQuery: `%${q}%`, traderId: req.user.trader_id || 0 },
  );

  res.json({ ok: true, customers: rows });
});

app.post("/api/v1/trader/customers/link", requireRoles("TRADER"), async (req, res) => {
  const traderId = req.user.trader_id;
  const customerId = Number(req.body?.customerId);
  if (!traderId || !customerId) {
    res.status(400).json({ ok: false, error: "Valid customer is required." });
    return;
  }
  const [[customer]] = await pool.query("SELECT id, kyc_status FROM customers WHERE id = :customerId AND deleted_at IS NULL LIMIT 1", { customerId });
  if (!customer) {
    res.status(404).json({ ok: false, error: "Customer KYC not found." });
    return;
  }
  await pool.query(
    `INSERT INTO trader_customers (trader_id, customer_id, relationship_status, linked_by_user_id)
     VALUES (:traderId, :customerId, :relationshipStatus, :userId)
     ON DUPLICATE KEY UPDATE relationship_status = IF(relationship_status = 'closed', VALUES(relationship_status), relationship_status)`,
    { traderId, customerId, relationshipStatus: customer.kyc_status === "verified" ? "active" : "pending", userId: req.user.id },
  );
  await writeAudit({ req, action: "customer.link_existing", module: "customers", entityType: "customers", entityId: customerId, newValues: { traderId } });
  res.json({ ok: true, customerId });
});

app.post("/api/v1/trader/customer-warnings", requireRoles("TRADER"), async (req, res) => {
  const traderId = req.user.trader_id;
  const customerId = Number(req.body?.customerId);
  const amount = Number(req.body?.amount);
  const dueDate = String(req.body?.dueDate || "").trim();
  const firstWarningAt = String(req.body?.firstWarningAt || "").trim().replace("T", " ");
  const secondWarningAt = String(req.body?.secondWarningAt || "").trim().replace("T", " ");
  const note = String(req.body?.note || "").trim();
  if (!traderId || !customerId || !amount || amount <= 0 || !dueDate || !firstWarningAt || !secondWarningAt || note.length < 10) {
    res.status(400).json({ ok: false, error: "Customer, unpaid amount, due date, both warning dates, and note are required." });
    return;
  }
  const [[customer]] = await pool.query("SELECT id, full_name FROM customers WHERE id = :customerId AND deleted_at IS NULL LIMIT 1", { customerId });
  if (!customer) {
    res.status(404).json({ ok: false, error: "Customer not found." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO trader_customers (trader_id, customer_id, relationship_status, linked_by_user_id)
       VALUES (:traderId, :customerId, 'active', :userId)
       ON DUPLICATE KEY UPDATE relationship_status = IF(relationship_status IN ('closed','pending'), 'active', relationship_status)`,
      { traderId, customerId, userId: req.user.id },
    );
    const [[relationship]] = await connection.query(
      "SELECT id FROM trader_customers WHERE trader_id = :traderId AND customer_id = :customerId LIMIT 1",
      { traderId, customerId },
    );
    const invoiceNumber = `WARN-${Date.now().toString().slice(-10)}`;
    const [invoiceResult] = await connection.query(
      `INSERT INTO invoices (trader_customer_id, trader_id, customer_id, invoice_number, invoice_date, due_date, total_amount, paid_amount, status, notes, created_by_user_id)
       VALUES (:traderCustomerId, :traderId, :customerId, :invoiceNumber, CURDATE(), :dueDate, :amount, 0, 'overdue', :note, :userId)`,
      { traderCustomerId: relationship.id, traderId, customerId, invoiceNumber, dueDate, amount, note, userId: req.user.id },
    );
    const caseNumber = `WRN-${Date.now().toString().slice(-8)}`;
    const [warningResult] = await connection.query(
      `INSERT INTO warning_cases (
          case_number, trader_id, customer_id, invoice_id, warning_stage,
          claimed_outstanding_amount, current_outstanding_amount, due_date,
          first_warning_at, second_warning_at, status, visibility, trader_statement,
          submitted_by_user_id, submitted_at, approved_by_user_id, approved_at
       )
       VALUES (
          :caseNumber, :traderId, :customerId, :invoiceId, 'market_alert',
          :amount, :amount, :dueDate,
          :firstWarningAt, :secondWarningAt, 'active', 'market_summary', :note,
          :userId, NOW(), :userId, NOW()
       )`,
      { caseNumber, traderId, customerId, invoiceId: invoiceResult.insertId, amount, dueDate, firstWarningAt, secondWarningAt, note, userId: req.user.id },
    );
    await connection.query(
      `INSERT INTO warning_history (warning_case_id, old_status, new_status, old_visibility, new_visibility, remarks, changed_by_user_id)
       VALUES (:warningCaseId, NULL, 'active', NULL, 'market_summary', :note, :userId)`,
      { warningCaseId: warningResult.insertId, note, userId: req.user.id },
    );
    await connection.query("UPDATE customers SET risk_status = 'high_risk' WHERE id = :customerId", { customerId });
    const notifiedMembers = await createMemberNotifications(connection, {
      type: "risk_alert",
      title: "Payment Risk Alert",
      message: `${customer.full_name} has a new market-wide payment warning for Rs. ${amount.toLocaleString("en-IN")}.`,
      relatedEntityType: "warning_cases",
      relatedEntityId: warningResult.insertId,
      actionUrl: "/member/kyc",
      priority: "critical",
      excludeUserId: req.user.id,
    });
    await connection.commit();
    setImmediate(() => {
      sendRiskAlertPush({ warningId: warningResult.insertId, customerName: customer.full_name, amount });
    });
    await writeAudit({ req, action: "warning.market_alert_submit", module: "warnings", entityType: "warning_cases", entityId: warningResult.insertId, newValues: { customerId, amount, caseNumber, notifiedMembers } });
    res.status(201).json({ ok: true, warningId: warningResult.insertId, caseNumber, notifiedMembers });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.post("/api/v1/trader/customer-warnings/:id/resolve", requireRoles("TRADER"), async (req, res) => {
  const traderId = req.user.trader_id;
  const warningId = Number(req.params.id);
  const remarks = String(req.body?.remarks || "Payment received from customer. Risk warning cleared.").trim();
  if (!traderId || !warningId) {
    res.status(400).json({ ok: false, error: "Valid warning is required." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [[warning]] = await connection.query(
      `SELECT wc.id, wc.customer_id, wc.invoice_id, wc.status, wc.visibility, wc.current_outstanding_amount,
              c.full_name AS customer_name
         FROM warning_cases wc
         JOIN customers c ON c.id = wc.customer_id
        WHERE wc.id = :warningId
          AND wc.trader_id = :traderId
          AND wc.status IN ('approved','active','partially_paid','disputed')
          AND wc.visibility = 'market_summary'
        LIMIT 1
        FOR UPDATE`,
      { warningId, traderId },
    );
    if (!warning) {
      await connection.rollback();
      res.status(404).json({ ok: false, error: "Active warning not found for your member account." });
      return;
    }

    await connection.query(
      `UPDATE warning_cases
          SET status = 'resolved',
              visibility = 'private',
              current_outstanding_amount = 0,
              resolved_at = NOW(),
              resolution_notes = :remarks
        WHERE id = :warningId`,
      { warningId, remarks },
    );
    await connection.query(
      "UPDATE invoices SET paid_amount = total_amount, status = 'paid' WHERE id = :invoiceId",
      { invoiceId: warning.invoice_id },
    );
    await connection.query(
      `INSERT INTO warning_history (warning_case_id, old_status, new_status, old_visibility, new_visibility, remarks, changed_by_user_id)
       VALUES (:warningId, :oldStatus, 'resolved', :oldVisibility, 'private', :remarks, :userId)`,
      { warningId, oldStatus: warning.status, oldVisibility: warning.visibility, remarks, userId: req.user.id },
    );

    const [[remaining]] = await connection.query(
      `SELECT COUNT(*) AS activeCount
         FROM warning_cases
        WHERE customer_id = :customerId
          AND status IN ('approved','active','partially_paid','disputed')
          AND visibility = 'market_summary'`,
      { customerId: warning.customer_id },
    );
    if (Number(remaining.activeCount || 0) === 0) {
      await connection.query("UPDATE customers SET risk_status = 'normal' WHERE id = :customerId", { customerId: warning.customer_id });
    }

    const notifiedMembers = await createMemberNotifications(connection, {
      type: "risk_cleared",
      title: "Payment Cleared",
      message: `${warning.customer_name} has cleared the pending payment warning and is no longer marked high risk for that case.`,
      relatedEntityType: "warning_cases",
      relatedEntityId: warningId,
      actionUrl: "/member/kyc",
      priority: "high",
    });
    await connection.commit();
    setImmediate(() => {
      sendRiskClearedPush({ warningId, customerName: warning.customer_name });
    });
    await writeAudit({ req, action: "warning.market_alert_resolve", module: "warnings", entityType: "warning_cases", entityId: warningId, oldValues: { status: warning.status, visibility: warning.visibility, outstanding: warning.current_outstanding_amount }, newValues: { status: "resolved", visibility: "private", outstanding: 0, notifiedMembers } });
    res.json({ ok: true, warningId, status: "resolved", notifiedMembers });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({ ok: false, error: error.message });
});

ensurePlatformExtensions()
  .then(() => {
    scheduleRetentionCleanup();
    app.listen(config.port, "127.0.0.1", () => {
      console.log(`Backend listening at http://127.0.0.1:${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize backend extensions", error);
    process.exit(1);
  });
