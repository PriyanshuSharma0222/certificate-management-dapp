import express from "express";
import {
  getDocumentStructureHandler,
} from "../../services/api/index.js";

const router = express.Router();

router.get("/document-structure", async (req, res) => {
  console.log("call at /document-structure");
  
  await getDocumentStructureHandler(req, res);
});

export default router;
