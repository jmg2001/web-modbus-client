"use client";

import { useState } from "react";
import {
  type ModbusRegisterParams,
  type PayloadConnection,
  MODBUS_REGISTER_TYPES,
  POLLING_TIMES,
} from "../types";
import { useSharedWebSocket } from "../context/useWebSocketContext";

export default function Page() {
  const initRegisters: ModbusRegisterParams = {
    type: "Holding",
    length: 5,
    start: 0,
  };

  const { modbusStatus, connectModbus, disconnectModbus } =
    useSharedWebSocket();

  const [ip, setIp] = useState("localhost");
  const [port, setPort] = useState(502);
  const [interval, setInterval] = useState(1000);
  const [retention, setRetention] = useState(1); // en minutos

  const [registers, setRegisters] =
    useState<ModbusRegisterParams>(initRegisters);

  const handleConnect = async () => {
    const payload: PayloadConnection = {
      ip,
      port: Number(port),
      interval: Number(interval),
      registers: registers,
    };
    connectModbus(payload, retention);
  };

  const handleDisconnect = async () => {
    disconnectModbus();
  };

  const changeRegister = (value, param) => {
    const updatedRegisters = { ...registers };
    updatedRegisters[param] = value;
    setRegisters(updatedRegisters);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-15">Modbus Settings</h1>
      <p className=" w-4xl text-center">
        Configure Modbus TCP client parameters including server IP address,
        port, polling interval and register mappings. This section also allows
        you to define which tags (addresses) to monitor, set data retention
        intervals, and manage connection status.
      </p>
      <div className=" mt-10">
        <form
          className={`text-xl flex flex-col gap-4 w-xl items-left ${
            modbusStatus.connected ? "pointer-events-none opacity-50" : ""
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
              {POLLING_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time} min
                </option>
              ))}
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
          onClick={modbusStatus.connected ? handleDisconnect : handleConnect}
          className={`w-full ${
            modbusStatus.connected
              ? "bg-red-700 hover:bg-red-700/70"
              : "bg-lime-700 hover:bg-lime-700/70"
          } text-white py-2 rounded mt-4 transition-colors ease-in font-bold uppercase`}
        >
          {modbusStatus.connected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
