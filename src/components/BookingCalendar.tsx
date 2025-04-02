
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { format, isSameDay, isToday, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarClock, 
  CheckCircle, 
  Clock, 
  Users, 
  X, 
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface BookingCalendarProps {
  clientId?: string;
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
  ],
  3: [ // Miércoles
    { id: "mie-1", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "mie-2", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "mie-3", startTime: "16:30", endTime: "18:00", capacity: 6 },
    { id: "mie-4", startTime: "18:00", endTime: "19:30", capacity: 6 },
  ],
  4: [ // Jueves
    { id: "jue-1", startTime: "08:00", endTime: "09:30", capacity: 6 },
    { id: "jue-2", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "jue-3", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "jue-4", startTime: "15:00", endTime: "16:30", capacity: 6 },
    { id: "jue-5", startTime: "16:30", endTime: "18:00", capacity: 6 },
    { id: "jue-6", startTime: "18:00", endTime: "19:30", capacity: 6 },
  ],
  5: [ // Viernes
    { id: "vie-1", startTime: "09:30", endTime: "11:00", capacity: 6 },
    { id: "vie-2", startTime: "11:00", endTime: "12:30", capacity: 6 },
    { id: "vie-3", startTime: "16:30", endTime: "18:00", capacity: 6 },
    { id: "vie-4", startTime: "18:00", endTime: "19:30", capacity: 6 },
  ],
  6: [], // Sábado - No hay horarios
  0: [], // Domingo - No hay horarios
};

const BookingCalendar = ({ clientId }: BookingCalendarProps) => {
  const { availableSlots, sessions, bookSession, cancelSession, clients, mode } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Obtener slots disponibles para la fecha seleccionada
  const getTimeSlotsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dayOfWeek = date.getDay(); // 0 (domingo) a 6 (sábado)
    return timeSlotsByDay[dayOfWeek as keyof typeof timeSlotsByDay] || [];
  };
  
  // Función para avanzar al siguiente mes
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Función para retroceder al mes anterior
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };
  
  // Obtener sesiones programadas para la fecha seleccionada
  const sessionsForSelectedDate = selectedDate
    ? sessions.filter(session => 
        session.date === selectedDate.toISOString().split('T')[0] && 
        (mode === "trainer" || session.clientId === clientId) &&
        session.status !== "cancelled"
      )
    : [];

  // Función para obtener cliente por ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

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

  // Función para confirmar la reserva
  const confirmBooking = () => {
    if (clientId && selectedSlot && selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const slotId = `slot-${dateStr}-${selectedStartTime?.split(':')[0] || '9'}`;
      bookSession(clientId, slotId);
      setShowReservationModal(false);
      setSelectedSlot(null);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = (sessionId: string) => {
    cancelSession(sessionId);
  };

  // Función para determinar si una fecha tiene slots disponibles
  const hasAvailableSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    return timeSlotsByDay[dayOfWeek as keyof typeof timeSlotsByDay]?.length > 0;
  };

  // Determinar el aforo actual (simulado)
  const getRandomOccupancy = (capacity: number) => {
    return Math.floor(Math.random() * (capacity + 1));
  };

  // Días de la semana en español
  const weekDays = ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Reserva tu sesión
            </CardTitle>
            <CardDescription>
              Selecciona una fecha y horario disponible para tu próxima sesión de entrenamiento
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <button 
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  onClick={prevMonth}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-medium">
                  Elige fecha y hora
                </h3>
                <button 
                  className="p-2 rounded-full hover:bg-accent transition-colors"
                  onClick={nextMonth}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-center text-lg mb-4 font-medium">
                {format(currentMonth, "MMMM, yyyy", { locale: es })}
              </p>
              
              <div className="grid grid-cols-7 text-center mb-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-6">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(currentMonth);
                  date.setDate(1);
                  const firstDayOfMonth = date.getDay(); // 0-6 (domingo-sábado)
                  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                  date.setDate(i - firstDayOfMonth + 1);
                  
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isAvailable = hasAvailableSlots(date) && isCurrentMonth;
                  const isTodayDate = isToday(date);
                  
                  return (
                    <button
                      key={i}
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center mx-auto text-sm font-medium",
                        isCurrentMonth ? "" : "opacity-40",
                        isSelected 
                          ? "bg-primary text-white" 
                          : isAvailable 
                            ? "hover:bg-accent/80" 
                            : "opacity-40",
                        isTodayDate && !isSelected && "border border-primary text-primary",
                        !isAvailable && "cursor-not-allowed"
                      )}
                      onClick={() => isAvailable && setSelectedDate(date)}
                      disabled={!isAvailable}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
              
              {/* Horarios disponibles */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Horarios disponibles para {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: es })}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {getTimeSlotsForDate(selectedDate).map(slot => {
                      const occupancy = getRandomOccupancy(slot.capacity);
                      const isBooked = sessionsForSelectedDate.some(
                        session => session.startTime === slot.startTime
                      );
                      
                      return (
                        <button
                          key={slot.id}
                          onClick={() => !isBooked && handleBooking(slot.id, slot.startTime, slot.endTime)}
                          disabled={isBooked && mode === "client"}
                          className={cn(
                            "border bg-white dark:bg-gray-800 p-3 rounded-lg text-sm font-medium flex flex-col items-center",
                            isBooked && mode === "client" 
                              ? "opacity-60 cursor-not-allowed border-muted" 
                              : "border-primary/20 hover:border-primary",
                            "transition-transform hover:scale-[1.02]"
                          )}
                        >
                          <span className="text-base font-bold">{slot.startTime} - {slot.endTime}</span>
                          <span className="text-xs mt-1 text-muted-foreground">
                            Aforo: {occupancy} / {slot.capacity}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  className="font-medium px-10"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Atrás
                </Button>
              </div>
            </div>
          </CardContent>
          
          {mode === "trainer" && (
            <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900/50">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({
                  title: "Gestión de disponibilidad",
                  description: "Esta funcionalidad estará disponible próximamente"
                })}
              >
                <Users className="h-4 w-4 mr-2" />
                Gestionar disponibilidad
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Modal de confirmación de reserva */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-5">
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
                  <p><span className="font-medium">Hora:</span> {selectedStartTime} - {selectedEndTime}</p>
                  <p><span className="font-medium">Duración:</span> Variable</p>
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
                variant="green"
                className="w-full"
                onClick={confirmBooking}
              >
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
