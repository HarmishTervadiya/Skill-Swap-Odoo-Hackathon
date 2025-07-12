import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import userRoutes from "./routes/user.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import { optionalAuth } from "./middlewares/auth.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use(optionalAuth)

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/skills", skillRoutes);

// Health check route
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Skill Swap Platform API is running",
        timestamp: new Date().toISOString()
    });
});

// 404 handler
// app.use("*", (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: "Route not found"
//     });
// });


export {app};