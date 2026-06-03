import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

//import authRoutes from "./modules/auth/auth.routes.js";
import authRoutes
  from "./modules/auth/auth.routes.js";

import memberRoutes from "./modules/members/member.routes.js";

import userRoutes
  from "./modules/users/user.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));



// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Chama API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/users", userRoutes);

export default app;
