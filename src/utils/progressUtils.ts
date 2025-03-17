import { Client, Progress, ScheduledSession, TrainingPlan } from "@/context/AppContext";

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
 * Determine if a change in a specific metric is positive
 */
export const isChangePositive = (
  metric: "weight" | "bodyFat" | "musclePercentage", 
  percentChange: number
): boolean => {
  // For weight and body fat, a decrease is positive
  // For muscle percentage, an increase is positive
  if (metric === "musclePercentage") {
    return percentChange > 0;
  } else {
    return percentChange < 0;
  }
};

/**
 * Filter progress data by time range
 */
export const filterProgressByTimeRange = (
  progress: Progress[], 
  timeRange: string
): Progress[] => {
  if (!progress || progress.length === 0) return [];
  
  const now = new Date();
  let cutoffDate = new Date();
  
  switch (timeRange) {
    case "1m":
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case "3m":
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    case "6m":
      cutoffDate.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // No filtering by default
      return progress;
  }
  
  return progress.filter(entry => new Date(entry.date) >= cutoffDate);
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
  completedSessionsCount: number, 
  totalPlannedSessions: number
): number => {
  if (totalPlannedSessions === 0) return 0;
  return Math.min(100, Math.round((completedSessionsCount / totalPlannedSessions) * 100));
};

/**
 * Get total sessions count by status
 */
export const getSessionsCountByStatus = (
  sessions: ScheduledSession[],
  clientId: string
): { completed: number; scheduled: number; cancelled: number; total: number } => {
  const clientSessions = sessions.filter(session => session.clientId === clientId);
  
  const completed = clientSessions.filter(session => session.status === "completed").length;
  const scheduled = clientSessions.filter(session => session.status === "scheduled").length;
  const cancelled = clientSessions.filter(session => session.status === "cancelled").length;
  
  return {
    completed,
    scheduled,
    cancelled,
    total: clientSessions.length
  };
};

/**
 * Calculate progress towards goal
 */
export const calculateGoalProgress = (client: Client): number => {
  if (!client.progress || client.progress.length < 2) {
    return 0;
  }
  
  const latest = client.progress[client.progress.length - 1];
  const first = client.progress[0];
  
  // Different calculation logic based on goal
  switch (client.goal.toLowerCase()) {
    case "pérdida de peso":
    case "pérdida de grasa":
    case "definición": {
      // Calculate progress based on weight or body fat reduction
      if (latest.bodyFat !== undefined && first.bodyFat !== undefined) {
        // If body fat is tracked, use that as primary indicator
        const targetBodyFat = client.goal.toLowerCase() === "definición" ? 12 : 15;
        const totalReduction = first.bodyFat - targetBodyFat;
        const currentReduction = first.bodyFat - latest.bodyFat;
        
        if (totalReduction <= 0) return 100; // Already at or below target
        return Math.min(100, Math.round((currentReduction / totalReduction) * 100));
      } else {
        // Otherwise use weight
        // Assuming goal is to lose 10% of starting weight
        const targetWeight = first.weight * 0.9;
        const weightLost = first.weight - latest.weight;
        const totalToLose = first.weight - targetWeight;
        
        if (totalToLose <= 0) return 100; // No weight to lose
        return Math.min(100, Math.round((weightLost / totalToLose) * 100));
      }
    }
    
    case "ganancia muscular":
    case "hipertrofia": {
      // Calculate progress based on muscle percentage or weight gain
      if (latest.musclePercentage !== undefined && first.musclePercentage !== undefined) {
        // Target is to gain 5 percentage points of muscle
        const targetGain = 5;
        const currentGain = latest.musclePercentage - first.musclePercentage;
        
        return Math.min(100, Math.round((currentGain / targetGain) * 100));
      } else {
        // Assuming goal is to gain 10% of starting weight
        const targetWeight = first.weight * 1.1;
        const weightGained = latest.weight - first.weight;
        const totalToGain = targetWeight - first.weight;
        
        if (totalToGain <= 0) return 100; // No weight to gain
        return Math.min(100, Math.round((weightGained / totalToGain) * 100));
      }
    }
    
    case "fuerza":
    case "resistencia":
    case "rendimiento": {
      // For these goals, progress is more about performance metrics
      // For simplicity, we'll use a combination of session completion and time
      const sessionCompletion = client.progress.length * 10;
      return Math.min(100, sessionCompletion);
    }
    
    default:
      // Generic progress calculation
      return Math.min(100, client.progress.length * 10);
  }
};
