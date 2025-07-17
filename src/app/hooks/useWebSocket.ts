import { useRef, useCallback, useState } from "react";
import { useModbusStore } from "../stores/useModbusStore";
import { PayloadConnection } from "../types";

export function useWebSocket() {
  const wsRef = useRef(null);
  const addModbusData = useModbusStore((s) => s.addModbusData);
  const setClientStatus = useModbusStore((s) => s.setClientStatus);
  const modbusStatus = useModbusStore((s) => s.clientStatus);
  const modbusDataBuffer = useModbusStore((s) => s.dataBuffer);
  const modbusRetentionMinutes = useModbusStore((s) => s.retentionMinutes);
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

  const disconnectModbus = useCallback(() => {
    console.log("Disconnecting");
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send("DISCONNECT");
    } else {
      console.warn("WebSocket not open, cannot send connect message.");
    }
  }, []);

  const connect = (url) => {
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
      setClientStatus(msg.state);
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => connect(url), 3000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      ws.close();
    };
  };

  return {
    modbusStatus,
    modbusDataBuffer,
    connectModbus,
    connected,
    connect,
    setModbusRetentionMinutes,
    modbusRetentionMinutes,
    disconnectModbus,
  };
}
