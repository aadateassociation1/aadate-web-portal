import crypto from "node:crypto";
import { pool } from "./db.js";

function passwordHash(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function roleId(code) {
  const [[role]] = await pool.query("SELECT id FROM roles WHERE code = :code LIMIT 1", { code });
  if (!role) throw new Error(`${code} role is missing. Run npm run db:init first.`);
  return role.id;
}

async function upsertUser({ roleCode, username, email, mobile, fullName, password }) {
  const id = await roleId(roleCode);
  await pool.query(
    `INSERT INTO users (role_id, username, email, mobile, password_hash, full_name, status, mobile_verified_at, password_changed_at)
     VALUES (:roleId, :username, :email, :mobile, :passwordHash, :fullName, 'active', NOW(), NOW())
     ON DUPLICATE KEY UPDATE
       role_id = VALUES(role_id),
       username = VALUES(username),
       email = VALUES(email),
       password_hash = VALUES(password_hash),
       full_name = VALUES(full_name),
       status = 'active',
       mobile_verified_at = COALESCE(mobile_verified_at, NOW())`,
    { roleId: id, username, email, mobile, passwordHash: passwordHash(password), fullName },
  );
  const [[user]] = await pool.query("SELECT id FROM users WHERE username = :username LIMIT 1", { username });
  return user.id;
}

async function main() {
  await upsertUser({
    roleCode: "MAIN_ADMIN",
    username: "mainadmin",
    email: "mainadmin@marketyard.local",
    mobile: "9000000001",
    fullName: "Main Administrator",
    password: "Admin@123",
  });

  await upsertUser({
    roleCode: "USER_ADMIN",
    username: "useradmin",
    email: "useradmin@marketyard.local",
    mobile: "9000000002",
    fullName: "User Administrator",
    password: "Admin@123",
  });

  const traderUserId = await upsertUser({
    roleCode: "TRADER",
    username: "ramesh.shinde",
    email: "ramesh.shinde@marketyard.local",
    mobile: "9876543210",
    fullName: "Ramesh Shinde",
    password: "Gala@123",
  });

  await pool.query(
    `INSERT INTO traders (user_id, trader_code, business_name, market_registration_number, address_line1, village_city, district, verification_status, verified_at)
     VALUES (:userId, 'TRD-0001', 'Ramesh Shinde Traders', 'MRN-0001', 'Gala A-101, Market Yard', 'Saswad', 'Pune', 'approved', NOW())
     ON DUPLICATE KEY UPDATE verification_status = 'approved', business_name = VALUES(business_name), verified_at = COALESCE(verified_at, NOW())`,
    { userId: traderUserId },
  );

  console.log("Demo users seeded: mainadmin, useradmin, ramesh.shinde");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
