import mysql from "mysql2/promise";
import { config } from "./config.js";

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

export async function pingDatabase() {
  const [rows] = await pool.query("SELECT DATABASE() AS database_name, VERSION() AS mysql_version");
  return rows[0];
}

