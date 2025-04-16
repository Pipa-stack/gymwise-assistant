import { useAppContext } from "@/context/AppContext";
import TrainingHeader from "@/components/training/TrainingHeader";
import CustomRoutinesList from "@/components/training/CustomRoutinesList";
import TrainingDocuments from "@/components/training/TrainingDocuments";
import ExerciseViewer from "@/components/ExerciseViewer";
import { useEffect } from "react";

const TrainingPlans = () => {
  const { 
    trainingPlans, 
    clients, 
    mode, 
    customRoutines,
    setTrainingPlans,
    addSampleWeightHistory
  } = useAppContext();
  
  const clientId = mode === "client" ? clients[0]?.id : undefined;
  const filteredPlans = clientId 
    ? trainingPlans.filter(plan => plan.clientId === clientId)
    : trainingPlans;

  const filteredRoutines = clientId
    ? customRoutines.filter(routine => routine.clientId === clientId)
    : customRoutines;

  useEffect(() => {
    if (trainingPlans.length === 0 || !trainingPlans.some(plan => plan.id === "comprehensive-plan")) {
      const sampleComprehensivePlan = {
        id: "comprehensive-plan",
        name: "Plan de Entrenamiento Completo - 12 Semanas",
        description: "Plan de entrenamiento personalizado enfocado en fuerza e hipertrofia con progresión lineal",
        goal: "Fuerza e Hipertrofia",
        duration: 12,
        createdAt: new Date().toISOString(),
        clientId: clients[0]?.id,
        workouts: [
          {
            id: "w1-comp",
            day: 1,
            name: "Día de Pecho y Tríceps",
            exercises: [
              { exerciseId: "e1", sets: 4, reps: 8, rest: 90, notes: "Aumentar peso cada semana" },
              { exerciseId: "e4", sets: 3, reps: 10, rest: 60, notes: "Enfoque en contracción muscular" },
              { exerciseId: "e5", sets: 3, reps: 12, rest: 45, notes: "Superset con press de hombros" }
            ]
          },
          {
            id: "w2-comp",
            day: 2,
            name: "Día de Espalda y Bíceps",
            exercises: [
              { exerciseId: "e3", sets: 4, reps: 8, rest: 90, notes: "Mantener espalda recta" },
              { exerciseId: "e7", sets: 3, reps: 12, rest: 60, notes: "Enfoque en estirar al máximo" },
              { exerciseId: "e9", sets: 3, reps: 15, rest: 45, notes: "Curl en banco Scott preferido" }
            ]
          },
          {
            id: "w3-comp",
            day: 3,
            name: "Día de Piernas",
            exercises: [
              { exerciseId: "e2", sets: 5, reps: 5, rest: 120, notes: "Progresión en peso es clave" },
              { exerciseId: "e8", sets: 3, reps: 12, rest: 90, notes: "Control en la fase excéntrica" },
              { exerciseId: "e6", sets: 3, reps: 15, rest: 60, notes: "Superset con extensiones" }
            ]
          },
          {
            id: "w4-comp",
            day: 4,
            name: "Día de Hombros y Abdominales",
            exercises: [
              { exerciseId: "e5", sets: 4, reps: 10, rest: 60, notes: "Enfoque en parte lateral y posterior" },
              { exerciseId: "e10", sets: 3, reps: 12, rest: 45, notes: "Control en toda la amplitud" },
              { exerciseId: "e11", sets: 3, reps: 15, rest: 30, notes: "Aumentar repeticiones progresivamente" }
            ]
          }
        ]
      };
      
      setTrainingPlans(prev => [...prev, sampleComprehensivePlan]);
      
      if (clients.length > 0) {
        addSampleWeightHistory(clients[0].id, "e1", [
          { weight: 60, reps: 8, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), notes: "Primera semana" },
          { weight: 65, reps: 8, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), notes: "Buena técnica" },
          { weight: 67.5, reps: 8, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), notes: "Aumentando peso" },
          { weight: 70, reps: 8, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Progresando bien" }
        ]);
        
        addSampleWeightHistory(clients[0].id, "e2", [
          { weight: 80, reps: 5, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), notes: "Profundidad adecuada" },
          { weight: 85, reps: 5, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), notes: "Mejorando técnica" },
          { weight: 90, reps: 5, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), notes: "Sensación de fuerza" },
          { weight: 95, reps: 5, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Buen progreso" }
        ]);
        
        addSampleWeightHistory(clients[0].id, "e3", [
          { weight: 100, reps: 8, date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), notes: "Peso inicial" },
          { weight: 110, reps: 8, date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), notes: "Buen agarre" },
          { weight: 115, reps: 8, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), notes: "Espalda recta" },
          { weight: 120, reps: 6, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Reduciendo reps para aumentar peso" }
        ]);
      }
    }
  }, [trainingPlans, clients, setTrainingPlans, addSampleWeightHistory]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <TrainingHeader mode={mode} />

      {customRoutines.length > 0 && (
        <CustomRoutinesList routines={filteredRoutines} />
      )}

      <div className="space-y-6">
        {mode === "trainer" && <TrainingDocuments />}

        <div className="grid gap-6">
          {filteredPlans.map((plan) => (
            <ExerciseViewer key={plan.id} planId={plan.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingPlans;
