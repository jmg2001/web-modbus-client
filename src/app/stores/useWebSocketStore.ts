// stores/useModbusStore.ts
import { create } from "zustand";
import type { ModbusStatus, PayloadConnection } from "../types";

interface WebSocketState {
  socket: WebSocket | null;
  connected: boolean;
  retentionMinutes: number;
  setRetention: (value: number) => void;
  connect: () => void;
  disconnect: () => void;
  modbusState: ModbusStatus | null;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  connected: false,
  retentionMinutes: 1,
  setRetention: (value) => {
    set({ retentionMinutes: value });
  },
  connect: () => {
    let ws = null;
    try {
      ws = new WebSocket("ws://192.168.209.1:3001");
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
        modbusState: {
          ...prevModbusState,
          ...msg.state,
          data: msg.data,
        },
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
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set({ socket: null });
  },

  modbusState: {
    connected: false,
    data: [],
    port: 502,
    ip: null,
    interval: 1000,
    registers: { length: 0, start: 0, type: "Holding" },
    connect: (payload: PayloadConnection) => {
      try {
        get().socket.send(JSON.stringify(payload));
      } catch (error) {
        console.error("🚨 Error al conectar:", error);
        return error;
      }
    },
    disconnect: () => {
      try {
        get().socket.send("DISCONNECT");
      } catch (error) {
        console.error("🚨 Error al desconectar:", error);
        return false;
      }
    },
  },
}));
