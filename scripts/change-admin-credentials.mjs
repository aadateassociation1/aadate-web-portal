import crypto from "node:crypto";
import { pool } from "../apps/backend-api/src/db.js";

function getArg(name) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : "";
}

const role = String(process.env.ADMIN_ROLE || getArg("role") || "").trim().toUpperCase();
const username = String(process.env.ADMIN_USERNAME || getArg("username") || "").trim();
const password = String(process.env.ADMIN_PASSWORD || getArg("password") || "");
const mobile = String(process.env.ADMIN_MOBILE || getArg("mobile") || "").trim();
const email = String(process.env.ADMIN_EMAIL || getArg("email") || "").trim();
const fullName = String(process.env.ADMIN_FULL_NAME || getArg("full-name") || "").trim();

if (!["MAIN_ADMIN", "USER_ADMIN"].includes(role)) {
  throw new Error("ADMIN_ROLE must be MAIN_ADMIN or USER_ADMIN.");
}

if (!username || username.length < 4) {
  throw new Error("ADMIN_USERNAME must be at least 4 characters.");
}

if (!password || password.length < 8 || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters and include a number and symbol.");
}

if (mobile && !/^\d{10}$/.test(mobile)) {
  throw new Error("ADMIN_MOBILE must be a 10 digit mobile number.");
}

if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("ADMIN_EMAIL is invalid.");
}

const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

try {
  const [[admin]] = await pool.query(
    `SELECT u.id, u.username, u.mobile, u.email, u.full_name
       FROM users u
       JOIN roles r ON r.id = u.role_id
      WHERE r.code = :role
      ORDER BY u.id ASC
      LIMIT 1`,
    { role },
  );

  if (!admin) {
    throw new Error(`${role} user was not found. Run npm run db:init and npm run db:seed-demo first.`);
  }

  await pool.query(
    `UPDATE users
        SET username = :username,
            password_hash = :passwordHash,
            mobile = COALESCE(NULLIF(:mobile, ''), mobile),
            email = COALESCE(NULLIF(:email, ''), email),
            full_name = COALESCE(NULLIF(:fullName, ''), full_name),
            status = 'active',
            password_changed_at = NOW()
      WHERE id = :userId`,
    {
      username,
      passwordHash,
      mobile,
      email,
      fullName,
      userId: admin.id,
    },
  );

  console.log(`${role} credentials updated successfully.`);
  console.log(`Username: ${username}`);
  console.log(`Mobile: ${mobile || admin.mobile || "-"}`);
  console.log(`Email: ${email || admin.email || "-"}`);
} finally {
  await pool.end();
}
