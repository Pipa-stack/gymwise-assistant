
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Filter } from "lucide-react";
import PdfDocument, { PdfDocumentProps } from "./PdfDocument";

interface DocumentViewerProps {
  documents: PdfDocumentProps[];
}

const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Filtrar documentos por categoría
  const filteredDocuments = filter 
    ? documents.filter(doc => doc.title.toLowerCase().includes(filter.toLowerCase()))
    : documents;

  return (
    <Card className="col-span-12 animate-slide-in-up [animation-delay:600ms]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mis Documentos</CardTitle>
            <CardDescription>Accede a tus rutinas y guías de ejercicios</CardDescription>
          </div>
          <Button>
            <FileUp className="mr-2 h-4 w-4" />
            Subir Documento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <PdfDocument key={doc.id} {...doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay documentos disponibles</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
