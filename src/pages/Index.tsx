
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { isToday } from "date-fns";
import TrainerDashboard from "@/components/dashboard/TrainerDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { mode, clients, trainingPlans, sessions, exercises } = useAppContext();
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if we just came from a booking
  useEffect(() => {
    const justBooked = sessionStorage.getItem("justBooked");
    if (justBooked === "true") {
      toast({
        title: "¡Reserva confirmada!",
        description: "Tu sesión ha sido reservada correctamente. Puedes verla en tu panel."
      });
      sessionStorage.removeItem("justBooked");
      setRefreshKey(prev => prev + 1); // Force re-render to refresh sessions
    }
  }, []);

  // Filter sessions to only include upcoming ones
  const upcomingSessions = sessions.filter(
    (session) => new Date(`${session.date}T${session.startTime}`) > new Date() && session.status === "scheduled"
  ).sort((a, b) => {
    return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
  });

  // Get today's sessions
  const todaySessions = sessions.filter(
    (session) => isToday(new Date(session.date)) && session.status === "scheduled"
  );
  
  // Add a subtle animation effect
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-mount');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('opacity-100', 'translate-y-0');
        element.classList.remove('opacity-0', 'translate-y-4');
      }, 100 * index);
    });
  }, []);
  
  if (mode === "trainer") {
    return (
      <TrainerDashboard 
        clients={clients}
        upcomingSessions={upcomingSessions}
        todaySessions={todaySessions}
        trainingPlansCount={trainingPlans.length}
        exercisesCount={exercises.length}
      />
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
    
    return (
      <ClientDashboard 
        key={refreshKey} // Force re-render when we come from booking
        client={clientData}
        clientSessions={clientSessions}
      />
    );
  }
};

export default Index;
