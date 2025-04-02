
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
  // Parse the slotId to get date and time information
  const slotParts = slotId.split('-');
  let slotInfo = null;
  let slotDate = '';
  
  // Handle format: slotid-YYYY-MM-DD
  if (slotParts.length >= 3) {
    slotDate = `${slotParts[slotParts.length - 3]}-${slotParts[slotParts.length - 2]}-${slotParts[slotParts.length - 1]}`;
    slotInfo = availableSlots.find(s => s.id === slotParts.slice(0, slotParts.length - 3).join('-'));
  }
  
  // If we couldn't parse it that way, try the regular lookup
  if (!slotInfo) {
    slotInfo = availableSlots.find(s => s.id === slotId);
    if (slotInfo) {
      slotDate = slotInfo.date;
    }
  }
  
  if (!slotInfo) {
    console.error("Could not find slot with ID:", slotId);
    toast({
      title: "Error",
      description: "El horario seleccionado no está disponible",
      variant: "destructive"
    });
    return;
  }
  
  if (slotInfo.isTaken) {
    toast({
      title: "Error",
      description: "Este horario ya está ocupado",
      variant: "destructive"
    });
    return;
  }
  
  // Find existing sessions for this slot
  const existingSessionsCount = sessions.filter(
    s => s.date === slotDate && 
       s.startTime === slotInfo?.startTime &&
       s.status !== "cancelled"
  ).length;
  
  const sessionDate = new Date(slotDate);
  const dayOfWeek = sessionDate.getDay();
  
  const timeSlotsByDay = {
    1: 6, // Monday
    2: 6, // Tuesday 
    3: 6, // Wednesday
    4: 6, // Thursday
    5: 6, // Friday
    6: 0, // Saturday
    0: 0  // Sunday
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
    date: slotDate,
    startTime: slotInfo.startTime,
    endTime: slotInfo.endTime,
    status: "scheduled"
  };
  
  console.log("Creating new session:", newSession);
  
  // Immediately update sessions state to ensure it's available on navigation
  setSessions(prevSessions => {
    const updatedSessions = [...prevSessions, newSession];
    console.log("Updated sessions array:", updatedSessions);
    return updatedSessions;
  });
  
  // Mark slot as taken
  setAvailableSlots(prevSlots => 
    prevSlots.map(s => {
      if (s.id === slotInfo?.id && s.date === slotDate) {
        return {...s, isTaken: true};
      }
      return s;
    })
  );
  
  // Set flag for successful booking
  sessionStorage.setItem("justBooked", "true");
  sessionStorage.setItem("lastBookedSessionId", newSession.id);
  
  toast({
    title: "Reserva confirmada",
    description: `Sesión reservada para el ${new Date(slotDate).toLocaleDateString('es-ES')} a las ${slotInfo.startTime}`
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
  
  const slotId = `slot-${session.date}-${session.startTime.split(':')[0]}`;
  setAvailableSlots(prev => 
    prev.map(s => s.id === slotId ? {...s, isTaken: false} : s)
  );
  
  toast({
    title: "Sesión cancelada",
    description: `La sesión del ${new Date(session.date).toLocaleDateString('es-ES')} a las ${session.startTime} ha sido cancelada`
  });
};
