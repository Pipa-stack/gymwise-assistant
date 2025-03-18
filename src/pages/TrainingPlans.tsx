import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FileText } from "lucide-react";
import DocumentViewer from "@/components/dashboard/DocumentViewer";
import ExerciseWeightProgress from "@/components/ExerciseWeightProgress";

const TrainingPlans = () => {
  const { trainingPlans, clients, mode, getExerciseById, addWeightHistory } = useAppContext();
  
  // Si es cliente, mostrar solo sus planes
  const clientId = mode === "client" ? clients[0]?.id : undefined;
  const filteredPlans = clientId 
    ? trainingPlans.filter(plan => plan.clientId === clientId)
    : trainingPlans;

  // Sample documents from the dashboard (you can move this to your context or API call)
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Planes de Entrenamiento</h1>
        {mode === "trainer" && (
          <Button variant="outline">Crear Plan</Button>
        )}
      </div>

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
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="text-muted-foreground">{plan.description}</p>
              
              {plan.workouts.map((workout) => (
                <div key={workout.id} className="border rounded-lg p-4 space-y-4">
                  <h3 className="text-xl font-medium">Día {workout.day}: {workout.name}</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
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
