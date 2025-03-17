
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Peso Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-semibold">
              {progressData.length > 0 ? currentWeight : "N/A"} kg
            </div>
            {progressData.length > 1 && (
              <div className={`text-xs font-medium ${
                calculateTrend('weight').isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateTrend('weight').isPositive ? '↓' : '↑'} {calculateTrend('weight').value}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            % Grasa Corporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-semibold">
              {currentBodyFat ? `${currentBodyFat}%` : "N/A"}
            </div>
            {progressData.length > 1 && currentBodyFat && (
              <div className={`text-xs font-medium ${
                calculateTrend('bodyFat').isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateTrend('bodyFat').isPositive ? '↓' : '↑'} {calculateTrend('bodyFat').value}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sesiones Completadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-semibold">
              {completedSessions}
            </div>
            <div className="text-xs text-muted-foreground">
              ~{sessionsPerWeek} / semana
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            IMC (Índice de Masa Corporal)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">
            {bmi ? bmi.toFixed(1) : "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {bmiCategory}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSummaryCards;
