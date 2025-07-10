export type ModbusStatus = {
  connected: boolean;
  ip: string;
  port: number;
  registers: RegisterParams;
  connect: (payload: PayloadConnection) => string;
  disconnect: () => boolean;
  data: object;
};

type PayloadConnection = {
  ip: string;
  port: number;
  interval: number;
  retentionTime: number;
  registers: RegisterParams;
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
