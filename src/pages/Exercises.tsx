
import { useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, Search, Play, PlusCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-orange-100 text-orange-800"
};

const Exercises = () => {
  const { exercises } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exercises);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const categories = ["all", ...Array.from(new Set(exercises.map(e => e.category)))];

  useEffect(() => {
    // Filter exercises based on search and category
    const filtered = exercises.filter(exercise => {
      const matchesSearch = 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.target.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredExercises(filtered);
  }, [exercises, searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getExerciseById = (id: string | null) => {
    if (!id) return null;
    return exercises.find(e => e.id === id) || null;
  };

  const exercise = getExerciseById(selectedExercise);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ejercicios</h2>
        <p className="text-muted-foreground">
          Explora la base de datos de ejercicios con demostraciones en video.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setSelectedCategory}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <ScrollArea className="w-full sm:w-auto whitespace-nowrap pb-2">
            <TabsList className="h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize px-3 py-1.5"
                >
                  {category === "all" ? "Todos" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ejercicios..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="w-full sm:w-auto whitespace-nowrap">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Ejercicio
            </Button>
          </div>
        </div>

        <TabsContent value={selectedCategory}>
          <div 
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500",
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="aspect-video bg-secondary relative">
                    {exercise.imageUrl ? (
                      <img 
                        src={exercise.imageUrl} 
                        alt={exercise.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                        <Dumbbell className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {exercise.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button 
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                          onClick={() => setSelectedExercise(exercise.id)}
                        >
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={difficultyColors[exercise.difficulty]}>
                        {exercise.difficulty === "beginner" ? "Principiante" : 
                         exercise.difficulty === "intermediate" ? "Intermedio" : "Avanzado"}
                      </Badge>
                      <Badge variant="outline">{exercise.category}</Badge>
                    </div>
                    <CardTitle className="mt-2 line-clamp-1">{exercise.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{exercise.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Músculos trabajados:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.target.map((muscle) => (
                          <span 
                            key={muscle} 
                            className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full gap-1"
                      onClick={() => setSelectedExercise(exercise.id)}
                    >
                      <Info className="h-4 w-4" />
                      <span>Detalles</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="sm:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>No se encontraron ejercicios</CardTitle>
                  <CardDescription>
                    No hay ejercicios que coincidan con tu búsqueda.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-6">
                    <Dumbbell className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedExercise}
        onOpenChange={(open) => {
          if (!open) setSelectedExercise(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {exercise && (
            <>
              <DialogHeader>
                <DialogTitle>{exercise.name}</DialogTitle>
                <DialogDescription>{exercise.description}</DialogDescription>
              </DialogHeader>
              
              {exercise.videoUrl && (
                <div className="aspect-video w-full rounded-md overflow-hidden">
                  <iframe
                    ref={videoRef}
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(exercise.videoUrl)}?rel=0`}
                    title={exercise.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Pasos para realizar el ejercicio:</h4>
                  <ol className="space-y-1 pl-5 list-decimal">
                    {exercise.steps.map((step, index) => (
                      <li key={index} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Músculos trabajados:</h4>
                  <div className="flex flex-wrap gap-1">
                    {exercise.target.map((muscle) => (
                      <Badge key={muscle} variant="outline">{muscle}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Categoría:</h4>
                    <Badge>{exercise.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Dificultad:</h4>
                    <Badge className={difficultyColors[exercise.difficulty]}>
                      {exercise.difficulty === "beginner" ? "Principiante" : 
                       exercise.difficulty === "intermediate" ? "Intermedio" : "Avanzado"}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exercises;
