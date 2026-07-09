// Force restart dev server to reload Prisma Client 5
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import moduleRoutes from "./routes/modules";
import latihanRoutes from "./routes/latihan";
import progressRoutes from "./routes/progress";
import profileRoutes from "./routes/profile";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Strict CORS Allowed Origins (only allow requests from trusted frontend locations)
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://kanji.fishiden.com",
];

// Strict HOST Header validation to prevent Host Header Injection attacks
const ALLOWED_HOSTS = [
  "localhost:5001",
  "127.0.0.1:5001",
  "kanji.fishiden.com",
];

// Disable trust proxy so Express ignores X-Forwarded-Host, X-Forwarded-For, etc.
app.set("trust proxy", false);

// Middleware
app.use((req, res, next) => {
  const host = req.headers.host;
  if (!host || !ALLOWED_HOSTS.includes(host)) {
    return res.status(400).json({ error: "Akses Ditolak: Header Host tidak valid." });
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Akses ditolak oleh kebijakan CORS."), false);
  },
  credentials: true,
}));

app.use(express.json());

// Serve uploaded static images (RCE prevention: files are served statically and never executed)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/latihan", latihanRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

// Serve Swagger Documentation
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../swagger.html"));
});

// Basic test endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Terjadi kesalahan internal server" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
});

export default app;
