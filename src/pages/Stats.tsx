
import StatsOverview from "@/components/stats/StatsOverview";
import WeightProgressChart from "@/components/stats/WeightProgressChart";
import WorkoutDistribution from "@/components/stats/WorkoutDistribution";
import { Card } from "@/components/ui/card";

const Stats = () => {
  return (
    <div className="space-y-8 p-6 pb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
        <p className="text-muted-foreground">
          Visualiza tu progreso y rendimiento
        </p>
      </div>

      <StatsOverview />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <WeightProgressChart />
        </Card>
        <WorkoutDistribution />
      </div>
    </div>
  );
};

export default Stats;
