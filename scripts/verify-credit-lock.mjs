import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = process.cwd();
const footerPath = path.join(root, "src", "components", "public", "SiteLayout.tsx");
const footer = fs.readFileSync(footerPath, "utf8");

const requiredText = [
  "Permanent portal credit: do not change this name for the lifetime of this portal.",
  "Ideation by",
  "Sourabh Kunjir",
  "Chaiman of Shri Chhatrapati Shivaji Market Yard Adte Association",
];

const missing = requiredText.filter((text) => !footer.includes(text));

if (missing.length === 0) {
  process.exit(0);
}

const overridePassword = process.env.CREDIT_LOCK_PASSWORD || "";
const expectedHash = process.env.CREDIT_LOCK_PASSWORD_SHA256 || "";
const overrideHash = crypto.createHash("sha256").update(overridePassword).digest("hex");

if (expectedHash && overridePassword && overrideHash === expectedHash) {
  console.warn("Credit lock override accepted. Footer credit was changed with owner approval.");
  process.exit(0);
}

console.error("\nProtected footer credit was changed.");
console.error("Restore the exact locked credit line or use the external owner-approved lock secret.");
console.error(`Missing protected text: ${missing.join(", ")}\n`);
process.exit(1);
