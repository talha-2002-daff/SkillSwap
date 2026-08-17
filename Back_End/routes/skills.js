const express = require("express");
const router = express.Router();

const db = require("../config/db");


router.get("/", (req, res) => {

    const sql = "SELECT * FROM skills";

    db.query(sql, (err, results) => {

        if (err) {

            console.log("Error fetching skills:", err);

            return res.status(500).json({
                message: "Failed to fetch skills"
            });
        }

        res.json(results);
    });
});


module.exports = router;