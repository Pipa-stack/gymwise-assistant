
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProgressChart from "@/components/ProgressChart";

interface ClientProgressProps {
  client: any;
  progressSummary: string;
}

export const ClientProgress = ({ client, progressSummary }: ClientProgressProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Progreso</CardTitle>
          <CardDescription>{progressSummary}</CardDescription>
        </CardHeader>
      </Card>

      {client.progress && client.progress.length > 0 ? (
        <ProgressChart 
          data={client.progress}
          metrics={["weight", "bodyFat", "musclePercentage"]}
          height={300}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sin datos de progreso</CardTitle>
            <CardDescription>No hay mediciones registradas para este cliente.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Medición
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
