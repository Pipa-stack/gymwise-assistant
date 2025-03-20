
import { ReactNode } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Calendar, Users, Dumbbell, Target, Clock, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <DashboardCard
        title="Clientes"
        value={clientsCount}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        className="border-t-2 border-t-blue-500/70"
      />
      <DashboardCard
        title="Sesiones"
        value={sessionsCount}
        icon={<Calendar className="h-5 w-5 text-green-500" />}
        className="border-t-2 border-t-green-500/70"
      />
      <DashboardCard
        title="Planes"
        value={plansCount}
        icon={<Dumbbell className="h-5 w-5 text-purple-500" />}
        className="border-t-2 border-t-purple-500/70"
      />
      <DashboardCard
        title="Ejercicios"
        value={exercisesCount}
        icon={<Target className="h-5 w-5 text-amber-500" />}
        className="border-t-2 border-t-amber-500/70"
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
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <DashboardCard
        title="Próxima Sesión"
        value={nextSessionDate}
        icon={<Calendar className="h-5 w-5 text-blue-500" />}
        className="border-t-2 border-t-blue-500/70"
      />
      <DashboardCard
        title="Días Entrenando"
        value={trainingDays}
        icon={<Clock className="h-5 w-5 text-green-500" />}
        className="border-t-2 border-t-green-500/70"
        description={
          <div className="w-full mt-1">
            <Progress value={Math.min(trainingDays/100 * 100, 100)} className="h-1.5" />
          </div>
        }
      />
      <DashboardCard
        title="Objetivo"
        value={goal}
        icon={<Target className="h-5 w-5 text-amber-500" />}
        className="border-t-2 border-t-amber-500/70"
      />
      <DashboardCard
        title="Racha"
        value="7 días"
        icon={<Flame className="h-5 w-5 text-orange-500" />}
        className="border-t-2 border-t-orange-500/70"
      />
    </div>
  );
};
