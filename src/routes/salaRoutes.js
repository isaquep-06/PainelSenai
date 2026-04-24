import express from 'express';
import SalaController from '../controllers/SalaController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/', SalaController.index);

router.use(authMiddleware)

router.get('/disponiveis', SalaController.disponiveis);
router.put('/atualizar-sala/:id', SalaController.update)
router.delete('/deletar-sala/:id', SalaController.delete)
router.post('/', SalaController.store);

export default router;
