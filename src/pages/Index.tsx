
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
    const checkForNewBookings = () => {
      console.log("Checking for recently booked sessions...");
      const justBooked = sessionStorage.getItem("justBooked");
      const lastBookedSessionId = sessionStorage.getItem("lastBookedSessionId");
      console.log("justBooked flag:", justBooked);
      console.log("lastBookedSessionId:", lastBookedSessionId);
      console.log("Available sessions:", sessions);
      
      if (justBooked === "true") {
        toast({
          title: "¡Reserva confirmada!",
          description: "Tu sesión ha sido reservada correctamente. Puedes verla en tu panel."
        });
        
        // Clear the flags after processing
        sessionStorage.removeItem("justBooked");
        sessionStorage.removeItem("lastBookedSessionId");
        
        // Force re-render to refresh sessions
        setRefreshKey(prev => prev + 1);
        console.log("Refreshing dashboard after booking with new key:", refreshKey + 1);
      }
    };

    // Check immediately when the component mounts
    checkForNewBookings();

    // Also set up a check whenever sessions change
    const timer = setTimeout(checkForNewBookings, 500);
    return () => clearTimeout(timer);
  }, [sessions, refreshKey]);

  // Filter sessions to only include upcoming ones
  const upcomingSessions = sessions.filter(
    (session) => {
      const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
      return sessionDateTime > new Date() && session.status === "scheduled";
    }
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
    
    // Get client sessions with future dates
    const clientSessions = sessions.filter(session => {
      if (session.clientId !== clientData.id || session.status !== "scheduled") {
        return false;
      }
      const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
      return sessionDateTime >= new Date();
    }).sort((a, b) => {
      return new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime();
    });
    
    console.log("Client sessions for dashboard:", clientSessions);
    
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
