
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, ChevronRight, CheckCircle2, Dumbbell, Info, Weight, ArrowRight, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface ExerciseViewerProps {
  planId?: string;
  clientId?: string;
}

const ExerciseViewer = ({ planId, clientId }: ExerciseViewerProps) => {
  const navigate = useNavigate();
  const { 
    trainingPlans, 
    exercises, 
    getExerciseById, 
    mode,
    clients,
    addWeightHistory 
  } = useAppContext();
  
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [completion, setCompletion] = useState<Record<string, number>>({});
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  // Get current client if in client mode
  const currentClientId = clientId || (mode === "client" ? clients[0]?.id : undefined);

  // Get the training plan
  const plan = trainingPlans.find(p => 
    p.id === planId || (currentClientId && p.clientId === currentClientId)
  );

  // Get exercises for the selected workout
  const workoutExercises = plan && selectedWorkout ? 
    plan.workouts.find(w => w.id === selectedWorkout)?.exercises || [] : [];

  // Select first workout if none selected and if plan exists
  useEffect(() => {
    if (plan && plan.workouts.length > 0 && !selectedWorkout) {
      setSelectedWorkout(plan.workouts[0].id);
    }
  }, [plan, selectedWorkout]);

  // Get selected exercise details
  const exercise = selectedExercise ? getExerciseById(selectedExercise) : null;

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Mark exercise as completed
  const markAsCompleted = (exerciseId: string, workoutId: string) => {
    const key = `${workoutId}-${exerciseId}`;
    setCompletion(prev => ({
      ...prev,
      [key]: 100
    }));
  };

  // Open weight tracking dialog
  const openWeightDialog = (exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
    setWeight('');
    setReps('');
    setNotes('');
    setShowWeightDialog(true);
  };

  // Handle weight submission
  const handleSubmitWeight = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);
    
    if (isNaN(weightNum) || isNaN(repsNum) || !currentExerciseId || !currentClientId) return;
    
    addWeightHistory(currentClientId, currentExerciseId, weightNum, repsNum, notes);
    setShowWeightDialog(false);
    
    // Mark as completed
    if (selectedWorkout) {
      markAsCompleted(currentExerciseId, selectedWorkout);
    }
  };

  // Navigate to see weight progress
  const viewWeightProgress = () => {
    const exerciseSection = document.getElementById("exercise-progress");
    if (exerciseSection) {
      exerciseSection.scrollIntoView({ behavior: 'smooth' });
    }
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
            <div className="flex overflow-x-auto py-2 -mx-1 px-1 snap-x space-x-2 scrollbar-hide">
              {plan.workouts.map(workout => (
                <div 
                  key={workout.id}
                  className={cn(
                    "snap-start shrink-0 rounded-lg border p-3 cursor-pointer transition-colors",
                    selectedWorkout === workout.id 
                      ? "bg-primary/10 border-primary" 
                      : "hover:bg-accent",
                    "min-w-[180px]"
                  )}
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
              {workoutExercises.length > 0 ? (
                workoutExercises.map(workoutExercise => {
                  const exercise = getExerciseById(workoutExercise.exerciseId);
                  if (!exercise) return null;

                  const key = `${selectedWorkout}-${workoutExercise.exerciseId}`;
                  const completionValue = completion[key] || 0;
                  
                  return (
                    <div 
                      key={workoutExercise.exerciseId}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="p-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-secondary rounded-md w-12 h-12 flex items-center justify-center shrink-0">
                            <Dumbbell className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {workoutExercise.sets} series × {workoutExercise.reps} repeticiones
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                          {completionValue === 100 ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-success border-success bg-success/10"
                              onClick={() => viewWeightProgress()}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Completado
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openWeightDialog(workoutExercise.exerciseId)}
                              className="flex-1 md:flex-initial"
                            >
                              <Weight className="h-4 w-4 mr-1" />
                              Registrar peso
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
                })
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <Dumbbell className="h-8 w-8 mx-auto text-muted-foreground opacity-40 mb-2" />
                  <p className="text-muted-foreground">
                    No hay ejercicios asignados para este día. El entrenador debe añadirlos.
                  </p>
                </div>
              )}
            </div>
            {workoutExercises.length > 0 && (
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={viewWeightProgress}
                  variant="default"
                  className="gap-2"
                >
                  <BarChart className="h-4 w-4" />
                  Ver progreso de pesos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Info Dialog */}
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

      {/* Weight Recording Dialog */}
      <Dialog
        open={showWeightDialog}
        onOpenChange={setShowWeightDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Peso</DialogTitle>
            <DialogDescription>
              Introduce el peso que has levantado y el número de repeticiones realizadas.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitWeight} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Peso (kg)</label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej: 50"
                  step="0.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Repeticiones</label>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Ej: 12"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notas (opcional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Añade notas sobre el ejercicio..."
                className="resize-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowWeightDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseViewer;
