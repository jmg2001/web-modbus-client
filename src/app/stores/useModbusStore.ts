// stores/useModbusStore.ts

import { create } from "zustand";

type PayloadConnection = {
  ip: string;
  port: number;
  interval: number;
  retentionMinutes: number;
  tags: ModbusTag[];
};

type ModbusTag = {
  type: string;
  start: number;
  length: number;
};

type ModbusState = {
  connected: boolean;
  tags: ModbusTag[];
  setTags: (tags: ModbusTag[]) => void;
  connect: (tags: ModbusTag[], payload: PayloadConnection) => boolean;
  disconnect: () => boolean;
  checkConnection: () => boolean;
};

export const useModbusStore = create<ModbusState>((set) => ({
  connected: false,
  tags: [],
  setTags: (tags) => set({ tags }),
  connect: async (tags, payload) => {
    try {
      const res = await fetch("http://localhost:3001/api/connect-modbus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("✅ Conexión exitosa");
        set({ connected: true });
        return true;
      } else {
        const err = await res.json();
        set({ connected: false });
        console.error("❌ Error:", err);
        return false;
      }
    } catch (error) {
      console.error("🚨 Error al conectar:", error);
      return false;
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
  checkConnection: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/status-modbus", {
        method: "POST",
      });
      console.log(res);
      // if (res.ok) {
      //   set({ connected: true });
      //   return true;
      // } else {
      //   set({ connected: false });
      //   const err = await res.json();
      //   console.error("❌ Error:", err);
      //   return false;
      // }
    } catch (error) {
      console.error("🚨 Error:", error);
      return false;
    }
  },
}));
