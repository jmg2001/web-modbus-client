import { useEffect, useRef, useCallback, useState } from "react";
import { useModbusStore } from "../stores/useModbusStore";
import { PayloadConnection } from "../types";

export function useWebSocket(url) {
  const wsRef = useRef(null);
  const addModbusData = useModbusStore((s) => s.addModbusData);
  const setClientStatus = useModbusStore((s) => s.setClientStatus);
  const setModbusRetentionMinutes = useModbusStore(
    (s) => s.setRetentionMinutes
  );
  const [connected, setConnected] = useState(false);

  const connectModbus = useCallback(
    (payload: PayloadConnection, minutes: number) => {
      console.log("Connecting");
      setModbusRetentionMinutes(minutes);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      } else {
        console.warn("WebSocket not open, cannot send connect message.");
      }
    },
    []
  );

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.error) {
        console.log(msg.error);
        return;
      }
      if (Object.keys(msg.data).length > 0) addModbusData(msg.data);
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
    connected,
  };
}
