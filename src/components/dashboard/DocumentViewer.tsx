
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PdfDocument, { PdfDocumentProps } from "./PdfDocument";

interface DocumentViewerProps {
  documents: PdfDocumentProps[];
}

const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Extraer categorías de documentos (usando la primera palabra del título como categoría para demostración)
  const categories = Array.from(new Set(documents.map(doc => {
    const firstWord = doc.title.split(' ')[0];
    return firstWord;
  })));
  
  // Filtrar documentos por categoría y búsqueda
  const filteredDocuments = documents.filter(doc => {
    // Filtrado por categoría
    const categoryMatch = filter ? doc.title.toLowerCase().includes(filter.toLowerCase()) : true;
    
    // Filtrado por búsqueda
    const searchMatch = searchQuery ? 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (doc.exercises?.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())) ?? false) 
      : true;
    
    return categoryMatch && searchMatch;
  });

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
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en documentos o ejercicios..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                {filter ? filter : "Filtrar"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter(null)}>
                Todos los documentos
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <PdfDocument key={doc.id} {...doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay documentos disponibles con los filtros actuales</p>
              {(filter || searchQuery) && (
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setFilter(null);
                    setSearchQuery("");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
