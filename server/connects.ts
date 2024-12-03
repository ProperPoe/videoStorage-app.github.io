import mysql2, { Pool, PoolConnection } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let dbConfig: mysql2.PoolOptions;

// if (process.env.JAWSDB_URL) {
//   // The JAWSDB_URL provided by Heroku
//   dbConfig = {
//     connectionLimit: 10,
//     host: process.env.DB_PRODUCTION_HOST,
//     user: process.env.DB_PRODUCTION_USER,
//     password: process.env.DB_PRODUCTION_PASSWORD,
//     database: process.env.DB_PRODUCTION_NAME,
//     port: process.env.DB_PRODUCTION_PORT ? parseInt(process.env.DB_PRODUCTION_PORT) : 3306,
//   };
// } else {
//   // Local development environment variables
//   dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: 3306,
//   };
// }

if (process.env.DB_AWS_HOST) {
  // The JAWSDB_URL provided by Heroku
  dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_AWS_HOST,
    user: process.env.DB_AWS_USER,
    password: process.env.DB_AWS_PASSWORD,
    database: process.env.DB_AWS_NAME,
    port: process.env.DB_PRODUCTION_PORT ? parseInt(process.env.DB_PRODUCTION_PORT) : 3306,
  };
} else {
  // Local development environment variables
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  };
}

// MySQL connection pool
const pool: Pool = mysql2.createPool(dbConfig);

pool.getConnection()
  .then((connection: PoolConnection) => {
    console.log("Connected to the database as ID " + connection.threadId);

    // Release the connection back to the pool when done
    connection.release();
  })
  .catch((err: mysql2.QueryError) => {
    console.error("Error getting connection from pool: " + err.stack);
  });

// Export the pool for use in your application
export default pool;
