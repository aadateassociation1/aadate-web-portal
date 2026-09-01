import dotenv from "dotenv";

dotenv.config();

function sanitizeEnvValue(value) {
  return String(value || "").trim().replace(/^['"]+|['"]+$/g, "");
}

export const config = {
  port: Number(process.env.BACKEND_PORT || process.env.PORT || 4008),
  corsOrigins: (process.env.CORS_ORIGIN || "http://127.0.0.1:8080,http://127.0.0.1:8083,http://127.0.0.1:8090,http://127.0.0.1:8091,http://127.0.0.1:8092")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  allowLocalDevOrigins: process.env.NODE_ENV !== "production",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "market_yard_portal",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },
  uploads: {
    root: process.env.UPLOAD_ROOT || "uploads",
  },
  jwtSecret: process.env.JWT_SECRET || "local-dev-session-secret",
  msg91: {
    authKey: process.env.MSG91_AUTH_KEY || "",
    templateId: process.env.MSG91_TEMPLATE_ID || "",
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    bucket: process.env.R2_BUCKET || "",
  },
  aisensy: {
    apiKey: process.env.AISENSY_API_KEY || "",
    campaignName: process.env.AISENSY_CAMPAIGN_NAME || "",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },
  vapid: {
    publicKey: sanitizeEnvValue(process.env.VAPID_PUBLIC_KEY),
    privateKey: sanitizeEnvValue(process.env.VAPID_PRIVATE_KEY),
    subject: sanitizeEnvValue(process.env.VAPID_SUBJECT) || "mailto:admin@digitalaadate.org",
  },
};
