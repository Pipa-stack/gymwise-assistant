
import { History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HistoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2 text-primary" />
          Historial de conversaciones
        </CardTitle>
        <CardDescription>
          Revisa tus conversaciones anteriores con el asistente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[50vh]">
          <div className="space-y-4">
            <HistoryCard 
              title="Consulta sobre nutrición"
              description="Preguntas sobre proteínas y suplementación post-entrenamiento..."
              date="Hoy"
            />
            
            <HistoryCard 
              title="Rutina para hipertrofia"
              description="Discusión sobre métodos de entrenamiento para ganar masa muscular..."
              date="Ayer"
            />
            
            <HistoryCard 
              title="Técnica de sentadilla"
              description="Revisión de la técnica correcta para sentadillas con barra..."
              date="Hace 3 días"
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
};

const HistoryCard = ({ title, description, date }: HistoryCardProps) => (
  <Card className="bg-muted/50">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Badge variant="outline" className="text-xs">{date}</Badge>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);
