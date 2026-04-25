import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import "./database/index.js";
import turmaRoutes from "./routes/turmaRoutes.js";
import salaRoutes from "./routes/salaRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://painel-senai-frontend.vercel.app"
];

const corsOriginValidator = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("CORS origin not allowed"));
};

app.use(cors({
  origin: corsOriginValidator,
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
