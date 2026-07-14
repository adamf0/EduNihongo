import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getSubmissions,
  submitAssignment,
  gradeSubmission,
  getComments,
  createComment,
  deleteComment
} from "../controllers/lms";

const router = Router();

// Apply authentication middleware to all LMS routes
router.use(authenticateToken);

// Assignments CRUD
router.get("/assignments", getAssignments);
router.post("/assignments", createAssignment);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

// Submissions
router.get("/submissions", getSubmissions);
router.post("/submissions", submitAssignment);
router.put("/submissions/:id/grade", gradeSubmission);

// Comments / Discussions
router.get("/comments", getComments);
router.post("/comments", createComment);
router.delete("/comments/:id", deleteComment);

export default router;
