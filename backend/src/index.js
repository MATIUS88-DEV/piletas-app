/**
 * index.js — versión con CORS forzado compatible con Codespaces.
 * Responde correctamente a preflight y evita bloqueos.
 */

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import sociosRouter from "./routes/socios.js";

// --- Configuración de __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cargar dotenv ---
if (!process.env.RENDER) {
  const envPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../.env.production")
      : path.join(__dirname, "../.env.development");
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
console.log("DATABASE_URL actual:", process.env.DATABASE_URL);
// 🧩 CORS forzado (antes de rutas)
// --- CORS FIX TOTAL PARA FIREFOX + GITHUB CODESPACES ---
app.use((req, res, next) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    "https://special-zebra-x5gjvr975jqr3j9g-3000.app.github.dev",
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});


// --- Debug de origen ---
app.use((req, _, next) => {
  console.log(`🌐 ${req.method} ${req.url} desde ${req.headers.origin || "N/A"}`);
  next();
});

// --- Rutas ---
app.use("/api/auth", authRouter);
app.use("/api/socios", sociosRouter);

// --- Root ---
app.get("/", (req, res) => {
  res.json({ message: "API funcionando", env: process.env.NODE_ENV });
});

// --- Servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
