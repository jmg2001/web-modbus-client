const express = require("express");
const http = require("http");
const {
  connectModbus,
  setRetention,
  closeClient,
} = require("./backend/modbus-client");
const { initWebSocketServer } = require("./backend/ws-server");
const cors = require("cors");

const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

// POST Connect Modbus Server
expressApp.post("/api/connect-modbus", async (req, res) => {
  const { ip, port, interval, registers, retentionMinutes } = req.body;
  try {
    await connectModbus({ ip, port, interval, registers });
    setRetention(retentionMinutes || 5);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error Modbus:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST Disconnect Modbus Server
expressApp.post("/api/disconnect-modbus", async (req, res) => {
  try {
    await closeClient();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE Web Socket
const server = http.createServer(expressApp);
initWebSocketServer(server);

// RUN Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Ready on http://localhost:${PORT}`);
});
