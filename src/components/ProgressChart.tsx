
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
  ReferenceLine,
  Dot,
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
        fullDate: new Date(entry.date).toLocaleDateString(),
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
  
  // Calculate averages for reference lines
  const averages = useMemo(() => {
    const result: Record<string, number> = {};
    
    if (data.length === 0) return result;
    
    metrics.forEach(metric => {
      if (data[0][metric] !== undefined) {
        const values = data.filter(entry => entry[metric] !== undefined)
                         .map(entry => Number(entry[metric]) || 0);
        if (values.length > 0) {
          const sum = values.reduce((acc, val) => acc + val, 0);
          result[metric] = sum / values.length;
        }
      }
    });
    
    return result;
  }, [data, metrics]);

  // Customize tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium mb-2">{payload[0]?.payload.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: <span className="font-medium">{entry.value}</span></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom dot renderer for the most recent point
  const renderDot = (props: any, dataKey: string) => {
    const { cx, cy, index } = props;
    const isLast = index === chartData.length - 1;
    
    if (isLast) {
      return (
        <Dot
          cx={cx}
          cy={cy}
          r={6}
          stroke="hsl(var(--background))"
          strokeWidth={2}
          fill={colors[dataKey as keyof typeof colors]}
        />
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-lg border border-border/60 bg-card p-4 shadow-sm">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 15,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              formatter={(value, entry) => (
                <span style={{ color: "hsl(var(--foreground))", marginLeft: "8px" }}>{value}</span>
              )}
            />
            
            {metrics.map((metric) => (
              data[0][metric] !== undefined && (
                <>
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    name={labels[metric]}
                    stroke={colors[metric]}
                    activeDot={{ r: 8, strokeWidth: 1, stroke: "hsl(var(--background))" }}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 1, stroke: "hsl(var(--background))" }}
                    animationDuration={1500}
                    connectNulls={true}
                  />
                  {averages[metric] && (
                    <ReferenceLine 
                      y={averages[metric]} 
                      stroke={colors[metric]} 
                      strokeDasharray="3 3" 
                      strokeOpacity={0.6} 
                      label={{
                        value: `Prom: ${averages[metric].toFixed(1)}`,
                        fill: colors[metric],
                        fontSize: 10,
                        position: 'right'
                      }}
                    />
                  )}
                </>
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
