const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Talha@12345",
    database: "skillswap"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:");
        console.log(err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

module.exports = db;