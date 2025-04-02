
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, User, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Client, ScheduledSession } from "@/context/AppContext";
import { useAppContext } from "@/context/AppContext";

interface TodaySessionsProps {
  sessions: ScheduledSession[];
  clients: Client[];
}

const TodaySessions = ({ sessions, clients }: TodaySessionsProps) => {
  const navigate = useNavigate();
  const { cancelSession } = useAppContext();
  const [showAll, setShowAll] = useState(false);
  
  // Order sessions by time
  const sortedSessions = [...sessions].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Only show first 3 sessions unless showAll is true
  const displayedSessions = showAll 
    ? sortedSessions 
    : sortedSessions.slice(0, 3);
  
  const handleCancelSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    cancelSession(sessionId);
  };
  
  return (
    <Card className="md:col-span-4 animate-slide-in-up [animation-delay:300ms]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Sesiones de Hoy
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {format(new Date(), "dd MMM", { locale: es })}
          </span>
        </CardTitle>
        <CardDescription>
          {sessions.length === 0 
            ? "No hay sesiones programadas para hoy" 
            : `${sessions.length} sesión${sessions.length !== 1 ? 'es' : ''} para hoy`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {displayedSessions.map(session => {
              const client = clients.find(c => c.id === session.clientId);
              
              return (
                <div 
                  key={session.id} 
                  className="p-3 border rounded-lg flex justify-between items-center hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/clients/${session.clientId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {client?.photo ? (
                        <img src={client.photo} alt={client?.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{client?.name || "Cliente"}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Mark session as completed logic would go here
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                      onClick={(e) => handleCancelSession(e, session.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {sessions.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Mostrar menos" : `Ver todas (${sessions.length})`}
              </Button>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No hay sesiones programadas para hoy</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate("/calendar")}
            >
              Gestionar calendario
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySessions;
