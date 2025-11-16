import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/register → solo Admin puede crear usuarios
router.post("/register", authMiddleware, adminMiddleware, registerUser);

// ✅ NUEVO: validar token
router.get("/validate", authMiddleware, (req, res) => {
  // Si llega acá, el token ya fue validado por authMiddleware (incluye expiración)
  return res.json({
    valid: true,
    user: req.user,
  });
});

export default router;