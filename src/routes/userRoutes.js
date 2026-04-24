import express from 'express';
import UserController from '../controllers/UserController.js';
import SessionController from '../controllers/SessionController.js';

const router = express.Router();

router.post('/', UserController.store);
router.post('/login', SessionController.store);

export default router;
