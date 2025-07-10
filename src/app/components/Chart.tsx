import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export default function Chart() {
  const [register, setRegister] = useState(0);
  const [registers, setRegisters] = useState([]);
  const [data, setData] = useState([]);
  const [registerType, setRegisterType] = useState("");

  const modbusData = useWebSocketStore((s) => s.modbusState.data);
  const modbusRegisters = useWebSocketStore((s) => s.modbusState.registers);

  useMemo(() => {
    setRegisterType(Object.keys(modbusData).at(0));
    const registerType = Object.keys(modbusData).at(0);

    setRegisters(
      Array.from(
        { length: modbusRegisters.length },
        (_, i) => modbusRegisters.start + i
      )
    );
    if (registerType) {
      const updatedData = [];
      console.log(register);
      modbusData[registerType].forEach((data) => {
        const date = new Date(data["timestamp"]);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const time = `${hours}:${minutes}:${seconds}`;

        const currData = {
          time: time,
          data: data.values[register],
        };
        updatedData.push(currData);
        setData(updatedData);
      });
    }
  }, [modbusData]);
  return (
    <div className="flex flex-col w-full items-center">
      <h1 className=" text-3xl font-bold mb-20">Chart</h1>
      <div className=" flex items-center gap-4 mb-5">
        <h2 className=" text-xl">Select {registerType} Register: </h2>
        <select
          className="p-2 border-2 border-[#4d6889] bg-[#243347] rounded-lg text-center"
          onChange={(e) => setRegister(Number(e.target.value))}
        >
          {registers.map((reg, i) => (
            <option key={i} value={i}>
              {reg}
            </option>
          ))}
        </select>
      </div>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid />
        <Line dataKey="data" isAnimationActive={false} />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
}
