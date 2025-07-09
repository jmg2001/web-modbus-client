const { WebSocketServer } = require("ws");
const { registerWebSocketClient } = require("./modbus-client");

function initWebSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("✅ Cliente WebSocket conectado");
    registerWebSocketClient(ws);
  });
}

module.exports = { initWebSocketServer };
