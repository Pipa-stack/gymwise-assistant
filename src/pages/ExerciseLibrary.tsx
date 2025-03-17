
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, Plus, ChevronRight, Filter } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import ExerciseDialog from "@/components/exercises/ExerciseDialog";

const muscleGroups = [
  "Pecho", "Espalda", "Piernas", "Hombros", "Bíceps", "Tríceps", "Abdominales", "Glúteos"
];

const equipmentTypes = [
  "Todo", "Barra", "Mancuernas", "Máquinas", "Poleas", "Peso corporal", "Bandas elásticas"
];

const ExerciseLibrary = () => {
  const { exercises } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("Todo");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const handleEquipmentSelect = (equipment: string) => {
    if (selectedEquipment === equipment) {
      setSelectedEquipment("Todo");
    } else {
      setSelectedEquipment(equipment);
    }
  };

  const handleMuscleSelect = (muscle: string) => {
    if (selectedMuscle === muscle) {
      setSelectedMuscle(null);
    } else {
      setSelectedMuscle(muscle);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    // Filtrar por búsqueda
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por equipo (si no es "Todo")
    const matchesEquipment = selectedEquipment === "Todo" || 
                            exercise.name.toLowerCase().includes(selectedEquipment.toLowerCase());
    
    // Filtrar por grupo muscular
    const matchesMuscle = !selectedMuscle || 
                          exercise.category === selectedMuscle || 
                          exercise.target.includes(selectedMuscle);
    
    return matchesSearch && matchesEquipment && matchesMuscle;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Ejercicios</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Añadir ejercicio
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Buscar Ejercicios</CardTitle>
          <CardDescription>
            Encuentra ejercicios por nombre, grupo muscular o equipo
          </CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ejercicios..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filtrar por equipo
              </h3>
              <ScrollArea className="pb-3">
                <div className="flex gap-2 pb-2 overflow-x-auto">
                  {equipmentTypes.map(equipment => (
                    <Button
                      key={equipment}
                      variant={selectedEquipment === equipment ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleEquipmentSelect(equipment)}
                    >
                      {equipment}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Grupos musculares</h3>
              <div className="flex flex-wrap gap-2">
                {muscleGroups.map(muscle => (
                  <Badge
                    key={muscle}
                    variant={selectedMuscle === muscle ? "default" : "outline"}
                    className={`cursor-pointer ${selectedMuscle === muscle ? "" : "hover:bg-accent"}`}
                    onClick={() => handleMuscleSelect(muscle)}
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-3">Resultados ({filteredExercises.length})</h3>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {filteredExercises.map((exercise) => (
                    <div 
                      key={exercise.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => setSelectedExercise(exercise.id)}
                    >
                      <div className="h-12 w-12 rounded-md bg-muted mr-3 overflow-hidden">
                        {exercise.imageUrl ? (
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <span className="text-xs">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{exercise.name}</h4>
                        <div className="text-sm text-muted-foreground">{exercise.category}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                  
                  {filteredExercises.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                      No se encontraron ejercicios con los criterios seleccionados.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ExerciseDialog 
        exerciseId={selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
      />
    </div>
  );
};

export default ExerciseLibrary;
