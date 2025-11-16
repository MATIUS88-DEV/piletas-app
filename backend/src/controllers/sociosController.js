/**
 * Controlador Socios — contiene la lógica de negocio para la tabla Socios.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * GET /api/socios
 * Listar socios filtrando por cualquier campo opcional.
 */
export const getSocios = async (req, res) => {
  try {
    const { nrsocio, nombre, apellido, dni } = req.query;

    const where = {};
    if (nrsocio) where.nrsocio = nrsocio;
    if (nombre) where.nombre = { contains: nombre, mode: "insensitive" };
    if (apellido) where.apellido = { contains: apellido, mode: "insensitive" };
    if (dni) where.dni = dni;

    const socios = await prisma.socio.findMany({
      where,
      include: { cuotas: true },
    });

    res.json(socios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener socios" });
  }
};

/**
 * GET /api/socios/:nrsocio
 * Obtener un socio por su ID.
 */
export const getSocioById = async (req, res) => {
  try {
    const socio = await prisma.socio.findUnique({
      where: { nrsocio: req.params.nrsocio },
      include: { cuotas: true },
    });

    if (!socio) return res.status(404).json({ error: "No encontrado" });

    res.json(socio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar socio" });
  }
};

/**
 * POST /api/socios
 * Crear un nuevo socio (Alta)
 */
export const createSocio = async (req, res) => {
  try {
    const {
      nrsocio,
      nombre,
      apellido,
      dni,
      tipo,
      estado,
      telefono,
      correo,
      aptoMedico,
    } = req.body;

    const nuevo = await prisma.socio.create({
      data: {
        nrsocio,
        nombre,
        apellido,
        dni,
        tipo,
        estado: estado ?? "Activo",
        telefono,
        correo,
        aptoMedico: aptoMedico ?? false,
      },
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al crear socio (posible duplicado)" });
  }
};

/**
 * PUT /api/socios/:nrsocio
 * Actualizar un socio existente.
 * Se limita SOLO a los campos editables en el formulario.
 */
export const updateSocio = async (req, res) => {
  try {
    const { nombre, apellido, dni, telefono, correo, aptoMedico, tipo } = req.body;

    // ⚠️ Solo permitimos actualizar estos campos
    const data = {
      nombre,
      apellido,
      dni,
      telefono,
      correo,
      aptoMedico,
      tipo,
    };

    const actualizado = await prisma.socio.update({
      where: { nrsocio: req.params.nrsocio },
      data,
    });

    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar socio" });
  }
};


/**
 * PATCH /api/socios/:nrsocio/estado
 * Dar de baja lógica a un socio.
 */
export const softDeleteSocio = async (req, res) => {
  try {
    const socio = await prisma.socio.update({
      where: { nrsocio: req.params.nrsocio },
      data: { estado: "Baja" },
    });

    res.json({ message: "Socio dado de baja", socio });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al dar de baja" });
  }
};
