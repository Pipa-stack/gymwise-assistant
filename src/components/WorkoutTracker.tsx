
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, CheckCircle2, Clock, ArrowRight, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WorkoutTrackerProps {
  clientId: string;
  trainingPlanId?: string;
}

const WorkoutTracker = ({ clientId, trainingPlanId }: WorkoutTrackerProps) => {
  const { trainingPlans, sessions } = useAppContext();
  
  // Find the active training plan (either the one specified or the first one for the client)
  const activePlan = trainingPlanId 
    ? trainingPlans.find(plan => plan.id === trainingPlanId)
    : trainingPlans.find(plan => plan.clientId === clientId);
  
  // Get completed sessions for this client
  const clientSessions = sessions.filter(session => 
    session.clientId === clientId && 
    session.status === "completed"
  );
  
  // Calculate progress
  const completedWorkouts = clientSessions.length;
  const totalWorkouts = activePlan?.workouts.length || 0;
  const progressPercentage = totalWorkouts > 0 
    ? Math.round((completedWorkouts / totalWorkouts) * 100)
    : 0;
  
  if (!activePlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguimiento de Entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No hay un plan de entrenamiento asignado</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const nextWorkouts = activePlan.workouts.slice(completedWorkouts, completedWorkouts + 3);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4 pb-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            {activePlan.name}
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            {activePlan.goal}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso del plan</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{completedWorkouts} de {totalWorkouts} entrenamientos completados</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-3">
            {nextWorkouts.map((workout, index) => (
              <div 
                key={workout.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
              >
                <div className="bg-primary/90 text-primary-foreground rounded-lg w-12 h-12 flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">Día {workout.day}</h4>
                  <p className="text-muted-foreground text-sm truncate">{workout.name}</p>
                </div>
                {index === 0 ? (
                  <Badge className="bg-primary text-primary-foreground">Siguiente</Badge>
                ) : (
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            ))}

            {nextWorkouts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary mb-3" />
                <p className="text-muted-foreground">¡Has completado todos los entrenamientos!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WorkoutTracker;
