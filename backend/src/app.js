const express = require("express");
const cors = require("cors");

const personRoutes = require("./routes/person.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Follow-Up Manager API is running"
    });
});

app.use("/api/auth", authRoutes);

app.use("/api/people", personRoutes);


module.exports = app;