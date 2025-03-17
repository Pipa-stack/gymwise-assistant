
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, CheckCircle, Clock } from "lucide-react";

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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Progreso de Plan: {activePlan.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{completedWorkouts} de {totalWorkouts} entrenamientos</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="space-y-3">
            {activePlan.workouts.slice(0, 3).map((workout, index) => (
              <div key={workout.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  {clientSessions.length > index ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{workout.name}</div>
                    <div className="text-xs text-muted-foreground">Día {workout.day}</div>
                  </div>
                </div>
                <Badge variant={clientSessions.length > index ? "default" : "outline"}>
                  {clientSessions.length > index ? "Completado" : "Pendiente"}
                </Badge>
              </div>
            ))}
            
            {activePlan.workouts.length > 3 && (
              <div className="text-center text-sm text-muted-foreground">
                +{activePlan.workouts.length - 3} más
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutTracker;
