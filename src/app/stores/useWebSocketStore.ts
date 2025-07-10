// stores/useModbusStore.ts
import { create } from "zustand";
import type { ModbusStatus } from "../types";

interface WebSocketState {
  socket: WebSocket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
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
      console.log(msg);

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
  modbusState: {
    connected: false,
    data: {},
    port: 502,
    ip: null,
    registers: [],
    connect: (payload) => {
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
