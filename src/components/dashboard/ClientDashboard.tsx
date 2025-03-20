import { Client, ScheduledSession } from "@/context/AppContext";
import { ClientStatsCards } from "./StatsCards";
import ClientSessions from "./ClientSessions";
import ClientProgress from "./ClientProgress";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarCheck, TrendingUp, Flame, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ClientDashboardProps {
  client: Client;
  clientSessions: ScheduledSession[];
}

const ClientDashboard = ({ client, clientSessions }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const nextClientSession = clientSessions[0];
  const trainingDays = Math.ceil(
    Math.abs(new Date().getTime() - new Date(client.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const completionPercentage = client.progress 
    ? Math.min(Math.round((client.progress.length / 10) * 100), 100) 
    : 0;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section with progress */}
      <div className="rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 border shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">¡Hola, {client.name.split(' ')[0]}!</h2>
            <p className="text-muted-foreground max-w-lg text-base">
              Bienvenido a tu panel personal. Llevas {trainingDays} días entrenando con nosotros. ¡Sigue así!
            </p>
            <div className="flex gap-3 pt-3">
              <Button onClick={() => navigate("/calendar")} className="rounded-lg">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Reservar Sesión
              </Button>
              <Button variant="outline" onClick={() => navigate("/stats")} className="rounded-lg">
                <BarChart2 className="mr-2 h-4 w-4" />
                Ver Progreso
              </Button>
            </div>
          </div>
          
          <div className="p-5 bg-card rounded-xl shadow-md border border-border/50 min-w-[200px] backdrop-blur-sm bg-background/70">
            <div className="text-center mb-3">
              <div className="font-medium text-muted-foreground">Progreso Global</div>
              <div className="text-4xl font-bold text-primary mt-1">{completionPercentage}%</div>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700 ease-in-out" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-3 flex items-center justify-center text-sm text-muted-foreground gap-2">
              <Flame className="h-4 w-4 text-primary" />
              Objetivo: {client.goal}
            </div>
          </div>
        </div>
      </div>

      <ClientStatsCards 
        nextSessionDate={nextClientSession ? 
          format(new Date(nextClientSession.date), "dd 'de' MMM", { locale: es })
          : "Sin programar"}
        trainingDays={trainingDays}
        goal={client.goal}
      />

      <div className="grid gap-6 md:grid-cols-12">
        <ClientSessions sessions={clientSessions} />
        <ClientProgress progress={client.progress || []} />
      </div>
    </div>
  );
};

export default ClientDashboard;
