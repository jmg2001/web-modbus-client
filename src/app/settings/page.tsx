"use client";

import { useState } from "react";
import { useModbusStore } from "../stores/useModbusStore";

export default function Page() {
  const [ip, setIp] = useState("localhost");
  const [port, setPort] = useState(502);
  const [interval, setInterval] = useState(1000);
  const [retention, setRetention] = useState(15); // en minutos
  const [tags, setTags] = useState("holdingRegisters:0:20");

  const modbusConnected = useModbusStore((s) => s.connected);
  const connectModbus = useModbusStore((s) => s.connect);
  const disconnectModbus = useModbusStore((s) => s.disconnect);

  const handleConnect = async () => {
    const parsedTags = tags.split(",").map((tag) => {
      const [type, start, length] = tag.split(":");
      return {
        type,
        start: Number(start),
        length: Number(length),
      };
    });

    const payload = {
      ip,
      port: Number(port),
      interval: Number(interval),
      retentionMinutes: Number(retention),
      tags: parsedTags,
    };

    connectModbus(parsedTags, payload);
  };

  const handleDisconnect = async () => {
    disconnectModbus();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-15">
        Modbus Configuration
      </h1>
      <div className="">
        <form className="text-xl flex flex-col gap-4 w-xl items-left" action="">
          <div className="flex items-center justify-between">
            <label htmlFor="ip">IP Address:</label>
            <div className="flex gap-2 items-center">
              <input
                className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
                placeholder="IP"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />

              <label htmlFor="port">:</label>
              <input
                className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg max-w-15 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Port"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="">Interval (ms):</label>
            <input
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              type="number"
              placeholder="1000"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="">Retention Time</label>
            <select
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              value={retention}
              onChange={(e) => setRetention(Number(e.target.value))}
            >
              <option value={1}>1 minuto</option>
              <option value={5}>5 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
            </select>
          </div>
          <div className="flex justify-between items-center ">
            <label htmlFor="">Tags:</label>
            <input
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              placeholder="Tags (ej: holdingRegisters:0:20)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </form>

        <button
          onClick={modbusConnected ? handleDisconnect : handleConnect}
          className="w-full bg-[#243347] text-white py-2 rounded hover:bg-[#1b2129] mt-4 transition-colors ease-in font-bold uppercase"
        >
          {modbusConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
