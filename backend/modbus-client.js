const ModbusRTU = require("modbus-serial");
const config = require("./config");

const client = new ModbusRTU();
const subscribers = [];

let intervalId = null;

function setRetention(minutes) {
  config.connection.retentionMinutes = minutes;
}

function broadcast(payload) {
  subscribers.forEach((ws) => {
    if (ws.readyState === 1) ws.send(JSON.stringify(payload));
  });
}

function cleanOldData() {
  const now = Date.now();
  const maxAge = config.connection.retentionMinutes * 60 * 1000;
  for (const key in config.memoryStore) {
    config.memoryStore[key] = config.memoryStore[key].filter(
      (entry) => now - entry.timestamp <= maxAge
    );
  }
}

function registerWebSocketClient(ws) {
  subscribers.push(ws);
  ws.on("close", () => {
    console.log("✅ Cliente WebSocket desconectado");
    const i = subscribers.indexOf(ws);
    if (i !== -1) subscribers.splice(i, 1);
  });
}

async function connectModbus({ ip, port, interval, tags }) {
  if (config.connected) closeClient();

  config.connection = {
    ip,
    port,
    interval,
    tags,
    retentionMinutes: config.connection.retentionMinutes,
  };
  config.memoryStore = {};

  await client.connectTCP(ip, { port });
  client.setID(1); // Modbus unit ID (ajustable)

  config.connected = true;
  console.log("✅ Cliente Modbus conectado correctamente");

  intervalId = setInterval(async () => {
    if (subscribers.length > 0) {
      const now = Date.now();
      for (const tag of tags) {
        try {
          let response;
          const key = `${tag.type}-${tag.start}`;
          switch (tag.type) {
            case "holdingRegisters":
              response = await client.readHoldingRegisters(
                tag.start,
                tag.length
              );
              break;
            case "inputRegisters":
              response = await client.readInputRegisters(tag.start, tag.length);
              break;
            case "coils":
              response = await client.readCoils(tag.start, tag.length);
              break;
            case "discreteInputs":
              response = await client.readDiscreteInputs(tag.start, tag.length);
              break;
            default:
              continue;
          }

          if (!config.memoryStore[key]) config.memoryStore[key] = [];

          const data = {
            key,
            values: response.data,
            timestamp: now,
          };

          config.memoryStore[key].push(data);
          broadcast(data);
        } catch (err) {
          console.error(`Error leyendo ${tag.type} ${tag.start}`, err.message);
        }
      }
    }
  }, interval);
}

// 🔌 Cerrar conexión correctamente
async function closeClient() {
  if (intervalId) clearInterval(intervalId);

  try {
    await client.close(); // esto cierra el socket TCP
    console.log("✅ Cliente Modbus cerrado correctamente");
  } catch (err) {
    console.error("⚠️ Error al cerrar cliente:", err.message);
  }
}

module.exports = {
  connectModbus,
  setRetention,
  registerWebSocketClient,
  cleanOldData,
  closeClient,
  getMemoryStore: () => config.memoryStore,
};
