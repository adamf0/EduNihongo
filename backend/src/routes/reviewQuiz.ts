import { Router } from "express";
import {
  getReviewQuizzes,
  getReviewQuizDetail,
  submitReviewQuiz,
  saveReviewQuizProgress,
  resetReviewQuizProgress,
  adminGetReviewQuizzes,
  adminSaveReviewQuiz,
  adminDeleteReviewQuiz,
  adminGetReviewQuizScoreReport,
} from "../controllers/reviewQuiz";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Admin endpoints (placed first to prevent any param collision)
router.get("/admin/score-report", authenticateToken as any, adminGetReviewQuizScoreReport);
router.get("/admin/list", authenticateToken as any, adminGetReviewQuizzes);
router.post("/admin/save", authenticateToken as any, adminSaveReviewQuiz);
router.delete("/admin/:id", authenticateToken as any, adminDeleteReviewQuiz);

// Student / Public authenticated endpoints
router.get("/", authenticateToken as any, getReviewQuizzes);
router.get("/:id", authenticateToken as any, getReviewQuizDetail);
router.post("/:id/submit", authenticateToken as any, submitReviewQuiz);
router.post("/:id/progress", authenticateToken as any, saveReviewQuizProgress);
router.delete("/:id/progress", authenticateToken as any, resetReviewQuizProgress);

export default router;
