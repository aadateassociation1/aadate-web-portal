import crypto from "node:crypto";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { config } from "../apps/backend-api/src/config.js";

dotenv.config();

const BATCH_SIZE = Math.max(1, Number(process.env.CUSTOMER_NAME_TRANSLATION_BATCH || 50));

function hasDevanagariText(value) {
  return /[\u0900-\u097F]/.test(String(value || ""));
}

function languageName(lang) {
  return lang === "mr" ? "Marathi" : "English";
}

function extractGeminiText(result) {
  const parts = result?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part?.text || "").join(" ").trim();
}

async function addColumnIfMissing(connection, tableName, columnName, ddl) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS count
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?`,
    [tableName, columnName],
  );
  if (Number(rows?.[0]?.count || 0) === 0) {
    await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${ddl}`);
  }
}

async function ensureSchema(connection) {
  await addColumnIfMissing(connection, "customers", "full_name_en", "full_name_en VARCHAR(180) NULL AFTER full_name");
  await addColumnIfMissing(connection, "customers", "full_name_mr", "full_name_mr VARCHAR(180) NULL AFTER full_name_en");
  await connection.query(`
    CREATE TABLE IF NOT EXISTS translation_cache (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      source_lang ENUM('en','mr') NOT NULL,
      target_lang ENUM('en','mr') NOT NULL,
      source_hash CHAR(64) NOT NULL,
      source_text TEXT NOT NULL,
      target_text TEXT NOT NULL,
      provider VARCHAR(40) NOT NULL DEFAULT 'gemini',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_translation_cache_pair_hash (source_lang, target_lang, source_hash),
      INDEX idx_translation_cache_langs (source_lang, target_lang, updated_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function translateName(connection, text, sourceLang, targetLang) {
  const cleanText = String(text || "").trim();
  if (!cleanText || sourceLang === targetLang) return cleanText;

  const sourceHash = crypto.createHash("sha256").update(`name:${sourceLang}:${targetLang}:${cleanText}`).digest("hex");
  const [cachedRows] = await connection.query(
    `SELECT target_text
       FROM translation_cache
      WHERE source_lang = ?
        AND target_lang = ?
        AND source_hash = ?
      LIMIT 1`,
    [sourceLang, targetLang, sourceHash],
  );
  if (cachedRows?.[0]?.target_text) return cachedRows[0].target_text;

  if (!config.gemini.apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const prompt = [
    `Transliterate this person full name from ${languageName(sourceLang)} to ${languageName(targetLang)}.`,
    "Keep it as a personal name, not a meaning translation.",
    "Use natural spelling for Maharashtra names. Preserve initials and honorifics when present.",
    "Return only the name. Do not add explanations, quotes, bullets, markdown, or labels.",
    "",
    cleanText,
  ].join("\n");
  const model = String(config.gemini.model || "gemini-2.0-flash").replace(/^models\//, "");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": config.gemini.apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0, candidateCount: 1 },
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error?.message || "Gemini name translation request failed.");

  const translatedText = (extractGeminiText(result) || cleanText).trim();
  await connection.query(
    `INSERT INTO translation_cache (source_lang, target_lang, source_hash, source_text, target_text, provider)
     VALUES (?, ?, ?, ?, ?, 'gemini')
     ON DUPLICATE KEY UPDATE target_text = VALUES(target_text), provider = VALUES(provider), updated_at = CURRENT_TIMESTAMP`,
    [sourceLang, targetLang, sourceHash, cleanText, translatedText],
  );
  return translatedText;
}

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    namedPlaceholders: true,
    charset: "utf8mb4",
  });

  try {
    await ensureSchema(connection);
    const [rows] = await connection.query(
      `SELECT id, full_name, full_name_en, full_name_mr
         FROM customers
        WHERE deleted_at IS NULL
          AND (full_name_en IS NULL OR full_name_en = '' OR full_name_mr IS NULL OR full_name_mr = '')
        ORDER BY id ASC
        LIMIT ?`,
      [BATCH_SIZE],
    );

    if (rows.length === 0) {
      console.log("No customer names pending translation.");
      return;
    }

    let updated = 0;
    for (const row of rows) {
      const sourceLang = hasDevanagariText(row.full_name) ? "mr" : "en";
      const fullNameEn = row.full_name_en || (sourceLang === "en" ? row.full_name : await translateName(connection, row.full_name, "mr", "en"));
      const fullNameMr = row.full_name_mr || (sourceLang === "mr" ? row.full_name : await translateName(connection, row.full_name, "en", "mr"));
      await connection.query(
        `UPDATE customers
            SET full_name_en = ?,
                full_name_mr = ?
          WHERE id = ?`,
        [fullNameEn, fullNameMr, row.id],
      );
      updated += 1;
      console.log(`Updated ${row.id}: ${row.full_name} -> ${fullNameMr}`);
    }

    console.log(`Done. Updated ${updated} customer name translation(s). Run again if more remain.`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});