
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Client, ScheduledSession } from "@/context/AppContext";

interface NextSessionProps {
  nextSession: ScheduledSession | undefined;
  client: Client | undefined;
}

const NextSession = ({ nextSession, client }: NextSessionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-3 lg:col-span-4 animate-slide-in-up [animation-delay:500ms]">
      <CardHeader>
        <CardTitle>Próxima Sesión</CardTitle>
        <CardDescription>Tu próxima sesión de entrenamiento</CardDescription>
      </CardHeader>
      <CardContent>
        {nextSession ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{client?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(nextSession.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {nextSession.startTime} - {nextSession.endTime}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center">
            <p className="text-muted-foreground">No hay sesiones programadas</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")} className="w-full">
          <span>Ver Calendario</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NextSession;
