"use client";
import { useModbusStore } from "../stores/useModbusStore";

export default function StatusBar() {
  const connected = useModbusStore((s) => s.connected);
  const tags = useModbusStore((s) => s.tags);
  return (
    <div className=" p-2 flex justify-between absolute bottom-0 z-50 bg-[#0b0f14] w-full font-bold">
      <div className="flex gap-5">
        <span>MB Status: {connected ? "🟢" : "🔴"}</span>
        <span>WS Status: {connected ? "🟢" : "🔴"}</span>
      </div>
      <span>Tags recibidos: {tags.length}</span>
    </div>
  );
}
