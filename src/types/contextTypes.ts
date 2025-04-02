
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
  documents?: any[]; // Using any for PdfDocumentProps to avoid circular dependencies
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

export interface AppContextProps {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  exercises: any[]; // Using any for Exercise to avoid circular dependencies
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
  bookSession: (clientId: string, slotId: string) => ScheduledSession | undefined;
  cancelSession: (sessionId: string) => void;
  getExerciseById: (id: string) => any | undefined; // Using any for Exercise to avoid circular dependencies
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
