const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.post("/", (req, res) => {

    const { sender_id,receiver_id,skill_id,message } = req.body;

    if (!sender_id || !receiver_id || !skill_id) {

        return res.status(400).json({
            message: "sender_id, receiver_id and skill_id are required"
        });
    }

    if (Number(sender_id) === Number(receiver_id)) {

        return res.status(400).json({
            message: "Nijeke nije daw hea?"
        });
    }

    const checkSql = `
        SELECT id
        FROM swap_requests
        WHERE sender_id = ?
        AND receiver_id = ?
        AND skill_id = ?
        AND status = 'pending'
    `;


    db.query(
        checkSql,
        [sender_id, receiver_id, skill_id],
        (err, results) => {

            if (err) {

                console.log(
                    "Error checking existing swap request:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to check existing swap request"
                });
            }

            if (results.length > 0) {

                return res.status(409).json({
                    message: "You already have a pending swap request for this skill."
                });
            }

            const sql = `
                INSERT INTO swap_requests
                (sender_id, receiver_id, skill_id, message, status)
                VALUES (?, ?, ?, ?, 'pending')
            `;


            db.query(
                sql,
                [
                    sender_id,
                    receiver_id,
                    skill_id,
                    message || null
                ],
                (err, result) => {

                    if (err) {

                        console.log(
                            "Error creating swap request:",
                            err
                        );

                        return res.status(500).json({
                            message: "Failed to create swap request"
                        });
                    }

                    res.status(201).json({

                        message:
                            "Swap request sent successfully",

                        id: result.insertId

                    });

                }
            );
        }
    );
});


router.get("/", (req, res) => {

    const sql = `
        SELECT 
            sr.id,
            sr.sender_id,
            sender.name AS sender_name,
            sr.receiver_id,
            receiver.name AS receiver_name,
            sr.skill_id,
            s.skill_name,
            sr.message,
            sr.status,
            sr.created_at

        FROM swap_requests sr

        JOIN users AS sender
            ON sr.sender_id = sender.id

        JOIN users AS receiver
            ON sr.receiver_id = receiver.id

        JOIN skills AS s
            ON sr.skill_id = s.id

        ORDER BY sr.id DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.log(
                "Error fetching swap requests:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch swap requests"
            });
        }


        res.json(results);

    });
});


router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            swap_requests.id,
            swap_requests.sender_id,
            sender.name AS sender_name,
            swap_requests.receiver_id,
            receiver.name AS receiver_name,
            swap_requests.skill_id,
            skills.skill_name,
            swap_requests.message,
            swap_requests.status,
            swap_requests.created_at

        FROM swap_requests

        JOIN users AS sender
            ON swap_requests.sender_id = sender.id

        JOIN users AS receiver
            ON swap_requests.receiver_id = receiver.id

        JOIN skills
            ON swap_requests.skill_id = skills.id

        WHERE swap_requests.sender_id = ?
           OR swap_requests.receiver_id = ?

        ORDER BY swap_requests.created_at DESC
    `;


    db.query(
        sql,
        [userId, userId],
        (err, results) => {

            if (err) {

                console.log(
                    "Error fetching swap requests:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch swap requests"
                });
            }


            res.json(results);

        }
    );
});



router.put("/:id", (req, res) => {

    const requestId = req.params.id;

    const { status } = req.body;

    if (
        status !== "accepted" &&
        status !== "rejected"
    ) {

        return res.status(400).json({
            message:
                "Status must be either accepted or rejected"
        });
    }


    const sql = `
        UPDATE swap_requests
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [status, requestId],
        (err, result) => {

            if (err) {

                console.log(
                    "Error updating swap request:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to update swap request"
                });
            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Swap request not found"
                });
            }


            res.json({

                message:
                    `Swap request ${status} successfully`

            });

        }
    );
});


module.exports = router;