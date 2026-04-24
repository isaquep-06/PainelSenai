import express from "express";
import upload from "../Middleware/upload.js";
import UploadController from "../controllers/UploadController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  UploadController.upload
);

router.get("/", UploadController.getAll);
router.put("/:id/status", UploadController.updateStatus);
router.delete("/:id", UploadController.delete);

export default router;
