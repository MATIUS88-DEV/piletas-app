import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/register → solo Admin puede crear usuarios
router.post("/register", authMiddleware, adminMiddleware, registerUser);

export default router;