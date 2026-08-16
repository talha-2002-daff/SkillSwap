const express = require("express");
const router = express.Router();

const db = require("../config/db");



router.get("/", (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            bio,
            created_at
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log("Error fetching users:", err);

            return res.status(500).json({
                message: "Failed to fetch users",
                error: err.message
            });
        }

        res.json(results);
    });

});


router.get("/:id", (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            id,
            name,
            email,
            bio,
            created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.log("Error fetching user:", err);

            return res.status(500).json({
                message: "Failed to fetch user",
                error: err.message
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(results[0]);
    });

});



router.post("/register", (req, res) => {

   

    const {
        name,
        email,
        password,
        bio
    } = req.body;


    console.log("Name:", name);
    console.log("Email:", email);

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    const checkSql = `
        SELECT id
        FROM users
        WHERE email = ?
    `;

    db.query(
        checkSql,
        [email],
        (err, results) => {

            if (err) {

              
                console.log("Database error");
                console.log("error code:", err.code);
                console.log("Erroer message:", err.message);
               

                return res.status(500).json({
                    message: "Registration failed",
                    error: err.message
                });
            }


            if (results.length > 0) {

                console.log("Email already exists:", email);

                return res.status(400).json({
                    message: "Email already registered"
                });
            }



            const insertSql = `
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    bio
                )
                VALUES (?, ?, ?, ?)
            `;


            console.log("Creating new user...");


            db.query(
                insertSql,
                [
                    name,
                    email,
                    password,
                    bio || null
                ],
                (err, result) => {

                    if (err) {

                     
                        console.log("Database error");
                        console.log("Error code", err.code);
                        console.log("error mesage:", err.message);
                        
                       

                        return res.status(500).json({
                            message: "Registration failed",
                            error: err.message
                        });
                    }


                    console.log("User created successfully!");
                    console.log("New User ID:", result.insertId);
                  


                    res.status(201).json({

                        message: "Registration successful",

                        userId: result.insertId

                    });

                }
            );

        }
    );

});



router.post("/login", (req, res) => {

    
    console.log("Ke jani login korte chay");
    


    const {
        email,
        password
    } = req.body;


    
    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required"
        });
    }


    const sql = `
        SELECT
            id,
            name,
            email,
            bio
        FROM users
        WHERE email = ?
        AND password = ?
    `;


    db.query(
        sql,
        [
            email,
            password
        ],
        (err, results) => {

            if (err) {

                
                console.log("DB error during login");
                console.log("Error code is:", err.code);
              
                

                return res.status(500).json({
                    message: "Login failed",
                    error: err.message
                });
            }


            

            if (results.length === 0) {

                console.log("Invalid login attempt:", email);

                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }



            console.log("Login successful:", email);


            res.json({

                message: "Login successful",

                user: results[0]

            });

        }
    );

});



module.exports = router;