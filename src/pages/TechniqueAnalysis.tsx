
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Camera,
  Video,
  Upload,
  ChevronRight,
  Check,
  X,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Lightbulb,
  Image,
  Move,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Simulación de ejercicios para análisis
const EXERCISES = [
  { id: "e1", name: "Sentadilla", category: "Piernas", difficulty: "intermediate" },
  { id: "e2", name: "Press de Banca", category: "Pecho", difficulty: "intermediate" },
  { id: "e3", name: "Peso Muerto", category: "Espalda", difficulty: "advanced" },
  { id: "e4", name: "Dominadas", category: "Espalda", difficulty: "advanced" },
  { id: "e5", name: "Press Militar", category: "Hombros", difficulty: "intermediate" },
];

// Puntos clave de análisis para cada ejercicio
const ANALYSIS_POINTS = {
  e1: [
    { id: "p1", description: "Rodillas alineadas con los pies", status: "good" },
    { id: "p2", description: "Espalda recta durante todo el movimiento", status: "warning" },
    { id: "p3", description: "Profundidad adecuada (caderas por debajo de rodillas)", status: "good" },
    { id: "p4", description: "Distribución del peso en los talones", status: "error" },
    { id: "p5", description: "Rodillas no sobrepasan la punta de los pies", status: "good" },
  ],
  e2: [
    { id: "p1", description: "Codos a 45 grados del cuerpo", status: "good" },
    { id: "p2", description: "Arco lumbar ligero", status: "warning" },
    { id: "p3", description: "Barra desciende hasta el pecho", status: "good" },
    { id: "p4", description: "Escápulas retraídas y deprimidas", status: "good" },
    { id: "p5", description: "Muñecas alineadas con los antebrazos", status: "error" },
  ],
  // Otros ejercicios...
};

const TechniqueAnalysis = () => {
  const { toast } = useToast();
  const [selectedExercise, setSelectedExercise] = useState<string>("e1");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  
  // Puntos de análisis para el ejercicio seleccionado
  const analysisPoints = ANALYSIS_POINTS[selectedExercise as keyof typeof ANALYSIS_POINTS] || [];
  
  // Ejercicio seleccionado
  const exercise = EXERCISES.find(ex => ex.id === selectedExercise);
  
  const handleStartRecording = () => {
    setIsRecording(true);
    
    toast({
      title: "Grabación iniciada",
      description: "Por favor, realiza el ejercicio completo frente a la cámara.",
    });
    
    // Simulación de finalización de grabación después de 3 segundos
    setTimeout(() => {
      setIsRecording(false);
      setHasVideo(true);
      
      toast({
        title: "Grabación completada",
        description: "Ahora puedes analizar tu técnica.",
      });
    }, 3000);
  };
  
  const handleAnalyze = () => {
    setIsPlaying(true);
    
    toast({
      title: "Analizando técnica",
      description: "Procesando vídeo, por favor espera...",
    });
    
    // Simulación de análisis completado después de 2 segundos
    setTimeout(() => {
      setIsPlaying(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Análisis completado",
        description: "Revisa los resultados del análisis de tu técnica.",
      });
    }, 2000);
  };
  
  const handleReset = () => {
    setHasVideo(false);
    setIsPlaying(false);
    setAnalysisComplete(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Análisis de Técnica</h1>
        <Select value={selectedExercise} onValueChange={(value) => {
          setSelectedExercise(value);
          setHasVideo(false);
          setAnalysisComplete(false);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar ejercicio" />
          </SelectTrigger>
          <SelectContent>
            {EXERCISES.map(ex => (
              <SelectItem key={ex.id} value={ex.id}>
                {ex.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                {exercise?.name || "Ejercicio"}
              </CardTitle>
              <Badge variant={
                exercise?.difficulty === "beginner" ? "outline" : 
                exercise?.difficulty === "intermediate" ? "secondary" : 
                "destructive"
              }>
                {exercise?.difficulty === "beginner" ? "Principiante" : 
                 exercise?.difficulty === "intermediate" ? "Intermedio" : 
                 "Avanzado"}
              </Badge>
            </div>
            <CardDescription>Graba un video para analizar tu técnica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
              {!hasVideo ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center max-w-xs">
                    {isRecording 
                      ? "Grabando... Realiza el ejercicio completo" 
                      : "Captura un video para analizar tu técnica"
                    }
                  </p>
                  {!isRecording && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => {
                          toast({
                            title: "Subir video",
                            description: "Función no disponible en esta versión de demostración.",
                          });
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Subir Video</span>
                      </Button>
                      <Button
                        onClick={handleStartRecording}
                        className="flex items-center gap-1"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Iniciar Grabación</span>
                      </Button>
                    </div>
                  )}
                  {isRecording && (
                    <div className="mt-4">
                      <div className="animate-pulse flex items-center gap-2 text-red-500">
                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                        <span>REC</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Ejercicio de ejemplo" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {isPlaying ? (
                        <Button variant="outline" size="icon" onClick={() => setIsPlaying(false)}>
                          <PauseCircle className="h-5 w-5" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon" onClick={() => setIsPlaying(true)}>
                          <PlayCircle className="h-5 w-5" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RotateCcw className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {!analysisComplete && (
                      <Button
                        variant="default"
                        className="flex items-center gap-1"
                        onClick={handleAnalyze}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Analizar Técnica</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Resultados del Análisis
            </CardTitle>
            <CardDescription>
              Puntos clave de técnica para {exercise?.name || "el ejercicio"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysisComplete ? (
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <Move className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                <p className="text-muted-foreground">
                  Graba y analiza un video para ver los resultados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysisPoints.map(point => (
                  <div 
                    key={point.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      point.status === "good" ? "border-green-200 bg-green-50" :
                      point.status === "warning" ? "border-yellow-200 bg-yellow-50" :
                      "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className={`rounded-full p-1 ${
                      point.status === "good" ? "bg-green-500" :
                      point.status === "warning" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}>
                      {point.status === "good" ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : point.status === "warning" ? (
                        <Lightbulb className="h-4 w-4 text-white" />
                      ) : (
                        <X className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        point.status === "good" ? "text-green-800" :
                        point.status === "warning" ? "text-yellow-800" :
                        "text-red-800"
                      }`}>
                        {point.description}
                      </p>
                      {point.status === "warning" && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Mejora posible: Mantén más atención a este aspecto.
                        </p>
                      )}
                      {point.status === "error" && (
                        <p className="text-xs text-red-600 mt-1">
                          Corrección necesaria: Consulta las recomendaciones.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => {
                toast({
                  title: "Historial de análisis",
                  description: "Función no disponible en esta versión de demostración.",
                });
              }}
            >
              <Image className="h-4 w-4" />
              <span>Historial</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => {
                toast({
                  title: "Tutorial",
                  description: "Función no disponible en esta versión de demostración.",
                });
              }}
            >
              <ChevronRight className="h-4 w-4" />
              <span>Ver Tutorial</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TechniqueAnalysis;
