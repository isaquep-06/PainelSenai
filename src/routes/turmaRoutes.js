import express from 'express'
import TurmaController from '../controllers/TurmaController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

// Rotas publicas 🔷

// Listar turmas -> GET 🔸
router.get('/', TurmaController.index);

// Proteção -> Apenas com login!! > || Tudo abaixo! || <
router.use(authMiddleware)

// Rotas com proteção 🔷

// Deletar turma -> DELETE 🔸
router.delete('/deletar-turma/:id', TurmaController.delete)

// Atualizar turma -> PUT 🔸
router.put('/atualizar-turma/:id', TurmaController.update)

// Criar turma -> POST 🔸
router.post('/criar-turma', TurmaController.store);

export default router