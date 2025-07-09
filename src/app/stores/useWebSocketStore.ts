// stores/useModbusStore.ts
import { create } from "zustand";

interface WebSocketState {
  socket: WebSocket | null;
  data: any[];
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  socket: null,
  data: [],

  connect: () => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("🟢 WebSocket conectado");
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      set((state) => ({
        data: [...state.data, msg], // o filtrado por tag, etc
      }));
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket cerrado");
      set({ socket: null });
    };

    set({ socket: ws });
  },

  disconnect: () => {
    const socket = useModbusStore.getState().socket;
    if (socket) {
      socket.close();
    }
    set({ socket: null });
  },
}));
