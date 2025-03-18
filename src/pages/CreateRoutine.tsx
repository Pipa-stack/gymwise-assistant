
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { X, Plus, Clock, Dumbbell, Search, ChevronLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      }
    } else {
      // Crear una nueva rutina
      const newRoutine = createCustomRoutine("Nueva Rutina");
      setRoutine(newRoutine);
      setRoutineTitle(newRoutine.name);
    }
  }, [routineId, customRoutines, createCustomRoutine]);

  // Actualizar el título de la rutina
  useEffect(() => {
    if (routine && routineTitle !== routine.name) {
      updateCustomRoutine(routine.id, { name: routineTitle });
    }
  }, [routineTitle, routine, updateCustomRoutine]);

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
    
    addExerciseToRoutine(routine.id, exerciseId);
    setShowExerciseDialog(false);
  };

  // Añadir una serie a un ejercicio
  const handleAddSet = (exerciseId: string) => {
    if (!routine) return;
    
    addSetToExercise(routine.id, exerciseId);
  };

  // Actualizar una serie de un ejercicio
  const handleUpdateSet = (
    exerciseId: string, 
    setId: string, 
    field: "weight" | "reps", 
    value: string
  ) => {
    if (!routine) return;
    
    const exercise = routine.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    const set = exercise.sets.find(s => s.id === setId);
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
    
    deleteExerciseFromRoutine(routine.id, exerciseId);
  };

  if (!routine) {
    return (
      <div className="container flex items-center justify-center h-screen">
        <p className="text-lg">Cargando rutina...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="text-blue-400 hover:text-blue-300 px-2"
        >
          Cancelar
        </Button>
        <h1 className="text-xl font-medium">Crear Rutina</h1>
        <Button 
          onClick={handleSaveRoutine}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4"
        >
          Guardar
        </Button>
      </header>

      {/* Alerta de ayuda */}
      <div className="bg-yellow-400 text-black p-4 relative">
        <p className="pr-10">Estás creando una rutina. Toca para obtener ayuda...</p>
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
          className="bg-transparent border-b border-gray-700 rounded-none px-0 text-xl placeholder:text-gray-500 focus-visible:ring-0"
        />
      </div>

      {/* Lista de ejercicios */}
      <div className="flex-1 p-4 space-y-4">
        {routine.exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <Dumbbell className="h-12 w-12 text-gray-500" strokeWidth={1.5} />
            <p className="text-gray-400 text-center">
              Empieza agregando un ejercicio a tu rutina
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {routine.exercises.map((exercise) => {
              const exerciseDetails = getExerciseById(exercise.exerciseId);
              if (!exerciseDetails) return null;

              return (
                <div key={exercise.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="flex items-center p-4 border-b border-gray-800">
                    <div className="h-12 w-12 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden mr-3">
                      {exerciseDetails.imageUrl ? (
                        <img 
                          src={exerciseDetails.imageUrl} 
                          alt={exerciseDetails.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-700">
                          <Dumbbell className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-blue-400 font-medium">{exerciseDetails.name}</h3>
                      <p className="text-sm text-gray-400">{exerciseDetails.category}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveExercise(exercise.id)}
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center text-blue-400 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Temporizador de descanso: APAGADO
                    </div>

                    <div className="grid grid-cols-3 gap-4 font-medium text-gray-300 text-sm mb-2">
                      <div>SERIE</div>
                      <div>KG</div>
                      <div>REPS</div>
                    </div>

                    {exercise.sets.map((set) => (
                      <div key={set.id} className="grid grid-cols-3 gap-4 mb-2">
                        <div className="flex items-center">
                          <span className="text-xl font-bold">{set.setNumber}</span>
                        </div>
                        <Input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => handleUpdateSet(exercise.id, set.id, "weight", e.target.value)}
                          className="bg-gray-800 border-none text-center"
                          placeholder="-"
                        />
                        <Input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) => handleUpdateSet(exercise.id, set.id, "reps", e.target.value)}
                          className="bg-gray-800 border-none text-center"
                          placeholder="-"
                        />
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      className="w-full mt-2 border-gray-700 text-gray-300"
                      onClick={() => handleAddSet(exercise.id)}
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
          className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-base"
          onClick={() => setShowExerciseDialog(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar ejercicio
        </Button>
      </div>

      {/* Diálogo para añadir ejercicio */}
      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="sm:max-w-md bg-black text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center">Agregar Ejercicio</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar ejercicio"
              className="pl-9 bg-gray-900 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
            {muscleGroups.map((group) => (
              <Button
                key={group}
                variant={selectedMuscleGroup === group ? "default" : "outline"}
                className={`flex-shrink-0 ${
                  selectedMuscleGroup === group 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"
                }`}
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
                className="flex items-center p-3 border border-gray-800 rounded-lg hover:bg-gray-900 cursor-pointer"
                onClick={() => handleAddExercise(exercise.id)}
              >
                <div className="h-12 w-12 rounded-full bg-gray-800 overflow-hidden mr-3">
                  {exercise.imageUrl ? (
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-700">
                      <Dumbbell className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.category}</p>
                </div>
              </div>
            ))}

            {filteredExercises.length === 0 && (
              <div className="text-center py-8 text-gray-400">
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
