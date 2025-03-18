
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WeightHistory } from '@/context/AppContext';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, ArrowUp, Dumbbell, TrendingUp } from 'lucide-react';

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
    fullDate: format(new Date(record.date), 'dd MMM yyyy', { locale: es }),
    peso: record.weight,
    repeticiones: record.reps,
    notes: record.notes
  }));

  // Calculate progress indicators
  const hasProgress = weightHistory.length > 1;
  const firstWeight = hasProgress ? weightHistory[0].weight : 0;
  const latestWeight = hasProgress ? weightHistory[weightHistory.length - 1].weight : 0;
  const weightProgress = hasProgress ? ((latestWeight - firstWeight) / firstWeight) * 100 : 0;
  const isPositiveProgress = weightProgress > 0;

  // Calculate personal record
  const personalRecord = weightHistory.length > 0 
    ? Math.max(...weightHistory.map(record => record.weight))
    : 0;

  // Calculate average weight
  const averageWeight = weightHistory.length > 0
    ? weightHistory.reduce((sum, record) => sum + record.weight, 0) / weightHistory.length
    : 0;

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          {exerciseName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weightHistory.length > 0 && (
          <div className="grid gap-4 grid-cols-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-md text-center">
              <div className="text-sm text-muted-foreground mb-1">PR</div>
              <div className="text-xl font-semibold">{personalRecord} kg</div>
            </div>
            <div className="bg-secondary/10 p-3 rounded-md text-center">
              <div className="text-sm text-muted-foreground mb-1">Promedio</div>
              <div className="text-xl font-semibold">{averageWeight.toFixed(1)} kg</div>
            </div>
            {hasProgress && (
              <div className={`${isPositiveProgress ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'} p-3 rounded-md text-center`}>
                <div className="text-sm opacity-80 mb-1">Progreso</div>
                <div className="text-xl font-semibold flex items-center justify-center">
                  {isPositiveProgress ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowRight className="h-4 w-4 mr-1" />}
                  {Math.abs(weightProgress).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        )}

        {weightHistory.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-3 rounded-md shadow-md">
                          <p className="font-medium">{payload[0].payload.fullDate}</p>
                          <p className="text-primary">Peso: {payload[0].value} kg</p>
                          <p className="text-accent">Reps: {payload[1].value}</p>
                          {payload[0].payload.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Notas: {payload[0].payload.notes}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <ReferenceLine 
                  y={averageWeight} 
                  yAxisId="left" 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.6} 
                  label={{
                    value: 'Promedio',
                    fill: 'hsl(var(--primary))',
                    fontSize: 10,
                    position: 'right'
                  }}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="hsl(var(--primary))" 
                  name="Peso (kg)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="repeticiones" 
                  stroke="hsl(var(--accent))" 
                  name="Repeticiones"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                  activeDot={{ r: 8, fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-lg">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">Añade pesos para ver tu progreso</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-muted/10 p-4 rounded-lg border">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Peso (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ej: 50"
                step="0.5"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Repeticiones</label>
              <Input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Ej: 12"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notas (opcional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas sobre el ejercicio..."
              className="resize-none"
              rows={2}
            />
          </div>
          <Button type="submit" className="w-full">
            Registrar Peso
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExerciseWeightProgress;
