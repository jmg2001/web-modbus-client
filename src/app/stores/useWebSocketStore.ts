// stores/useModbusStore.ts
import { create } from "zustand";
import type { ModbusStatus, PayloadConnection } from "../types";

interface WebSocketState {
  socket: WebSocket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  cleanData: () => void;
  modbusState: ModbusStatus | null;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  connected: false,
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
        modbusState: {
          ...prevModbusState,
          ...msg.state,
          data: [...get().modbusState.data, ...msg.data],
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
  cleanData: () => {
    // Limpiar datos fuera del intervalo
    const prevModbusState = get().modbusState;
    const now = Date.now();
    const maxAge = 1 * 60 * 1000;
    set({
      modbusState: {
        ...prevModbusState,
        data: get().modbusState.data.filter(
          (entry) => now - entry.timestamp <= maxAge
        ),
      },
    });
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
