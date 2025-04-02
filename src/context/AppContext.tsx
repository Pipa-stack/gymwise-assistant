import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { PdfDocumentProps } from "@/components/dashboard/PdfDocument";
import { exercisesData } from '@/data/exercisesData';
import type { Exercise } from '@/data/exercisesData';

// Types for our data models
export type UserMode = "trainer" | "client";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  goal: string;
  startDate: string;
  height?: number;
  photo?: string;
  progress?: Progress[];
  documents?: PdfDocumentProps[];
  weightHistory?: WeightHistory[];
}

export interface Progress {
  date: string;
  weight: number;
  bodyFat?: number;
  musclePercentage?: number;
  notes?: string;
}

export interface WeightHistory {
  exerciseId: string;
  date: string;
  weight: number;
  reps: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  goal: string;
  duration: number;
  createdAt: string;
  clientId?: string;
  workouts: Workout[];
}

export interface Workout {
  id: string;
  day: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  rest: number;
  notes?: string;
  weightHistory?: WeightHistory[];
}

export interface CustomRoutine {
  id: string;
  name: string;
  createdAt: string;
  clientId?: string;
  exercises: CustomRoutineExercise[];
}

export interface CustomRoutineExercise {
  id: string;
  exerciseId: string;
  sets: CustomRoutineSet[];
}

export interface CustomRoutineSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
}

export interface ScheduledSession {
  id: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  trainingPlanId?: string;
}

export interface AvailableSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isTaken: boolean;
}

interface AppContextProps {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  exercises: Exercise[];
  trainingPlans: TrainingPlan[];
  setTrainingPlans: React.Dispatch<React.SetStateAction<TrainingPlan[]>>;
  customRoutines: CustomRoutine[];
  setCustomRoutines: React.Dispatch<React.SetStateAction<CustomRoutine[]>>;
  sessions: ScheduledSession[];
  setSessions: React.Dispatch<React.SetStateAction<ScheduledSession[]>>;
  availableSlots: AvailableSlot[];
  setAvailableSlots: React.Dispatch<React.SetStateAction<AvailableSlot[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  bookSession: (clientId: string, slotId: string) => void;
  cancelSession: (sessionId: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;
  addWeightHistory: (clientId: string, exerciseId: string, weight: number, reps: number, notes?: string) => void;
  addSampleWeightHistory: (clientId: string, exerciseId: string, records: Omit<WeightHistory, "exerciseId">[]) => void;
  createCustomRoutine: (name: string, clientId?: string) => CustomRoutine;
  updateCustomRoutine: (routineId: string, data: Partial<CustomRoutine>) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  addSetToExercise: (routineId: string, routineExerciseId: string) => void;
  updateExerciseSet: (routineId: string, routineExerciseId: string, setId: string, weight: number, reps: number) => void;
  deleteExerciseFromRoutine: (routineId: string, routineExerciseId: string) => void;
  deleteSetFromExercise: (routineId: string, routineExerciseId: string, setId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const sampleClients: Client[] = [
  {
    id: "c1",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "+34 666 123 456",
    age: 32,
    goal: "Hipertrofia",
    startDate: "2023-09-15",
    height: 1.78,
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    progress: [
      { date: "2023-09-15", weight: 85, bodyFat: 22 },
      { date: "2023-10-15", weight: 83, bodyFat: 20 },
      { date: "2023-11-15", weight: 81, bodyFat: 18 },
    ],
    documents: []
  },
  {
    id: "c2",
    name: "Ana López",
    email: "ana.lopez@example.com",
    phone: "+34 666 789 012",
    age: 28,
    goal: "Definición",
    startDate: "2023-10-01",
    height: 1.65,
    photo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    progress: [
      { date: "2023-10-01", weight: 65, bodyFat: 24 },
      { date: "2023-11-01", weight: 64, bodyFat: 22 },
      { date: "2023-12-01", weight: 63, bodyFat: 21 },
    ],
    documents: []
  },
  {
    id: "c3",
    name: "Miguel García",
    email: "miguel.garcia@example.com",
    phone: "+34 666 345 678",
    age: 42,
    goal: "Fuerza",
    startDate: "2023-08-15",
    height: 1.82,
    photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    progress: [
      { date: "2023-08-15", weight: 90, bodyFat: 25 },
      { date: "2023-09-15", weight: 88, bodyFat: 24 },
      { date: "2023-10-15", weight: 87, bodyFat: 23 },
    ],
    documents: []
  }
];

const sampleTrainingPlans: TrainingPlan[] = [
  {
    id: "p1",
    name: "Plan de hipertrofia",
    description: "Plan de entrenamiento para aumentar la masa muscular",
    goal: "Hipertrofia",
    duration: 12,
    createdAt: "2023-09-01",
    clientId: "c1",
    workouts: [
      {
        id: "w1",
        day: 1,
        name: "Pecho y tríceps",
        exercises: [
          { exerciseId: "e1", sets: 4, reps: 10, rest: 90 }
        ]
      },
      {
        id: "w2",
        day: 2,
        name: "Espalda y bíceps",
        exercises: [
          { exerciseId: "e3", sets: 4, reps: 8, rest: 120 }
        ]
      },
      {
        id: "w3",
        day: 3,
        name: "Piernas",
        exercises: [
          { exerciseId: "e2", sets: 4, reps: 10, rest: 120 }
        ]
      }
    ]
  }
];

const sampleSessions: ScheduledSession[] = [
  {
    id: "s1",
    clientId: "c1",
    date: "2023-12-15",
    startTime: "09:00",
    endTime: "10:00",
    status: "scheduled",
    trainingPlanId: "p1"
  },
  {
    id: "s2",
    clientId: "c2",
    date: "2023-12-16",
    startTime: "10:30",
    endTime: "11:30",
    status: "scheduled"
  },
  {
    id: "s3",
    clientId: "c3",
    date: "2023-12-14",
    startTime: "17:00",
    endTime: "18:00",
    status: "completed",
    notes: "Aumentó el peso en sentadillas"
  }
];

const generateAvailableSlots = (): AvailableSlot[] => {
  const slots: AvailableSlot[] = [];
  const now = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      for (let hour = 9; hour < 13; hour++) {
        slots.push({
          id: `slot-${date.toISOString().split('T')[0]}-${hour}`,
          date: date.toISOString().split('T')[0],
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isTaken: Math.random() > 0.7
        });
      }
      
      for (let hour = 16; hour < 20; hour++) {
        slots.push({
          id: `slot-${date.toISOString().split('T')[0]}-${hour}`,
          date: date.toISOString().split('T')[0],
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isTaken: Math.random() > 0.7
        });
      }
    }
  }
  
  return slots;
};

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

  const bookSession = (clientId: string, slotId: string) => {
    const slot = availableSlots.find(s => s.id === slotId);
    
    if (!slot) {
      toast({
        title: "Error",
        description: "El horario seleccionado no está disponible",
        variant: "destructive"
      });
      return;
    }
    
    if (slot.isTaken) {
      toast({
        title: "Error",
        description: "Este horario ya está ocupado",
        variant: "destructive"
      });
      return;
    }
    
    const existingSessionsCount = sessions.filter(
      s => s.date === slot.date && 
           s.startTime === slot.startTime &&
           s.status !== "cancelled"
    ).length;
    
    const sessionDate = new Date(slot.date);
    const dayOfWeek = sessionDate.getDay();
    
    const timeSlotsByDay = {
      1: 6,
      2: 6,
      3: 6,
      4: 6,
      5: 6,
      6: 0,
      0: 0
    };
    
    const maxCapacity = timeSlotsByDay[dayOfWeek as keyof typeof timeSlotsByDay] || 0;
    
    if (existingSessionsCount >= maxCapacity) {
      toast({
        title: "Aforo completo",
        description: "Este horario ha alcanzado su capacidad máxima",
        variant: "destructive"
      });
      return;
    }
    
    const newSession: ScheduledSession = {
      id: `session-${Date.now()}`,
      clientId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "scheduled"
    };
    
    setSessions(prev => [...prev, newSession]);
    
    if (mode === "client") {
      setAvailableSlots(prev => 
        prev.map(s => s.id === slotId ? {...s, isTaken: true} : s)
      );
    }
    
    toast({
      title: "Reserva confirmada",
      description: `Sesión reservada para el ${new Date(slot.date).toLocaleDateString('es-ES')} a las ${slot.startTime}`
    });
  };

  const cancelSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      toast({
        title: "Error",
        description: "No se encontró la sesión",
        variant: "destructive"
      });
      return;
    }
    
    setSessions(prev => 
      prev.map(s => s.id === sessionId ? {...s, status: "cancelled"} : s)
    );
    
    const slotId = `slot-${session.date}-${parseInt(session.startTime.split(':')[0])}`;
    setAvailableSlots(prev => 
      prev.map(s => s.id === slotId ? {...s, isTaken: false} : s)
    );
    
    toast({
      title: "Sesión cancelada",
      description: `La sesión del ${new Date(session.date).toLocaleDateString('es-ES')} a las ${session.startTime} ha sido cancelada`
    });
  };

  const getExerciseById = (id: string) => {
    return exercisesData.find(exercise => exercise.id === id);
  };

  const addWeightHistory = (clientId: string, exerciseId: string, weight: number, reps: number, notes?: string) => {
    const newWeightRecord: WeightHistory = {
      exerciseId,
      date: new Date().toISOString(),
      weight,
      reps,
      notes
    };

    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          weightHistory: [...(client.weightHistory || []), newWeightRecord]
        };
      }
      return client;
    }));

    toast({
      title: "Peso registrado",
      description: "El progreso ha sido guardado correctamente"
    });
  };

  const addSampleWeightHistory = (clientId: string, exerciseId: string, records: Omit<WeightHistory, "exerciseId">[]) => {
    const weightRecords = records.map(record => ({
      ...record,
      exerciseId
    }));

    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        const existingRecords = client.weightHistory || [];
        const filteredExistingRecords = existingRecords.filter(r => r.exerciseId !== exerciseId);
        
        return {
          ...client,
          weightHistory: [...filteredExistingRecords, ...weightRecords]
        };
      }
      return client;
    }));
  };

  const createCustomRoutine = (name: string, clientId?: string): CustomRoutine => {
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
  
  const updateCustomRoutine = (routineId: string, data: Partial<CustomRoutine>) => {
    setCustomRoutines(prev => 
      prev.map(routine => 
        routine.id === routineId 
          ? { ...routine, ...data } 
          : routine
      )
    );
  };
  
  const addExerciseToRoutine = (routineId: string, exerciseId: string) => {
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
  
  const addSetToExercise = (routineId: string, routineExerciseId: string) => {
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
  
  const updateExerciseSet = (
    routineId: string, 
    routineExerciseId: string, 
    setId: string, 
    weight: number, 
    reps: number
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
  
  const deleteExerciseFromRoutine = (routineId: string, routineExerciseId: string) => {
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
  
  const deleteSetFromExercise = (routineId: string, routineExerciseId: string, setId: string) => {
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
    bookSession,
    cancelSession,
    getExerciseById,
    addWeightHistory,
    addSampleWeightHistory,
    createCustomRoutine,
    updateCustomRoutine,
    addExerciseToRoutine,
    addSetToExercise,
    updateExerciseSet,
    deleteExerciseFromRoutine,
    deleteSetFromExercise
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
