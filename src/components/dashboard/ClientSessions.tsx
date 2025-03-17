
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ScheduledSession } from "@/context/AppContext";

interface ClientSessionsProps {
  sessions: ScheduledSession[];
}

const ClientSessions = ({ sessions }: ClientSessionsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-4 animate-slide-in-up [animation-delay:400ms]">
      <CardHeader>
        <CardTitle>Próximas Sesiones</CardTitle>
        <CardDescription>Tus próximas sesiones de entrenamiento</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 3).map(session => (
              <div 
                key={session.id} 
                className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => navigate("/calendar")}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <p className="font-medium text-sm">
                    {format(new Date(session.date), "EEEE, dd 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <div className="ml-6 text-sm text-muted-foreground">
                  {session.startTime} - {session.endTime}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No tienes sesiones programadas</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => navigate("/calendar")}
              >
                Reservar Ahora
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate("/calendar")}
        >
          <span>Gestionar Reservas</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientSessions;
