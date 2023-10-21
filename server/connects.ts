import mysql from "mysql2";
import dotenv from "dotenv"

dotenv.config();


export const db = mysql.createConnection({
    host: process.env.DB_PRODUCTION_HOST,
    user: process.env.DB_PRODUCTION_USER,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_NAME,
    port: 3306,
})