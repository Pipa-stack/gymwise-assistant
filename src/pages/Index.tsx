
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import DashboardCard from "@/components/DashboardCard";
import ClientCard from "@/components/ClientCard";
import ProgressChart from "@/components/ProgressChart";
import { Calendar, Users, Dumbbell, Target, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { mode, clients, trainingPlans, sessions } = useAppContext();
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
    (session) => new Date(`${session.date}T${session.startTime}`) > new Date()
  ).sort((a, b) => {
    return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
  });

  const nextSession = upcomingSessions[0];
  
  // Get client for next session
  const nextSessionClient = nextSession 
    ? clients.find(client => client.id === nextSession.clientId) 
    : null;
  
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
            value="35+"
            icon={<Target className="h-6 w-6" />}
            className="animate-slide-in-up [animation-delay:400ms]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-1 animate-slide-in-up [animation-delay:500ms]">
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
                        {new Date(`${nextSession.date}T${nextSession.startTime}`).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
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

          <Card className="md:col-span-2 animate-slide-in-up [animation-delay:600ms]">
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
            value={upcomingSessions.length > 0 ? 
              new Date(`${upcomingSessions[0].date}T${upcomingSessions[0].startTime}`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
              : "Sin programar"}
            description={upcomingSessions.length > 0 ? `${upcomingSessions[0].startTime} - ${upcomingSessions[0].endTime}` : ""}
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

        <div className="grid gap-6 md:grid-cols-8 lg:grid-cols-12">
          <Card className="md:col-span-8 lg:col-span-12 animate-slide-in-up [animation-delay:400ms]">
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
          </Card>
        </div>
      </div>
    );
  }
};

export default Index;
