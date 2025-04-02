
import { Client, WeightHistory } from "@/types/contextTypes";
import { toast } from "@/hooks/use-toast";

// Add weight history
export const addWeightHistory = (
  clientId: string, 
  exerciseId: string, 
  weight: number, 
  reps: number, 
  notes: string | undefined,
  setClients: React.Dispatch<React.SetStateAction<Client[]>>
) => {
  const newWeightRecord: WeightHistory = {
    exerciseId,
    date: new Date().toISOString(),
    weight,
    reps,
    notes
  };

  setClients(prev => prev.map(client => {
    if (client.id === clientId) {
      return {
        ...client,
        weightHistory: [...(client.weightHistory || []), newWeightRecord]
      };
    }
    return client;
  }));

  toast({
    title: "Peso registrado",
    description: "El progreso ha sido guardado correctamente"
  });
};

// Add sample weight history
export const addSampleWeightHistory = (
  clientId: string, 
  exerciseId: string, 
  records: Omit<WeightHistory, "exerciseId">[],
  setClients: React.Dispatch<React.SetStateAction<Client[]>>
) => {
  const weightRecords = records.map(record => ({
    ...record,
    exerciseId
  }));

  setClients(prev => prev.map(client => {
    if (client.id === clientId) {
      const existingRecords = client.weightHistory || [];
      const filteredExistingRecords = existingRecords.filter(r => r.exerciseId !== exerciseId);
      
      return {
        ...client,
        weightHistory: [...filteredExistingRecords, ...weightRecords]
      };
    }
    return client;
  }));
};
