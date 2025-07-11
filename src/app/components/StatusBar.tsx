"use client";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export default function StatusBar() {
  const webSocketStoreConnected = useWebSocketStore((s) => s.connected);
  const modbusState = useWebSocketStore((s) => s.modbusState);

  return (
    <div className=" p-2 flex justify-between absolute bottom-0 z-50 bg-[#0b0f14] w-full font-bold">
      <div className="flex gap-5">
        <span>WS Status: {webSocketStoreConnected ? "🟢" : "🔴"}</span>
        <span>MB Status: {modbusState.connected ? "🟢" : "🔴"}</span>
        <span>IP: {modbusState.ip ? modbusState.ip : "na"}</span>
        <span>Port: {modbusState.port ? modbusState.port : "na"}</span>
      </div>
      <span className=" flex gap-4">
        <p>Data Length: </p>
        {modbusState.data && <p>{modbusState.data.length}</p>}
      </span>
    </div>
  );
}
