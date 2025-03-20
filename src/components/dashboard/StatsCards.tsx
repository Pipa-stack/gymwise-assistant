
import { ReactNode } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Calendar, Users, Dumbbell, Target, Clock, Heart, Flame, Award } from "lucide-react";
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Clientes Activos"
        value={clientsCount}
        icon={<Users className="h-6 w-6 text-blue-500" />}
        className="animate-slide-in-up [animation-delay:100ms] border-t-4 border-t-blue-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description="Total de clientes actualmente"
      />
      <DashboardCard
        title="Sesiones Pendientes"
        value={sessionsCount}
        icon={<Calendar className="h-6 w-6 text-green-500" />}
        className="animate-slide-in-up [animation-delay:200ms] border-t-4 border-t-green-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description="Programadas para próximos días"
      />
      <DashboardCard
        title="Planes de Entrenamiento"
        value={plansCount}
        icon={<Dumbbell className="h-6 w-6 text-purple-500" />}
        className="animate-slide-in-up [animation-delay:300ms] border-t-4 border-t-purple-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description="Planes activos creados"
      />
      <DashboardCard
        title="Ejercicios"
        value={exercisesCount}
        icon={<Target className="h-6 w-6 text-amber-500" />}
        className="animate-slide-in-up [animation-delay:400ms] border-t-4 border-t-amber-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description="Base de datos de ejercicios"
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
        className="animate-slide-in-up [animation-delay:100ms] border-t-4 border-t-blue-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description="Tu próxima cita"
      />
      <DashboardCard
        title="Días Entrenando"
        value={trainingDays}
        icon={<Clock className="h-6 w-6 text-green-500" />}
        className="animate-slide-in-up [animation-delay:200ms] border-t-4 border-t-green-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description={
          <div className="w-full mt-1">
            <Progress value={Math.min(trainingDays/100 * 100, 100)} className="h-1.5" />
            <p className="text-xs mt-1 text-right">{Math.min(trainingDays/100 * 100, 100).toFixed(0)}% del camino</p>
          </div>
        }
      />
      <DashboardCard
        title="Objetivo"
        value={goal}
        icon={<Target className="h-6 w-6 text-amber-500" />}
        className="animate-slide-in-up [animation-delay:300ms] border-t-4 border-t-amber-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description="Meta principal"
      />
      <DashboardCard
        title="Progreso"
        value="En curso"
        icon={<Award className="h-6 w-6 text-purple-500" />}
        className="animate-slide-in-up [animation-delay:400ms] border-t-4 border-t-purple-500/70 hover:translate-y-[-4px] transition-all duration-300"
        description={
          <div className="flex items-center gap-1 mt-1">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs">Racha de 7 días</span>
          </div>
        }
      />
    </div>
  );
};
