import { Router } from "express";
import { getProgressData } from "../controllers/progress";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken as any, getProgressData);

export default router;
