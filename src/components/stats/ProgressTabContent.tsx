
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/context/AppContext";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { LineChart as LineChartIcon, PlusCircle, Scale } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProgressTabContentProps {
  progressData: Progress[];
  statType: "weight" | "bodyFat" | "musclePercentage";
  setStatType: (type: "weight" | "bodyFat" | "musclePercentage") => void;
  mode: "trainer" | "client";
  clientName?: string;
  onAddMeasurement: () => void;
}

const ProgressTabContent = ({
  progressData,
  statType,
  setStatType,
  mode,
  clientName,
  onAddMeasurement
}: ProgressTabContentProps) => {
  const progressDataFormatted = progressData.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    weight: item.weight,
    bodyFat: item.bodyFat || 0,
    musclePercentage: item.musclePercentage || 0
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-primary" />
            Progreso a lo Largo del Tiempo
          </CardTitle>
          <CardDescription>
            {mode === "trainer" 
              ? `Progreso de ${clientName || "cliente seleccionado"}`
              : "Tu progreso a lo largo del tiempo"}
          </CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Button 
              variant={statType === "weight" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setStatType("weight")}
            >
              Peso
            </Button>
            <Button 
              variant={statType === "bodyFat" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setStatType("bodyFat")}
            >
              % Grasa
            </Button>
            <Button 
              variant={statType === "musclePercentage" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setStatType("musclePercentage")}
            >
              % Músculo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {progressDataFormatted.length > 0 ? (
            <ChartContainer
              className="h-80"
              config={{
                weight: {
                  label: "Peso (kg)",
                  color: "#8884d8"
                },
                bodyFat: {
                  label: "% Grasa Corporal",
                  color: "#82ca9d"
                },
                musclePercentage: {
                  label: "% Músculo",
                  color: "#ffc658"
                }
              }}
            >
              <LineChart data={progressDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey={statType}
                  stroke={statType === "weight" ? "#8884d8" : statType === "bodyFat" ? "#82ca9d" : "#ffc658"}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <LineChartIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
              <p className="text-muted-foreground">No hay datos de progreso disponibles</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={onAddMeasurement}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar mediciones
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {progressData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Mediciones</CardTitle>
            <CardDescription>Registro histórico de mediciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...progressData].reverse().map((progress, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {format(new Date(progress.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                    </div>
                    <div className="flex items-center">
                      <Scale className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">{progress.weight} kg</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {progress.bodyFat !== undefined && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">% Grasa:</span> {progress.bodyFat}%
                      </div>
                    )}
                    {progress.musclePercentage !== undefined && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">% Músculo:</span> {progress.musclePercentage}%
                      </div>
                    )}
                  </div>
                  {progress.notes && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {progress.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressTabContent;
