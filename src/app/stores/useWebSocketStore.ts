// stores/useModbusStore.ts
import { create } from "zustand";
import type { ModbusStatus } from "../types";

interface WebSocketState {
  socket: WebSocket | null;
  modbusState: ModbusStatus | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  connected: false,
  modbusState: {
    connected: false,
    data: {},
    port: 502,
    ip: null,
    registers: [],
    connect: async (payload) => {
      try {
        const res = await fetch("http://10.0.0.253:3001/api/connect-modbus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const prevModbusState = get().modbusState;
        if (res.ok) {
          console.log("✅ Conexión exitosa");
          set({ modbusState: { ...prevModbusState, connected: true } });
          return res.text;
        } else {
          const err = await res.json();
          set({ modbusState: { ...prevModbusState, connected: false } });
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
        const res = await fetch(
          "http://10.0.0.253:3001/api/disconnect-modbus",
          {
            method: "POST",
          }
        );

        if (res.ok) {
          const prevModbusState = get().modbusState;
          console.log("✅ Desconexión exitosa");
          set({ modbusState: { ...prevModbusState, connected: false } });
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
  },
  connect: () => {
    let ws = null;
    try {
      ws = new WebSocket("ws://10.0.0.253:3001");
    } catch (error) {
      console.log("Error", error);
    }

    ws.onopen = () => {
      console.log("🟢 WebSocket conectado");
      set({ connected: true });
    };

    ws.onmessage = (e) => {
      const prevModbusState = get().modbusState;
      const msg = JSON.parse(e.data);

      set(() => ({
        modbusState: { ...prevModbusState, ...msg.state, data: msg.data },
      }));
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket cerrado");
      set({ socket: null });
      set({ connected: false });
    };

    set({ socket: ws });
  },

  disconnect: () => {
    const socket = useWebSocketStore.getState().socket;
    if (socket) {
      socket.close();
    }
    set({ socket: null });
  },
}));
