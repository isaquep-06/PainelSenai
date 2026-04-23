import express from "express";
import http from "http";
import { Server } from "socket.io";

import DatabaseConfig from "./database/index.js";
import turmaRoutes from "./routes/turmaRoutes.js";
import salaRoutes from "./routes/salaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// cria servidor HTTP
const server = http.createServer(app);

// inicia websocket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// conexão
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// EXPORTA
export { io };

// rota raiz
app.get("/", (req, res) => res.send("Servidor rodando! 🔥🔥"));

// rotas
app.use("/turma", turmaRoutes);
app.use("/sala", salaRoutes);
app.use("/user", userRoutes);
app.use("/dashboard", dashboardRoutes);

// start
server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000 🟢🟢");
});