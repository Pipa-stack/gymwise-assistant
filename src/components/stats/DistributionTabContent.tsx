
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Client } from "@/context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DistributionTabContentProps {
  clients: Client[];
}

const DistributionTabContent = ({ clients }: DistributionTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          Comparación de Clientes
        </CardTitle>
        <CardDescription>Comparativa de progreso entre clientes</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={clients.map(client => {
              const latestProgress = client.progress?.[client.progress.length - 1];
              return {
                name: client.name.split(' ')[0],
                peso: latestProgress?.weight || 0,
                objetivo: client.goal
              };
            })}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              tick={{ dy: 10 }}
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="peso" fill="#8884d8" name="Peso (kg)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DistributionTabContent;
