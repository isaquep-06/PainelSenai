import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("🟢 Conectado no servidor:", socket.id);
});

socket.on("dashboard:update", () => {
  console.log("🔥 RECEBI EVENTO DE ATUALIZAÇÃO!");
});