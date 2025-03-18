
import { useState } from 'react';

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type ChatResponse = {
  category: string;
  subCategory?: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente especializado en fitness. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const analyzeQuery = (message: string): ChatResponse => {
    message = message.toLowerCase();
    
    // Saludos
    if (/^(hola|saludos|buenos días|buenas|hi|hello|hey)/.test(message)) {
      return { category: "greeting" };
    }
    
    // Ejercicios específicos
    if (/(sentadilla|squat|press de banca|peso muerto|deadlift|press|planchas|push.?ups)/i.test(message)) {
      const exercise = message.match(/(sentadilla|squat|press de banca|peso muerto|deadlift|press|planchas|push.?ups)/i)?.[0];
      return { category: "exercises", subCategory: exercise?.toLowerCase() };
    }
    
    // Nutrición
    if (/(proteína|carbohidratos|grasas|nutrición|dieta|alimentación|comer|comida|meal)/i.test(message)) {
      if (message.includes("proteína") || message.includes("protein")) {
        return { category: "nutrition", subCategory: "protein" };
      }
      if (message.includes("carbohidratos") || message.includes("carbs")) {
        return { category: "nutrition", subCategory: "carbohydrates" };
      }
      if (message.includes("grasas") || message.includes("fats")) {
        return { category: "nutrition", subCategory: "fats" };
      }
      return { category: "nutrition", subCategory: "general" };
    }

    // Entrenamiento
    if (/(rutina|entrenamiento|ejercicio|programa|plan)/i.test(message)) {
      if (/(músculo|hipertrofia|ganar masa)/i.test(message)) {
        return { category: "training", subCategory: "hypertrophy" };
      }
      if (/(fuerza|strength)/i.test(message)) {
        return { category: "training", subCategory: "strength" };
      }
      if (/(cardio|resistencia|endurance)/i.test(message)) {
        return { category: "training", subCategory: "endurance" };
      }
      return { category: "training", subCategory: "general" };
    }

    // Lesiones y recuperación
    if (/(lesión|dolor|injury|recuperación|recovery)/i.test(message)) {
      return { category: "recovery" };
    }

    return { category: "general" };
  };

  const generateResponse = (query: ChatResponse): string => {
    switch (query.category) {
      case "greeting":
        return "¡Hola! Estoy aquí para ayudarte con tu entrenamiento. Puedo asesorarte sobre ejercicios, nutrición, rutinas de entrenamiento y más. ¿Qué te gustaría saber?";
      
      case "exercises":
        return getExerciseResponse(query.subCategory || "");
      
      case "nutrition":
        return getNutritionResponse(query.subCategory || "general");
      
      case "training":
        return getTrainingResponse(query.subCategory || "general");
      
      case "recovery":
        return "La recuperación es fundamental para el progreso. ¿Te gustaría saber más sobre técnicas de recuperación, manejo de lesiones o descanso adecuado?";
      
      default:
        return "¿Podrías darme más detalles sobre tu pregunta? Puedo ayudarte con ejercicios específicos, nutrición, planificación de entrenamientos o recuperación.";
    }
  };

  const getExerciseResponse = (exercise: string): string => {
    const exercises: Record<string, string> = {
      "sentadilla": "La sentadilla es un ejercicio fundamental para piernas. Aspectos clave:\n\n- Mantén la espalda recta\n- Rodillas alineadas con los pies\n- Desciende hasta que los muslos estén paralelos al suelo\n- Respira: inhala al bajar, exhala al subir\n\n¿Te gustaría saber más sobre variaciones o técnica específica?",
      "squat": "La sentadilla (squat) es un ejercicio fundamental para piernas. Aspectos clave:\n\n- Mantén la espalda recta\n- Rodillas alineadas con los pies\n- Desciende hasta que los muslos estén paralelos al suelo\n- Respira: inhala al bajar, exhala al subir\n\n¿Te gustaría saber más sobre variaciones o técnica específica?",
      "press de banca": "El press de banca es esencial para desarrollar el pecho. Puntos clave:\n\n- Agarre firme y estable\n- Hombros hacia atrás y abajo\n- Control en el movimiento\n- Trayectoria en forma de J\n\n¿Quieres conocer más detalles sobre la técnica o variaciones?",
      "peso muerto": "El peso muerto es excelente para la cadena posterior. Aspectos importantes:\n\n- Espalda neutra\n- Caderas más bajas que los hombros\n- Barra cerca del cuerpo\n- Empuje con las piernas\n\n¿Necesitas más información sobre la técnica o variantes?",
      "deadlift": "El peso muerto (deadlift) es excelente para la cadena posterior. Aspectos importantes:\n\n- Espalda neutra\n- Caderas más bajas que los hombros\n- Barra cerca del cuerpo\n- Empuje con las piernas\n\n¿Necesitas más información sobre la técnica o variantes?",
      "press": "El press militar es fundamental para hombros. Puntos clave:\n\n- Agarre a la anchura de los hombros\n- Core activado\n- Movimiento vertical\n- Control en la bajada\n\n¿Te gustaría conocer variaciones o detalles técnicos?",
      "planchas": "Las planchas son excelentes para el core y pecho. Aspectos clave:\n\n- Cuerpo en línea recta\n- Core activado\n- Codos cerca del cuerpo\n- Respiración controlada\n\n¿Quieres saber más sobre progresiones o variantes?",
      "push ups": "Las flexiones son un básico para el pecho. Puntos importantes:\n\n- Cuerpo en línea recta\n- Core activado\n- Codos cerca del cuerpo\n- Respiración controlada\n\n¿Te gustaría conocer variaciones o técnica detallada?"
    };

    return exercises[exercise] || "Este ejercicio es importante para tu entrenamiento. ¿Te gustaría que te explicara la técnica correcta y sus beneficios?";
  };

  const getNutritionResponse = (type: string): string => {
    switch (type) {
      case "protein":
        return "La proteína es esencial para el desarrollo muscular. Recomendaciones:\n\n- 1.6-2.2g por kg de peso corporal\n- Fuentes: pollo, pescado, huevos, legumbres\n- Distribuir en 4-5 comidas\n- Importante post-entrenamiento\n\n¿Quieres saber más sobre timing o fuentes específicas?";
      case "carbohydrates":
        return "Los carbohidratos son tu fuente principal de energía. Consejos:\n\n- 3-7g por kg según actividad\n- Priorizar fuentes complejas\n- Timing alrededor del entrenamiento\n- Ajustar según objetivos\n\n¿Necesitas más detalles sobre tipos o cantidades?";
      case "fats":
        return "Las grasas son esenciales para hormonas. Aspectos clave:\n\n- 0.5-1g por kg de peso\n- Priorizar grasas saludables\n- Moderar saturadas\n- Incluir omega-3\n\n¿Te gustaría saber más sobre fuentes o distribución?";
      default:
        return "Una nutrición balanceada es clave. ¿Te gustaría saber más sobre:\n\n- Proteínas\n- Carbohidratos\n- Grasas\n- Timing de comidas\n- Suplementación?";
    }
  };

  const getTrainingResponse = (type: string): string => {
    switch (type) {
      case "hypertrophy":
        return "Para hipertrofia, considera:\n\n- 6-12 repeticiones\n- 3-4 series por ejercicio\n- 48-72h recuperación\n- Progresión de carga\n- Variedad de ejercicios\n\n¿Quieres un ejemplo de rutina?";
      case "strength":
        return "Para fuerza máxima:\n\n- 1-5 repeticiones\n- 4-6 series\n- Ejercicios compuestos\n- Descansos largos\n- Técnica perfecta\n\n¿Necesitas más detalles sobre programación?";
      case "endurance":
        return "Para resistencia:\n\n- 12-15+ repeticiones\n- Circuitos\n- Descansos cortos\n- Cardio integrado\n- Volumen progresivo\n\n¿Te gustaría un ejemplo de rutina?";
      default:
        return "El entrenamiento debe ser específico a tus objetivos. ¿Buscas:\n\n- Ganar músculo\n- Aumentar fuerza\n- Mejorar resistencia\n- Pérdida de grasa?";
    }
  };

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage(text, "user");
    setIsTyping(true);

    try {
      // Analyze and generate response
      const analysis = analyzeQuery(text);
      const response = generateResponse(analysis);

      // Simulate bot typing
      await new Promise(resolve => setTimeout(resolve, 1000));
      addMessage(response, "bot");
    } catch (error) {
      addMessage("Lo siento, ha ocurrido un error. ¿Podrías reformular tu pregunta?", "bot");
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    handleSendMessage
  };
};
