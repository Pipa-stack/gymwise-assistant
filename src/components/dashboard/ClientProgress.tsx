
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProgressChart from "@/components/ProgressChart";
import { Progress } from "@/context/AppContext";

interface ClientProgressProps {
  progress: Progress[];
}

const ClientProgress = ({ progress }: ClientProgressProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-8 animate-slide-in-up [animation-delay:500ms]">
      <CardHeader>
        <CardTitle>Mi Progreso</CardTitle>
        <CardDescription>Seguimiento de peso y composición corporal</CardDescription>
      </CardHeader>
      <CardContent>
        {progress && progress.length > 0 ? (
          <ProgressChart 
            data={progress} 
            metrics={["weight", "bodyFat"]} 
          />
        ) : (
          <div className="flex h-60 items-center justify-center">
            <p className="text-muted-foreground">No hay datos de progreso disponibles</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => navigate("/stats")}
        >
          <span>Ver Estadísticas Detalladas</span>
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientProgress;
