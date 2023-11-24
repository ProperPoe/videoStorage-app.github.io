import mysql2 from "mysql2/promise";
import dotenv from "dotenv"
import { createPool } from "mysql2";

dotenv.config();
let dbConfig;

let pool;

if (process.env.JAWSDB_URL) {
  // the JAWSDB_URL provided by Heroku
  pool = mysql2.createPool(process.env.JAWSDB_URL);
} else {
  // local development environment variables
  pool = mysql2.createPool({
    host: process.env.DB_PRODUCTION_HOST,
    user: process.env.DB_PRODUCTION_USER,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_NAME,
    port: process.env.DB_PRODUCTION_PORT ? parseInt(process.env.DB_PRODUCTION_PORT) : 3306,
  });
}

// MySQL connection
// const db = typeof dbConfig === "string" ? mysql2.createConnection(dbConfig) : mysql2.createConnection(dbConfig);

// Connect to the database
pool.getConnection()
  .then((connection) => {
    console.log("Connected to the database as ID " + connection.threadId);
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database: " + err.stack)
  })
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database: " + err.stack);
//     return;
//   }
//   console.log("Connected to the database as ID " + db.threadId);
// });

export default pool;