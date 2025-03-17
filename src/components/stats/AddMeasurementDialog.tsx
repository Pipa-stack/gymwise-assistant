
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/context/AppContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AddMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (progress: Progress) => void;
}

const AddMeasurementDialog = ({ open, onOpenChange, onSave }: AddMeasurementDialogProps) => {
  const [newProgress, setNewProgress] = useState<Partial<Progress>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    bodyFat: 0,
    musclePercentage: 0,
    notes: ""
  });

  const handleSave = () => {
    if (!newProgress.weight) {
      toast({
        title: "Error",
        description: "El peso es obligatorio",
        variant: "destructive"
      });
      return;
    }

    onSave({
      date: newProgress.date || new Date().toISOString().split('T')[0],
      weight: Number(newProgress.weight),
      bodyFat: newProgress.bodyFat !== undefined ? Number(newProgress.bodyFat) : undefined,
      musclePercentage: newProgress.musclePercentage !== undefined ? Number(newProgress.musclePercentage) : undefined,
      notes: newProgress.notes
    });

    setNewProgress({
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      bodyFat: 0,
      musclePercentage: 0,
      notes: ""
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Medición</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="text-sm font-medium mb-1 block">Peso (kg) *</label>
              <input
                type="number"
                id="weight"
                value={newProgress.weight || ""}
                onChange={(e) => setNewProgress(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="bodyFat" className="text-sm font-medium mb-1 block">% Grasa Corporal</label>
              <input
                type="number"
                id="bodyFat"
                value={newProgress.bodyFat || ""}
                onChange={(e) => setNewProgress(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) }))}
                className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="musclePercentage" className="text-sm font-medium mb-1 block">% Músculo</label>
              <input
                type="number"
                id="musclePercentage"
                value={newProgress.musclePercentage || ""}
                onChange={(e) => setNewProgress(prev => ({ ...prev, musclePercentage: parseFloat(e.target.value) }))}
                className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="date" className="text-sm font-medium mb-1 block">Fecha *</label>
              <input
                type="date"
                id="date"
                value={newProgress.date || ""}
                onChange={(e) => setNewProgress(prev => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="text-sm font-medium mb-1 block">Notas</label>
            <Textarea
              id="notes"
              value={newProgress.notes || ""}
              onChange={(e) => setNewProgress(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[80px]"
              placeholder="Notas adicionales sobre la medición..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Guardar Medición
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeasurementDialog;
