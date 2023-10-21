import mysql2 from "mysql2";
import dotenv from "dotenv"

dotenv.config();
let dbConfig;

if (process.env.JAWSDB_URL) {
  // Use the JAWSDB_URL provided by Heroku
  dbConfig = process.env.JAWSDB_URL;
} else {
  // Use local development environment variables
  dbConfig = {
    host: process.env.DB_PRODUCTION_HOST,
    user: process.env.DB_PRODUCTION_USER,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_NAME,
    port: process.env.DB_PRODUCTION_PORT ? parseInt(process.env.DB_PRODUCTION_PORT) : 3306,
  };
}

// Create a MySQL connection
const db = typeof dbConfig === "string" ? mysql2.createConnection(dbConfig) : mysql2.createConnection(dbConfig);

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database as ID " + db.threadId);
});

export default db;