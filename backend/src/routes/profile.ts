import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile";
import { authenticateToken } from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads folder exists at backend root (next to src)
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine - secure filename generation to prevent RCE & directory traversal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure randomized filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

// File validation helper
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 1. Strict Mime Type check
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Hanya file gambar (.jpg, .jpeg, .png) yang diperbolehkan."));
  }

  // 2. Strict Extension check
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Ekstensi file tidak valid. Hanya .jpg, .jpeg, .png yang diperbolehkan."));
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.get("/", authenticateToken as any, getProfile);

// Profile update accepts optional single multipart file upload under key "avatarFile"
router.put(
  "/",
  authenticateToken as any,
  (req: any, res: any, next: any) => {
    upload.single("avatarFile")(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "Ukuran file terlalu besar. Maksimal 5MB." });
        }
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  updateProfile
);

export default router;
