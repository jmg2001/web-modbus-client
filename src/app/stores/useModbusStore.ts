import { create } from "zustand";
import { ModbusRegisterParams } from "../types";

type ModbusData = {
  values: number[];
  timestamp: number;
};

type ModbusClientStatus = {
  ip: string;
  port: number;
  registers: ModbusRegisterParams;
  connected: boolean;
};

type ModbusStore = {
  retentionMinutes: number;
  dataBuffer: ModbusData[];
  clientStatus: ModbusClientStatus;
  addModbusData: (newData: ModbusData) => void;
  setClientStatus: (status: ModbusClientStatus) => void;
  setRetentionMinutes: (minutes: number) => void;
};

export const useModbusStore = create<ModbusStore>((set, get) => ({
  dataBuffer: [],
  clientStatus: {
    connected: false,
    ip: "na",
    port: 502,
    registers: { length: 0, start: 0, type: "Holding" },
  },
  retentionMinutes: 5,
  addModbusData: (newData: ModbusData) => {
    const now = Date.now();
    const updatedBuffer = [
      ...get().dataBuffer.filter(
        (p) => now - p.timestamp < get().retentionMinutes * 60 * 1000
      ),
      newData,
    ];

    set({ dataBuffer: updatedBuffer });
  },
  setRetentionMinutes: (minutes: number) => {
    set({ retentionMinutes: minutes });
  },
  setClientStatus: (status: ModbusClientStatus) => {
    set({ clientStatus: status });
  },
}));
