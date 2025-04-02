import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { format, isSameDay, isToday, addMonths, getDay, subMonths, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarClock, 
  CheckCircle, 
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BookingCalendarProps {
  clientId?: string;
  onDateChange?: (date: Date) => void;
  onBookingSuccess?: () => void;
}

// Horarios disponibles por día
const timeSlotsByDay = {
  1: [ // Lunes
    { id: "lun-1", startTime: "08:00", endTime: "09:30", capacity: 6 },
    { id: "lun-2", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "lun-3", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "lun-4", startTime: "15:00", endTime: "16:30", capacity: 6 },
    { id: "lun-5", startTime: "16:30", endTime: "18:00", capacity: 6 },
    { id: "lun-6", startTime: "18:00", endTime: "19:30", capacity: 6 },
    { id: "lun-7", startTime: "19:30", endTime: "21:00", capacity: 6 },
  ],
  2: [ // Martes
    { id: "mar-1", startTime: "08:00", endTime: "09:30", capacity: 6 },
    { id: "mar-2", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "mar-3", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "mar-4", startTime: "15:00", endTime: "16:30", capacity: 6 },
    { id: "mar-5", startTime: "16:30", endTime: "18:00", capacity: 6 },
    { id: "mar-6", startTime: "18:00", endTime: "19:30", capacity: 6 },
    { id: "mar-7", startTime: "19:30", endTime: "21:00", capacity: 6 },
  ],
  3: [ // Miércoles
    { id: "mie-1", startTime: "08:00", endTime: "09:30", capacity: 6 },
    { id: "mie-2", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "mie-3", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "mie-4", startTime: "15:00", endTime: "16:30", capacity: 6 },
    { id: "mie-5", startTime: "16:30", endTime: "18:00", capacity: 6 },
    { id: "mie-6", startTime: "18:00", endTime: "19:30", capacity: 6 },
    { id: "mie-7", startTime: "19:30", endTime: "21:00", capacity: 6 },
  ],
  4: [ // Jueves
    { id: "jue-1", startTime: "08:00", endTime: "09:30", capacity: 6 },
    { id: "jue-2", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "jue-3", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "jue-4", startTime: "15:00", endTime: "16:30", capacity: 6 },
  ],
  5: [ // Viernes
    { id: "vie-1", startTime: "08:00", endTime: "09:30", capacity: 6 },
    { id: "vie-2", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "vie-3", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "vie-4", startTime: "15:00", endTime: "16:30", capacity: 6 },
  ],
  6: [], // Sábado - No hay horarios
  0: [], // Domingo - No hay horarios
};

const BookingCalendar = ({ clientId, onDateChange, onBookingSuccess }: BookingCalendarProps) => {
  const { sessions, bookSession, cancelSession, clients, mode } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const navigate = useNavigate();
  
  // Función para avanzar al siguiente mes
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Función para retroceder al mes anterior
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Función para ir al día actual
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    
    if (onDateChange) {
      onDateChange(today);
    }
    
    toast({
      title: "Fecha actualizada",
      description: "Mostrando el día de hoy"
    });
  };
  
  // Obtener sesiones programadas para la fecha seleccionada
  const sessionsForSelectedDate = selectedDate
    ? sessions.filter(session => 
        session.date === selectedDate.toISOString().split('T')[0] && 
        (mode === "trainer" || session.clientId === clientId) &&
        session.status !== "cancelled"
      )
    : [];

  // Función para manejar la reserva
  const handleBooking = (slotId: string, startTime: string, endTime: string) => {
    if (clientId) {
      setSelectedSlot(slotId);
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
      setShowReservationModal(true);
    } else {
      toast({
        title: "Selecciona un cliente",
        description: "Debes seleccionar un cliente para hacer una reserva",
        variant: "destructive"
      });
    }
  };

  // Función para manejar la cancelación
  const handleCancelBooking = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowCancelModal(true);
  };

  // Función para confirmar la reserva
  const confirmBooking = () => {
    if (clientId && selectedSlot && selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      bookSession(clientId, `${selectedSlot}-${dateStr}`);
      setShowReservationModal(false);
      setSelectedSlot(null);
      
      toast({
        title: "Reserva confirmada",
        description: `Sesión reservada para el ${format(selectedDate, "dd 'de' MMMM", { locale: es })} de ${selectedStartTime} a ${selectedEndTime}`
      });
      
      // Call the onBookingSuccess callback if provided
      if (onBookingSuccess) {
        onBookingSuccess();
      } else {
        // Fallback to the original behavior if no callback is provided
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
  };
  
  // Función para confirmar la cancelación
  const confirmCancelBooking = () => {
    if (selectedSessionId) {
      cancelSession(selectedSessionId);
      setShowCancelModal(false);
      setSelectedSessionId(null);
    }
  };

  // Función para obtener el nombre del día y fecha en formato legible
  const getFormattedDateHeader = (date: Date) => {
    return `📅 ${format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })}`;
  };

  // Función para determinar si una fecha tiene slots disponibles
  const hasAvailableSlots = (date: Date) => {
    const dayOfWeek = getDay(date);
    return (dayOfWeek > 0 && dayOfWeek < 6); // Solo Lunes a Viernes
  };

  // Obtener el número de personas inscritas para un horario específico
  const getSlotOccupancy = (date: Date, slotStartTime: string) => {
    if (!date) return 0;
    const dateStr = date.toISOString().split('T')[0];
    
    // Contar sesiones para esta fecha y hora de inicio
    return sessions.filter(session => 
      session.date === dateStr && 
      session.startTime === slotStartTime &&
      session.status !== "cancelled"
    ).length;
  };

  // Obtener la lista de clientes para un slot específico
  const getClientsInSlot = (date: Date, slotStartTime: string) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    
    const sessionClients = sessions
      .filter(session => 
        session.date === dateStr && 
        session.startTime === slotStartTime &&
        session.status !== "cancelled"
      )
      .map(session => {
        const client = clients.find(c => c.id === session.clientId);
        return {
          name: client?.name || "Cliente",
          id: session.clientId,
          sessionId: session.id
        };
      });
    
    return sessionClients;
  };

  // Verificar si el cliente ya tiene una reserva en este horario
  const hasExistingBooking = (date: Date, slotStartTime: string) => {
    if (!clientId || !date) return false;
    const dateStr = date.toISOString().split('T')[0];
    
    const existingSession = sessions.find(session => 
      session.date === dateStr && 
      session.startTime === slotStartTime &&
      session.clientId === clientId &&
      session.status !== "cancelled"
    );
    
    return existingSession ? existingSession : false;
  };

  // Obtener los slots para la fecha seleccionada
  const timeSlotsForSelectedDate = selectedDate 
    ? timeSlotsByDay[getDay(selectedDate) as keyof typeof timeSlotsByDay] || []
    : [];

  // Función que se ejecuta cuando cambia la fecha seleccionada
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Reserva tu sesión
            </CardTitle>
            <CardDescription>
              Selecciona una fecha y horario disponible para tu próxima sesión de entrenamiento
            </CardDescription>
            
            <div className="flex justify-between items-center mt-4">
              <button 
                className="p-2 rounded-md hover:bg-accent transition-colors"
                onClick={prevMonth}
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-medium">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </h3>
              <button 
                className="p-2 rounded-md hover:bg-accent transition-colors"
                onClick={nextMonth}
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex overflow-x-auto pb-2 -mx-1 px-1">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const isAvailable = hasAvailableSlots(date);
                const dayNumber = date.getDate();
                const dayName = format(date, "EEE", { locale: es });
                
                return (
                  <button
                    key={i}
                    className={cn(
                      "min-w-16 h-16 rounded-md flex flex-col items-center justify-center mx-1",
                      selectedDate && isSameDay(date, selectedDate) 
                        ? "bg-primary text-primary-foreground" 
                        : isAvailable 
                          ? "hover:bg-accent/80" 
                          : "opacity-40 cursor-not-allowed",
                      isToday(date) && !(selectedDate && isSameDay(date, selectedDate)) && "border border-primary"
                    )}
                    onClick={() => isAvailable && handleDateChange(date)}
                    disabled={!isAvailable}
                  >
                    <span className="text-xs font-medium uppercase">{dayName}</span>
                    <span className="text-xl font-bold">{dayNumber}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="text-xs"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Ir a hoy
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedDate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                  <span>{getFormattedDateHeader(selectedDate)}</span>
                </div>
                {hasAvailableSlots(selectedDate) && (
                  <Button variant="ghost" size="sm" onClick={goToToday}>
                    Hoy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeSlotsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {timeSlotsForSelectedDate.map(slot => {
                    const occupancy = getSlotOccupancy(selectedDate, slot.startTime);
                    const isFullyBooked = occupancy >= slot.capacity;
                    const existingBooking = hasExistingBooking(selectedDate, slot.startTime);
                    const isBooked = Boolean(existingBooking);
                    const clientsInSlot = getClientsInSlot(selectedDate, slot.startTime);
                    
                    return (
                      <div 
                        key={slot.id}
                        className={cn(
                          "p-4 border rounded-lg",
                          isBooked ? "bg-primary/10 border-primary/30" : "",
                          isFullyBooked && !isBooked ? "opacity-60" : ""
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted rounded-full p-2">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{slot.startTime} – {slot.endTime}</div>
                              <div className={cn(
                                "text-sm flex items-center gap-1",
                                occupancy === slot.capacity ? "text-red-500" : 
                                occupancy > slot.capacity / 2 ? "text-amber-500" : 
                                "text-green-500"
                              )}>
                                <Users className="h-3 w-3" />
                                <span>({occupancy}/{slot.capacity})</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {isBooked ? (
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-primary/30 text-primary"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Reservado
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => existingBooking && handleCancelBooking(existingBooking.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                disabled={isFullyBooked}
                                onClick={() => handleBooking(slot.id, slot.startTime, slot.endTime)}
                                className={isFullyBooked ? "opacity-50" : ""}
                              >
                                {isFullyBooked ? "Completo" : "Reservar"}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Lista de usuarios inscritos */}
                        {clientsInSlot.length > 0 && mode === "trainer" && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Usuarios inscritos:</p>
                            <div className="flex flex-wrap gap-1">
                              {clientsInSlot.map((client, idx) => (
                                <div key={idx} className="flex items-center bg-primary/5 px-2 py-1 rounded-full text-xs">
                                  <User className="h-3 w-3 mr-1 text-primary" />
                                  <span className="text-primary">{client.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay horarios disponibles para este día</p>
                  <p className="text-sm text-muted-foreground">Selecciona otra fecha o contacta con tu entrenador</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de confirmación de reserva */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-in fade-in-0">
            <CardHeader>
              <CardTitle>Confirmar reserva</CardTitle>
              <CardDescription>
                ¿Estás seguro de que deseas reservar este horario?
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && (
                <div className="space-y-2">
                  <p><span className="font-medium">Fecha:</span> {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                  <p><span className="font-medium">Hora:</span> {selectedStartTime} – {selectedEndTime}</p>
                  <p><span className="font-medium">Duración:</span> 1h 30min</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setShowReservationModal(false);
                  setSelectedSlot(null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="w-full"
                onClick={confirmBooking}
              >
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Modal de confirmación de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-in fade-in-0">
            <CardHeader>
              <CardTitle>Cancelar reserva</CardTitle>
              <CardDescription>
                ¿Estás seguro de que deseas cancelar esta reserva?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSessionId(null);
                }}
              >
                Volver
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
                onClick={confirmCancelBooking}
              >
                Cancelar reserva
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
