
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Youtube, 
  ExternalLink, 
  Download, 
  Eye, 
  Calendar, 
  Share2, 
  Printer,
  Info
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DocumentExercise {
  name: string;
  videoUrl: string;
}

export interface PdfDocumentProps {
  id: string;
  title: string;
  fileSize: string;
  fileType: string;
  thumbnailUrl?: string;
  pdfUrl: string;
  exercises?: DocumentExercise[];
  createdAt: string;
  category?: string;
}

const PdfDocument = ({ 
  title, 
  fileSize, 
  fileType, 
  thumbnailUrl, 
  pdfUrl, 
  exercises,
  createdAt,
  category
}: PdfDocumentProps) => {
  const [showVideo, setShowVideo] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<DocumentExercise | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Función para obtener el ID de un video de YouTube de su URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Función para manejar la apertura de un video
  const handleOpenVideo = (exercise: DocumentExercise) => {
    setSelectedExercise(exercise);
    setShowVideo(true);
  };

  // Función para compartir el documento
  const handleShare = () => {
    // Aquí iría la lógica para compartir, por ahora solo alerta
    alert("Función de compartir documento: " + title);
  };

  // Función para imprimir el documento
  const handlePrint = () => {
    window.open(pdfUrl, '_blank')?.print();
  };

  // Determinar el color del badge según la categoría
  const getBadgeVariant = () => {
    if (!category) return "outline";
    
    switch(category.toLowerCase()) {
      case "plan": return "default";
      case "guía": case "guia": return "secondary";
      case "rutina": return "destructive";
      case "informe": return "outline";
      default: return "outline";
    }
  };

  const formattedDate = format(new Date(createdAt), "dd/MM/yyyy HH:mm");

  return (
    <div className="border rounded-md overflow-hidden bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-4">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title} 
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-base">{title}</h3>
            {category && (
              <Badge variant={getBadgeVariant()}>
                {category}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{fileSize}, {fileType}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          </div>
          <div className="flex mt-2 space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1">Ver</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver documento</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" asChild>
                    <a href={pdfUrl} download>
                      <Download className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1">Descargar</span>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Descargar documento</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handlePrint}>
                    <Printer className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-1">Imprimir</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Imprimir documento</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-1">Compartir</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Compartir documento</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
                    <Info className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-1">Detalles</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver detalles del documento</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {exercises && exercises.length > 0 && (
        <div className="border-t px-4 py-2">
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-1 text-sm hover:bg-accent/50 px-2 rounded-md transition-colors"
              >
                <span className="flex items-center">
                  <ExternalLink className="h-3 w-3 mr-2 text-primary" />
                  {exercise.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleOpenVideo(exercise)}
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog para la visualización del video */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-2xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedExercise.name}</DialogTitle>
              </DialogHeader>
              
              <div className="aspect-video w-full rounded-md overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedExercise.videoUrl)}?rel=0&autoplay=1`}
                  title={selectedExercise.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para los detalles del documento */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold">Nombre</h4>
              <p>{title}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Categoría</h4>
              <p>{category || "Sin categoría"}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Formato</h4>
              <p>{fileType}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Tamaño</h4>
              <p>{fileSize}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Fecha de creación</h4>
              <p>{formattedDate}</p>
            </div>
            {exercises && exercises.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold">Ejercicios incluidos</h4>
                <ul className="list-disc pl-5">
                  {exercises.map((ex, i) => (
                    <li key={i}>{ex.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PdfDocument;
