import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken as any, getProfile);
router.put("/", authenticateToken as any, updateProfile);

export default router;
