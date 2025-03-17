
import { useNavigate } from "react-router-dom";
import { Client } from "@/context/AppContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, ClipboardList, TrendingUp, Target } from "lucide-react";

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const navigate = useNavigate();
  
  const lastProgress = client.progress && client.progress.length > 0 
    ? client.progress[client.progress.length - 1] 
    : null;
  
  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-all rounded-xl group border-border/70">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mt-16 -mr-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Avatar className="h-16 w-16 border-4 border-background shadow-md">
            <AvatarImage src={client.photo} alt={client.name} />
            <AvatarFallback className="bg-primary/10 text-primary">{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/20 transition-colors border-none">{client.goal}</Badge>
        </div>
        
        <h3 className="text-xl font-semibold">{client.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{client.email}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary opacity-70" />
            <span>{client.age} años</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary opacity-70" />
            <span>{new Date(client.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
          </div>
          {lastProgress && (
            <>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary opacity-70" />
                <span>{lastProgress.weight} kg</span>
              </div>
              {lastProgress.bodyFat !== undefined && (
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 flex items-center justify-center text-primary opacity-70">%</div>
                  <span>{lastProgress.bodyFat}% grasa</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-6 pt-0">
        <Button variant="outline" size="sm" className="flex-1 rounded-lg" onClick={onClick}>
          <Calendar className="h-4 w-4 mr-1" />
          Reservar
        </Button>
        <Button onClick={() => navigate(`/clients/${client.id}`)} className="flex-1 rounded-lg">
          <ClipboardList className="h-4 w-4 mr-1" />
          Detalle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
