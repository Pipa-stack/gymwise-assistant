
import { History, Search, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HistoryTab = () => {
  return (
    <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              Historial de conversaciones
            </CardTitle>
            <CardDescription>
              Revisa tus conversaciones anteriores con el asistente
            </CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar en el historial..." className="pl-8" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4">
            <HistoryCard 
              title="Consulta sobre nutrición"
              description="Preguntas sobre proteínas y suplementación post-entrenamiento para optimizar la recuperación muscular y maximizar los resultados del entrenamiento de fuerza."
              date="Hoy"
              category="nutrition"
            />
            
            <HistoryCard 
              title="Rutina para hipertrofia"
              description="Discusión sobre métodos de entrenamiento para ganar masa muscular, incluyendo series, repeticiones y ejercicios recomendados para cada grupo muscular."
              date="Ayer"
              category="training"
            />
            
            <HistoryCard 
              title="Técnica de sentadilla"
              description="Revisión de la técnica correcta para sentadillas con barra, incluyendo posición de pies, respiración y patrones de movimiento seguros."
              date="Hace 3 días"
              category="technique"
            />
            
            <HistoryCard 
              title="Plan de recuperación"
              description="Consulta sobre estrategias de recuperación post-entrenamiento, incluyendo estiramientos, nutrición y descanso."
              date="Hace 1 semana"
              category="recovery"
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

type HistoryCardProps = {
  title: string;
  description: string;
  date: string;
  category: "nutrition" | "training" | "technique" | "recovery";
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  nutrition: { bg: "bg-green-100", text: "text-green-700" },
  training: { bg: "bg-blue-100", text: "text-blue-700" },
  technique: { bg: "bg-yellow-100", text: "text-yellow-700" },
  recovery: { bg: "bg-purple-100", text: "text-purple-700" },
};

const HistoryCard = ({ title, description, date, category }: HistoryCardProps) => (
  <Card className="relative overflow-hidden transition-all hover:shadow-md">
    <div className={`absolute left-0 top-0 w-1 h-full ${categoryColors[category].text.replace('text', 'bg')}`} />
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant="secondary" 
              className={`${categoryColors[category].bg} ${categoryColors[category].text}`}
            >
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 inline mr-1" />
              {date}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
    </CardContent>
  </Card>
);
