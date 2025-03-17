
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { format, isSameDay, isToday, isFuture } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarClock, CheckCircle, Clock, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  clientId?: string;
}

const BookingCalendar = ({ clientId }: BookingCalendarProps) => {
  const { availableSlots, sessions, bookSession, cancelSession, clients, mode } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Obtener slots disponibles para la fecha seleccionada
  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter(slot => 
        slot.date === selectedDate.toISOString().split('T')[0] && 
        !slot.isTaken
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

  // Obtener cliente por ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Función para manejar la reserva
  const handleBooking = (slotId: string) => {
    if (clientId) {
      bookSession(clientId, slotId);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Calendario</CardTitle>
          <CardDescription>Selecciona una fecha para ver las sesiones disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => !isFuture(date) && !isToday(date)}
            modifiers={{
              available: (date) => hasAvailableSlots(date) && (isFuture(date) || isToday(date)),
            }}
            modifiersClassNames={{
              available: "bg-green-50 text-green-700 font-medium",
            }}
            className="rounded-md border"
            locale={es}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Horarios Disponibles</CardTitle>
            <CardDescription>
              {selectedDate ? (
                <>
                  {format(selectedDate, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es })}
                </>
              ) : (
                "Selecciona una fecha"
              )}
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex gap-1 items-center">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>{slotsForSelectedDate.length} disponibles</span>
          </Badge>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <>
              {mode === "trainer" && sessionsForSelectedDate.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="text-lg font-semibold">Sesiones Programadas</h3>
                  <div className="space-y-2">
                    {sessionsForSelectedDate.map(session => {
                      const client = getClientById(session.clientId);
                      return (
                        <div 
                          key={session.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={client?.photo} alt={client?.name} />
                              <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{client?.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {session.startTime} - {session.endTime}
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancel(session.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {clientId && sessionsForSelectedDate.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="text-lg font-semibold">Tus Sesiones</h3>
                  <div className="space-y-2">
                    {sessionsForSelectedDate.map(session => (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Sesión de entrenamiento</h4>
                            <div className="text-sm text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCancel(session.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slotsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {slotsForSelectedDate
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(slot => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="flex-col h-auto py-3 space-y-1 hover:bg-primary/5"
                        onClick={() => clientId && handleBooking(slot.id)}
                        disabled={!clientId}
                      >
                        <span className="text-base font-medium">{slot.startTime}</span>
                        <span className="text-xs text-muted-foreground">1 hora</span>
                      </Button>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                  <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay horarios disponibles para esta fecha</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Selecciona una fecha para ver los horarios disponibles</p>
            </div>
          )}
        </CardContent>
        {mode === "trainer" && (
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!selectedDate}
            >
              <Users className="h-4 w-4 mr-2" />
              Gestionar disponibilidad
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default BookingCalendar;
