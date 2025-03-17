
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { isToday } from "date-fns";
import TrainerDashboard from "@/components/dashboard/TrainerDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";

const Index = () => {
  const { mode, clients, trainingPlans, sessions, exercises } = useAppContext();

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
        client={clientData}
        clientSessions={clientSessions}
      />
    );
  }
};

export default Index;
