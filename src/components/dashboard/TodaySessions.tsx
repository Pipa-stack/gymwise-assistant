
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { Client, ScheduledSession } from "@/context/AppContext";

interface TodaySessionsProps {
  sessions: ScheduledSession[];
  clients: Client[];
}

const TodaySessions = ({ sessions, clients }: TodaySessionsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-5 lg:col-span-8 animate-slide-in-up [animation-delay:600ms]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sesiones de Hoy</CardTitle>
          <CardDescription>Sesiones programadas para hoy</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
          Ver Todas
        </Button>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => {
              const client = clients.find(c => c.id === session.clientId);
              return (
                <div 
                  key={session.id} 
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{client?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/calendar")}
                  >
                    Detalles
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No hay sesiones programadas para hoy</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySessions;
