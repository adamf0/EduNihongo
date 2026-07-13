import { Router } from "express";
import { getKanjiDetail, verifyHandwriting, verifyReading, verifyQuiz } from "../controllers/latihan";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/:character", authenticateToken as any, getKanjiDetail);
router.post("/verify", authenticateToken as any, verifyHandwriting);
router.post("/verify-reading", authenticateToken as any, verifyReading);
router.post("/verify-quiz", authenticateToken as any, verifyQuiz);

export default router;
