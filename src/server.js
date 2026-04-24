import express from "express";
import http from "http";
import { Server } from "socket.io";

import DatabaseConfig from "./database/index.js";
import turmaRoutes from "./routes/turmaRoutes.js";
import salaRoutes from "./routes/salaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

export { io };

app.get("/", (req, res) => res.send("Servidor rodando!"));

app.use("/turma", turmaRoutes);
app.use("/sala", salaRoutes);
app.use("/user", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/upload", uploadRoutes);

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
