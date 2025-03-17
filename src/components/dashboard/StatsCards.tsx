
import { ReactNode } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Calendar, Users, Dumbbell, Target, Clock, Heart, Flame, Award } from "lucide-react";

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
        icon={<Users className="h-6 w-6 text-blue-500" />}
        className="animate-slide-in-up [animation-delay:100ms] border-t-4 border-t-blue-500/70"
      />
      <DashboardCard
        title="Sesiones Pendientes"
        value={sessionsCount}
        icon={<Calendar className="h-6 w-6 text-green-500" />}
        className="animate-slide-in-up [animation-delay:200ms] border-t-4 border-t-green-500/70"
      />
      <DashboardCard
        title="Planes de Entrenamiento"
        value={plansCount}
        icon={<Dumbbell className="h-6 w-6 text-purple-500" />}
        className="animate-slide-in-up [animation-delay:300ms] border-t-4 border-t-purple-500/70"
      />
      <DashboardCard
        title="Ejercicios"
        value={exercisesCount}
        icon={<Target className="h-6 w-6 text-amber-500" />}
        className="animate-slide-in-up [animation-delay:400ms] border-t-4 border-t-amber-500/70"
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Próxima Sesión"
        value={nextSessionDate}
        icon={<Calendar className="h-6 w-6 text-blue-500" />}
        className="animate-slide-in-up [animation-delay:100ms] border-t-4 border-t-blue-500/70"
      />
      <DashboardCard
        title="Días Entrenando"
        value={trainingDays}
        icon={<Clock className="h-6 w-6 text-green-500" />}
        className="animate-slide-in-up [animation-delay:200ms] border-t-4 border-t-green-500/70"
      />
      <DashboardCard
        title="Objetivo"
        value={goal}
        icon={<Target className="h-6 w-6 text-amber-500" />}
        className="animate-slide-in-up [animation-delay:300ms] border-t-4 border-t-amber-500/70"
      />
      <DashboardCard
        title="Progreso"
        value="En curso"
        icon={<Award className="h-6 w-6 text-purple-500" />}
        className="animate-slide-in-up [animation-delay:400ms] border-t-4 border-t-purple-500/70"
      />
    </div>
  );
};
