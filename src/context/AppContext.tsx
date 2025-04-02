
import React, { createContext, useContext, useState, useEffect } from "react";
import { exercisesData } from '@/data/exercisesData';
import { 
  sampleClients, 
  sampleTrainingPlans, 
  sampleSessions, 
  generateAvailableSlots 
} from '@/data/sampleData';
import { 
  UserMode, 
  Client, 
  TrainingPlan, 
  CustomRoutine, 
  ScheduledSession, 
  AvailableSlot, 
  AppContextProps, 
  WeightHistory 
} from '@/types/contextTypes';
import { 
  bookSession as bookSessionService, 
  cancelSession as cancelSessionService 
} from '@/services/sessionService';
import {
  addWeightHistory as addWeightHistoryService,
  addSampleWeightHistory as addSampleWeightHistoryService
} from '@/services/progressService';
import {
  createCustomRoutine as createCustomRoutineService,
  updateCustomRoutine as updateCustomRoutineService,
  addExerciseToRoutine as addExerciseToRoutineService,
  addSetToExercise as addSetToExerciseService,
  updateExerciseSet as updateExerciseSetService,
  deleteExerciseFromRoutine as deleteExerciseFromRoutineService,
  deleteSetFromExercise as deleteSetFromExerciseService
} from '@/services/routineService';

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<UserMode>("client");
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(sampleTrainingPlans);
  const [customRoutines, setCustomRoutines] = useState<CustomRoutine[]>([]);
  const [sessions, setSessions] = useState<ScheduledSession[]>(sampleSessions);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>(generateAvailableSlots());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get exercise by ID
  const getExerciseById = (id: string) => {
    return exercisesData.find(exercise => exercise.id === id);
  };

  // Session management functions
  const handleBookSession = (clientId: string, slotId: string) => {
    return bookSessionService(clientId, slotId, availableSlots, sessions, setSessions, setAvailableSlots);
  };

  const handleCancelSession = (sessionId: string) => {
    cancelSessionService(sessionId, sessions, setSessions, setAvailableSlots);
  };

  // Progress management functions
  const handleAddWeightHistory = (clientId: string, exerciseId: string, weight: number, reps: number, notes?: string) => {
    addWeightHistoryService(clientId, exerciseId, weight, reps, notes, setClients);
  };

  const handleAddSampleWeightHistory = (clientId: string, exerciseId: string, records: Omit<WeightHistory, "exerciseId">[]) => {
    addSampleWeightHistoryService(clientId, exerciseId, records, setClients);
  };

  // Routine management functions
  const handleCreateCustomRoutine = (name: string, clientId?: string) => {
    return createCustomRoutineService(name, clientId, setCustomRoutines);
  };

  const handleUpdateCustomRoutine = (routineId: string, data: Partial<CustomRoutine>) => {
    updateCustomRoutineService(routineId, data, setCustomRoutines);
  };

  const handleAddExerciseToRoutine = (routineId: string, exerciseId: string) => {
    addExerciseToRoutineService(routineId, exerciseId, setCustomRoutines);
  };

  const handleAddSetToExercise = (routineId: string, routineExerciseId: string) => {
    addSetToExerciseService(routineId, routineExerciseId, setCustomRoutines);
  };

  const handleUpdateExerciseSet = (
    routineId: string, 
    routineExerciseId: string, 
    setId: string, 
    weight: number, 
    reps: number
  ) => {
    updateExerciseSetService(routineId, routineExerciseId, setId, weight, reps, setCustomRoutines);
  };

  const handleDeleteExerciseFromRoutine = (routineId: string, routineExerciseId: string) => {
    deleteExerciseFromRoutineService(routineId, routineExerciseId, setCustomRoutines);
  };

  const handleDeleteSetFromExercise = (routineId: string, routineExerciseId: string, setId: string) => {
    deleteSetFromExerciseService(routineId, routineExerciseId, setId, setCustomRoutines);
  };

  const value = {
    mode,
    setMode,
    clients,
    setClients,
    exercises: exercisesData,
    trainingPlans,
    setTrainingPlans,
    customRoutines,
    setCustomRoutines,
    sessions,
    setSessions,
    availableSlots,
    setAvailableSlots,
    loading,
    setLoading,
    bookSession: handleBookSession,
    cancelSession: handleCancelSession,
    getExerciseById,
    addWeightHistory: handleAddWeightHistory,
    addSampleWeightHistory: handleAddSampleWeightHistory,
    createCustomRoutine: handleCreateCustomRoutine,
    updateCustomRoutine: handleUpdateCustomRoutine,
    addExerciseToRoutine: handleAddExerciseToRoutine,
    addSetToExercise: handleAddSetToExercise,
    updateExerciseSet: handleUpdateExerciseSet,
    deleteExerciseFromRoutine: handleDeleteExerciseFromRoutine,
    deleteSetFromExercise: handleDeleteSetFromExercise
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

// Re-export types for easier access
export type { 
  UserMode, 
  Client, 
  Progress, 
  WeightHistory, 
  TrainingPlan, 
  Workout, 
  WorkoutExercise, 
  CustomRoutine, 
  CustomRoutineExercise, 
  CustomRoutineSet, 
  ScheduledSession, 
  AvailableSlot 
} from '@/types/contextTypes';
