import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { config } from "./config.js";

const schemaPath = path.resolve("database", "market_yard_portal_mysql_schema.sql");
const schemaSql = await fs.readFile(schemaPath, "utf8");

const connection = await mysql.createConnection({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  multipleStatements: true,
});

try {
  await connection.query(schemaSql);
  console.log(`Database initialized from ${schemaPath}`);
} finally {
  await connection.end();
}

