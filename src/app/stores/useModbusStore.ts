// stores/useModbusStore.ts

import { create } from "zustand";

type PayloadConnection = {
  ip: string;
  port: number;
  interval: number;
  retentionMinutes: number;
  registers: ModbusRegister[];
};

type ModbusRegister = {
  type: string;
  start: number;
  length: number;
};

type ModbusState = {
  connected: boolean;
  registers: ModbusRegister[];
  setRegisters: (tags: ModbusRegister[]) => void;
  connect: (payload: PayloadConnection) => string;
  disconnect: () => boolean;
};

export const useModbusStore = create<ModbusState>((set) => ({
  connected: false,
  tags: [],
  setRegisters: (registers) => set({ registers }),
  connect: async (payload) => {
    try {
      const res = await fetch("http://localhost:3001/api/connect-modbus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("✅ Conexión exitosa");
        set({ connected: true });
        return res.text;
      } else {
        const err = await res.json();
        set({ connected: false });
        console.error("❌ Error:", err);
        return err.error;
      }
    } catch (error) {
      console.error("🚨 Error al conectar:", error);
      return error;
    }
  },
  disconnect: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/disconnect-modbus", {
        method: "POST",
      });

      if (res.ok) {
        console.log("✅ Desconexión exitosa");
        set({ connected: false });
        return true;
      } else {
        const err = await res.json();
        console.error("❌ Error:", err);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error al desconectar:", error);
      return false;
    }
  },
}));
