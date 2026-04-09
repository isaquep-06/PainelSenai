import express from 'express';
import DatabaseConfig from './database/index.js';
import turmaRoutes from './routes/turmaRoutes.js'; // <-- import em vez de require
import salaRoutes from './routes/salaRoutes.js'
import userRoutes from './routes/userRoutes.js'

import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());

// rota raiz
app.get('/', (req, res) => res.send('Servidor rodando! 🔥🔥'));

// suas rotas
app.use('/turma', turmaRoutes);
app.use('/sala', salaRoutes);
app.use('/user', userRoutes);

// servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000 🟢🟢'));