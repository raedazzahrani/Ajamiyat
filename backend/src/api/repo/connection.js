const mysql = require("mysql2/promise");
const api_db_version = "016.20260301110654"; // Update this version when making database schema changes


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000, // 10 seconds
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection established successfully.");
    const [[[result]]] = await connection.query("CALL get_db_version()");
    if(result.version !== api_db_version) {
      throw new Error(`Database version mismatch: expected ${api_db_version}, got ${result.version}`);
    }
    console.log(`Database version ${result.version} is compatible with API version ${api_db_version}.`);
    connection.release();
  } catch (error) {
    throw error; // Rethrow to prevent the application from starting
  }
})();

module.exports = { pool };
