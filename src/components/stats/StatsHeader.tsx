
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { Client } from "@/context/AppContext";

interface StatsHeaderProps {
  mode: "trainer" | "client";
  activeClient: string;
  setActiveClient: (clientId: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  clients: Client[];
  onAddMeasurement: () => void;
}

const StatsHeader = ({
  mode,
  activeClient,
  setActiveClient,
  timeRange,
  setTimeRange,
  clients,
  onAddMeasurement
}: StatsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">Estadísticas</h1>
      <div className="flex items-center gap-2">
        {mode === "trainer" && (
          <Select value={activeClient} onValueChange={setActiveClient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 mes</SelectItem>
            <SelectItem value="3m">3 meses</SelectItem>
            <SelectItem value="6m">6 meses</SelectItem>
            <SelectItem value="1y">1 año</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={onAddMeasurement}
          className="bg-primary text-white rounded-md flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Añadir Medición
        </Button>
      </div>
    </div>
  );
};

export default StatsHeader;
