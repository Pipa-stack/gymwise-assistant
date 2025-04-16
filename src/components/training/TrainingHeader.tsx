
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface TrainingHeaderProps {
  mode: "trainer" | "client";
}

const TrainingHeader = ({ mode }: TrainingHeaderProps) => {
  const handleCreatePlan = () => {
    toast({
      title: "Crear Plan",
      description: "Funcionalidad para crear planes será implementada pronto"
    });
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Planes de Entrenamiento</h1>
      <div className="flex gap-2">
        {mode === "trainer" && (
          <Button variant="outline" onClick={handleCreatePlan}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Plan
          </Button>
        )}
        <Link to="/create-routine">
          <Button className="bg-primary hover:bg-primary/90">
            <Dumbbell className="mr-2 h-4 w-4" />
            Crear Rutina
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TrainingHeader;
