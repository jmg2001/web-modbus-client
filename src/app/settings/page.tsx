"use client";

import { useState } from "react";
import { useModbusStore } from "../stores/useModbusStore";
import type { RegisterParams } from "../types";

export default function Page() {
  const initRegister: RegisterParams = {
    type: "Holding",
    length: 5,
    start: 0,
  };

  const registerTypes = ["Holding", "Input", "Coils"];

  const [ip, setIp] = useState("localhost");
  const [port, setPort] = useState(502);
  const [interval, setInterval] = useState(1000);
  const [retention, setRetention] = useState(15); // en minutos
  const [registers, setResgisters] = useState<RegisterParams>(initRegister);

  const modbusConnected = useModbusStore((s) => s.connected);
  const connectModbus = useModbusStore((s) => s.connect);
  const disconnectModbus = useModbusStore((s) => s.disconnect);

  const handleConnect = async () => {
    const payload = {
      ip,
      port: Number(port),
      interval: Number(interval),
      retentionMinutes: Number(retention),
      registers: [registers],
    };
    connectModbus(payload);
  };

  const handleDisconnect = async () => {
    disconnectModbus();
  };

  const changeRegister = (value, param) => {
    const updatedRegisters = { ...registers };
    updatedRegisters[param] = value;
    setResgisters(updatedRegisters);
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
          <div>
            <h1 className="text-center">Registers</h1>
          </div>
          {/* {registers.map((register, i) => (
            <div
              key={register.type}
              className="flex justify-between items-center"
            >
              <h3>{register.type.split("R")[0]}</h3>
              <div className=" flex gap-3 items-center">
                Start:
                <input
                  type="number"
                  className="max-w-20 p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
                  value={register.start}
                  onChange={(e) => changeRegister(e.target.value, i, "start")}
                />
                Quantity:
                <input
                  type="number"
                  className="max-w-20 p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
                  value={register.length}
                  onChange={(e) => changeRegister(e.target.value, i, "length")}
                />
              </div>
            </div>
          ))} */}

          <div className=" flex items-center justify-between">
            <select
              name=""
              value={registers.type}
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              onChange={(e) => changeRegister(e.target.value, "type")}
            >
              {registerTypes.map((type) => (
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
          className="w-full bg-[#243347] text-white py-2 rounded hover:bg-[#1b2129] mt-4 transition-colors ease-in font-bold uppercase"
        >
          {modbusConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
