import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { type ChartData } from "../types";

type ChartProps = {
  data: ChartData[];
  timeRange: number[];
};

export default function Chart({ data, timeRange }: ChartProps) {
  return (
    <>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <Line dataKey="value" isAnimationActive={false} />
        <XAxis
          dataKey="timestamp"
          domain={timeRange}
          type="number"
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          tickCount={4}
        />
        <YAxis domain={["dataMin", "auto"]} tickCount={5} />
        <Tooltip
          labelFormatter={(label) => {
            const date = new Date(label);
            return date.toLocaleTimeString(); // o .toLocaleTimeString(), .toLocaleDateString()
          }}
          contentStyle={{ backgroundColor: "#121921" }}
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
