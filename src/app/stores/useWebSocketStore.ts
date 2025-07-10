// stores/useModbusStore.ts
import { create } from "zustand";
import type { ModbusStatus } from "../types";

interface WebSocketState {
  socket: WebSocket | null;
  data: any[];
  modbusStatus: ModbusStatus | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  socket: null,
  data: [],
  modbusStatus: null,
  connected: false,
  connect: () => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("🟢 WebSocket conectado");
      set({ connected: true });
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      set(() => ({
        modbusStatus: msg.status,
        data: msg.data, // o filtrado por tag, etc
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
