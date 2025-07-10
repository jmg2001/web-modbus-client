"use client";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export default function StatusBar() {
  const webSocketStore = useWebSocketStore((s) => s);
  const modbusState = useWebSocketStore((s) => s.modbusState);

  return (
    <div className=" p-2 flex justify-between absolute bottom-0 z-50 bg-[#0b0f14] w-full font-bold">
      <div className="flex gap-5">
        <span>MB Status: {modbusState.connected ? "🟢" : "🔴"}</span>
        <span>WS Status: {webSocketStore.connected ? "🟢" : "🔴"}</span>
      </div>
      <span className=" flex gap-4">
        <p>CURRENT DATA: </p>
        <p>
          HR:{" "}
          {modbusState.data["Holding"] ? modbusState.data["Holding"].length : 0}
        </p>
        <p>
          IR: {modbusState.data["Input"] ? modbusState.data["Input"].length : 0}
        </p>
        <p>
          COILS:{" "}
          {modbusState.data["Coils"] ? modbusState.data["Coils"].length : 0}
        </p>
      </span>
    </div>
  );
}
