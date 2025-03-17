
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan 1", hours: 3 },
  { name: "Jan 8", hours: 2.5 },
  { name: "Jan 15", hours: 3 },
  { name: "Jan 22", hours: 3.5 },
  { name: "Jan 29", hours: 3.8 },
  { name: "Feb 5", hours: 3 },
  { name: "Feb 12", hours: 3 },
  { name: "Feb 19", hours: 3.2 },
  { name: "Feb 26", hours: 2.8 },
  { name: "Mar 5", hours: 3 },
  { name: "Mar 12", hours: 3.5 },
];

const WorkoutTimeChart = () => {
  return (
    <div className="h-[300px] w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-medium">3 horas</span>
        <span className="text-muted-foreground">esta semana</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${value} hrs`}
            ticks={[0, 2, 4]}
            domain={[0, 4]}
          />
          <Tooltip 
            formatter={(value) => [`${value} horas`, "Tiempo"]} 
            labelFormatter={(label) => `Semana de ${label}`}
          />
          <Bar 
            dataKey="hours" 
            fill="#1e88e5" 
            radius={[4, 4, 0, 0]} 
            name="Horas" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutTimeChart;
