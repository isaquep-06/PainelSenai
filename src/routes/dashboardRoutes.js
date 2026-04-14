import DashboardController from "../controllers/DashboardController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

// Rotas com proteção 🔷
router.get('/', DashboardController.index);

export default router;