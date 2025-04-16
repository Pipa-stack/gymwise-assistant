
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Dumbbell, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const StatsOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:-translate-y-1 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Entrenamientos Completados
          </CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">24</div>
          <p className="text-xs text-muted-foreground mt-1">
            Este mes
          </p>
          <Progress value={80} className="mt-3 h-1" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:-translate-y-1 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Progreso del Objetivo
          </CardTitle>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">65%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Pérdida de peso
          </p>
          <Progress value={65} className="mt-3 h-1" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:-translate-y-1 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            PR's Conseguidos
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">8</div>
          <p className="text-xs text-muted-foreground mt-1">
            Últimos 30 días
          </p>
          <Progress value={40} className="mt-3 h-1" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 hover:-translate-y-1 transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Ejercicios Favoritos
          </CardTitle>
          <Dumbbell className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">12</div>
          <p className="text-xs text-muted-foreground mt-1">
            En rutina actual
          </p>
          <Progress value={60} className="mt-3 h-1" />
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
