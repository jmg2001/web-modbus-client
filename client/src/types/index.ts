export type ModbusRegistersTypes = "Holding" | "Input" | "Coils";

export type ModbusData = {
  values: number[];
  timestamp: number;
};

export type ChartData = {
  value: number;
  timestamp: number;
};

export const MODBUS_REGISTER_TYPES: ModbusRegistersTypes[] = [
  "Holding",
  "Input",
  "Coils",
];

export const POLLING_TIMES: number[] = [1, 5, 15, 30, 60];

export type ModbusStatus = {
  connected: boolean;
  ip: string;
  port: number;
  registers: ModbusRegisterParams;
  interval: number;
  data: ModbusData[];
  connect: (payload: PayloadConnection) => string;
  disconnect: () => boolean;
};

export type PayloadConnection = {
  ip: string;
  port: number;
  interval: number;
  registers: ModbusRegisterParams;
};

export type ModbusRegisterParams = {
  type: ModbusRegistersTypes;
  start: number;
  length: number;
};
