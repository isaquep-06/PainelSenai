import express from 'express'
import TurmaController from '../controllers/TurmaController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/', TurmaController.index);

router.use(authMiddleware)

router.delete('/deletar-turma/:id', TurmaController.delete)
router.put('/atualizar-turma/:id', TurmaController.update)
router.post('/criar-turma', TurmaController.store);

export default router
