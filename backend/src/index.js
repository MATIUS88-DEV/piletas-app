/**
 * index.js — punto de entrada del backend.
 * Inicia Express, carga variables de entorno y conecta Prisma.
 * Versión corregida para que Prisma lea DATABASE_URL correctamente.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- Configuración de __dirname y path (para ES Modules) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cargar dotenv antes de importar Prisma ---
// Selecciona el .env según NODE_ENV
const envPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../.env.production")
    : path.join(__dirname, "../.env.development");

// ⚠️ dotenv debe ejecutarse antes de importar Prisma
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("❌ Error cargando archivo .env:", result.error);
  process.exit(1);
}

console.log(`✅ Entorno: ${process.env.NODE_ENV || "development"}`);
console.log(`📦 DATABASE_URL: ${process.env.DATABASE_URL ? "Cargada" : "NO CARGADA"}`);

// --- Importar Prisma después de cargar dotenv ---
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// --- Inicializar Express ---
const app = express();
app.use(cors());
app.use(express.json());

// --- Rutas ---
import sociosRouter from "./routes/socios.js";
app.use("/api/socios", sociosRouter);

// --- Endpoint base ---
app.get("/", (req, res) => {
  res.json({ message: "API funcionando", env: process.env.NODE_ENV });
});

// --- Levantar servidor ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
