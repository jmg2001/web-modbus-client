export type ModbusStatus = {
  connected: boolean;
  ip: string;
  port: number;
  registers: [];
};

export type RegisterParams = {
  type: string;
  start: number;
  length: number;
};

// connected: config.connected,
// ip: config.connection.ip,
// port: config.connection.port,
// register: config.connection.tags,
