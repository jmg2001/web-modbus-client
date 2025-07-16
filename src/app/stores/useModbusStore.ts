import { create } from "zustand";

const retentionMillis = 5 * 60 * 1000; // 5 minutos

type ModbusData = {
  values: number[];
  timestamp: number;
};

type ModbusClientRegisters = {
  type: "Holding" | "Input" | "Coils";
  start: number;
  lenght: number;
};

type ModbusClientStatus = {
  ip: string;
  port: number;
  registers: ModbusClientRegisters;
};

type ModbusStore = {
  dataBuffer: ModbusData[];
  clientStatus: ModbusClientStatus;
  isConnected: boolean;
  addModbusData: (newData: ModbusData) => void;
  setClientStatus: (status: ModbusClientStatus) => void;
  setIsConnected: (status: boolean) => void;
};

export const useModbusStore = create<ModbusStore>((set, get) => ({
  dataBuffer: [],
  clientStatus: null,
  isConnected: false,

  addModbusData: (newData) => {
    const now = Date.now();
    console.log("new1", newData);
    console.log("buffer1", get().dataBuffer);

    const updatedBuffer = [
      ...get().dataBuffer.filter((p) => now - p.timestamp <= retentionMillis),
      newData,
    ];

    set({ dataBuffer: updatedBuffer });
  },

  setClientStatus: (status) => set({ clientStatus: status }),
  setIsConnected: (status) => set({ isConnected: status }),
}));
