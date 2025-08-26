import mysql from "mysql2/promise"

const connectionConfig = {
  host: "server.idenegociosdigitais.com.br",
  port: 3355,
  user: "barbearia",
  password: "5f8dab8402afe2a6e043",
  database: "barbearia-db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
}

// Pool de conexões para melhor performance
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
