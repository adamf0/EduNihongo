import { Router } from "express";
import { getModulesData } from "../controllers/modules";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken as any, getModulesData);

export default router;
