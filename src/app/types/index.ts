export type ModbusRegistersTypes = "Holding" | "Input" | "Coils";

export type ModbusData = {
  values: number[];
  timestamp: number;
};

export const MODBUS_REGISTER_TYPES: ModbusRegistersTypes[] = [
  "Holding",
  "Input",
  "Coils",
];

export type ModbusStatus = {
  connected: boolean;
  ip: string;
  port: number;
  registers: RegisterParams;
  interval: number;
  data: ModbusData[];
  connect: (payload: PayloadConnection) => string;
  disconnect: () => boolean;
};

export type PayloadConnection = {
  ip: string;
  port: number;
  interval: number;
  registers: RegisterParams;
};

export type RegisterParams = {
  type: ModbusRegistersTypes;
  start: number;
  length: number;
};
