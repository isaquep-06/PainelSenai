import express from 'express';
import SalaController from '../controllers/SalaController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

// Rotas publicas 🔷

// Listar salas -> GET 🔸
router.get('/', SalaController.index);

// Proteção -> Apenas com login!! > || Tudo abaixo! || <
router.use(authMiddleware)

// Rotas com proteção 🔷

// Listar salas disponiveis 🔸 -> GET
router.get('/disponiveis', SalaController.disponiveis);

// Atualizar salas -> PUT 🔸
router.put('/atualizar-sala/:id', SalaController.update)

// Deletar sala -> DELETE 🔸
router.delete('/deletar-sala/:id', SalaController.delete)

// Criar sala -> POST 🔸
router.post('/', SalaController.store);


export default router;