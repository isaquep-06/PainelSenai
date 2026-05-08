import DashboardController from "../controllers/DashboardController.js";
import express from "express";

const router = express.Router();

router.get('/', DashboardController.index);
router.get('/ultima-atualizacao', DashboardController.latestUpdate);

export default router;
