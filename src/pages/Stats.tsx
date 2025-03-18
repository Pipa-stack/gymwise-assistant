
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, CalendarClock } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Progress } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";

// Componentes refactorizados
import StatsHeader from "@/components/stats/StatsHeader";
import StatsSummaryCards from "@/components/stats/StatsSummaryCards";
import OverviewTabContent from "@/components/stats/OverviewTabContent";
import ProgressTabContent from "@/components/stats/ProgressTabContent";
import ActivityTabContent from "@/components/stats/ActivityTabContent";
import DistributionTabContent from "@/components/stats/DistributionTabContent";
import AddMeasurementDialog from "@/components/stats/AddMeasurementDialog";

const Stats = () => {
  const { clients, mode, sessions, setClients } = useAppContext();
  const [activeClient, setActiveClient] = useState(clients[0]?.id || "");
  const [timeRange, setTimeRange] = useState("6m");
  const [statType, setStatType] = useState<"weight" | "bodyFat" | "musclePercentage">("weight");
  const [showAddProgressDialog, setShowAddProgressDialog] = useState(false);

  const clientData = clients.find(client => client.id === activeClient);
  const progressData = clientData?.progress || [];
  
  // Distribución de objetivos para el gráfico circular
  const goalsByDistribution = clients.reduce((acc, client) => {
    acc[client.goal] = (acc[client.goal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const goalsData = Object.keys(goalsByDistribution).map(goal => ({
    name: goal,
    value: goalsByDistribution[goal]
  }));
  
  // Datos de actividad para el gráfico de barras
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

  // Sesiones completadas del cliente seleccionado
  const completedSessions = sessions.filter(session => 
    (clientData && session.clientId === clientData.id) && 
    session.status === "completed"
  );

  const sessionsPerWeek = completedSessions.length > 0 ? 
    Math.round((completedSessions.length / 4) * 10) / 10 : 0;

  // Función para guardar una nueva medición
  const handleSaveMeasurement = (newMeasurement: Progress) => {
    if (!clientData) return;

    const updatedClients = clients.map(client => {
      if (client.id === clientData.id) {
        const updatedProgress = [...(client.progress || []), newMeasurement];
        return {
          ...client,
          progress: updatedProgress
        };
      }
      return client;
    });

    setClients(updatedClients);
    
    toast({
      title: "Medición guardada",
      description: "Los datos de progreso han sido actualizados correctamente"
    });
  };

  return (
    <div className="space-y-8">
      <StatsHeader 
        mode={mode}
        activeClient={activeClient}
        setActiveClient={setActiveClient}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        clients={clients}
        onAddMeasurement={() => setShowAddProgressDialog(true)}
      />

      <StatsSummaryCards 
        progressData={progressData}
        height={clientData?.height}
        completedSessions={completedSessions.length}
        sessionsPerWeek={sessionsPerWeek}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="border-b w-full flex justify-start space-x-2">
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
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTabContent 
            activityData={activityData}
            goalsData={goalsData}
            mode={mode}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <ProgressTabContent 
            progressData={progressData}
            statType={statType}
            setStatType={setStatType}
            mode={mode}
            clientName={clientData?.name}
            onAddMeasurement={() => setShowAddProgressDialog(true)}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityTabContent completedSessions={completedSessions} />
        </TabsContent>
      </Tabs>

      <AddMeasurementDialog 
        open={showAddProgressDialog} 
        onOpenChange={setShowAddProgressDialog}
        onSave={handleSaveMeasurement}
      />
    </div>
  );
};

export default Stats;
