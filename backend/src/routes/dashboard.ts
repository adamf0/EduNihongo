import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken as any, getDashboardData);

export default router;
