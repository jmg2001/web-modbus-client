module.exports = {
  connection: {
    ip: null,
    port: 502,
    interval: 1000,
    retentionMinutes: 5,
    registers: [], // { type: 'holdingRegisters', start: 0, length: 2 }
  },
  memoryStore: {}, // { "holdingRegisters-0": [ { value, timestamp }, ... ] }
  connected: false,
};
