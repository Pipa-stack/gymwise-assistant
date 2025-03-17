import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, TrendingUp, CalendarClock, Users, PlusCircle, Scale } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/context/AppContext";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

const Stats = () => {
  const { clients, mode, sessions } = useAppContext();
  const [activeClient, setActiveClient] = useState(clients[0]?.id || "");
  const [timeRange, setTimeRange] = useState("6m");
  const [statType, setStatType] = useState("weight");
  const [showAddProgressDialog, setShowAddProgressDialog] = useState(false);
  const [newProgress, setNewProgress] = useState<Partial<Progress>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    bodyFat: 0,
    musclePercentage: 0,
    notes: ""
  });

  const clientData = clients.find(client => client.id === activeClient);

  const progressData = clientData?.progress || [];
  
  const goalsByDistribution = clients.reduce((acc, client) => {
    acc[client.goal] = (acc[client.goal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goalsData = Object.keys(goalsByDistribution).map(goal => ({
    name: goal,
    value: goalsByDistribution[goal]
  }));
  
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const sessionCount = sessions.filter(session => 
      isSameDay(new Date(session.date), date) && 
      session.status !== "cancelled"
    ).length;
    
    return {
      name: format(date, "EEE", { locale: es }),
      sessions: sessionCount
    };
  }).reverse();

  const progressDataFormatted = progressData.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    weight: item.weight,
    bodyFat: item.bodyFat || 0,
    musclePercentage: item.musclePercentage || 0
  }));

  const calculateTrend = (metric: keyof Progress) => {
    if (progressData.length < 2) return { value: 0, isPositive: true };
    
    const currentValue = progressData[progressData.length - 1][metric];
    const previousValue = progressData[progressData.length - 2][metric];
    
    if (typeof currentValue !== 'number' || typeof previousValue !== 'number') {
      return { value: 0, isPositive: true };
    }
    
    const percentChange = ((currentValue - previousValue) / previousValue) * 100;
    
    let isPositive = metric === 'musclePercentage' ? percentChange > 0 : percentChange < 0;
    
    return {
      value: Math.abs(percentChange).toFixed(1),
      isPositive
    };
  };

  const completedSessions = sessions.filter(session => 
    (clientData && session.clientId === clientData.id) && 
    session.status === "completed"
  );

  const sessionsPerWeek = completedSessions.length > 0 ? 
    Math.round((completedSessions.length / 4) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
        <div className="flex items-center gap-2">
          {mode === "trainer" && (
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
          )}
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
          
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setShowAddProgressDialog(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir Medición
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peso Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-semibold">
                {progressData.length > 0 ? progressData[progressData.length - 1].weight : "N/A"} kg
              </div>
              {progressData.length > 1 && (
                <div className={`text-xs font-medium ${
                  calculateTrend('weight').isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {calculateTrend('weight').isPositive ? '↓' : '↑'} {calculateTrend('weight').value}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              % Grasa Corporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-semibold">
                {progressData.length > 0 && progressData[progressData.length - 1].bodyFat ? 
                  `${progressData[progressData.length - 1].bodyFat}%` : "N/A"}
              </div>
              {progressData.length > 1 && progressData[progressData.length - 1].bodyFat && (
                <div className={`text-xs font-medium ${
                  calculateTrend('bodyFat').isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {calculateTrend('bodyFat').isPositive ? '↓' : '↑'} {calculateTrend('bodyFat').value}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sesiones Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-semibold">
                {completedSessions.length}
              </div>
              <div className="text-xs text-muted-foreground">
                ~{sessionsPerWeek} / semana
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              IMC (Índice de Masa Corporal)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {progressData.length > 0 && clientData && clientData.height ? 
                (progressData[progressData.length - 1].weight / Math.pow(clientData.height, 2)).toFixed(1) : 
                "N/A"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {progressData.length > 0 && clientData && clientData.height ? 
                (() => {
                  const bmi = progressData[progressData.length - 1].weight / Math.pow(clientData.height, 2);
                  if (bmi < 18.5) return "Bajo peso";
                  if (bmi < 25) return "Peso normal";
                  if (bmi < 30) return "Sobrepeso";
                  return "Obesidad";
                })() : 
                ""}
            </div>
          </CardContent>
        </Card>
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
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>Actividad</span>
            </TabsTrigger>
            {mode === "trainer" && (
              <TabsTrigger value="distribution" className="flex items-center gap-1">
                <PieChartIcon className="h-4 w-4" />
                <span>Distribución</span>
              </TabsTrigger>
            )}
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
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowAddProgressDialog(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agregar mediciones
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {progressData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Mediciones</CardTitle>
                <CardDescription>Registro histórico de mediciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...progressData].reverse().map((progress, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">
                          {new Date(progress.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Scale className="h-4 w-4 mr-1 text-primary" />
                          <span className="font-medium">{progress.weight} kg</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {progress.bodyFat !== undefined && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">% Grasa:</span> {progress.bodyFat}%
                          </div>
                        )}
                        {progress.musclePercentage !== undefined && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">% Músculo:</span> {progress.musclePercentage}%
                          </div>
                        )}
                      </div>
                      {progress.notes && (
                        <div className="text-sm text-muted-foreground mt-2">
                          {progress.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                Historial de Sesiones
              </CardTitle>
              <CardDescription>Registro de asistencia a entrenamientos</CardDescription>
            </CardHeader>
            <CardContent>
              {completedSessions.length > 0 ? (
                <div className="space-y-3">
                  {completedSessions.map(session => (
                    <div 
                      key={session.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CalendarClock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {format(new Date(session.date), "EEEE, dd 'de' MMMM", { locale: es })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CalendarClock className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                  <p className="text-muted-foreground">No hay historial de sesiones completadas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {mode === "trainer" && (
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
        )}
      </Tabs>

      <Dialog 
        open={showAddProgressDialog} 
        onOpenChange={setShowAddProgressDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Nueva Medición</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="text-sm font-medium mb-1 block">Peso (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={newProgress.weight || ""}
                  onChange={(e) => setNewProgress(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="bodyFat" className="text-sm font-medium mb-1 block">% Grasa Corporal</label>
                <input
                  type="number"
                  id="bodyFat"
                  value={newProgress.bodyFat || ""}
                  onChange={(e) => setNewProgress(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="musclePercentage" className="text-sm font-medium mb-1 block">% Músculo</label>
                <input
                  type="number"
                  id="musclePercentage"
                  value={newProgress.musclePercentage || ""}
                  onChange={(e) => setNewProgress(prev => ({ ...prev, musclePercentage: parseFloat(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="date" className="text-sm font-medium mb-1 block">Fecha</label>
                <input
                  type="date"
                  id="date"
                  value={newProgress.date || ""}
                  onChange={(e) => setNewProgress(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-1 block">Notas</label>
              <Textarea
                id="notes"
                value={newProgress.notes || ""}
                onChange={(e) => setNewProgress(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[80px]"
                placeholder="Notas adicionales sobre la medición..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddProgressDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Medición
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stats;
