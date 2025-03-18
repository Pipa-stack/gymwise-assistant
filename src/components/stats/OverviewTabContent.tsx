
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface OverviewTabContentProps {
  activityData: { name: string; sessions: number }[];
  goalsData: { name: string; value: number }[];
  mode: "trainer" | "client";
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const OverviewTabContent = ({ activityData, goalsData, mode }: OverviewTabContentProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-5 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Actividad Semanal</h3>
          </div>
          <p className="text-sm text-muted-foreground">Distribución de sesiones por día</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sessions" fill="#4285F4" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default OverviewTabContent;
