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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/latihan", latihanRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/profile", profileRoutes);

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
