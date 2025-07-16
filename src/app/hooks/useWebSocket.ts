import { useEffect, useRef, useCallback, useState } from "react";
import { useModbusStore } from "../stores/useModbusStore";

export function useWebSocket(url) {
  const wsRef = useRef(null);
  const addModbusData = useModbusStore((s) => s.addModbusData);
  const setClientStatus = useModbusStore((s) => s.setClientStatus);
  const setModbusIsConnected = useModbusStore((s) => s.setIsConnected);
  const [connected, setConnected] = useState(false);

  const connectModbus = useCallback(() => {
    console.log("Connecting");
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ip: "localhost",
          port: 502,
          interval: 1000,
          registers: { type: "Holding", start: 0, length: 2 },
        })
      );
      console.warn("CMODBUS connnected");
    } else {
      console.warn("WebSocket not open, cannot send connect message.");
    }
  }, []);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.data.length > 0) addModbusData(msg.data);
      setClientStatus(msg.status);
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => connect(), 3000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      ws.close();
    };
  }, [url]);

  useEffect(() => {
    connect();
  }, [connect]);

  return {
    connectModbus,
  };
}
