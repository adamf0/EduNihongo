import { Router } from "express";
import { getKanjiDetail, verifyHandwriting } from "../controllers/latihan";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/:character", authenticateToken as any, getKanjiDetail);
router.post("/verify", authenticateToken as any, verifyHandwriting);

export default router;
