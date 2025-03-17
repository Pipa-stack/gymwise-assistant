
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Youtube, ExternalLink, Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  return (
    <div className="border rounded-md overflow-hidden bg-card">
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
          <p className="text-sm text-muted-foreground">{fileSize}, {fileType}</p>
          <div className="flex mt-2 space-x-2">
            <Button size="sm" variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-1 h-4 w-4" />
                <span>Abrir</span>
              </a>
            </Button>
            
            <Button size="sm" variant="outline" asChild>
              <a href={pdfUrl} download>
                <Download className="mr-1 h-4 w-4" />
                <span>Guardar como...</span>
              </a>
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {new Date(createdAt).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          })}
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

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-2xl">
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExercise.name}</DialogTitle>
              </DialogHeader>
              
              <div className="aspect-video w-full rounded-md overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedExercise.videoUrl)}?rel=0`}
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
    </div>
  );
};

export default PdfDocument;
