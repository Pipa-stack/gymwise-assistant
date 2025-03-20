
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Image, X } from "lucide-react";

interface TrainingPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
}

interface TrainingGalleryProps {
  photos: TrainingPhoto[];
}

const TrainingGallery = ({ photos }: TrainingGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<TrainingPhoto | null>(null);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Fotos de Entrenamiento</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map(photo => (
          <Card 
            key={photo.id} 
            className="overflow-hidden hover:shadow-md cursor-pointer transition-all" 
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative">
              <img 
                src={photo.url} 
                alt={photo.description} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <p className="text-sm font-medium line-clamp-1">{photo.description}</p>
                  <p className="text-xs opacity-80">{format(new Date(photo.date), "dd/MM/yyyy")}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Card className="flex items-center justify-center aspect-square border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-2">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Añadir foto</p>
          </CardContent>
        </Card>
      </div>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
          <button 
            onClick={() => setSelectedPhoto(null)} 
            className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-1 text-white hover:bg-black/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="grid md:grid-cols-5 h-full">
            <div className="md:col-span-3 bg-black flex items-center">
              <img 
                src={selectedPhoto?.url} 
                alt={selectedPhoto?.description} 
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <div className="md:col-span-2 p-6">
              <DialogHeader>
                <DialogTitle>{selectedPhoto?.description}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Fecha</h4>
                  <p>{selectedPhoto && format(new Date(selectedPhoto.date), "dd MMMM yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Descripción</h4>
                  <p>{selectedPhoto?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingGallery;
