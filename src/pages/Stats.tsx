
import StatsOverview from "@/components/stats/StatsOverview";
import WeightProgressChart from "@/components/stats/WeightProgressChart";
import WorkoutDistribution from "@/components/stats/WorkoutDistribution";

const Stats = () => {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
        <p className="text-muted-foreground">
          Visualiza tu progreso y rendimiento
        </p>
      </div>

      <StatsOverview />

      <div className="grid gap-4 md:grid-cols-3">
        <WeightProgressChart />
        <WorkoutDistribution />
      </div>
    </div>
  );
};

export default Stats;
