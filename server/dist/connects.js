"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let dbConfig;
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
}
else {
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
const pool = promise_1.default.createPool(dbConfig);
pool.getConnection()
    .then((connection) => {
    console.log("Connected to the database as ID " + connection.threadId);
    // Release the connection back to the pool when done
    connection.release();
})
    .catch((err) => {
    console.error("Error getting connection from pool: " + err.stack);
});
// Export the pool for use in your application
exports.default = pool;
