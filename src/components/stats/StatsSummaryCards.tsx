
import { Card } from "@/components/ui/card";
import { Progress } from "@/context/AppContext";
import { calculateBMI, getBMICategory } from "@/utils/progressUtils";

interface StatsSummaryCardsProps {
  progressData: Progress[];
  height?: number;
  completedSessions: number;
  sessionsPerWeek: number;
}

const StatsSummaryCards = ({
  progressData,
  height,
  completedSessions,
  sessionsPerWeek
}: StatsSummaryCardsProps) => {
  
  const calculateTrend = (metric: keyof Progress) => {
    if (progressData.length < 2) return { value: 0, isPositive: true };
    
    const currentValue = progressData[progressData.length - 1][metric];
    const previousValue = progressData[progressData.length - 2][metric];
    
    if (typeof currentValue !== 'number' || typeof previousValue !== 'number') {
      return { value: 0, isPositive: true };
    }
    
    const percentChange = ((currentValue - previousValue) / previousValue) * 100;
    
    let isPositive = metric === 'musclePercentage' ? percentChange > 0 : percentChange < 0;
    
    return {
      value: Math.abs(percentChange).toFixed(1),
      isPositive
    };
  };

  const currentWeight = progressData.length > 0 ? progressData[progressData.length - 1].weight : 0;
  const currentBodyFat = progressData.length > 0 ? progressData[progressData.length - 1].bodyFat : undefined;
  const bmi = (height && currentWeight) ? calculateBMI(currentWeight, height) : 0;
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-5 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-normal">
            Peso Actual
          </h3>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold">
              {progressData.length > 0 ? currentWeight : "0"} kg
            </div>
            {progressData.length > 1 && (
              <div className={`text-xs font-medium ${
                calculateTrend('weight').isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {calculateTrend('weight').isPositive ? '↓' : '↑'} {calculateTrend('weight').value}%
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-5 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-normal">
            % Grasa Corporal
          </h3>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold">
              {currentBodyFat ? `${currentBodyFat}%` : "0%"}
            </div>
            {progressData.length > 1 && currentBodyFat && (
              <div className={`text-xs font-medium ${
                calculateTrend('bodyFat').isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {calculateTrend('bodyFat').isPositive ? '↓' : '↑'} {calculateTrend('bodyFat').value}%
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-5 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-normal">
            Sesiones Completadas
          </h3>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold">
              {completedSessions}
            </div>
            <div className="text-xs text-muted-foreground">
              ~{sessionsPerWeek} / semana
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-normal">
            IMC (Índice de Masa Corporal)
          </h3>
          <div className="flex flex-col">
            <div className="text-2xl font-semibold">
              {bmi ? bmi.toFixed(1) : "0"}
            </div>
            <div className="text-xs text-muted-foreground">
              {bmiCategory}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsSummaryCards;
