
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { format, isSameDay, isToday, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const BookingCalendar = ({ clientId }: BookingCalendarProps) => {
  const { availableSlots, sessions, bookSession, cancelSession, clients, mode } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Obtener slots disponibles para la fecha seleccionada
  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter(slot => 
        slot.date === selectedDate.toISOString().split('T')[0]
      )
    : [];
  
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
  const handleBooking = (slotId: string) => {
    if (clientId) {
      setSelectedSlot(slotId);
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
    if (clientId && selectedSlot) {
      bookSession(clientId, selectedSlot);
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
    const dateStr = date.toISOString().split('T')[0];
    return availableSlots.some(slot => 
      slot.date === dateStr && !slot.isTaken
    );
  };

  // Calcular días de la semana
  const getDayAbbreviation = (day: number) => {
    const days = ["lun.", "mar.", "mié.", "jue.", "vie.", "sáb.", "dom."];
    return days[day];
  };

  // Función para calcular aforo disponible
  const getCapacityString = (slot: any) => {
    const total = 6; // Capacidad total por defecto
    const taken = slot.isTaken ? total : Math.floor(Math.random() * total);
    return `Aforo: ${total - taken} / ${total}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-12 bg-white dark:bg-gray-950">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-xl flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Reserva tu sesión
            </CardTitle>
            <CardDescription>
              Selecciona una fecha y horario disponible para tu próxima sesión de entrenamiento
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="bg-[#7ED957]/90 text-white p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-medium">
                  Elige fecha y hora
                </h3>
                <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-center text-lg mb-4">
                {selectedDate && format(selectedDate, "MMMM, yyyy", { locale: es })}
              </p>
              
              <div className="grid grid-cols-7 text-center mb-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div key={day} className="text-sm">
                    {getDayAbbreviation(day)}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay() + i);
                  const isCurrentMonth = date.getMonth() === new Date().getMonth();
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isAvailable = hasAvailableSlots(date);
                  
                  return (
                    <button
                      key={i}
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center mx-auto text-sm font-medium",
                        isCurrentMonth ? "" : "opacity-40",
                        isSelected ? "bg-white text-[#7ED957]" : isAvailable ? "hover:bg-white/20" : "opacity-40",
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {slotsForSelectedDate
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => handleBooking(slot.id)}
                        disabled={slot.isTaken && mode === "client"}
                        className={cn(
                          "bg-[#36843D] text-white p-2 rounded text-sm font-medium flex flex-col items-center",
                          slot.isTaken && mode === "client" && "opacity-60 cursor-not-allowed",
                          "transition-transform hover:scale-[1.02]"
                        )}
                      >
                        <span className="text-base font-bold">{slot.startTime} - {slot.endTime}</span>
                        <span className="text-xs mt-1">{getCapacityString(slot)}</span>
                      </button>
                    ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white text-[#7ED957] border-none font-medium px-10"
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
              {selectedSlot && selectedDate && (
                <div className="space-y-2">
                  <p><span className="font-medium">Fecha:</span> {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                  <p><span className="font-medium">Hora:</span> {availableSlots.find(s => s.id === selectedSlot)?.startTime} - {availableSlots.find(s => s.id === selectedSlot)?.endTime}</p>
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
