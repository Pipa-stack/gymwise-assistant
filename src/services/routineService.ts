
import { CustomRoutine } from "@/types/contextTypes";
import { toast } from "@/hooks/use-toast";

// Create a custom routine
export const createCustomRoutine = (
  name: string, 
  clientId: string | undefined,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
): CustomRoutine => {
  const newRoutine: CustomRoutine = {
    id: `routine-${Date.now()}`,
    name: name || "Nueva Rutina",
    createdAt: new Date().toISOString(),
    clientId,
    exercises: []
  };
  
  setCustomRoutines(prev => [...prev, newRoutine]);
  
  toast({
    title: "Rutina creada",
    description: "La nueva rutina se ha creado correctamente"
  });
  
  return newRoutine;
};

// Update a custom routine
export const updateCustomRoutine = (
  routineId: string, 
  data: Partial<CustomRoutine>,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
) => {
  setCustomRoutines(prev => 
    prev.map(routine => 
      routine.id === routineId 
        ? { ...routine, ...data } 
        : routine
    )
  );
};

// Add exercise to routine
export const addExerciseToRoutine = (
  routineId: string, 
  exerciseId: string,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
) => {
  const routineExerciseId = `exercise-${Date.now()}`;
  const initialSet = {
    id: `set-${Date.now()}`,
    setNumber: 1,
    weight: 0,
    reps: 0
  };
  
  console.log("Adding exercise to routine:", routineId, exerciseId);
  
  setCustomRoutines(prev => {
    const updatedRoutines = prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          exercises: [
            ...routine.exercises,
            {
              id: routineExerciseId,
              exerciseId,
              sets: [initialSet]
            }
          ]
        };
      }
      return routine;
    });
    
    console.log("Updated routines:", updatedRoutines);
    return updatedRoutines;
  });
  
  toast({
    title: "Ejercicio añadido",
    description: "El ejercicio se ha añadido a la rutina"
  });
};

// Add set to exercise
export const addSetToExercise = (
  routineId: string, 
  routineExerciseId: string,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
) => {
  setCustomRoutines(prev => 
    prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          exercises: routine.exercises.map(exercise => {
            if (exercise.id === routineExerciseId) {
              const newSetNumber = exercise.sets.length + 1;
              return {
                ...exercise,
                sets: [
                  ...exercise.sets,
                  {
                    id: `set-${Date.now()}-${newSetNumber}`,
                    setNumber: newSetNumber,
                    weight: 0,
                    reps: 0
                  }
                ]
              };
            }
            return exercise;
          })
        };
      }
      return routine;
    })
  );
};

// Update exercise set
export const updateExerciseSet = (
  routineId: string, 
  routineExerciseId: string, 
  setId: string, 
  weight: number, 
  reps: number,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
) => {
  setCustomRoutines(prev => 
    prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          exercises: routine.exercises.map(exercise => {
            if (exercise.id === routineExerciseId) {
              return {
                ...exercise,
                sets: exercise.sets.map(set => {
                  if (set.id === setId) {
                    return { ...set, weight, reps };
                  }
                  return set;
                })
              };
            }
            return exercise;
          })
        };
      }
      return routine;
    })
  );
};

// Delete exercise from routine
export const deleteExerciseFromRoutine = (
  routineId: string, 
  routineExerciseId: string,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
) => {
  setCustomRoutines(prev => 
    prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          exercises: routine.exercises.filter(
            exercise => exercise.id !== routineExerciseId
          )
        };
      }
      return routine;
    })
  );
  
  toast({
    title: "Ejercicio eliminado",
    description: "El ejercicio se ha eliminado de la rutina"
  });
};

// Delete set from exercise
export const deleteSetFromExercise = (
  routineId: string, 
  routineExerciseId: string, 
  setId: string,
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>
) => {
  setCustomRoutines(prev => 
    prev.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          exercises: routine.exercises.map(exercise => {
            if (exercise.id === routineExerciseId) {
              if (exercise.sets.length > 1) {
                const filteredSets = exercise.sets.filter(set => set.id !== setId);
                
                const renumberedSets = filteredSets.map((set, index) => ({
                  ...set,
                  setNumber: index + 1
                }));
                
                return {
                  ...exercise,
                  sets: renumberedSets
                };
              }
              return exercise;
            }
            return exercise;
          })
        };
      }
      return routine;
    })
  );
};
