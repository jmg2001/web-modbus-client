const express = require("express");
const http = require("http");
const { initWebSocketServer } = require("./backend/ws-server");
const cors = require("cors");

const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

// CREATE Web Socket
const server = http.createServer(expressApp);
initWebSocketServer(server);

// RUN Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Ready on http://localhost:${PORT}`);
});
