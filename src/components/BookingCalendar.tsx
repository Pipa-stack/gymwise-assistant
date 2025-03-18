
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
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

  // Obtener todas las sesiones de hoy
  const todaySessions = sessions.filter(session => 
    isSameDay(new Date(session.date), new Date()) &&
    session.status !== "cancelled"
  );

  // Función para obtener cliente por ID
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
    <div className="space-y-6">
      {/* Resumen del día */}
      {todaySessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Sesiones de Hoy
            </CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE dd 'de' MMMM", { locale: es })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {todaySessions.map(session => {
                const client = getClientById(session.clientId);
                return (
                  <Card key={session.id} className="min-w-[200px] bg-accent/50">
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client?.photo} alt={client?.name} />
                          <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium leading-none">{client?.name}</h4>
                          <p className="text-xs text-muted-foreground">{session.startTime}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
                today: (date) => isToday(date),
              }}
              modifiersClassNames={{
                available: "bg-primary/10 text-primary font-medium",
                today: "border-2 border-primary",
              }}
              className="rounded-md border"
              locale={es}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Horarios {selectedDate && format(selectedDate, "'del' dd 'de' MMMM", { locale: es })}</CardTitle>
              <CardDescription className="mt-1.5">
                {slotsForSelectedDate.length > 0 
                  ? `${slotsForSelectedDate.length} horarios disponibles`
                  : "Selecciona una fecha para ver los horarios"
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {selectedDate && (
              <div className="space-y-6">
                {mode === "trainer" && sessionsForSelectedDate.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Sesiones Programadas</h3>
                    </div>
                    <div className="grid gap-3">
                      {sessionsForSelectedDate.map(session => {
                        const client = getClientById(session.clientId);
                        return (
                          <div 
                            key={session.id}
                            className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={client?.photo} alt={client?.name} />
                                <AvatarFallback>{client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{client?.name}</h4>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {session.startTime} - {session.endTime}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancel(session.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                    <Separator />
                  </div>
                )}

                {slotsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Horarios Disponibles</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {slotsForSelectedDate
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map(slot => (
                          <Button
                            key={slot.id}
                            variant="outline"
                            className="flex items-center justify-between h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/50"
                            onClick={() => clientId && handleBooking(slot.id)}
                            disabled={!clientId}
                          >
                            <span className="text-base font-medium">{slot.startTime}</span>
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </Button>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay horarios disponibles para esta fecha</p>
                  </div>
                )}
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
    </div>
  );
};

export default BookingCalendar;
