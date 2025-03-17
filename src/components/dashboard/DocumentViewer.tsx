
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Filter, Search, SortAsc, SortDesc, Calendar, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import PdfDocument, { PdfDocumentProps } from "./PdfDocument";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  documents: PdfDocumentProps[];
}

type SortOption = "newest" | "oldest" | "a-z" | "z-a" | "size-asc" | "size-desc";

const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const { toast } = useToast();
  
  // Extraer categorías únicas de los documentos
  const categories = Array.from(
    new Set(documents.map(doc => doc.category || "Sin categoría"))
  );
  
  // Ordenar documentos
  const sortDocuments = (docs: PdfDocumentProps[]) => {
    return [...docs].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "z-a":
          return b.title.localeCompare(a.title);
        case "size-asc":
          return parseFloat(a.fileSize) - parseFloat(b.fileSize);
        case "size-desc":
          return parseFloat(b.fileSize) - parseFloat(a.fileSize);
        default:
          return 0;
      }
    });
  };
  
  // Filtrar documentos por categoría y búsqueda
  const filteredDocuments = documents.filter(doc => {
    // Filtrado por categoría
    const categoryMatch = filter ? 
      (doc.category && doc.category.toLowerCase() === filter.toLowerCase()) || 
      (!doc.category && filter === "Sin categoría") : 
      true;
    
    // Filtrado por búsqueda
    const searchMatch = searchQuery ? 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (doc.exercises?.some(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())) ?? false) 
      : true;
    
    return categoryMatch && searchMatch;
  });

  // Ordenar los documentos filtrados
  const sortedDocuments = sortDocuments(filteredDocuments);

  // Función para manejar la subida de documentos
  const handleUpload = () => {
    toast({
      title: "Función en desarrollo",
      description: "La carga de documentos estará disponible próximamente.",
      duration: 3000
    });
  };

  return (
    <Card className="col-span-12 animate-slide-in-up [animation-delay:600ms]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mis Documentos</CardTitle>
            <CardDescription>Accede a tus rutinas y guías de ejercicios</CardDescription>
          </div>
          <Button onClick={handleUpload}>
            <FileUp className="mr-2 h-4 w-4" />
            Subir Documento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en documentos o ejercicios..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Dropdown para filtrar por categoría */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  {filter || "Categoría"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter(null)}>
                  Todas las categorías
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown para opciones de ordenación */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  {sortBy === "newest" || sortBy === "oldest" ? (
                    <Calendar className="h-4 w-4" />
                  ) : sortBy === "a-z" || sortBy === "z-a" ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <SortAsc className="h-4 w-4" />
                  )}
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <DropdownMenuRadioItem value="newest">Más recientes primero</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Más antiguos primero</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="a-z">Nombre (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="z-a">Nombre (Z-A)</DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem value="size-asc">Tamaño (menor a mayor)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="size-desc">Tamaño (mayor a menor)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="space-y-4">
          {sortedDocuments.length > 0 ? (
            <div className="space-y-4">
              {sortedDocuments.map((doc) => (
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
