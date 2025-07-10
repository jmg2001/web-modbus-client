import { useMemo, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export default function Chart() {
  const [register, setRegister] = useState(0);
  const [data, setData] = useState([]);

  const modbusData = useWebSocketStore((s) => s.modbusState.data);
  useMemo(() => {
    const registerType = Object.keys(modbusData).at(0);
    if (registerType) {
      const updatedData = [];
      modbusData[registerType].forEach((data) => {
        const date = new Date(data["timestamp"]);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const time = `${hours}:${minutes}:${seconds}`;
        const currData = {
          time: time,
          r: data.values[register],
        };
        updatedData.push(currData);
        setData(updatedData);
      });
      console.log("Data: ", data);
    }
  }, [modbusData]);
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid />
      <Line dataKey="r" isAnimationActive={false} />
      <XAxis dataKey="time" />
      <YAxis />
      <Legend />
    </LineChart>
  );
}
