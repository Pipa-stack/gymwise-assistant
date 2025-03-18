
import { Mail, Phone, User, Calendar, Target } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateBMI, getBMICategory } from "@/utils/progressUtils";

interface ClientProfileProps {
  client: any;
  latestProgress: any;
}

export const ClientProfile = ({ client, latestProgress }: ClientProfileProps) => {
  const bmi = client.height && latestProgress 
    ? calculateBMI(latestProgress.weight, client.height) 
    : 0;
    
  const bmiCategory = getBMICategory(bmi);

  return (
    <Card className="md:w-1/3">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={client.photo} alt={client.name} />
          <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <CardTitle>{client.name}</CardTitle>
        <CardDescription>{client.goal}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{client.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{client.age} años</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Cliente desde {new Date(client.startDate).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Objetivo: {client.goal}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Datos físicos actuales</h4>
            {latestProgress ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border p-2">
                  <div className="text-xs text-muted-foreground">Peso</div>
                  <div className="font-medium">{latestProgress.weight} kg</div>
                </div>
                {latestProgress.bodyFat !== undefined && (
                  <div className="rounded-md border p-2">
                    <div className="text-xs text-muted-foreground">% Grasa</div>
                    <div className="font-medium">{latestProgress.bodyFat}%</div>
                  </div>
                )}
                {client.height && (
                  <div className="rounded-md border p-2">
                    <div className="text-xs text-muted-foreground">Altura</div>
                    <div className="font-medium">{client.height} m</div>
                  </div>
                )}
                {bmi > 0 && (
                  <div className="rounded-md border p-2">
                    <div className="text-xs text-muted-foreground">IMC</div>
                    <div className="font-medium">{bmi.toFixed(1)} ({bmiCategory})</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No hay datos disponibles</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
