// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();
let db = null;

// if (process.env.NODE_ENV == "production"){
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            rejectUnauthorized: true
        }
    });
// } else{
//     db = mysql.createPool({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         database: process.env.DB_NAME
//     })
// }


console.log("database is connected")

module.exports = db;