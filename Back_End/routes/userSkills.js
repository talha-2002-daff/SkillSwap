const express = require("express");
const router = express.Router();

const db = require("../config/db");


router.get("/", (req, res) => {

    const sql = `
        SELECT 
            user_skills.id,
            user_skills.user_id,
            users.name AS user_name,
            user_skills.skill_id,
            skills.skill_name,
            user_skills.skill_type
        FROM user_skills
        JOIN users 
            ON user_skills.user_id = users.id
        JOIN skills 
            ON user_skills.skill_id = skills.id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Error fetching user skills:", err);

            return res.status(500).json({
                message: "Failed to fetch user skills"
            });
        }

        res.json(results);
    });
});


router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT 
            user_skills.id,
            user_skills.user_id,
            users.name AS user_name,
            user_skills.skill_id,
            skills.skill_name,
            user_skills.skill_type
        FROM user_skills
        JOIN users 
            ON user_skills.user_id = users.id
        JOIN skills 
            ON user_skills.skill_id = skills.id
        WHERE user_skills.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log("Error fetching user's skills:", err);

            return res.status(500).json({
                message: "Failed to fetch user's skills"
            });
        }

        res.json(results);
    });
});


router.post("/", (req, res) => {

    const { user_id, skill_id, skill_type } = req.body;


    if (!user_id || !skill_id || !skill_type) {

        return res.status(400).json({
            message: "user_id, skill_id and skill_type are required"
        });
    }


    if (skill_type !== "teach" && skill_type !== "learn") {

        return res.status(400).json({
            message: "skill_type must be either teach or learn"
        });
    }


    const checkSql = `
        SELECT 
            user_skills.id,
            skills.skill_name,
            user_skills.skill_type
        FROM user_skills
        JOIN skills
            ON user_skills.skill_id = skills.id
        WHERE user_skills.user_id = ?
        AND user_skills.skill_id = ?
        AND user_skills.skill_type = ?
    `;


    db.query(
        checkSql,
        [user_id, skill_id, skill_type],
        (err, results) => {

            if (err) {

                console.log(
                    "Error checking existing user skill:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to check existing skill"
                });
            }
            if (results.length > 0) {

                return res.status(409).json({

                    message:
                        `You already added ${results[0].skill_name} ` +
                        `as a skill you ${skill_type}.`

                });
            }


            

            const insertSql = `
                INSERT INTO user_skills
                (user_id, skill_id, skill_type)
                VALUES (?, ?, ?)
            `;


            db.query(
                insertSql,
                [user_id, skill_id, skill_type],
                (err, result) => {

                    if (err) {

                        console.log(
                            "Error adding user skill:",
                            err
                        );

                        return res.status(500).json({
                            message: "Failed to add user skill"
                        });
                    }


                    
                    

                    res.status(201).json({

                        message: "Skill added successfully",

                        id: result.insertId

                    });

                }
            );

        }
    );

});

router.delete("/:id", (req, res) => {

    const userSkillId = req.params.id;


    const sql = `
        DELETE FROM user_skills
        WHERE id = ?
    `;


    db.query(
        sql,
        [userSkillId],
        (err, result) => {

            if (err) {

                console.log(
                    "Error deleting user skill:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to delete user skill"
                });
            }



            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "User skill not found"
                });
            }


           

            res.json({
                message: "User skill deleted successfully"
            });

        }
    );

});


module.exports = router;