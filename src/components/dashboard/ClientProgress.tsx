
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, LineChart } from "lucide-react";
import ProgressChart from "@/components/ProgressChart";
import { Progress as ProgressType } from "@/context/AppContext";
import { generateProgressSummary } from "@/utils/progressUtils";

interface ClientProgressProps {
  progress: ProgressType[];
  clientName?: string;
  clientGoal?: string;
}

const ClientProgress = ({ progress, clientName, clientGoal }: ClientProgressProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-8 animate-slide-in-up [animation-delay:500ms] border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-background/0 p-5 rounded-t-lg">
        <div>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            {clientName ? `Progreso de ${clientName}` : "Mi Progreso"}
          </CardTitle>
          <CardDescription>
            {clientGoal ? `Objetivo: ${clientGoal}` : "Seguimiento de peso y composición corporal"}
          </CardDescription>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => navigate("/stats")} className="gap-1">
          <LineChart className="h-4 w-4" />
          Estadísticas
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {progress && progress.length > 0 ? (
          <>
            <ProgressChart 
              data={progress} 
              metrics={["weight", "bodyFat"]} 
            />
            {progress.length >= 2 && (
              <p className="text-sm text-muted-foreground mt-4 px-2">
                {generateProgressSummary({
                  id: "temp",
                  name: clientName || "Cliente",
                  email: "",
                  phone: "",
                  age: 0,
                  goal: clientGoal || "Fitness",
                  startDate: "",
                  progress: progress
                })}
              </p>
            )}
          </>
        ) : (
          <div className="flex flex-col h-60 items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground opacity-70" />
            </div>
            <p className="text-muted-foreground">No hay datos de progreso disponibles</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/stats")}
              className="mt-2"
            >
              Añadir Mediciones
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/5 rounded-b-lg">
        <Button 
          variant="ghost" 
          className="w-full group"
          onClick={() => navigate("/stats")}
        >
          <span className="group-hover:mr-2 transition-all">Ver Estadísticas Detalladas</span>
          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientProgress;
