
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FileText, Plus, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import DocumentViewer from "@/components/dashboard/DocumentViewer";
import ExerciseWeightProgress from "@/components/ExerciseWeightProgress";
import ExerciseViewer from "@/components/ExerciseViewer";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const TrainingPlans = () => {
  const { 
    trainingPlans, 
    clients, 
    mode, 
    getExerciseById, 
    addWeightHistory, 
    addSampleWeightHistory,
    setTrainingPlans,
    customRoutines,
    createCustomRoutine
  } = useAppContext();
  
  const clientId = mode === "client" ? clients[0]?.id : undefined;
  const filteredPlans = clientId 
    ? trainingPlans.filter(plan => plan.clientId === clientId)
    : trainingPlans;

  const filteredRoutines = clientId
    ? customRoutines.filter(routine => routine.clientId === clientId)
    : customRoutines;

  useEffect(() => {
    if (trainingPlans.length === 0 || !trainingPlans.some(plan => plan.id === "comprehensive-plan")) {
      const sampleComprehensivePlan = {
        id: "comprehensive-plan",
        name: "Plan de Entrenamiento Completo - 12 Semanas",
        description: "Plan de entrenamiento personalizado enfocado en fuerza e hipertrofia con progresión lineal",
        goal: "Fuerza e Hipertrofia",
        duration: 12,
        createdAt: new Date().toISOString(),
        clientId: clients[0]?.id,
        workouts: [
          {
            id: "w1-comp",
            day: 1,
            name: "Día de Pecho y Tríceps",
            exercises: [
              { exerciseId: "e1", sets: 4, reps: 8, rest: 90, notes: "Aumentar peso cada semana" },
              { exerciseId: "e4", sets: 3, reps: 10, rest: 60, notes: "Enfoque en contracción muscular" },
              { exerciseId: "e5", sets: 3, reps: 12, rest: 45, notes: "Superset con press de hombros" }
            ]
          },
          {
            id: "w2-comp",
            day: 2,
            name: "Día de Espalda y Bíceps",
            exercises: [
              { exerciseId: "e3", sets: 4, reps: 8, rest: 90, notes: "Mantener espalda recta" },
              { exerciseId: "e7", sets: 3, reps: 12, rest: 60, notes: "Enfoque en estirar al máximo" },
              { exerciseId: "e9", sets: 3, reps: 15, rest: 45, notes: "Curl en banco Scott preferido" }
            ]
          },
          {
            id: "w3-comp",
            day: 3,
            name: "Día de Piernas",
            exercises: [
              { exerciseId: "e2", sets: 5, reps: 5, rest: 120, notes: "Progresión en peso es clave" },
              { exerciseId: "e8", sets: 3, reps: 12, rest: 90, notes: "Control en la fase excéntrica" },
              { exerciseId: "e6", sets: 3, reps: 15, rest: 60, notes: "Superset con extensiones" }
            ]
          },
          {
            id: "w4-comp",
            day: 4,
            name: "Día de Hombros y Abdominales",
            exercises: [
              { exerciseId: "e5", sets: 4, reps: 10, rest: 60, notes: "Enfoque en parte lateral y posterior" },
              { exerciseId: "e10", sets: 3, reps: 12, rest: 45, notes: "Control en toda la amplitud" },
              { exerciseId: "e11", sets: 3, reps: 15, rest: 30, notes: "Aumentar repeticiones progresivamente" }
            ]
          }
        ]
      };
      
      setTrainingPlans(prev => [...prev, sampleComprehensivePlan]);
      
      if (clients.length > 0) {
        addSampleWeightHistory(clients[0].id, "e1", [
          { weight: 60, reps: 8, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), notes: "Primera semana" },
          { weight: 65, reps: 8, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), notes: "Buena técnica" },
          { weight: 67.5, reps: 8, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), notes: "Aumentando peso" },
          { weight: 70, reps: 8, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Progresando bien" }
        ]);
        
        addSampleWeightHistory(clients[0].id, "e2", [
          { weight: 80, reps: 5, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), notes: "Profundidad adecuada" },
          { weight: 85, reps: 5, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), notes: "Mejorando técnica" },
          { weight: 90, reps: 5, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), notes: "Sensación de fuerza" },
          { weight: 95, reps: 5, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Buen progreso" }
        ]);
        
        addSampleWeightHistory(clients[0].id, "e3", [
          { weight: 100, reps: 8, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), notes: "Peso inicial" },
          { weight: 110, reps: 8, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), notes: "Buen agarre" },
          { weight: 115, reps: 8, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), notes: "Espalda recta" },
          { weight: 120, reps: 6, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Reduciendo reps para aumentar peso" }
        ]);
      }
    }
  }, [trainingPlans, clients, setTrainingPlans, addSampleWeightHistory]);

  const sampleDocuments = [
    {
      id: "doc1",
      title: "Plan Essentials Program 2x.pdf",
      fileSize: "4.3 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2023, 11, 15, 10, 30).toISOString(),
      category: "Plan",
      exercises: [
        { name: "Mira por ejemplo", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Este chico se dedica a vender PDFs", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Con rutinas", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Y en cada ejercicio tiene un hipervínculo con la demostración del ejercicio", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ]
    },
    {
      id: "doc2",
      title: "Plan de Entrenamiento - Semana 1.pdf",
      fileSize: "2.5 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2024, 3, 2, 14, 15).toISOString(),
      category: "Plan",
      exercises: [
        { name: "Flat DB Press", videoUrl: "https://youtu.be/URQ1Wn7lYA?feature=shared" },
        { name: "Squat", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ]
    },
    {
      id: "doc3",
      title: "Guía Nutrición Básica.pdf",
      fileSize: "1.8 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2024, 1, 10, 9, 45).toISOString(),
      category: "Guía",
      exercises: []
    },
    {
      id: "doc4",
      title: "Rutina Hipertrofia Avanzada.pdf",
      fileSize: "5.2 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2024, 2, 18, 16, 20).toISOString(),
      category: "Rutina",
      exercises: [
        { name: "Deadlift", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Bench Press", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Pull-up", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ]
    },
    {
      id: "doc5",
      title: "Informe Progreso Mensual.pdf",
      fileSize: "0.8 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2024, 3, 5, 11, 30).toISOString(),
      category: "Informe",
      exercises: []
    },
    {
      id: "doc6",
      title: "Rutina Definición Verano.pdf",
      fileSize: "3.1 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2024, 3, 10, 8, 15).toISOString(),
      category: "Rutina",
      exercises: [
        { name: "HIIT Training", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Burpees", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ]
    },
    {
      id: "doc7",
      title: "Guía de Estiramientos.pdf",
      fileSize: "1.2 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date(2023, 10, 20, 15, 45).toISOString(),
      category: "Guía",
      exercises: [
        { name: "Estiramiento de isquiotibiales", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Estiramiento de cuádriceps", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { name: "Estiramiento de hombros", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
      ]
    }
  ];
  
  const handleCreatePlan = () => {
    toast({
      title: "Crear Plan",
      description: "Funcionalidad para crear planes será implementada pronto"
    });
  };
  
  const handleCreateRoutine = () => {
    const newRoutine = createCustomRoutine("Nueva Rutina");
    toast({
      title: "Nueva Rutina Creada",
      description: "Se ha creado una nueva rutina personalizada"
    });
    return newRoutine.id;
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
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

      {customRoutines.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Mis Rutinas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutines.map(routine => (
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
      )}

      <div className="space-y-6">
        {mode === "trainer" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Recursos y Documentos
              </h3>
            </div>
            <DocumentViewer documents={sampleDocuments} />
          </div>
        )}

        <div className="grid gap-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="space-y-4">
              <div className="bg-card shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-semibold gradient-text mb-2">{plan.name}</h2>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    {plan.goal}
                  </span>
                  <span className="bg-secondary/10 text-secondary text-sm px-3 py-1 rounded-full">
                    {plan.duration} semanas
                  </span>
                </div>
              </div>
              
              <ExerciseViewer planId={plan.id} />
              
              {plan.workouts.map((workout) => (
                <div key={workout.id} className="border rounded-lg p-4 space-y-4">
                  <h3 className="text-xl font-medium">Día {workout.day}: {workout.name}</h3>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    {workout.exercises.map((exercise) => {
                      const exerciseDetails = getExerciseById(exercise.exerciseId);
                      if (!exerciseDetails) return null;
                      
                      const client = clients.find(c => c.id === plan.clientId);
                      const exerciseHistory = client?.weightHistory?.filter(
                        h => h.exerciseId === exercise.exerciseId
                      );

                      return (
                        <ExerciseWeightProgress
                          key={exercise.exerciseId}
                          exerciseId={exercise.exerciseId}
                          exerciseName={exerciseDetails.name}
                          weightHistory={exerciseHistory}
                          onAddWeight={(weight, reps, notes) => {
                            if (client) {
                              addWeightHistory(client.id, exercise.exerciseId, weight, reps, notes);
                              toast({
                                title: "Progreso guardado",
                                description: `Se ha registrado tu progreso en ${exerciseDetails.name}`
                              });
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingPlans;
