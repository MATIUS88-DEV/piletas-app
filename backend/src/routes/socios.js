/**
 * Rutas de Socios — gestiona endpoints de la tabla Socios.
 * Importa la lógica desde el controlador.
 */
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getSocios,
  getSocioById,
  createSocio,
  updateSocio,
  softDeleteSocio
} from "../controllers/sociosController.js";

const router = express.Router();

// GET /api/socios → listar socios con filtros opcionales
router.get("/", authMiddleware, getSocios);

// GET /api/socios/:nrsocio → obtener un socio por ID
router.get("/:nrsocio",authMiddleware, getSocioById);

// POST /api/socios → crear nuevo socio
router.post("/",authMiddleware, createSocio);

// PUT /api/socios/:nrsocio → actualizar socio
router.put("/:nrsocio",authMiddleware, updateSocio);

// PATCH /api/socios/:nrsocio/estado → baja lógica
router.patch("/:nrsocio/estado",authMiddleware, softDeleteSocio);

export default router;
