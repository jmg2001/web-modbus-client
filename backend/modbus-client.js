const ModbusRTU = require("modbus-serial");
const config = require("./config");

const client = new ModbusRTU();
const subscribers = [];

let sendDataInterval = null;
let sendStatusInterval = null;
let data = {};

// SET el intervalo de limpieza de datos
function setRetention(minutes) {
  config.connection.retentionMinutes = minutes;
}

// Enviar ingformacion a todos los sockets
function broadcast(payload) {
  subscribers.forEach((ws) => {
    if (ws.readyState === 1) ws.send(JSON.stringify(payload));
  });
}

// Limpiar datos fuera del intervalo
function cleanOldData() {
  const now = Date.now();
  const maxAge = config.connection.retentionMinutes * 60 * 1000;
  for (const key in config.memoryStore) {
    config.memoryStore[key] = config.memoryStore[key].filter(
      (entry) => now - entry.timestamp <= maxAge
    );
  }
}

// SET Interval para enviar Status del Cliente Modbus
function setSendStatusInterval() {
  sendStatusInterval = setInterval(() => {
    broadcast({
      state: {
        connected: config.connected,
        ip: config.connection.ip,
        port: config.connection.port,
        registers: config.connection.registers,
      },
      data: config.memoryStore,
    });
  }, 1500);
}

// Registrar el Web Socket
function registerWebSocketClient(ws) {
  subscribers.push(ws);
  ws.on("close", () => {
    console.log("✅ Cliente WebSocket desconectado");
    const i = subscribers.indexOf(ws);
    if (i !== -1) subscribers.splice(i, 1);
  });
  if ((subscribers.length > 0) & !sendStatusInterval) {
    if (!config.connected) {
      setSendStatusInterval();
    }
  }
}

// Conectar al server
async function connectModbus({ ip, port, interval, registers }) {
  if (sendStatusInterval) clearInterval(sendStatusInterval);
  if (config.connected) closeClient();

  config.connection = {
    ip,
    port,
    interval,
    registers,
    retentionMinutes: config.connection.retentionMinutes,
  };
  config.memoryStore = {};

  await client.connectTCP(ip, { port });
  client.setID(1); // Modbus unit ID (ajustable)

  config.connected = true;
  console.log("✅ Cliente Modbus conectado correctamente");
  console.log(registers);

  sendDataInterval = setInterval(async () => {
    if (subscribers.length > 0) {
      const now = Date.now();
      for (const tag of registers) {
        try {
          let response;
          const key = `${tag.type}`;
          switch (tag.type) {
            case "Holding":
              response = await client.readHoldingRegisters(
                tag.start,
                tag.length
              );
              break;
            case "Input":
              response = await client.readInputRegisters(tag.start, tag.length);
              break;
            case "Coils":
              response = await client.readCoils(tag.start, tag.length);
              break;
            case "discreteInputs":
              response = await client.readDiscreteInputs(tag.start, tag.length);
              break;
            default:
              continue;
          }

          if (!config.memoryStore[key]) config.memoryStore[key] = [];

          data = {
            key,
            values: response.data,
            timestamp: now,
          };

          cleanOldData();
          config.memoryStore[key].push(data);
        } catch (err) {
          console.error(`Error leyendo ${tag.type} ${tag.start}`, err.message);
        }
        broadcast({
          state: {
            connected: config.connected,
            ip: config.connection.ip,
            port: config.connection.port,
            registers: config.connection.registers,
          },
          data: config.memoryStore,
        });
      }
    }
  }, interval);
}

// Cerrar la conexión al server modbus
async function closeClient() {
  if (sendDataInterval) clearInterval(sendDataInterval);

  try {
    await client.close();
    config.connected = false;
    clearInterval(sendStatusInterval);
    setSendStatusInterval();

    config.memoryStore = {};

    console.log("✅ Cliente Modbus cerrado correctamente");
  } catch (err) {
    console.error("⚠️ Error al cerrar cliente:", err.message);
  }
}

module.exports = {
  connectModbus,
  setRetention,
  registerWebSocketClient,
  closeClient,
  getMemoryStore: () => config.memoryStore,
};
