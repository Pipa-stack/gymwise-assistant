
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarClock, CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import BookingCalendar from "@/components/BookingCalendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const { mode, clients, sessions, cancelSession } = useAppContext();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<string | undefined>(
    mode === "client" ? clients[0]?.id : undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("bookings");
  
  // Sesiones próximas (futuras)
  const upcomingSessions = sessions.filter(
    session => new Date(session.date) >= new Date() && session.status === "scheduled"
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Sesiones para hoy
  const todaySessions = sessions.filter(
    session => isSameDay(new Date(session.date), new Date()) && session.status === "scheduled"
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleSelectClient = (clientId: string) => {
    setSelectedClient(clientId);
  };
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleGoToToday = () => {
    setSelectedDate(new Date());
  };
  
  const handleBookNow = () => {
    setActiveTab("bookings");
  };
  
  const handleCancelSession = (sessionId: string) => {
    cancelSession(sessionId);
  };

  // Custom callback for booking completion
  const handleBookingSuccess = () => {
    console.log("Booking success callback triggered");
    // Set session storage to signal that we just booked a session
    sessionStorage.setItem("justBooked", "true");
    // Navigate to home page to see the booked session
    console.log("Navigating back to home after successful booking");
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={handleGoToToday}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Hoy</span>
          </Button>
          <Button 
            className="gap-1"
            onClick={handleBookNow}
          >
            <CalendarClock className="h-4 w-4" />
            <span>Reservar</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="bookings" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white">
            <CalendarClock className="h-4 w-4" />
            <span>Reservas</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white">
            <CalendarDays className="h-4 w-4" />
            <span>Horario</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          {mode === "trainer" && (
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <label className="block text-sm font-medium mb-2">Seleccionar cliente:</label>
              <Select onValueChange={handleSelectClient} value={selectedClient}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <BookingCalendar 
            clientId={mode === "client" ? clients[0]?.id : selectedClient} 
            onDateChange={handleDateChange}
            onBookingSuccess={handleBookingSuccess}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-primary" />
                    Hoy
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: es })}
                  </span>
                </div>
                <CardDescription>Sesiones programadas para hoy</CardDescription>
              </CardHeader>
              <CardContent>
                {todaySessions.length > 0 ? (
                  <div className="space-y-3">
                    {todaySessions.map(session => {
                      const client = clients.find(c => c.id === session.clientId);
                      return (
                        <div key={session.id} className="p-3 border rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium">{client?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Ver detalles</Button>
                            {mode === "trainer" && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleCancelSession(session.id)}
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay sesiones programadas para hoy</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Próximas Sesiones
                </CardTitle>
                <CardDescription>Sesiones programadas para los próximos días</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 5).map(session => {
                      const client = clients.find(c => c.id === session.clientId);
                      const sessionDate = new Date(session.date);
                      
                      return (
                        <div key={session.id} className="p-3 border rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium">{client?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(sessionDate, "EEEE, dd 'de' MMMM", { locale: es })}
                            </div>
                            <div className="text-sm">
                              {session.startTime} - {session.endTime}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Ver detalles</Button>
                            {mode === "trainer" && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleCancelSession(session.id)}
                              >
                                Cancelar
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay sesiones programadas próximamente</p>
                  </div>
                )}
              </CardContent>
              {upcomingSessions.length > 5 && (
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    Ver todas ({upcomingSessions.length})
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calendar;
