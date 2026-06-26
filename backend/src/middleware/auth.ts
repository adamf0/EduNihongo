import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }

  try {
    const secret = process.env.JWT_SECRET || "super-secret-kanjigraph-key-12345";
    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token tidak valid atau kedaluwarsa." });
  }
};
