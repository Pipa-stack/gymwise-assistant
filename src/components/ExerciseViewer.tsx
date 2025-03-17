
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, ChevronRight, CheckCircle2, Dumbbell, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseViewerProps {
  planId?: string;
  clientId?: string;
}

const ExerciseViewer = ({ planId, clientId }: ExerciseViewerProps) => {
  const { trainingPlans, exercises, getExerciseById } = useAppContext();
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [completion, setCompletion] = useState<Record<string, number>>({});

  // Obtener el plan de entrenamiento
  const plan = trainingPlans.find(p => 
    p.id === planId || (clientId && p.clientId === clientId)
  );

  // Obtener los ejercicios del workout seleccionado
  const workoutExercises = plan && selectedWorkout ? 
    plan.workouts.find(w => w.id === selectedWorkout)?.exercises || [] : [];

  // Seleccionar el primer workout si no hay ninguno seleccionado
  if (plan && plan.workouts.length > 0 && !selectedWorkout) {
    setSelectedWorkout(plan.workouts[0].id);
  }

  // Obtener el ejercicio seleccionado
  const exercise = selectedExercise ? getExerciseById(selectedExercise) : null;

  // Función para obtener el ID de video de YouTube
  const getYouTubeVideoId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Función para marcar ejercicio como completado
  const markAsCompleted = (exerciseId: string, workoutId: string) => {
    const key = `${workoutId}-${exerciseId}`;
    setCompletion(prev => ({
      ...prev,
      [key]: 100
    }));
  };

  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan de Entrenamiento</CardTitle>
          <CardDescription>No se ha encontrado ningún plan de entrenamiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Dumbbell className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
            <p className="text-muted-foreground">
              No hay un plan de entrenamiento asignado actualmente
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {plan.goal}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex overflow-x-auto py-2 -mx-1 px-1 snap-x space-x-2">
              {plan.workouts.map(workout => (
                <div 
                  key={workout.id}
                  className={cn(
                    "snap-start shrink-0 rounded-lg border p-3 cursor-pointer transition-colors",
                    selectedWorkout === workout.id ? "bg-primary/10 border-primary" : "hover:bg-accent"
                  )}
                  style={{ width: "180px" }}
                  onClick={() => setSelectedWorkout(workout.id)}
                >
                  <div className="font-medium mb-1">Día {workout.day}</div>
                  <div className="text-sm text-muted-foreground">{workout.name}</div>
                  <div className="text-xs mt-2">
                    {workout.exercises.length} ejercicios
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mt-2">
              {workoutExercises.map(workoutExercise => {
                const exercise = getExerciseById(workoutExercise.exerciseId);
                if (!exercise) return null;

                const key = `${selectedWorkout}-${workoutExercise.exerciseId}`;
                const completionValue = completion[key] || 0;
                
                return (
                  <div 
                    key={workoutExercise.exerciseId}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary rounded-md w-12 h-12 flex items-center justify-center">
                          <Dumbbell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workoutExercise.sets} series × {workoutExercise.reps} repeticiones
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {completionValue === 100 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsCompleted(workoutExercise.exerciseId, selectedWorkout || "")}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedExercise(exercise.id)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {workoutExercise.notes && (
                      <div className="px-4 pb-3 pt-0 text-sm text-muted-foreground">
                        Nota: {workoutExercise.notes}
                      </div>
                    )}
                    {completionValue > 0 && (
                      <Progress value={completionValue} className="h-1 rounded-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Descargar Plan</Button>
          <Button>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <span>Completar Entrenamiento</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        open={!!selectedExercise}
        onOpenChange={(open) => {
          if (!open) setSelectedExercise(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {exercise && (
            <>
              <DialogHeader>
                <DialogTitle>{exercise.name}</DialogTitle>
                <DialogDescription>{exercise.description}</DialogDescription>
              </DialogHeader>
              
              {exercise.videoUrl && (
                <div className="aspect-video w-full rounded-md overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(exercise.videoUrl)}?rel=0`}
                    title={exercise.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Pasos para realizar el ejercicio:</h4>
                  <ol className="space-y-1 pl-5 list-decimal">
                    {exercise.steps.map((step, index) => (
                      <li key={index} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Músculos trabajados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {exercise.target.map((muscle) => (
                      <Badge key={muscle} variant="outline">{muscle}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseViewer;
