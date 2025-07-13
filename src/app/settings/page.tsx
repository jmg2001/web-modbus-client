"use client";

import { useMemo, useState } from "react";
import {
  type RegisterParams,
  type PayloadConnection,
  MODBUS_REGISTER_TYPES,
} from "../types";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export default function Page() {
  const initRegister: RegisterParams = {
    type: "Holding",
    length: 5,
    start: 0,
  };

  const [ip, setIp] = useState("localhost");
  const [port, setPort] = useState(502);
  const [interval, setInterval] = useState(1000);
  const [retention, setRetention] = useState(1); // en minutos

  const [registers, setRegisters] = useState<RegisterParams>(initRegister);

  const modbusConnected = useWebSocketStore((s) => s.modbusState.connected);
  const connectModbus = useWebSocketStore((s) => s.modbusState.connect);
  const disconnectModbus = useWebSocketStore((s) => s.modbusState.disconnect);
  const setRetentionStore = useWebSocketStore((s) => s.setRetention);

  const handleConnect = async () => {
    const payload: PayloadConnection = {
      ip,
      port: Number(port),
      interval: Number(interval),
      registers: registers,
    };
    connectModbus(payload);
  };

  const handleDisconnect = async () => {
    disconnectModbus();
  };

  const changeRegister = (value, param) => {
    const updatedRegisters = { ...registers };
    updatedRegisters[param] = value;
    setRegisters(updatedRegisters);
  };

  useMemo(() => {
    setRetentionStore(retention);
  }, [retention]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-15">
        Modbus Configuration
      </h1>
      <div className="">
        <form
          className={`text-xl flex flex-col gap-4 w-xl items-left ${
            modbusConnected ? "pointer-events-none opacity-50" : ""
          }`}
          action=""
        >
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
            <label htmlFor="">Retention Time:</label>
            <select
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              value={retention}
              onChange={(e) => setRetention(Number(e.target.value))}
            >
              <option value={1}>1 min</option>
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
          <div>
            <h1 className="text-center">Registers</h1>
          </div>
          <div className=" flex items-center justify-between">
            <select
              name=""
              value={registers.type}
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              onChange={(e) => changeRegister(e.target.value, "type")}
            >
              {MODBUS_REGISTER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <div className="flex gap-3 items-center">
              Start:{" "}
              <input
                type="number"
                value={registers.start}
                className="max-w-15 p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
                onChange={(e) => changeRegister(e.target.value, "start")}
              />
              Length:{" "}
              <input
                type="number"
                value={registers.length}
                className="max-w-15 p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
                onChange={(e) => changeRegister(e.target.value, "length")}
              />
            </div>
          </div>
        </form>

        <button
          onClick={modbusConnected ? handleDisconnect : handleConnect}
          className={`w-full ${
            modbusConnected
              ? "bg-red-700 hover:bg-red-700/70"
              : "bg-lime-700 hover:bg-lime-700/70"
          } text-white py-2 rounded mt-4 transition-colors ease-in font-bold uppercase`}
        >
          {modbusConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
