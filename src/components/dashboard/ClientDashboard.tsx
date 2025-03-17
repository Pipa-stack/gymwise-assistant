
import { Client, ScheduledSession } from "@/context/AppContext";
import { ClientStatsCards } from "./StatsCards";
import ClientSessions from "./ClientSessions";
import ClientProgress from "./ClientProgress";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientDashboardProps {
  client: Client;
  clientSessions: ScheduledSession[];
}

const ClientDashboard = ({ client, clientSessions }: ClientDashboardProps) => {
  const nextClientSession = clientSessions[0];
  const trainingDays = Math.ceil(
    Math.abs(new Date().getTime() - new Date(client.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mi Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido, {client.name}. Aquí tienes tu resumen.
        </p>
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
