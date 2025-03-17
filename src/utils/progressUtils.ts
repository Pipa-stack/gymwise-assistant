
import { Client, Progress, TrainingPlan } from "@/context/AppContext";

/**
 * Calculate Body Mass Index
 */
export const calculateBMI = (weight: number, heightInMeters: number): number => {
  if (!heightInMeters || heightInMeters <= 0) {
    return 0;
  }
  return weight / (heightInMeters * heightInMeters);
};

/**
 * Get BMI Category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi <= 0) return "No disponible";
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  return "Obesidad";
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number, 
  previous: number
): { value: number; isPositive: boolean } => {
  if (previous === 0) return { value: 0, isPositive: false };
  
  const percentChange = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(percentChange),
    isPositive: percentChange > 0
  };
};

/**
 * Generate progress summary for a client
 */
export const generateProgressSummary = (client: Client): string => {
  if (!client.progress || client.progress.length < 2) {
    return "No hay suficientes datos para generar un resumen de progreso.";
  }
  
  const latest = client.progress[client.progress.length - 1];
  const first = client.progress[0];
  
  const weightChange = calculatePercentageChange(latest.weight, first.weight);
  let summary = `Desde ${new Date(first.date).toLocaleDateString('es-ES')}, `;
  
  if (weightChange.value > 0) {
    summary += `has ${weightChange.isPositive ? 'ganado' : 'perdido'} un ${weightChange.value.toFixed(1)}% de peso corporal. `;
  } else {
    summary += "tu peso se ha mantenido estable. ";
  }
  
  if (latest.bodyFat !== undefined && first.bodyFat !== undefined) {
    const fatChange = calculatePercentageChange(latest.bodyFat, first.bodyFat);
    if (fatChange.value > 1) {
      summary += `Tu porcentaje de grasa corporal ha ${fatChange.isPositive ? 'aumentado' : 'disminuido'} un ${fatChange.value.toFixed(1)}%. `;
    }
  }
  
  if (latest.musclePercentage !== undefined && first.musclePercentage !== undefined) {
    const muscleChange = calculatePercentageChange(latest.musclePercentage, first.musclePercentage);
    if (muscleChange.value > 1) {
      summary += `Tu masa muscular ha ${muscleChange.isPositive ? 'aumentado' : 'disminuido'} un ${muscleChange.value.toFixed(1)}%. `;
    }
  }
  
  return summary;
};

/**
 * Calculate adherence rate to training plan
 */
export const calculateAdherenceRate = (
  clientId: string, 
  completedSessionsCount: number, 
  totalPlannedSessions: number
): number => {
  if (totalPlannedSessions === 0) return 0;
  return Math.min(100, Math.round((completedSessionsCount / totalPlannedSessions) * 100));
};
