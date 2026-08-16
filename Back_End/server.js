const express = require("express");
const cors = require("cors");

const app = express();



const usersRoutes = require("./routes/users");
const skillsRoutes = require("./routes/skills");
const userSkillsRoutes = require("./routes/userSkills");
const swapRequestsRoutes = require("./routes/swapRequests");



app.use(cors());

app.use(express.json());




app.get("/", (req, res) => {

    res.json({
        message: "SkillSwap Backend is Running!"
    });

});


app.use("/api/users", usersRoutes);

app.use("/api/skills", skillsRoutes);

app.use("/api/user-skills", userSkillsRoutes);

app.use("/api/swap-requests", swapRequestsRoutes);



app.listen(5000, () => {

    console.log("---------------------------------");
    console.log("SkillSwap Backend");
    console.log("Server running on port 5000");
    console.log("---------------------------------");

});