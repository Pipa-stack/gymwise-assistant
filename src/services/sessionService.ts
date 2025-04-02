
import { AvailableSlot, ScheduledSession } from "@/types/contextTypes";
import { toast } from "@/hooks/use-toast";

// Book a session
export const bookSession = (
  clientId: string, 
  slotId: string, 
  availableSlots: AvailableSlot[],
  sessions: ScheduledSession[],
  setSessions: React.Dispatch<React.SetStateAction<ScheduledSession[]>>,
  setAvailableSlots: React.Dispatch<React.SetStateAction<AvailableSlot[]>>
): ScheduledSession | undefined => {
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
  
  console.log("Creating new session:", newSession);
  
  setSessions(prevSessions => [...prevSessions, newSession]);
  
  setAvailableSlots(prevSlots => 
    prevSlots.map(s => s.id === slotId ? {...s, isTaken: true} : s)
  );
  
  sessionStorage.setItem("justBooked", "true");
  
  toast({
    title: "Reserva confirmada",
    description: `Sesión reservada para el ${new Date(slot.date).toLocaleDateString('es-ES')} a las ${slot.startTime}`
  });
  
  console.log("Session has been booked, returning:", newSession);
  return newSession;
};

// Cancel a session
export const cancelSession = (
  sessionId: string,
  sessions: ScheduledSession[],
  setSessions: React.Dispatch<React.SetStateAction<ScheduledSession[]>>,
  setAvailableSlots: React.Dispatch<React.SetStateAction<AvailableSlot[]>>
) => {
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
