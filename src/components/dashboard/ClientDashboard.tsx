
import { Client, ScheduledSession } from "@/context/AppContext";
import { ClientStatsCards } from "./StatsCards";
import ClientSessions from "./ClientSessions";
import ClientProgress from "./ClientProgress";
import DocumentViewer from "./DocumentViewer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ClientDashboardProps {
  client: Client;
  clientSessions: ScheduledSession[];
}

const ClientDashboard = ({ client, clientSessions }: ClientDashboardProps) => {
  const nextClientSession = clientSessions[0];
  const trainingDays = Math.ceil(
    Math.abs(new Date().getTime() - new Date(client.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Datos de ejemplo para documentos
  const sampleDocuments = [
    {
      id: "doc1",
      title: "Plan Essentials Program 2x.pdf",
      fileSize: "43 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      category: "Guía",
      exercises: []
    },
    {
      id: "doc4",
      title: "Rutina Hipertrofia Avanzada.pdf",
      fileSize: "5.2 MB",
      fileType: "Documento Adobe Acrobat",
      pdfUrl: "/sample-pdf.pdf",
      createdAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      category: "Informe",
      exercises: []
    }
  ];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mi Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido, {client.name}. Aquí tienes tu resumen.
        </p>
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
      
      <div className="grid gap-6 md:grid-cols-12">
        <DocumentViewer documents={sampleDocuments} />
      </div>
    </div>
  );
};

export default ClientDashboard;
