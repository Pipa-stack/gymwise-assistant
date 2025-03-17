
import { ReactNode } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Calendar, Users, Dumbbell, Target, Clock } from "lucide-react";

interface StatsCardsProps {
  clientsCount: number;
  sessionsCount: number;
  plansCount: number;
  exercisesCount: number;
}

export const TrainerStatsCards = ({ 
  clientsCount, 
  sessionsCount, 
  plansCount, 
  exercisesCount 
}: StatsCardsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Clientes Activos"
        value={clientsCount}
        icon={<Users className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:100ms]"
      />
      <DashboardCard
        title="Sesiones Pendientes"
        value={sessionsCount}
        icon={<Calendar className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:200ms]"
      />
      <DashboardCard
        title="Planes de Entrenamiento"
        value={plansCount}
        icon={<Dumbbell className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:300ms]"
      />
      <DashboardCard
        title="Ejercicios"
        value={exercisesCount}
        icon={<Target className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:400ms]"
      />
    </div>
  );
};

interface ClientStatsProps {
  nextSessionDate: string;
  trainingDays: number;
  goal: string;
}

export const ClientStatsCards = ({ 
  nextSessionDate, 
  trainingDays, 
  goal 
}: ClientStatsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Próxima Sesión"
        value={nextSessionDate}
        icon={<Calendar className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:100ms]"
      />
      <DashboardCard
        title="Días Entrenando"
        value={trainingDays}
        icon={<Clock className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:200ms]"
      />
      <DashboardCard
        title="Objetivo"
        value={goal}
        icon={<Target className="h-6 w-6" />}
        className="animate-slide-in-up [animation-delay:300ms]"
      />
    </div>
  );
};
