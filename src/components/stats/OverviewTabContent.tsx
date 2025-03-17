
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface OverviewTabContentProps {
  activityData: { name: string; sessions: number }[];
  goalsData: { name: string; value: number }[];
  mode: "trainer" | "client";
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const OverviewTabContent = ({ activityData, goalsData, mode }: OverviewTabContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Actividad Semanal
          </CardTitle>
          <CardDescription>Distribución de sesiones por día</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#8884d8" name="Sesiones" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {mode === "trainer" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Distribución de Objetivos
            </CardTitle>
            <CardDescription>Objetivos de los clientes</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {goalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
