import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { ModbusData } from "../types";
import { useModbusStore } from "../stores/useModbusStore";

type ChartProps = {
  data: ModbusData[];
  timeRange: number[];
};

export default function Chart({ data, timeRange }: ChartProps) {
  const dataBuffer = useModbusStore((s) => s.dataBuffer);
  console.log("buffer", dataBuffer);
  return (
    <>
      <LineChart width={800} height={400} data={dataBuffer}>
        <CartesianGrid />
        <Line dataKey="value" isAnimationActive={false} />
        <XAxis
          dataKey="timestamp"
          domain={timeRange}
          type="number"
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <YAxis domain={["dataMin", "auto"]} />
        <Tooltip
          labelFormatter={(label) => {
            const date = new Date(label);
            return date.toLocaleTimeString(); // o .toLocaleTimeString(), .toLocaleDateString()
          }}
        />
        <Legend
          formatter={(value) => {
            return value === "value" ? "Register Value" : value;
          }}
        />
      </LineChart>
    </>
  );
}
