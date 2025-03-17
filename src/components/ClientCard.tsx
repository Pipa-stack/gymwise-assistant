
import { useNavigate } from "react-router-dom";
import { Client } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ClipboardList } from "lucide-react";

interface ClientCardProps {
  client: Client;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const navigate = useNavigate();
  
  const lastProgress = client.progress && client.progress.length > 0 
    ? client.progress[client.progress.length - 1] 
    : null;
  
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Avatar className="h-16 w-16 border-4 border-background">
            <AvatarImage src={client.photo} alt={client.name} />
            <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Badge>{client.goal}</Badge>
        </div>
        
        <h3 className="text-xl font-semibold">{client.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{client.email}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Edad:</span> {client.age}
          </div>
          <div>
            <span className="text-muted-foreground">Inicio:</span> {new Date(client.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
          </div>
          {lastProgress && (
            <>
              <div>
                <span className="text-muted-foreground">Peso:</span> {lastProgress.weight} kg
              </div>
              {lastProgress.bodyFat !== undefined && (
                <div>
                  <span className="text-muted-foreground">% Grasa:</span> {lastProgress.bodyFat}%
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-6 pt-0">
        <Button variant="outline" size="sm" className="flex-1">
          <Calendar className="h-4 w-4 mr-1" />
          Reservar
        </Button>
        <Button onClick={() => navigate(`/clients/${client.id}`)} className="flex-1">
          <ClipboardList className="h-4 w-4 mr-1" />
          Detalle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
