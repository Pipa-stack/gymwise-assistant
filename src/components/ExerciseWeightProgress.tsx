
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WeightHistory } from '@/context/AppContext';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExerciseWeightProgressProps {
  exerciseId: string;
  exerciseName: string;
  weightHistory?: WeightHistory[];
  onAddWeight: (weight: number, reps: number, notes?: string) => void;
}

const ExerciseWeightProgress = ({
  exerciseId,
  exerciseName,
  weightHistory = [],
  onAddWeight
}: ExerciseWeightProgressProps) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);
    
    if (isNaN(weightNum) || isNaN(repsNum)) return;
    
    onAddWeight(weightNum, repsNum, notes);
    setWeight('');
    setReps('');
    setNotes('');
  };

  const chartData = weightHistory.map(record => ({
    date: format(new Date(record.date), 'dd/MM/yy', { locale: es }),
    peso: record.weight,
    repeticiones: record.reps
  }));

  return (
    <Card className="w-full hover-card glass-card">
      <CardHeader>
        <CardTitle className="gradient-text">{exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weightHistory.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                <XAxis dataKey="date" />
                <YAxis 
                  yAxisId="left" 
                  label={{ 
                    value: 'Peso (kg)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: 'hsl(var(--primary))' }
                  }} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ 
                    value: 'Repeticiones', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { fill: 'hsl(var(--accent))' }
                  }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="hsl(var(--primary))" 
                  name="Peso (kg)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="repeticiones" 
                  stroke="hsl(var(--accent))" 
                  name="Repeticiones"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No hay registros de peso para este ejercicio</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium gradient-text">Peso (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej: 50"
                step="0.5"
                required
                className="glass-card"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium gradient-text">Repeticiones</label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Ej: 12"
                required
                className="glass-card"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium gradient-text">Notas (opcional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas sobre el ejercicio..."
              className="glass-card"
            />
          </div>
          <Button type="submit" className="w-full hover-card">
            Registrar Peso
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExerciseWeightProgress;
