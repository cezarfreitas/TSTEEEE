import mysql from "mysql2/promise"

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`)
  }
  return value
}

const connectionConfig = {
  host: requireEnv("MYSQL_HOST", MYSQL_HOST),
  port: Number(MYSQL_PORT ?? 3306),
  user: requireEnv("MYSQL_USER", MYSQL_USER),
  password: requireEnv("MYSQL_PASSWORD", MYSQL_PASSWORD),
  database: requireEnv("MYSQL_DATABASE", MYSQL_DATABASE),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
}

const pool = mysql.createPool(connectionConfig)

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database operation failed")
  }
}

export async function executeTransaction<T>(queries: Array<{ query: string; params: any[] }>): Promise<T[]> {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const results: T[] = []
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params)
      results.push(rows as T)
    }

    await connection.commit()
    return results
  } catch (error) {
    await connection.rollback()
    console.error("Transaction error:", error)
    throw new Error("Transaction failed")
  } finally {
    connection.release()
  }
}

export { pool }
