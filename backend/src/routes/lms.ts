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
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `lms-${uniqueSuffix}${ext}`);
  }
});

// File validation helper
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    return cb(new Error("File tidak valid. Hanya gambar, PDF, Word, atau Teks yang diperbolehkan."));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Apply authentication middleware to all LMS routes
router.use(authenticateToken);

// Assignments CRUD
router.get("/assignments", getAssignments);
router.post("/assignments", upload.single("materialFile"), createAssignment);
router.put("/assignments/:id", upload.single("materialFile"), updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

// Submissions
router.get("/submissions", getSubmissions);
router.post("/submissions", upload.single("submissionFile"), submitAssignment);
router.put("/submissions/:id/grade", gradeSubmission);

// Comments / Discussions
router.get("/comments", getComments);
router.post("/comments", createComment);
router.delete("/comments/:id", deleteComment);

export default router;
