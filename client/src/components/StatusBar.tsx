import { useEffect } from "react";
import { useSharedWebSocket } from "../context/useWebSocketContext";

export default function StatusBar() {
  const { connect, connected, modbusStatus, modbusDataBuffer } =
    useSharedWebSocket();

  useEffect(() => {
    connect("http://localhost:3001");
  }, []);

  return (
    <div className=" p-2 flex justify-between absolute bottom-0 z-50 bg-[#0b0f14] w-full font-bold">
      <div className="flex gap-5">
        <span>WS Status: {connected ? "🟢" : "🔴"}</span>
        <span>MB Status: {modbusStatus.connected ? "🟢" : "🔴"}</span>
        <span>IP: {modbusStatus.ip ? modbusStatus.ip : "na"}</span>
        <span>Port: {modbusStatus.port ? modbusStatus.port : "na"}</span>
      </div>
      <span className=" flex gap-4">
        <p>Data Length: </p>
        <p>{modbusDataBuffer.length}</p>
      </span>
    </div>
  );
}
