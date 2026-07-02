import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export async function getDbConnection() {
  if (pool) {
    return pool;
  }

  const host = process.env.DB_HOST?.trim() || "localhost";
  const user = process.env.DB_USER?.trim() || "root";
  const password = process.env.DB_PASSWORD ?? "";
  const database = process.env.DB_NAME?.trim();

  if (!host || !user || !database) {
    return null;
  }

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function queryDb<T = unknown>(sql: string, params: unknown[] = []) {
  const connection = await getDbConnection();
  if (!connection) {
    return null;
  }

  try {
    const [rows] = await connection.execute(sql, params as never);
    return rows as T;
  } catch (error) {
    console.error("[queryDb] database query failed:", error);
    return null;
  }
}
