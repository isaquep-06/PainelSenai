import DashboardController from "../controllers/DashboardController.js";
import express from "express";

const router = express.Router();

router.get('/', DashboardController.index);

export default router;
