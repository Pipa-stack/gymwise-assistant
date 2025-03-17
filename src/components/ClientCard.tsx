
import { useState, useRef, useEffect } from "react";
import { Client } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Calendar, Target, ChevronRight } from "lucide-react";

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  // Calculate days since start
  const startDate = new Date(client.startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group rounded-lg border bg-card overflow-hidden transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.01]"
      )}
    >
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-4">
        <div 
          className={cn(
            "h-16 w-16 rounded-full overflow-hidden flex-shrink-0 blur-load",
            imageLoaded && "loaded"
          )}
          style={{ backgroundImage: `url(${client.photo})` }}
        >
          <img
            ref={imageRef}
            src={client.photo} 
            alt={client.name}
            className="h-full w-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-medium text-lg">{client.name}</h3>
            <div className="flex items-center text-xs text-muted-foreground mt-1 sm:mt-0">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{diffDays} días</span>
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <Target className="h-3 w-3 mr-1" />
              {client.goal}
            </div>
            
            {client.progress && client.progress.length >= 2 && (
              <div className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                client.progress[client.progress.length - 1].weight < client.progress[client.progress.length - 2].weight
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              )}>
                {client.progress[client.progress.length - 1].weight} kg
              </div>
            )}
          </div>
        </div>
        
        {onClick && (
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        )}
      </div>
    </div>
  );
};

export default ClientCard;
