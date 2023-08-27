import mysql from "mysql2";


export const db = mysql.createConnection({
    host: "10.0.0.93",
    user: "proper",
    password: "5030Steves#Database?",
    database: "video_storage",
    port: 3306,
})