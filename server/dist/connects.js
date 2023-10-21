"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let dbConfig;
if (process.env.JAWSDB_URL) {
    // Use the JAWSDB_URL provided by Heroku
    dbConfig = process.env.JAWSDB_URL;
}
else {
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
const db = typeof dbConfig === "string" ? mysql2_1.default.createConnection(dbConfig) : mysql2_1.default.createConnection(dbConfig);
// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: " + err.stack);
        return;
    }
    console.log("Connected to the database as ID " + db.threadId);
});
exports.default = db;
