const ModbusRTU = require("modbus-serial");
const config = require("./config");

const client = new ModbusRTU();
const subscribers = [];

let sendDataInterval = null;
let sendStatusInterval = null;
let data = {};

// Enviar informacion a todos los sockets
function SendMessageBroadcast(payload) {
  subscribers.forEach((ws) => {
    if (ws.readyState === 1) ws.send(JSON.stringify(payload));
  });
}

// SET Interval para enviar Status del Cliente Modbus
function setSendStatusInterval() {
  sendStatusInterval = setInterval(() => {
    SendMessageBroadcast({
      state: config.connection,
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

  ws.on("message", async (msg) => {
    try {
      const text = msg.toString();
      switch (text) {
        case "DISCONNECT":
          closeClient();
          break;
        default:
          console.log(text);
          const obj = JSON.parse(text);

          try {
            await connectModbus(obj);
          } catch (err) {
            console.log(err);
          }
          break;
      }
    } catch (err) {
      console.error("Error al parsear:", err);
    }
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
  if (config.connection.connected) closeClient();

  config.memoryStore = {};

  // Try Connection
  try {
    await client.connectTCP(ip, { port });
  } catch (err) {
    SendMessageBroadcast({
      error: err,
    });
    setSendStatusInterval();
    return;
  }

  client.setID(1); // Modbus unit ID (ajustable)

  config.connection.connected = true;
  console.log("✅ Cliente Modbus conectado correctamente");

  config.connection = {
    ip,
    port,
    interval,
    registers,
    connected: true,
  };

  sendDataInterval = setInterval(async () => {
    if (subscribers.length > 0) {
      const now = Date.now();
      try {
        let response;
        switch (registers.type) {
          case "Holding":
            response = await client.readHoldingRegisters(
              registers.start,
              registers.length
            );
            break;
          case "Input":
            response = await client.readInputRegisters(
              registers.start,
              registers.length
            );
            break;
          case "Coils":
            response = await client.readCoils(
              registers.start,
              registers.length
            );
            break;
          case "discreteInputs":
            response = await client.readDiscreteInputs(
              registers.start,
              registers.length
            );
            break;
          default:
            console.log("Invalid Register Type");
            break;
        }

        config.memoryStore = [];

        data = {
          values: response.data,
          timestamp: now,
        };

        config.memoryStore = data;
      } catch (err) {
        console.error(
          `Error leyendo ${registers.type} ${registers.start}`,
          err.message
        );
      }

      SendMessageBroadcast({
        state: config.connection,
        data: config.memoryStore,
      });
    }
  }, interval);
}

// Cerrar la conexión al server modbus
async function closeClient() {
  if (sendDataInterval) clearInterval(sendDataInterval);
  try {
    await client.close();

    config.connection.connected = false;
    clearInterval(sendStatusInterval);
    setSendStatusInterval();

    config.memoryStore = {};

    console.log("✅ Cliente Modbus cerrado correctamente");
  } catch (err) {
    console.error("⚠️ Error al cerrar cliente:", err.message);
  }
}

module.exports = {
  registerWebSocketClient,
};
