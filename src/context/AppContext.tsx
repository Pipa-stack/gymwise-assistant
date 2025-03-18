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
}

export interface Progress {
  date: string;
  weight: number;
  bodyFat?: number;
  musclePercentage?: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  target: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  steps: string[];
  videoUrl?: string;
  imageUrl?: string;
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
  sessions: ScheduledSession[];
  setSessions: React.Dispatch<React.SetStateAction<ScheduledSession[]>>;
  availableSlots: AvailableSlot[];
  setAvailableSlots: React.Dispatch<React.SetStateAction<AvailableSlot[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  bookSession: (clientId: string, slotId: string) => void;
  cancelSession: (sessionId: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;
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
    
    const newSession: ScheduledSession = {
      id: `session-${Date.now()}`,
      clientId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "scheduled"
    };
    
    setSessions(prev => [...prev, newSession]);
    
    setAvailableSlots(prev => 
      prev.map(s => s.id === slotId ? {...s, isTaken: true} : s)
    );
    
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

  const value = {
    mode,
    setMode,
    clients,
    setClients,
    exercises: exercisesData,
    trainingPlans,
    setTrainingPlans,
    sessions,
    setSessions,
    availableSlots,
    setAvailableSlots,
    loading,
    setLoading,
    bookSession,
    cancelSession,
    getExerciseById
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
