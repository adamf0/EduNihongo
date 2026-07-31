import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getModules,
  getModuleDetail,
  createModule,
  updateModule,
  deleteModule,
  getKanjis,
  createKanji,
  updateKanji,
  deleteKanji
} from "../controllers/admin";
import {
  getJukugos,
  createJukugo,
  updateJukugo,
  deleteJukugo
} from "../controllers/jukugo";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category";
import {
  getGraphEdges,
  createGraphEdge,
  updateGraphEdge,
  deleteGraphEdge
} from "../controllers/graphEdge";

const router = Router();

// Apply auth middleware to protect admin endpoints
router.use(authenticateToken);

router.get("/modules", getModules);
router.get("/modules/:id", getModuleDetail);
router.post("/modules", createModule);
router.put("/modules/:id", updateModule);
router.delete("/modules/:id", deleteModule);

router.get("/kanjis", getKanjis);
router.post("/kanjis", createKanji);
router.put("/kanjis/:id", updateKanji);
router.delete("/kanjis/:id", deleteKanji);

router.get("/jukugos", getJukugos);
router.post("/jukugos", createJukugo);
router.put("/jukugos/:id", updateJukugo);
router.delete("/jukugos/:id", deleteJukugo);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/graph-edges", getGraphEdges);
router.post("/graph-edges", createGraphEdge);
router.put("/graph-edges/:id", updateGraphEdge);
router.delete("/graph-edges/:id", deleteGraphEdge);

export default router;
