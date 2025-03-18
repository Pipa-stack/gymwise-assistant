
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardEdit, MessageSquare, MoreHorizontal, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const ClientHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={() => navigate("/clients")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver a Clientes
      </Button>
      <div className="flex gap-2">
        <Button>
          <ClipboardEdit className="mr-2 h-4 w-4" />
          Editar Plan
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/chat")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar Mensaje
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Medición
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
