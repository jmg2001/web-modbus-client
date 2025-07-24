import { WebSocketServer } from "ws";
import { registerWebSocketClient } from "./modbusClient.js";

export function initWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("✅ Cliente WebSocket conectado");
    registerWebSocketClient(ws);
  });
}
