import mysql2 from "mysql2";
import dotenv from "dotenv"

dotenv.config();

const port = process.env.DB_PRODUCTION_PORT ? parseInt(process.env.DB_PRODUCTION_PORT) : 3306;

export const db = mysql2.createConnection({
    host: process.env.DB_PRODUCTION_HOST,
    user: process.env.DB_PRODUCTION_USER,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_NAME,
    port: port,
})