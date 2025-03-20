
import { useNavigate } from "react-router-dom";
import { Client, ScheduledSession } from "@/context/AppContext";
import { TrainerStatsCards } from "./StatsCards";
import NextSession from "./NextSession";
import TodaySessions from "./TodaySessions";
import RecentClients from "./RecentClients";
import { ArrowUpRight, Target, LineChart, Users, Dumbbell, Calendar, Award, Trophy, Star } from "lucide-react";
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
      <div className="rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-background p-8 shadow-md border border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">¡Bienvenido, Entrenador!</h2>
            <p className="text-muted-foreground max-w-lg text-base">
              Gestiona tus clientes, sesiones y planes de entrenamiento desde tu panel de control. Hoy tienes {todaySessionsCount} sesiones programadas.
            </p>
            <div className="flex gap-3 pt-3">
              <Button onClick={() => navigate("/clients")} className="rounded-lg">
                <Users className="mr-2 h-4 w-4" />
                Ver Clientes
              </Button>
              <Button variant="outline" onClick={() => navigate("/calendar")} className="rounded-lg">
                <Calendar className="mr-2 h-4 w-4" />
                Calendario
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center p-4 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-1">{activeClientsCount}</div>
              <div className="text-sm text-muted-foreground">Clientes</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-1">{todaySessionsCount}</div>
              <div className="text-sm text-muted-foreground">Hoy</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-xl shadow-sm border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-1">{upcomingSessions.length}</div>
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
        <div className="md:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Target className="mr-2 h-5 w-5 text-primary" />
              Objetivos Destacados
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/clients")} className="gap-1 hover:bg-primary/10 rounded-lg">
              Ver Todos
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="border rounded-xl p-4 space-y-3 shadow-sm bg-card">
            {clients.slice(0, 3).map(client => (
              <div key={client.id} className="flex justify-between items-center p-3 hover:bg-accent/40 rounded-lg transition-colors">
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.goal}</div>
                </div>
                <div className="text-sm px-2.5 py-1 bg-primary/15 text-primary rounded-md font-medium">
                  En Progreso
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Progreso de Clientes
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/stats")} className="gap-1 hover:bg-primary/10 rounded-lg">
              Ver Estadísticas
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="border rounded-xl p-4 space-y-4 shadow-sm bg-card">
            {clients.slice(0, 3).map(client => {
              // Determine progress percentage based on progress array
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

      {/* New Achievements Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Award className="mr-2 h-5 w-5 text-primary" />
            Logros Recientes
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/achievements")} className="gap-1 hover:bg-primary/10 rounded-lg">
            Ver Todos
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <AchievementPreview
            title="Entrenador Estrella"
            icon={<Star className="h-8 w-8 text-yellow-400" />}
            progress={85}
          />
          <AchievementPreview
            title="Mentor de Campeones"
            icon={<Trophy className="h-8 w-8 text-amber-500" />}
            progress={60}
          />
          <AchievementPreview
            title="Experto en Nutrición"
            icon={<Award className="h-8 w-8 text-emerald-500" />}
            progress={40}
          />
        </div>
      </div>
    </div>
  );
};

const AchievementPreview = ({ 
  title, 
  icon, 
  progress 
}: { 
  title: string;
  icon: JSX.Element;
  progress: number;
}) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card hover:bg-gradient-to-br hover:from-background hover:to-primary/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-primary/10">
          {icon}
        </div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Progreso</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
