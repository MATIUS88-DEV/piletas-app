import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Valida que haya un token
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Valida que sea Administrador
export const adminMiddleware = (req, res, next) => {
  if (req.user.tipo !== "Administrador") {
    return res.status(403).json({ error: "Se requiere rol Administrador" });
  }
  next();
};
