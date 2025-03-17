
import { Client, ScheduledSession } from "@/context/AppContext";
import { ClientStatsCards } from "./StatsCards";
import ClientSessions from "./ClientSessions";
import ClientProgress from "./ClientProgress";
import DocumentViewer from "./DocumentViewer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarCheck, TrendingUp, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ClientDashboardProps {
  client: Client;
  clientSessions: ScheduledSession[];
}

const ClientDashboard = ({ client, clientSessions }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const nextClientSession = clientSessions[0];
  const trainingDays = Math.ceil(
    Math.abs(new Date().getTime() - new Date(client.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Datos de ejemplo para documentos
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
  
  // Calculate completion percentage
  const completionPercentage = client.progress 
    ? Math.min(Math.round((client.progress.length / 10) * 100), 100) 
    : 0;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section with progress */}
      <div className="rounded-lg bg-gradient-to-r from-primary/20 via-primary/5 to-transparent p-6 border shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">¡Hola, {client.name.split(' ')[0]}!</h2>
            <p className="text-muted-foreground max-w-lg">
              Bienvenido a tu panel personal. Llevas {trainingDays} días entrenando con nosotros. ¡Sigue así!
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => navigate("/calendar")}>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Reservar Sesión
              </Button>
              <Button variant="outline" onClick={() => navigate("/stats")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Ver Progreso
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50 min-w-[200px]">
            <div className="text-center mb-2">
              <div className="font-medium">Progreso Global</div>
              <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
            </div>
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700 ease-in-out" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Objetivo: {client.goal}
            </div>
          </div>
        </div>
      </div>

      <ClientStatsCards 
        nextSessionDate={nextClientSession ? 
          format(new Date(nextClientSession.date), "dd 'de' MMM", { locale: es })
          : "Sin programar"}
        trainingDays={trainingDays}
        goal={client.goal}
      />

      <div className="grid gap-6 md:grid-cols-12">
        <ClientSessions sessions={clientSessions} />
        <ClientProgress progress={client.progress || []} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Recursos y Documentos
          </h3>
          <Button variant="ghost" className="gap-1" onClick={() => navigate("/training-plans")}>
            Ver Todo
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        <DocumentViewer documents={sampleDocuments} />
      </div>
    </div>
  );
};

export default ClientDashboard;
