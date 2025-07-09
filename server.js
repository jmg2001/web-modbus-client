const express = require("express");
const next = require("next");
const http = require("http");
const {
  connectModbus,
  setRetention,
  closeClient,
} = require("./backend/modbus-client");
const { initWebSocketServer } = require("./backend/ws-server");
const cors = require("cors");
const { config } = require("process");

const app = next({ dev: true, dir: "./src" });

app.prepare().then(() => {
  const expressApp = express();
  expressApp.use(express.json());
  expressApp.use(cors());

  expressApp.post("/api/connect-modbus", async (req, res) => {
    const { ip, port, interval, tags, retentionMinutes } = req.body;
    console.log(req.body);
    try {
      await connectModbus({ ip, port, interval, tags });
      setRetention(retentionMinutes || 5);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error Modbus:", err);
      res.status(500).json({ error: err.message });
    }
  });

  expressApp.post("/api/disconnect-modbus", async (req, res) => {
    try {
      await closeClient();
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  expressApp.post("/api/status-modbus", async (req, res) => {
    if (config.connected) res.status(200);
    else res.status(500);
  });

  const server = http.createServer(expressApp);
  initWebSocketServer(server);

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`✅ Ready on http://localhost:${PORT}`);
  });
});
