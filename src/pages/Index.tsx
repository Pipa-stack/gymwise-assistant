
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import DashboardCard from "@/components/DashboardCard";
import ClientCard from "@/components/ClientCard";
import ProgressChart from "@/components/ProgressChart";
import { Calendar, Users, Dumbbell, Target, Clock, ArrowRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";

const Index = () => {
  const { mode, clients, trainingPlans, sessions, exercises } = useAppContext();
  const navigate = useNavigate();
  const [recentLoaded, setRecentLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading effect for recent clients
    const timer = setTimeout(() => {
      setRecentLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter sessions to only include upcoming ones
  const upcomingSessions = sessions.filter(
    (session) => new Date(`${session.date}T${session.startTime}`) > new Date() && session.status === "scheduled"
  ).sort((a, b) => {
    return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
  });

  const nextSession = upcomingSessions[0];
  
  // Get client for next session
  const nextSessionClient = nextSession 
    ? clients.find(client => client.id === nextSession.clientId) 
    : null;
    
  // Get today's sessions
  const todaySessions = sessions.filter(
    (session) => isToday(new Date(session.date)) && session.status === "scheduled"
  );
  
  if (mode === "trainer") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Bienvenido al panel de entrenador de GymWise.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Clientes Activos"
            value={clients.length}
            icon={<Users className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:100ms]"
          />
          <DashboardCard
            title="Sesiones Pendientes"
            value={upcomingSessions.length}
            icon={<Calendar className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:200ms]"
          />
          <DashboardCard
            title="Planes de Entrenamiento"
            value={trainingPlans.length}
            icon={<Dumbbell className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:300ms]"
          />
          <DashboardCard
            title="Ejercicios"
            value={exercises.length}
            icon={<Target className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:400ms]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-8 lg:grid-cols-12">
          <Card className="md:col-span-3 lg:col-span-4 animate-slide-in-up [animation-delay:500ms]">
            <CardHeader>
              <CardTitle>Próxima Sesión</CardTitle>
              <CardDescription>Tu próxima sesión de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{nextSessionClient?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(nextSession.date), "EEEE, dd 'de' MMMM", { locale: es })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {nextSession.startTime} - {nextSession.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center">
                  <p className="text-muted-foreground">No hay sesiones programadas</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")} className="w-full">
                <span>Ver Calendario</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-5 lg:col-span-8 animate-slide-in-up [animation-delay:600ms]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sesiones de Hoy</CardTitle>
                <CardDescription>Sesiones programadas para hoy</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
                Ver Todas
              </Button>
            </CardHeader>
            <CardContent>
              {todaySessions.length > 0 ? (
                <div className="space-y-4">
                  {todaySessions.map(session => {
                    const client = clients.find(c => c.id === session.clientId);
                    return (
                      <div 
                        key={session.id} 
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <CalendarClock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{client?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate("/calendar")}
                        >
                          Detalles
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-center">
                    <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No hay sesiones programadas para hoy</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-8 lg:col-span-12 animate-slide-in-up [animation-delay:700ms]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Clientes Recientes</CardTitle>
                <CardDescription>Los últimos clientes añadidos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
                Ver Todos
              </Button>
            </CardHeader>
            <CardContent>
              <div className={`space-y-3 transition-opacity duration-500 ${recentLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {clients.slice(0, 3).map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onClick={() => navigate(`/clients/${client.id}`)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } else {
    // Client mode dashboard
    const clientData = clients[0]; // Using first client as example
    const clientSessions = sessions.filter(session => 
      session.clientId === clientData.id && 
      session.status === "scheduled" && 
      new Date(`${session.date}T${session.startTime}`) > new Date()
    ).sort((a, b) => 
      new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()
    );
    const nextClientSession = clientSessions[0];
    
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mi Dashboard</h2>
          <p className="text-muted-foreground">
            Bienvenido, {clientData.name}. Aquí tienes tu resumen.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Próxima Sesión"
            value={nextClientSession ? 
              format(new Date(nextClientSession.date), "dd 'de' MMM", { locale: es })
              : "Sin programar"}
            description={nextClientSession ? `${nextClientSession.startTime} - ${nextClientSession.endTime}` : ""}
            icon={<Calendar className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:100ms]"
          />
          <DashboardCard
            title="Días Entrenando"
            value={Math.ceil(Math.abs(new Date().getTime() - new Date(clientData.startDate).getTime()) / (1000 * 60 * 60 * 24))}
            icon={<Clock className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:200ms]"
          />
          <DashboardCard
            title="Objetivo"
            value={clientData.goal}
            icon={<Target className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:300ms]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-4 animate-slide-in-up [animation-delay:400ms]">
            <CardHeader>
              <CardTitle>Próximas Sesiones</CardTitle>
              <CardDescription>Tus próximas sesiones de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent>
              {clientSessions.length > 0 ? (
                <div className="space-y-3">
                  {clientSessions.slice(0, 3).map(session => (
                    <div 
                      key={session.id} 
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate("/calendar")}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarClock className="h-4 w-4 text-primary" />
                        <p className="font-medium text-sm">
                          {format(new Date(session.date), "EEEE, dd 'de' MMMM", { locale: es })}
                        </p>
                      </div>
                      <div className="ml-6 text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-center">
                    <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No tienes sesiones programadas</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => navigate("/calendar")}
                    >
                      Reservar Ahora
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate("/calendar")}
              >
                <span>Gestionar Reservas</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-8 animate-slide-in-up [animation-delay:500ms]">
            <CardHeader>
              <CardTitle>Mi Progreso</CardTitle>
              <CardDescription>Seguimiento de peso y composición corporal</CardDescription>
            </CardHeader>
            <CardContent>
              {clientData.progress && clientData.progress.length > 0 ? (
                <ProgressChart 
                  data={clientData.progress} 
                  metrics={["weight", "bodyFat"]} 
                />
              ) : (
                <div className="flex h-60 items-center justify-center">
                  <p className="text-muted-foreground">No hay datos de progreso disponibles</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate("/stats")}
              >
                <span>Ver Estadísticas Detalladas</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
};

export default Index;
