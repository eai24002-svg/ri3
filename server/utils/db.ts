import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export const getDbPool = () => {
  if (pool) {
    return pool
  }

  const config = useRuntimeConfig()

  pool = mysql.createPool({
    host: config.mysqlHost,
    port: config.mysqlPort,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: true
  })

  return pool
}

export const queryRows = async <T>(sql: string, params: Record<string, unknown> = {}) => {
  const [rows] = await getDbPool().query(sql, params as any)
  return rows as T[]
}

export const queryFirst = async <T>(sql: string, params: Record<string, unknown> = {}) => {
  const rows = await queryRows<T>(sql, params)
  return rows[0] || null
}

export const executeWrite = async (sql: string, params: Record<string, unknown> = {}) => {
  const [result] = await getDbPool().execute(sql, params as any)
  return result as mysql.ResultSetHeader
}
