import express from "express";
import cors from "cors";
import http from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { initWebSocketServer } from "./webSocket.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "../client/dist")));

// CREATE Web Socket
const server = http.createServer(app);
initWebSocketServer(server);

// RUN Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Ready on http://localhost:${PORT}`);
});
