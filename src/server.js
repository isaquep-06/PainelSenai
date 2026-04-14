import express from 'express';
import DatabaseConfig from './database/index.js';
import turmaRoutes from './routes/turmaRoutes.js';
import salaRoutes from './routes/salaRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

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
app.use('/dashboard', dashboardRoutes);

// servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000 🟢🟢'));