import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // definir en .env

// Login
export const loginUser = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Vary", "Origin");
  console.log(">> Prisma ve DATABASE_URL:", process.env.DATABASE_URL);

  const { username, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Password incorrecto" });
    }

    const token = jwt.sign({ id: user.id, tipo: user.tipo }, JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token, username: user.username, tipo: user.tipo });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ error: err.message || "Error en login" });
  }
};


// Registro de usuario → solo Admin
export const registerUser = async (req, res) => {
  const { username, password, tipo } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const nuevo = await prisma.usuario.create({
      data: { username, password: hashed, tipo },
    });
    res.status(201).json({ message: "Usuario creado", usuario: nuevo.username });
  } catch (err) {
    res.status(400).json({ error: "Error al crear usuario (posible duplicado)" });
  }
};
