
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Progress } from "@/context/AppContext";

interface ProgressChartProps {
  data: Progress[];
  metrics: Array<"weight" | "bodyFat" | "musclePercentage">;
  height?: number;
}

const ProgressChart = ({ data, metrics, height = 300 }: ProgressChartProps) => {
  const chartData = useMemo(() => {
    return data.map((entry) => {
      const date = new Date(entry.date);
      return {
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        ...entry,
      };
    });
  }, [data]);

  const colors = {
    weight: "#3b82f6", // blue
    bodyFat: "#ef4444", // red
    musclePercentage: "#10b981", // green
  };

  const labels = {
    weight: "Peso (kg)",
    bodyFat: "% Grasa",
    musclePercentage: "% Músculo",
  };

  return (
    <div className="w-full rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Progreso</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "0.5rem" }}
            />
            <Legend />
            {metrics.map((metric) => (
              data[0][metric] !== undefined && (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={labels[metric]}
                  stroke={colors[metric]}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
