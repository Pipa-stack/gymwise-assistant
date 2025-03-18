
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { X, Plus, Clock, Dumbbell, Search, ChevronLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const { routineId } = useParams();
  const { 
    customRoutines, 
    exercises, 
    createCustomRoutine, 
    updateCustomRoutine,
    addExerciseToRoutine,
    addSetToExercise,
    updateExerciseSet,
    deleteExerciseFromRoutine,
    getExerciseById
  } = useAppContext();

  // Estado para la rutina actual
  const [routine, setRoutine] = useState<ReturnType<typeof useAppContext>["customRoutines"][0] | null>(null);
  const [routineTitle, setRoutineTitle] = useState("");
  
  // Estado para el diálogo de añadir ejercicio
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("Todo");
  
  // Efectos para inicializar o crear la rutina
  useEffect(() => {
    if (routineId) {
      const existingRoutine = customRoutines.find(r => r.id === routineId);
      if (existingRoutine) {
        setRoutine(existingRoutine);
        setRoutineTitle(existingRoutine.name);
      } else {
        // Manejar caso donde el ID no existe
        toast({
          title: "Rutina no encontrada",
          description: "La rutina que intentas editar no existe",
          variant: "destructive"
        });
        navigate("/training-plans");
      }
    } else {
      // Crear una nueva rutina
      const newRoutine = createCustomRoutine("Nueva Rutina");
      setRoutine(newRoutine);
      setRoutineTitle(newRoutine.name);
    }
  }, [routineId, customRoutines, createCustomRoutine, navigate]);

  // Actualizar el título de la rutina
  useEffect(() => {
    if (routine && routineTitle !== routine.name) {
      updateCustomRoutine(routine.id, { name: routineTitle });
    }
  }, [routineTitle, routine, updateCustomRoutine]);

  // Re-obtener la rutina actualizada cuando cambia customRoutines
  useEffect(() => {
    if (routine) {
      const updatedRoutine = customRoutines.find(r => r.id === routine.id);
      if (updatedRoutine) {
        setRoutine(updatedRoutine);
      }
    }
  }, [customRoutines, routine]);

  // Filtrar ejercicios para el diálogo
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscleGroup === "Todo" || exercise.category === selectedMuscleGroup;
    return matchesSearch && matchesMuscle;
  });

  // Obtener grupos musculares únicos
  const muscleGroups = ["Todo", ...Array.from(new Set(exercises.map(e => e.category)))];

  // Guardar rutina y navegar de vuelta
  const handleSaveRoutine = () => {
    if (!routine) return;
    
    // Validar que la rutina tiene un título
    if (!routineTitle.trim()) {
      toast({
        title: "Error",
        description: "La rutina debe tener un título",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Rutina guardada",
      description: "La rutina se ha guardado correctamente"
    });
    
    navigate("/training-plans");
  };

  // Añadir un ejercicio a la rutina
  const handleAddExercise = (exerciseId: string) => {
    if (!routine) return;
    
    console.log("Añadiendo ejercicio:", exerciseId);
    
    // Añadir el ejercicio a la rutina
    addExerciseToRoutine(routine.id, exerciseId);
    
    // Cerrar el diálogo
    setShowExerciseDialog(false);
    
    // Obtener el nombre del ejercicio para el toast
    const exercise = getExerciseById(exerciseId);
    
    toast({
      title: "Ejercicio añadido",
      description: `${exercise?.name || "Ejercicio"} se ha añadido a tu rutina`
    });
  };

  // Añadir una serie a un ejercicio
  const handleAddSet = (exerciseId: string) => {
    if (!routine) return;
    
    addSetToExercise(routine.id, exerciseId);
    
    toast({
      description: "Serie añadida correctamente"
    });
  };

  // Actualizar una serie de un ejercicio
  const handleUpdateSet = (
    exerciseId: string, 
    setId: string, 
    field: "weight" | "reps", 
    value: string
  ) => {
    if (!routine) return;
    
    const exerciseObj = routine.exercises.find(e => e.id === exerciseId);
    if (!exerciseObj) return;
    
    const set = exerciseObj.sets.find(s => s.id === setId);
    if (!set) return;
    
    const numValue = parseInt(value, 10) || 0;
    
    if (field === "weight") {
      updateExerciseSet(routine.id, exerciseId, setId, numValue, set.reps);
    } else {
      updateExerciseSet(routine.id, exerciseId, setId, set.weight, numValue);
    }
  };

  // Eliminar un ejercicio
  const handleRemoveExercise = (exerciseId: string) => {
    if (!routine) return;
    
    const routineExercise = routine.exercises.find(e => e.id === exerciseId);
    if (!routineExercise) return;
    
    const exercise = getExerciseById(routineExercise.exerciseId);
    const exerciseName = exercise?.name || "Ejercicio";
    
    deleteExerciseFromRoutine(routine.id, exerciseId);
    
    toast({
      title: "Ejercicio eliminado",
      description: `${exerciseName} se ha eliminado de tu rutina`
    });
  };

  if (!routine) {
    return (
      <div className="container flex items-center justify-center h-screen">
        <p className="text-lg">Cargando rutina...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/training-plans")} 
          className="text-primary hover:text-primary/80 px-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>
        <h1 className="text-xl font-medium">
          {routineId ? 'Editar Rutina' : 'Crear Rutina'}
        </h1>
        <Button 
          onClick={handleSaveRoutine}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4"
        >
          <Save className="h-4 w-4 mr-1" />
          Guardar
        </Button>
      </header>

      {/* Alerta de ayuda */}
      <div className="bg-yellow-400 text-black p-4 relative">
        <p className="pr-10">Estás creando una rutina. Añade ejercicios y configura series, repeticiones y pesos.</p>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 p-1 hover:bg-yellow-500/20"
          onClick={() => toast({
            title: "Ayuda",
            description: "Añade ejercicios a tu rutina y especifica series, repeticiones y peso para cada uno."
          })}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Formulario de rutina */}
      <div className="p-4">
        <Input
          value={routineTitle}
          onChange={(e) => setRoutineTitle(e.target.value)}
          placeholder="Título de la Rutina"
          className="bg-transparent border-b rounded-none px-0 text-xl placeholder:text-gray-500 focus-visible:ring-0"
        />
      </div>

      {/* Lista de ejercicios */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {routine.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-muted-foreground text-center">
              Empieza agregando un ejercicio a tu rutina
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {routine.exercises.map((routineExercise) => {
              const exerciseDetails = getExerciseById(routineExercise.exerciseId);
              if (!exerciseDetails) return null;

              return (
                <div key={routineExercise.id} className="bg-card rounded-lg overflow-hidden shadow-sm">
                  <div className="flex items-center p-4 border-b">
                    <div className="h-12 w-12 rounded-full bg-muted flex-shrink-0 overflow-hidden mr-3">
                      {exerciseDetails.imageUrl ? (
                        <img 
                          src={exerciseDetails.imageUrl} 
                          alt={exerciseDetails.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <Dumbbell className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-primary font-medium">{exerciseDetails.name}</h3>
                      <p className="text-sm text-muted-foreground">{exerciseDetails.category}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveExercise(routineExercise.id)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center text-primary mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Temporizador de descanso: APAGADO
                    </div>

                    <div className="grid grid-cols-3 gap-4 font-medium text-muted-foreground text-sm mb-2">
                      <div>SERIE</div>
                      <div>KG</div>
                      <div>REPS</div>
                    </div>

                    {routineExercise.sets.map((set) => (
                      <div key={set.id} className="grid grid-cols-3 gap-4 mb-2">
                        <div className="flex items-center">
                          <span className="text-xl font-bold">{set.setNumber}</span>
                        </div>
                        <Input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => handleUpdateSet(routineExercise.id, set.id, "weight", e.target.value)}
                          className="bg-muted border-none text-center"
                          placeholder="-"
                        />
                        <Input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) => handleUpdateSet(routineExercise.id, set.id, "reps", e.target.value)}
                          className="bg-muted border-none text-center"
                          placeholder="-"
                        />
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => handleAddSet(routineExercise.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Serie
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button 
          className="w-full bg-primary hover:bg-primary/90 py-6 text-base"
          onClick={() => setShowExerciseDialog(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar ejercicio
        </Button>
      </div>

      {/* Diálogo para añadir ejercicio */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="text-center">Agregar Ejercicio</DialogTitle>
            <DialogDescription className="text-center">
              Busca y selecciona ejercicios para añadir a tu rutina
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ejercicio"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
            {muscleGroups.map((group) => (
              <Button
                key={group}
                variant={selectedMuscleGroup === group ? "default" : "outline"}
                className={`flex-shrink-0`}
                onClick={() => setSelectedMuscleGroup(group)}
              >
                {group}
              </Button>
            ))}
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-2">
            {filteredExercises.map((exercise) => (
              <div 
                key={exercise.id}
                className="flex items-center p-3 border rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => handleAddExercise(exercise.id)}
              >
                <div className="h-12 w-12 rounded-full bg-muted overflow-hidden mr-3">
                  {exercise.imageUrl ? (
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <Dumbbell className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.category}</p>
                </div>
              </div>
            ))}

            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron ejercicios
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateRoutine;
