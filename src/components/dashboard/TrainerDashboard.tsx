
import { useNavigate } from "react-router-dom";
import { Client, ScheduledSession } from "@/context/AppContext";
import { TrainerStatsCards } from "./StatsCards";
import NextSession from "./NextSession";
import TodaySessions from "./TodaySessions";
import RecentClients from "./RecentClients";
import { isToday } from "date-fns";

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
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido al panel de entrenador de GymWise.
        </p>
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
    </div>
  );
};

export default TrainerDashboard;
