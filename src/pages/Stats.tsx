
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, TrendingUp, Users } from "lucide-react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const Stats = () => {
  const { clients, mode } = useAppContext();
  const [activeClient, setActiveClient] = useState(clients[0]?.id || "");
  const [timeRange, setTimeRange] = useState("6m");
  const [statType, setStatType] = useState("weight");

  // Get active client data
  const clientData = clients.find(client => client.id === activeClient);

  // Prepare progress data for charts
  const progressData = clientData?.progress || [];
  
  // Calculate additional statistics
  const goalsByDistribution = clients.reduce((acc, client) => {
    acc[client.goal] = (acc[client.goal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goalsData = Object.keys(goalsByDistribution).map(goal => ({
    name: goal,
    value: goalsByDistribution[goal]
  }));
  
  // Simulate activity data (could be real data in a production app)
  const activityData = [
    { name: "Lun", sessions: 5 },
    { name: "Mar", sessions: 7 },
    { name: "Mié", sessions: 4 },
    { name: "Jue", sessions: 8 },
    { name: "Vie", sessions: 6 },
    { name: "Sáb", sessions: 3 },
    { name: "Dom", sessions: 1 },
  ];

  // Client progress over time
  const progressDataFormatted = progressData.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    weight: item.weight,
    bodyFat: item.bodyFat || 0,
    musclePercentage: item.musclePercentage || 0
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
        {mode === "trainer" && (
          <div className="flex items-center gap-2">
            <Select value={activeClient} onValueChange={setActiveClient}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 mes</SelectItem>
                <SelectItem value="3m">3 meses</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="1y">1 año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Progreso</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              <span>Distribución</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
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
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#8884d8" name="Sesiones" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                Progreso a lo Largo del Tiempo
              </CardTitle>
              <CardDescription>
                {mode === "trainer" 
                  ? `Progreso de ${clientData?.name || "cliente seleccionado"}`
                  : "Tu progreso a lo largo del tiempo"}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Button 
                  variant={statType === "weight" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setStatType("weight")}
                >
                  Peso
                </Button>
                <Button 
                  variant={statType === "bodyFat" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setStatType("bodyFat")}
                >
                  % Grasa
                </Button>
                <Button 
                  variant={statType === "musclePercentage" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setStatType("musclePercentage")}
                >
                  % Músculo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {progressDataFormatted.length > 0 ? (
                <ChartContainer
                  className="h-80"
                  config={{
                    weight: {
                      label: "Peso (kg)",
                      color: "#8884d8"
                    },
                    bodyFat: {
                      label: "% Grasa Corporal",
                      color: "#82ca9d"
                    },
                    musclePercentage: {
                      label: "% Músculo",
                      color: "#ffc658"
                    }
                  }}
                >
                  <LineChart data={progressDataFormatted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey={statType}
                      stroke={statType === "weight" ? "#8884d8" : statType === "bodyFat" ? "#82ca9d" : "#ffc658"}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <LineChartIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                  <p className="text-muted-foreground">No hay datos de progreso disponibles</p>
                  {mode === "trainer" && (
                    <Button variant="outline" className="mt-4">Agregar mediciones</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stats;
