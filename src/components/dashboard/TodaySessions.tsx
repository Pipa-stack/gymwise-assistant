
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock, ChevronRight, Calendar } from "lucide-react";
import { Client, ScheduledSession } from "@/context/AppContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TodaySessionsProps {
  sessions: ScheduledSession[];
  clients: Client[];
}

const TodaySessions = ({ sessions, clients }: TodaySessionsProps) => {
  const navigate = useNavigate();
  
  // Get the initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="md:col-span-5 lg:col-span-8 animate-slide-in-up [animation-delay:600ms] border-none shadow-md bg-white dark:bg-gray-950">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/20 to-background p-4 rounded-t-lg">
        <div>
          <CardTitle className="flex items-center text-xl">
            <CalendarClock className="h-5 w-5 mr-2 text-primary" />
            Sesiones de Hoy
          </CardTitle>
          <CardDescription>
            {sessions.length > 0 
              ? `${sessions.length} sesiones programadas para hoy` 
              : "No hay sesiones programadas para hoy"}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/calendar")} className="gap-1">
          <Calendar className="h-4 w-4" />
          Ver Todas
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map(session => {
              const client = clients.find(c => c.id === session.clientId);
              
              // Format the date for display
              const sessionDate = new Date(session.date);
              const formattedDate = format(sessionDate, "EEEE, dd 'de' MMMM", { locale: es });
              
              return (
                <div 
                  key={session.id} 
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {client && getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{client?.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <Clock className="h-3 w-3" />
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/calendar")}
                    className="opacity-70 group-hover:opacity-100 group-hover:bg-primary/10 transition-all"
                  >
                    <span className="mr-1">Detalles</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
                <CalendarClock className="h-8 w-8 text-muted-foreground opacity-70" />
              </div>
              <p className="text-muted-foreground">No hay sesiones programadas para hoy</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => navigate("/calendar")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Programar Nueva Sesión
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySessions;
