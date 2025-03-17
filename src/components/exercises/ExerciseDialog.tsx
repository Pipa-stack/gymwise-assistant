
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Dumbbell, 
  BookOpen, 
  CheckCircle2, 
  Plus 
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface ExerciseDialogProps {
  exerciseId: string | null;
  onClose: () => void;
}

const ExerciseDialog = ({ exerciseId, onClose }: ExerciseDialogProps) => {
  const { exercises } = useAppContext();
  const exercise = exercises.find(ex => ex.id === exerciseId);

  // Función para obtener el ID de video de YouTube
  const getYouTubeVideoId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Dialog open={!!exerciseId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        {exercise && (
          <>
            <DialogHeader>
              <DialogTitle>{exercise.name}</DialogTitle>
              <DialogDescription>
                {exercise.category} • {exercise.difficulty}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Información</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
                <TabsTrigger value="instructions" className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Instrucciones</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-1">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Descripción</h3>
                      <p>{exercise.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Músculos trabajados</h3>
                      <div className="flex flex-wrap gap-1">
                        {exercise.target.map((muscle) => (
                          <Badge key={muscle} variant="outline">{muscle}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Dificultad</h3>
                      <Badge variant={
                        exercise.difficulty === "beginner" ? "outline" :
                        exercise.difficulty === "intermediate" ? "secondary" : "default"
                      }>
                        {exercise.difficulty === "beginner" ? "Principiante" :
                         exercise.difficulty === "intermediate" ? "Intermedio" : "Avanzado"}
                      </Badge>
                    </div>
                    
                    {exercise.imageUrl && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Imagen</h3>
                        <div className="rounded-md overflow-hidden">
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name} 
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="video" className="flex-1">
                {exercise.videoUrl ? (
                  <div className="aspect-video w-full rounded-md overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(exercise.videoUrl)}?rel=0`}
                      title={exercise.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No hay video disponible para este ejercicio.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="instructions" className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-1">
                    <h3 className="text-sm font-medium mb-2">Pasos para realizar el ejercicio:</h3>
                    <ol className="space-y-3 pl-5 list-decimal">
                      {exercise.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
                Cerrar
              </Button>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Añadir a mi rutina
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseDialog;
