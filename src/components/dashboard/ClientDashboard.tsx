
import { Client, ScheduledSession } from "@/context/AppContext";
import { ClientStatsCards } from "./StatsCards";
import ClientSessions from "./ClientSessions";
import ClientProgress from "./ClientProgress";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarCheck, BarChart2 } from "lucide-react";
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
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section - Simplified */}
      <div className="rounded-lg bg-primary/10 p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">¡Hola, {client.name.split(' ')[0]}!</h2>
            <p className="text-muted-foreground">
              Llevas {trainingDays} días entrenando con nosotros.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => navigate("/calendar")} size="sm">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Reservar
              </Button>
              <Button variant="outline" onClick={() => navigate("/stats")} size="sm">
                <BarChart2 className="mr-2 h-4 w-4" />
                Progreso
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-lg shadow-sm border">
            <div className="text-center mb-2">
              <div className="text-sm text-muted-foreground">Progreso Global</div>
              <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <ClientSessions sessions={clientSessions} />
        <ClientProgress progress={client.progress || []} />
      </div>
    </div>
  );
};

export default ClientDashboard;
