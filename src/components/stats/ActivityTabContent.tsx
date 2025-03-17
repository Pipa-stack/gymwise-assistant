
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { ScheduledSession } from "@/context/AppContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityTabContentProps {
  completedSessions: ScheduledSession[];
}

const ActivityTabContent = ({ completedSessions }: ActivityTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          Historial de Sesiones
        </CardTitle>
        <CardDescription>Registro de asistencia a entrenamientos</CardDescription>
      </CardHeader>
      <CardContent>
        {completedSessions.length > 0 ? (
          <div className="space-y-3">
            {completedSessions.map(session => (
              <div 
                key={session.id} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CalendarClock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {format(new Date(session.date), "EEEE, dd 'de' MMMM", { locale: es })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.startTime} - {session.endTime}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Ver Detalles
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            <p className="text-muted-foreground">No hay historial de sesiones completadas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTabContent;
