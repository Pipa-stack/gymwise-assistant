
import { useNavigate } from "react-router-dom";
import { Client, ScheduledSession } from "@/context/AppContext";
import { TrainerStatsCards } from "./StatsCards";
import NextSession from "./NextSession";
import TodaySessions from "./TodaySessions";
import RecentClients from "./RecentClients";
import { ArrowUpRight, Users, Dumbbell, Calendar } from "lucide-react";
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
  
  const nextSession = upcomingSessions[0];
  const nextSessionClient = nextSession 
    ? clients.find(client => client.id === nextSession.clientId) 
    : undefined;
  
  const activeClientsCount = clients.length;
  const todaySessionsCount = todaySessions.length;
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section - Simplified */}
      <div className="rounded-xl bg-primary/10 p-6 shadow-sm border relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">¡Bienvenido, Entrenador!</h2>
            <p className="text-muted-foreground">
              Hoy tienes {todaySessionsCount} sesiones programadas.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => navigate("/clients")} size="sm">
                <Users className="mr-2 h-4 w-4" />
                Clientes
              </Button>
              <Button variant="outline" onClick={() => navigate("/calendar")} size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Calendario
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center p-3 bg-primary/10 rounded-lg shadow-sm border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-1">{activeClientsCount}</div>
              <div className="text-xs text-muted-foreground">Clientes</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg shadow-sm border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-1">{todaySessionsCount}</div>
              <div className="text-xs text-muted-foreground">Hoy</div>
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

      <div className="grid gap-4 md:grid-cols-8 lg:grid-cols-12">
        <NextSession 
          nextSession={nextSession} 
          client={nextSessionClient} 
        />
        
        <TodaySessions 
          sessions={todaySessions} 
          clients={clients} 
        />
      </div>
      
      <RecentClients clients={clients} />
      
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-12 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Progreso de Clientes</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/stats")} className="gap-1">
              Ver Estadísticas
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="border rounded-lg p-4 space-y-4 shadow-sm bg-card">
            {clients.slice(0, 3).map(client => {
              const progressPercentage = client.progress && client.progress.length > 0 
                ? Math.min(client.progress.length * 10, 100) 
                : 0;
              
              return (
                <div key={client.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-primary font-medium">{progressPercentage}%</div>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
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
