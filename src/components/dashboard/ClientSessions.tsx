
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, CalendarCheck, CalendarPlus, Clock } from "lucide-react";
import { format, isToday, addDays, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { ScheduledSession } from "@/context/AppContext";

interface ClientSessionsProps {
  sessions: ScheduledSession[];
}

const ClientSessions = ({ sessions }: ClientSessionsProps) => {
  const navigate = useNavigate();
  
  // Get days until next session
  const getDaysUntilSession = (sessionDate: string) => {
    const today = new Date();
    const date = new Date(sessionDate);
    return differenceInDays(date, today);
  };
  
  return (
    <Card className="md:col-span-4 animate-slide-in-up [animation-delay:400ms] border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-background/0 p-5 rounded-t-lg">
        <CardTitle className="flex items-center">
          <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
          Próximas Sesiones
        </CardTitle>
        <CardDescription>Tus próximas sesiones de entrenamiento</CardDescription>
      </CardHeader>
      <CardContent className="p-4 max-h-[350px] overflow-auto">
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 3).map(session => {
              const sessionDate = new Date(session.date);
              const daysUntil = getDaysUntilSession(session.date);
              const isSessionToday = daysUntil === 0;
              const isTomorrow = daysUntil === 1;
              
              return (
                <div 
                  key={session.id} 
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer relative overflow-hidden"
                  onClick={() => navigate("/calendar")}
                >
                  {(isSessionToday || isTomorrow) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-pulse"></div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarClock className={`h-4 w-4 ${isSessionToday ? "text-primary" : "text-muted-foreground"}`} />
                        <p className={`font-medium text-sm ${isSessionToday ? "text-primary" : ""}`}>
                          {isSessionToday && "Hoy"}
                          {isTomorrow && "Mañana"}
                          {!isSessionToday && !isTomorrow && format(sessionDate, "EEEE, dd 'de' MMMM", { locale: es })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-6 text-sm text-muted-foreground font-medium">
                        <Clock className="h-3 w-3" />
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                    
                    <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      Reservado
                    </div>
                  </div>
                  
                  {isSessionToday && (
                    <div className="mt-2 ml-6 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full inline-block">
                      ¡Hoy! Prepárate para tu sesión
                    </div>
                  )}
                </div>
              );
            })}
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
                <CalendarPlus className="h-4 w-4 mr-2" />
                Reservar Ahora
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/5 rounded-b-lg">
        <Button 
          variant="ghost" 
          className="w-full group"
          onClick={() => navigate("/calendar")}
        >
          <span className="group-hover:mr-2 transition-all">Gestionar Reservas</span>
          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientSessions;
