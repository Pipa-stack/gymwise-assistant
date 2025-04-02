
import { Client, TrainingPlan, ScheduledSession, AvailableSlot } from "@/types/contextTypes";

export const sampleClients: Client[] = [
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

export const sampleTrainingPlans: TrainingPlan[] = [
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

export const sampleSessions: ScheduledSession[] = [
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

export const generateAvailableSlots = (): AvailableSlot[] => {
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
