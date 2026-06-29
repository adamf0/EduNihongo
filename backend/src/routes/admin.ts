import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  getKanjis,
  createKanji,
  updateKanji,
  deleteKanji
} from "../controllers/admin";

const router = Router();

// Apply auth middleware to protect admin endpoints
router.use(authenticateToken);

router.get("/modules", getModules);
router.post("/modules", createModule);
router.put("/modules/:id", updateModule);
router.delete("/modules/:id", deleteModule);

router.get("/kanjis", getKanjis);
router.post("/kanjis", createKanji);
router.put("/kanjis/:id", updateKanji);
router.delete("/kanjis/:id", deleteKanji);

export default router;
