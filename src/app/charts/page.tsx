"use client";
import { useMemo, useState } from "react";
import Chart from "../components/Chart";
import { POLLING_TIMES } from "../types";
import { useSharedWebSocket } from "../context/useWebSocketContext";

export default function Page() {
  const { modbusDataBuffer, modbusStatus, modbusRetentionMinutes } =
    useSharedWebSocket();

  const [chartData, setChartData] = useState([]);
  const [register, setRegister] = useState(0);
  const [registers, setRegisters] = useState([]);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [minutesViewRange, setMinutesViewRange] = useState(
    modbusRetentionMinutes
  );

  const pollingTimes = POLLING_TIMES;

  useMemo(() => {
    setRegisters(
      Array.from(
        { length: modbusStatus.registers.length },
        (_, i) => modbusStatus.registers.start + i
      )
    );
  }, [modbusStatus.registers]);

  useMemo(() => {
    console.log(
      new Date(Date.now() - minutesViewRange * 60 * 1000).toLocaleTimeString()
    );
    setTimeRange([Date.now() - minutesViewRange * 60 * 1000, Date.now()]);
    setChartData(
      modbusDataBuffer.map((item) => ({
        value: item.values[register],
        timestamp: item.timestamp,
      }))
    );
  }, [modbusDataBuffer, minutesViewRange]);

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className=" text-3xl font-bold mb-15">Chart</h1>
      {modbusDataBuffer.length > 0 ? (
        <>
          {" "}
          <div className=" flex items-center gap-4 mb-3">
            <h2 className=" text-xl">
              Select {modbusStatus.registers.type} Register:{" "}
            </h2>
            <select
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              onChange={(e) => setRegister(Number(e.target.value))}
            >
              {registers.map((reg, i) => (
                <option key={i} value={i}>
                  {reg.toString().padStart(4, "0")}
                </option>
              ))}
            </select>
            <p
              className={`${
                modbusStatus.connected ? "text-lime-500" : "text-red-400"
              }`}
            >
              {modbusStatus.connected ? "ONLINE" : "OFFLINE"}
            </p>
          </div>
          <Chart data={chartData} timeRange={timeRange} />
          <div className="flex gap-3 items-center">
            <h3>Range: </h3>
            <select
              className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
              value={minutesViewRange}
              onChange={(e) => setMinutesViewRange(Number(e.target.value))}
            >
              {pollingTimes
                .filter((time) => time <= modbusRetentionMinutes)
                .map((time) => (
                  <option key={time} value={time}>
                    {time} min
                  </option>
                ))}
            </select>
          </div>
        </>
      ) : (
        <h3>Waiting for Data</h3>
      )}
    </div>
  );
}
