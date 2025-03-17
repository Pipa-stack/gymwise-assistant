
import { useNavigate } from "react-router-dom";
import { Client, ScheduledSession } from "@/context/AppContext";
import { TrainerStatsCards } from "./StatsCards";
import NextSession from "./NextSession";
import TodaySessions from "./TodaySessions";
import RecentClients from "./RecentClients";
import { ArrowUpRight, Target, LineChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrainerDashboardProps {
  clients: Client[];
  upcomingSessions: ScheduledSession[];
  todaySessions: ScheduledSession[];
  trainingPlansCount: number;
  exercisesCount: number;
}

const TrainerDashboard = ({ 
  clients, 
  upcomingSessions, 
  todaySessions,
  trainingPlansCount, 
  exercisesCount 
}: TrainerDashboardProps) => {
  const navigate = useNavigate();
  
  // Get client for next session
  const nextSession = upcomingSessions[0];
  const nextSessionClient = nextSession 
    ? clients.find(client => client.id === nextSession.clientId) 
    : undefined;
  
  // Quick metrics for the summary section
  const activeClientsCount = clients.length;
  const todaySessionsCount = todaySessions.length;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 shadow-sm border border-border/40">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">¡Bienvenido, Entrenador!</h2>
            <p className="text-muted-foreground max-w-lg">
              Gestiona tus clientes, sesiones y planes de entrenamiento desde tu panel de control. Hoy tienes {todaySessionsCount} sesiones programadas.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => navigate("/clients")}>
                <Users className="mr-2 h-4 w-4" />
                Ver Clientes
              </Button>
              <Button variant="outline" onClick={() => navigate("/calendar")}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Calendario
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{activeClientsCount}</div>
              <div className="text-sm text-muted-foreground">Clientes</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{todaySessionsCount}</div>
              <div className="text-sm text-muted-foreground">Hoy</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{upcomingSessions.length}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
          </div>
        </div>
      </div>

      <TrainerStatsCards 
        clientsCount={clients.length}
        sessionsCount={upcomingSessions.length}
        plansCount={trainingPlansCount}
        exercisesCount={exercisesCount}
      />

      <div className="grid gap-6 md:grid-cols-8 lg:grid-cols-12">
        <NextSession 
          nextSession={nextSession} 
          client={nextSessionClient} 
        />
        
        <TodaySessions 
          sessions={todaySessions} 
          clients={clients} 
        />
        
        <RecentClients clients={clients} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-6 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="mr-2 h-5 w-5 text-primary" />
              Objetivos Destacados
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
              Ver Todos
            </Button>
          </div>
          <div className="border rounded-md p-4 space-y-3">
            {clients.slice(0, 3).map(client => (
              <div key={client.id} className="flex justify-between items-center p-2 hover:bg-accent/40 rounded-md transition-colors">
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.goal}</div>
                </div>
                <div className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-md">
                  En Progreso
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-6 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Progreso de Clientes
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/stats")}>
              Ver Estadísticas
            </Button>
          </div>
          <div className="border rounded-md p-4 space-y-3">
            {clients.slice(0, 3).map(client => {
              // Determine progress percentage based on progress array
              const progressPercentage = client.progress && client.progress.length > 0 
                ? Math.min(client.progress.length * 10, 100) 
                : 0;
              
              return (
                <div key={client.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">{progressPercentage}%</div>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
