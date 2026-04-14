import express from 'express';
import UserController from '../controllers/UserController.js';
import SessionController from '../controllers/SessionController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

// Rotas publicas 🔷

// Criar usuario -> POST 🔸
router.post('/', UserController.store);

// Login user -> POST 🔸
router.post('/login', SessionController.store);

export default router;