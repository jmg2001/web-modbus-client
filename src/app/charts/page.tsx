"use client";
import { useMemo, useState } from "react";
import Chart from "../components/Chart";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { ModbusData, POLLING_TIMES } from "../types";

export default function Page() {
  const modbusRegisters = useWebSocketStore((s) => s.modbusState.registers);
  const modbusData = useWebSocketStore((s) => s.modbusState.data);
  const minutesRetention = useWebSocketStore((s) => s.retentionMinutes);

  const [chartData, setChartData] = useState([]);
  const [register, setRegister] = useState(0);
  const [registers, setRegisters] = useState([]);
  const [filteredData, setFilteredData] = useState<ModbusData[]>([]);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [minutesViewRange, setMinutesViewRange] = useState(minutesRetention);

  const pollingTimes = POLLING_TIMES;

  function filterData(data: ModbusData[]) {
    const now = Date.now();
    const maxAge = minutesRetention * 60 * 1000;
    const dataFiltered = data.filter(
      (entry) => now - entry.timestamp <= maxAge
    );
    return dataFiltered;
  }

  useMemo(() => {
    setRegisters(
      Array.from(
        { length: modbusRegisters.length },
        (_, i) => modbusRegisters.start + i
      )
    );
    const filteredPrevData = filterData(filteredData);
    setFilteredData([...filteredPrevData, ...modbusData]);
  }, [modbusData]);

  useMemo(() => {
    setTimeRange([Date.now() - minutesViewRange * 60 * 1000 - 2, Date.now()]);
    setChartData(
      filteredData.map((item) => ({
        value: item.values[register],
        timestamp: item.timestamp,
      }))
    );
  }, [filteredData]);

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className=" text-3xl font-bold mb-15">Chart</h1>
      {modbusData.length > 0 ? (
        <>
          {" "}
          <div className=" flex items-center gap-4 mb-3">
            <h2 className=" text-xl">
              Select {modbusRegisters.type} Register:{" "}
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
                .filter((time) => time <= minutesRetention)
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
