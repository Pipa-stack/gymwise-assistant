
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, ChevronRight, CheckCircle2, Dumbbell, Info, Weight, ArrowRight, BarChart, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [completion, setCompletion] = useState<Record<string, number>>({});
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');
  const [openWorkouts, setOpenWorkouts] = useState<Record<string, boolean>>({});

  // Get current client if in client mode
  const currentClientId = clientId || (mode === "client" ? clients[0]?.id : undefined);

  // Get the training plan
  const plan = trainingPlans.find(p => 
    p.id === planId || (currentClientId && p.clientId === currentClientId)
  );

  // Toggle workout visibility
  const toggleWorkout = (workoutId: string) => {
    setOpenWorkouts(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

  // If no workouts are open, open the first one by default
  useEffect(() => {
    if (plan && plan.workouts.length > 0 && Object.keys(openWorkouts).length === 0) {
      setOpenWorkouts({ [plan.workouts[0].id]: true });
    }
  }, [plan, openWorkouts]);

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
    const workout = plan?.workouts.find(w => 
      w.exercises.some(e => e.exerciseId === currentExerciseId)
    );
    if (workout) {
      markAsCompleted(currentExerciseId, workout.id);
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
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 pb-4">
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
        <CardContent className="p-0">
          <div className="divide-y">
            {plan.workouts.length > 0 ? (
              plan.workouts.map((workout) => (
                <Collapsible
                  key={workout.id}
                  open={openWorkouts[workout.id]}
                  onOpenChange={() => toggleWorkout(workout.id)}
                  className="overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/90 rounded-lg w-12 h-12 flex items-center justify-center shrink-0 text-white shadow-sm">
                        <Dumbbell className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Día {workout.day}</h3>
                        <p className="text-sm text-muted-foreground">{workout.name}</p>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      openWorkouts[workout.id] ? "transform rotate-180" : ""
                    )} />
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="bg-muted/30 py-1 px-4">
                      <div className="text-xs text-muted-foreground py-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Aprox. 60 min
                      </div>
                    </div>
                    <div className="divide-y">
                      {workout.exercises.length > 0 ? (
                        workout.exercises.map(workoutExercise => {
                          const exercise = getExerciseById(workoutExercise.exerciseId);
                          if (!exercise) return null;
                          
                          const key = `${workout.id}-${workoutExercise.exerciseId}`;
                          const completionValue = completion[key] || 0;
                          
                          // Find weight history for this exercise
                          const client = clients.find(c => c.id === currentClientId);
                          const exerciseHistory = client?.weightHistory?.filter(
                            h => h.exerciseId === workoutExercise.exerciseId
                          );
                          
                          // Get the latest weight record if it exists
                          const latestWeight = exerciseHistory?.length 
                            ? exerciseHistory.sort((a, b) => 
                                new Date(b.date).getTime() - new Date(a.date).getTime()
                              )[0]
                            : null;
                          
                          return (
                            <div 
                              key={workoutExercise.exerciseId}
                              className="p-4 hover:bg-accent/20 transition-colors relative"
                            >
                              <div className="grid grid-cols-[1fr,auto] gap-4">
                                <div className="space-y-1">
                                  <div className="font-medium">{exercise.name}</div>
                                  <div className="text-sm text-primary/90 font-medium">
                                    {workoutExercise.sets} series × {workoutExercise.reps} repeticiones
                                  </div>
                                  {latestWeight && (
                                    <div className="mt-1 text-sm font-medium text-success bg-success/10 inline-block px-2 py-0.5 rounded">
                                      {latestWeight.weight} kg × {latestWeight.reps} reps
                                    </div>
                                  )}
                                  {workoutExercise.notes && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Nota: {workoutExercise.notes}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {completionValue === 100 ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-success border-success bg-success/10 h-8 px-2"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => openWeightDialog(workoutExercise.exerciseId)}
                                      className="h-8 px-2"
                                    >
                                      <Weight className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setSelectedExercise(exercise.id)}
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {completionValue > 0 && (
                                <Progress value={completionValue} className="h-1 absolute bottom-0 left-0 right-0 rounded-none" />
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 px-4">
                          <Dumbbell className="h-6 w-6 mx-auto text-muted-foreground opacity-40 mb-2" />
                          <p className="text-muted-foreground">
                            No hay ejercicios asignados para este día. El entrenador debe añadirlos.
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <Dumbbell className="h-8 w-8 mx-auto text-muted-foreground opacity-40 mb-2" />
                <p className="text-muted-foreground">
                  No hay días de entrenamiento asignados en este plan.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 p-4 mt-2">
          <Button 
            onClick={viewWeightProgress}
            variant="default"
            className="w-full gap-2 bg-primary/90 hover:bg-primary shadow-sm"
          >
            <BarChart className="h-4 w-4" />
            Ver progreso de pesos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
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

