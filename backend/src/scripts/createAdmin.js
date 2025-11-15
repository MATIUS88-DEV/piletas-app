import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "../../.env.development") });

const prisma = new PrismaClient();

const run = async () => {
  try {
    const hashed = await bcrypt.hash("1234", 10);
    const user = await prisma.usuario.create({
      data: {
        username: "admin",
        password: hashed,
        tipo: "admin",
      },
    });
    console.log("✅ Usuario admin creado:", user);
  } catch (err) {
    console.error("❌ Error al crear admin:", err);
  } finally {
    await prisma.$disconnect();
  }
};

run();
