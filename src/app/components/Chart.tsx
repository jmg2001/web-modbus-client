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

type ChartProps = {
  data: ModbusData[];
  timeRange: number[];
};

export default function Chart({ data, timeRange }: ChartProps) {
  return (
    <>
      <LineChart width={800} height={400} data={data}>
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
