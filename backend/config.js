module.exports = {
  connection: {
    ip: null,
    port: 502,
    interval: 1000,
    registers: {}, // { type: 'holdingRegisters', start: 0, length: 2 }
    connected: false,
  },
  memoryStore: {}, // { "holdingRegisters-0": [ { value, timestamp }, ... ] }
};
