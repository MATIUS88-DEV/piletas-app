import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "../../.env.development") });

// Inicializar Prisma
const prisma = new PrismaClient();

async function main() {
  try {
    const socio1 = await prisma.socio.create({
      data: {
        nrsocio: "001",
        nombre: "Juan",
        apellido: "Pérez",
        dni: "12345678",
        tipo: "Regular",
        estado: "Activo",
      },
    });

    const socio2 = await prisma.socio.create({
      data: {
        nrsocio: "002",
        nombre: "María",
        apellido: "Gómez",
        dni: "87654321",
        tipo: "VIP",
        estado: "Activo",
      },
    });

    console.log("✅ Socios creados:", socio1, socio2);
  } catch (error) {
    console.error("❌ Error al crear socios:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
