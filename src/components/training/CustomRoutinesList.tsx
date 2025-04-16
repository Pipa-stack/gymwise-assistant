
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Plus } from "lucide-react";
import { CustomRoutine } from "@/types/contextTypes";

interface CustomRoutinesListProps {
  routines: CustomRoutine[];
}

const CustomRoutinesList = ({ routines }: CustomRoutinesListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mis Rutinas</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routines.map(routine => (
          <Link 
            key={routine.id} 
            to={`/create-routine/${routine.id}`}
            className="bg-card hover:bg-accent/30 transition-colors shadow-sm rounded-lg p-6 card-hover"
          >
            <h3 className="text-xl font-semibold mb-2">{routine.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {new Date(routine.createdAt).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                {routine.exercises.length} ejercicios
              </span>
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </Link>
        ))}
        
        <Link
          to="/create-routine"
          className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-accent/10 transition-colors h-full min-h-[180px]"
        >
          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="font-medium">Crear nueva rutina</p>
          <p className="text-sm text-muted-foreground mt-1">
            Personaliza tu entrenamiento
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CustomRoutinesList;
