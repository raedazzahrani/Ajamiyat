const mysql = require("mysql2/promise");
const api_db_version = "021.20260311132211"; // Update this version when making database schema changes

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000, // 10 seconds
};

class Pool {
  constructor(config) {
    this.pool = mysql.createPool(config);
  }

  async query(sql, params) {
    const connection = await this.connect();
    try {
      await this.checkDatabaseVersion(connection);
      const [rows] = await connection.query(sql, params);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async connect() {
    try {
      const connection = await this.pool.getConnection();
      console.log("Database connection established successfully.");
      return connection;
    }
    catch (error) {
      console.error("Failed to establish database connection:");
      throw error; // Rethrow to prevent server from starting
    }
  }

  async checkDatabaseVersion(connection) {
    console.log("Checking database version...");
    const [[[result]]] = await connection.query("CALL get_db_version()");
    if (result.version !== api_db_version) {
      throw new Error(`Database version mismatch: expected ${api_db_version}, got ${result.version}`);
    }
    console.log(`Database version ${result.version} is compatible with API version ${api_db_version}.`);
  }
}

module.exports = { pool: new Pool(connectionConfig) };
