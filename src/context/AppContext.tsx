import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { PdfDocumentProps } from "@/components/dashboard/PdfDocument";
import { exercisesData, Exercise } from '@/data/exercisesData';

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
  height?: number; // Added height property as optional
  photo?: string;
  progress?: Progress[];
  documents?: PdfDocumentProps[]; // Añadimos los documentos al cliente
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
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
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

// Sample data for initial state
const sampleClients: Client[] = [
  {
    id: "c1",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "+34 666 123 456",
    age: 32,
    goal: "Hipertrofia",
    startDate: "2023-09-15",
    height: 1.78, // Added height
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
    height: 1.65, // Added height
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
    height: 1.82, // Added height
    photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    progress: [
      { date: "2023-08-15", weight: 90, bodyFat: 25 },
      { date: "2023-09-15", weight: 88, bodyFat: 24 },
      { date: "2023-10-15", weight: 87, bodyFat: 23 },
    ],
    documents: []
  }
];

const sampleExercises: Exercise[] = [
  {
    id: "e1",
    name: "Press de banca",
    category: "Pecho",
    target: ["Pectorales", "Tríceps", "Hombros"],
    difficulty: "intermediate",
    description: "Ejercicio compuesto para desarrollar la fuerza y tamaño del pecho",
    steps: [
      "Acuéstate en un banco plano",
      "Agarra la barra con las manos más separadas que los hombros",
      "Baja la barra a la altura del pecho",
      "Empuja la barra hacia arriba hasta extender los brazos"
    ],
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800"
  },
  {
    id: "e2",
    name: "Sentadilla",
    category: "Piernas",
    target: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    difficulty: "intermediate",
    description: "Ejercicio compuesto fundamental para el desarrollo de las piernas",
    steps: [
      "Coloca la barra sobre los trapecios",
      "Separa los pies a la anchura de los hombros",
      "Flexiona las rodillas y baja hasta que los muslos estén paralelos al suelo",
      "Empuja a través de los talones para volver a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
    imageUrl: "https://images.unsplash.com/photo-1534368786749-b63e05c92717?auto=format&fit=crop&w=800"
  },
  {
    id: "e3",
    name: "Peso muerto",
    category: "Espalda",
    target: ["Espalda baja", "Isquiotibiales", "Glúteos"],
    difficulty: "advanced",
    description: "Ejercicio compuesto para desarrollar la fuerza y tamaño de la espalda y piernas",
    steps: [
      "Colócate con los pies a la anchura de los hombros",
      "Flexiona las caderas y agarra la barra con las manos fuera de las piernas",
      "Mantén la espalda recta y el pecho hacia arriba",
      "Levanta la barra extendiendo las caderas y las rodillas"
    ],
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-a4a01a12931c?auto=format&fit=crop&w=800"
  },
  {
    id: "e4",
    name: "Pull-ups",
    category: "Espalda",
    target: ["Dorsales", "Bíceps", "Antebrazos"],
    difficulty: "intermediate",
    description: "Ejercicio corporal para desarrollar la espalda y los brazos",
    steps: [
      "Agarra la barra con las palmas hacia adelante",
      "Cuelga con los brazos completamente extendidos",
      "Tira de tu cuerpo hacia arriba hasta que tu barbilla supere la barra",
      "Baja controladamente a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800"
  },
  {
    id: "e5",
    name: "Press militar",
    category: "Hombros",
    target: ["Deltoides", "Tríceps", "Trapecio"],
    difficulty: "intermediate",
    description: "Ejercicio compuesto para desarrollar los hombros",
    steps: [
      "De pie, coloca la barra al nivel de los hombros",
      "Mantén el core activado y la espalda recta",
      "Empuja la barra hacia arriba hasta la extensión completa",
      "Baja la barra controladamente a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDI",
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800"
  },
  {
    id: "e6",
    name: "Curl de bíceps",
    category: "Bíceps",
    target: ["Bíceps", "Antebrazos"],
    difficulty: "beginner",
    description: "Ejercicio de aislamiento para bíceps",
    steps: [
      "De pie, sostén las mancuernas con los brazos extendidos",
      "Mantén los codos pegados al cuerpo",
      "Curl hacia arriba manteniendo los codos fijos",
      "Baja controladamente a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800"
  },
  {
    id: "e7",
    name: "Extensiones de tríceps",
    category: "Tríceps",
    target: ["Tríceps"],
    difficulty: "beginner",
    description: "Ejercicio de aislamiento para tríceps",
    steps: [
      "Siéntate en un banco con una mancuerna",
      "Eleva la mancuerna sobre tu cabeza",
      "Baja la mancuerna detrás de tu cabeza flexionando los codos",
      "Extiende los brazos volviendo a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=_gsUck-7M74",
    imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef319?auto=format&fit=crop&w=800"
  },
  {
    id: "e8",
    name: "Crunch abdominal",
    category: "Abdominales",
    target: ["Abdominales superiores", "Oblicuos"],
    difficulty: "beginner",
    description: "Ejercicio básico para abdominales",
    steps: [
      "Acuéstate boca arriba con las rodillas flexionadas",
      "Coloca las manos detrás de la cabeza",
      "Eleva los hombros del suelo contrayendo los abdominales",
      "Baja controladamente a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800"
  },
  {
    id: "e9",
    name: "Hip thrust",
    category: "Glúteos",
    target: ["Glúteos", "Isquiotibiales"],
    difficulty: "intermediate",
    description: "Ejercicio efectivo para el desarrollo de glúteos",
    steps: [
      "Siéntate en el suelo con la espalda apoyada en un banco",
      "Coloca una barra sobre tus caderas",
      "Empuja con los talones y eleva las caderas",
      "Baja controladamente a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=SEdqd1n0cvg",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800"
  },
  {
    id: "e10",
    name: "Remo con barra",
    category: "Espalda",
    target: ["Dorsales", "Romboides", "Bíceps"],
    difficulty: "intermediate",
    description: "Ejercicio compuesto para el desarrollo de la espalda",
    steps: [
      "Inclínate hacia adelante manteniendo la espalda recta",
      "Agarra la barra con las manos más anchas que los hombros",
      "Tira de la barra hacia tu estómago",
      "Baja controladamente"
    ],
    videoUrl: "https://www.youtube.com/watch?v=G8l_8chR5BE",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800"
  },
  {
    id: "e11",
    name: "Press inclinado",
    category: "Pecho",
    target: ["Pectorales superiores", "Deltoides anteriores", "Tríceps"],
    difficulty: "intermediate",
    description: "Variación del press de banca para enfatizar el pecho superior",
    steps: [
      "Acuéstate en un banco inclinado",
      "Agarra la barra con un agarre ligeramente más ancho que los hombros",
      "Baja la barra hacia la parte superior del pecho",
      "Empuja la barra hacia arriba hasta la extensión completa"
    ],
    videoUrl: "https://www.youtube.com/watch?v=jPLdzuHckI8",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800"
  },
  {
    id: "e12",
    name: "Zancadas",
    category: "Piernas",
    target: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    difficulty: "intermediate",
    description: "Ejercicio unilateral para el desarrollo de las piernas",
    steps: [
      "De pie, da un paso largo hacia adelante",
      "Baja la rodilla trasera hacia el suelo",
      "Mantén el torso erguido",
      "Empuja con el pie delantero para volver a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=3XDriUn0udo",
    imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&w=800"
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

// Generar slots disponibles para las próximas 2 semanas
const generateAvailableSlots = (): AvailableSlot[] => {
  const slots: AvailableSlot[] = [];
  const now = new Date();
  
  // Generar slots para los próximos 14 días
  for (let i = 0; i < 14; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    
    // Solo días laborables (de lunes a viernes)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      // Slots de mañana (9:00 - 13:00)
      for (let hour = 9; hour < 13; hour++) {
        slots.push({
          id: `slot-${date.toISOString().split('T')[0]}-${hour}`,
          date: date.toISOString().split('T')[0],
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isTaken: Math.random() > 0.7 // 30% de probabilidad de que esté ocupado
        });
      }
      
      // Slots de tarde (16:00 - 20:00)
      for (let hour = 16; hour < 20; hour++) {
        slots.push({
          id: `slot-${date.toISOString().split('T')[0]}-${hour}`,
          date: date.toISOString().split('T')[0],
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
          isTaken: Math.random() > 0.7 // 30% de probabilidad de que esté ocupado
        });
      }
    }
  }
  
  return slots;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<UserMode>("client"); // Changed default mode to "client"
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [exercises] = useState<Exercise[]>(exercisesData);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(sampleTrainingPlans);
  const [sessions, setSessions] = useState<ScheduledSession[]>(sampleSessions);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>(generateAvailableSlots());
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para reservar una sesión
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
    
    // Crear nueva sesión
    const newSession: ScheduledSession = {
      id: `session-${Date.now()}`,
      clientId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "scheduled"
    };
    
    // Actualizar sesiones
    setSessions(prev => [...prev, newSession]);
    
    // Marcar slot como ocupado
    setAvailableSlots(prev => 
      prev.map(s => s.id === slotId ? {...s, isTaken: true} : s)
    );
    
    toast({
      title: "Reserva confirmada",
      description: `Sesión reservada para el ${new Date(slot.date).toLocaleDateString('es-ES')} a las ${slot.startTime}`
    });
  };

  // Función para cancelar una sesión
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
    
    // Actualizar estado de la sesión
    setSessions(prev => 
      prev.map(s => s.id === sessionId ? {...s, status: "cancelled"} : s)
    );
    
    // Liberar el slot
    const slotId = `slot-${session.date}-${parseInt(session.startTime.split(':')[0])}`;
    setAvailableSlots(prev => 
      prev.map(s => s.id === slotId ? {...s, isTaken: false} : s)
    );
    
    toast({
      title: "Sesión cancelada",
      description: `La sesión del ${new Date(session.date).toLocaleDateString('es-ES')} a las ${session.startTime} ha sido cancelada`
    });
  };

  // Función para obtener un ejercicio por su ID
  const getExerciseById = (id: string) => {
    return exercises.find(exercise => exercise.id === id);
  };

  const value = {
    mode,
    setMode,
    clients,
    setClients,
    exercises,
    setExercises,
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
