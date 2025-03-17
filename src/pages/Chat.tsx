
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Dumbbell, Activity, Brain } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Base de conocimientos avanzada para el asistente de fitness
const fitnessKnowledgeBase = {
  // Saludos y presentación
  greeting: [
    "¡Hola! Soy tu asistente especializado en fitness. Puedo responder preguntas sobre ejercicios, técnicas, biomecánica, planificación de entrenamientos y adaptaciones según tu nivel y objetivos. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! Estoy aquí para ayudarte con cualquier duda sobre entrenamiento, nutrición o progreso físico. ¿Qué te gustaría saber?",
    "¡Saludos! Como tu asistente de entrenamiento, puedo ofrecerte información detallada sobre ejercicios, rutinas personalizadas y consejos basados en evidencia científica. ¿Cómo puedo ayudarte?"
  ],
  
  // Categoría de ejercicios específicos
  exercises: {
    squat: {
      name: "Sentadilla (Squat)",
      description: "La sentadilla es un ejercicio fundamental para desarrollar fuerza y tamaño en las piernas.",
      execution: [
        "Colócate de pie con los pies a la anchura de los hombros o ligeramente más amplio.",
        "Mantén el pecho erguido y la espalda neutral.",
        "Baja flexionando las rodillas y las caderas como si fueras a sentarte en una silla.",
        "Desciende hasta que tus muslos estén paralelos al suelo (o más bajo si tu movilidad lo permite).",
        "Empuja a través de los talones para volver a la posición inicial."
      ],
      muscles: ["Cuádriceps", "Glúteos", "Isquiotibiales", "Erectores espinales", "Core"],
      commonMistakes: [
        "Elevar los talones del suelo",
        "Permitir que las rodillas colapsen hacia dentro",
        "Redondear excesivamente la espalda",
        "No alcanzar suficiente profundidad",
        "Mirar hacia abajo en lugar de al frente"
      ],
      variations: {
        beginner: ["Sentadilla con peso corporal", "Sentadilla con TRX", "Box squat"],
        intermediate: ["Sentadilla con barra", "Sentadilla frontal", "Sentadilla Goblet"],
        advanced: ["Sentadilla olímpica", "Sentadilla con salto", "Sentadilla búlgara"]
      },
      tips: "Mantén una buena técnica antes de aumentar el peso. La profundidad adecuada y la estabilidad son prioritarias."
    },
    deadlift: {
      name: "Peso muerto (Deadlift)",
      description: "El peso muerto es uno de los ejercicios más completos para desarrollar fuerza en todo el cuerpo, especialmente en la cadena posterior.",
      execution: [
        "Colócate de pie con los pies a la anchura de las caderas y la barra sobre el medio del pie.",
        "Flexiona las caderas y rodillas hasta alcanzar la barra manteniendo la espalda recta.",
        "Agarra la barra con las manos fuera de las piernas (agarre prono o mixto).",
        "Eleva el pecho y activa el core.",
        "Empuja con las piernas mientras mantienes la barra cerca del cuerpo.",
        "Extiende caderas y rodillas hasta quedar completamente erguido.",
        "Baja la barra de forma controlada invirtiendo el movimiento."
      ],
      muscles: ["Isquiotibiales", "Glúteos", "Erectores espinales", "Trapecios", "Antebrazos", "Core"],
      commonMistakes: [
        "Redondear la espalda",
        "Alejar la barra del cuerpo durante el movimiento",
        "Iniciar el levantamiento con las rodillas en lugar de las caderas",
        "Extender primero las piernas y luego la espalda",
        "Hiperextender excesivamente la espalda al final del movimiento"
      ],
      variations: {
        beginner: ["Peso muerto rumano con mancuernas", "Peso muerto sumo", "Good morning"],
        intermediate: ["Peso muerto convencional", "Peso muerto rumano", "Peso muerto con piernas rígidas"],
        advanced: ["Peso muerto con déficit", "Peso muerto a una pierna", "Peso muerto con barra trampa"]
      },
      tips: "La técnica en el peso muerto es fundamental para evitar lesiones. Comienza con pesos ligeros y progresa gradualmente. Nunca sacrifiques la forma por levantar más peso."
    },
    benchPress: {
      name: "Press de banca (Bench Press)",
      description: "El press de banca es el ejercicio principal para desarrollar el pecho, aunque también involucra hombros y tríceps.",
      execution: [
        "Acuéstate en un banco plano con los pies apoyados firmemente en el suelo.",
        "Coloca las manos en la barra con un agarre ligeramente más ancho que los hombros.",
        "Desbloquea la barra y bájala lentamente hacia la parte media del pecho.",
        "Toca ligeramente el pecho y empuja la barra hacia arriba hasta extender los brazos.",
        "Mantén los codos a unos 45-75 grados respecto al torso durante todo el movimiento."
      ],
      muscles: ["Pectoral mayor", "Tríceps", "Deltoides anterior", "Serrato anterior"],
      commonMistakes: [
        "Rebotar la barra en el pecho",
        "Arquear excesivamente la espalda",
        "Levantar las nalgas del banco",
        "No bajar la barra completamente",
        "Dejar que los codos se abran demasiado (más de 90 grados)"
      ],
      variations: {
        beginner: ["Press con mancuernas", "Push-ups", "Press en máquina"],
        intermediate: ["Press de banca inclinado", "Press de banca declinado", "Press con agarre cerrado"],
        advanced: ["Press de banca con pausa", "Press con bandas o cadenas", "Floor press"]
      },
      tips: "Para maximizar la activación del pecho, mantén los hombros hacia atrás y abajo durante todo el movimiento. La trayectoria de la barra no tiene que ser completamente vertical, sino ligeramente diagonal hacia la parte superior del abdomen."
    }
  },
  
  // Planificación de entrenamientos
  trainingPlanning: {
    hypertrophy: {
      description: "Plan enfocado en el aumento de masa muscular.",
      volume: "Alto volumen: 3-4 series de 8-12 repeticiones por ejercicio.",
      frequency: "Cada grupo muscular 2-3 veces por semana.",
      intensity: "Intensidad moderada (65-75% de 1RM).",
      rest: "30-90 segundos entre series.",
      techniques: [
        "Series descendentes",
        "Superseries",
        "Series hasta el fallo técnico",
        "Repeticiones parciales",
        "Tempo controlado (especialmente en fase excéntrica)"
      ],
      sampleRoutine: [
        "Día 1: Pecho y Tríceps - Press de banca 4x10, Press inclinado 3x10, Aperturas 3x12, Extensiones de tríceps 3x12, Fondos 3x10.",
        "Día 2: Espalda y Bíceps - Dominadas 4x8, Remo 4x10, Jalón al pecho 3x12, Curl de bíceps 3x10, Curl martillo 3x12.",
        "Día 3: Piernas - Sentadillas 4x10, Prensa 3x12, Extensiones 3x15, Curl femoral 3x12, Elevación de pantorrillas 4x15.",
        "Día 4: Hombros y Core - Press militar 4x10, Elevaciones laterales 3x12, Pájaros 3x12, Abdominales 3x15, Plancha 3x45s."
      ]
    },
    strength: {
      description: "Plan enfocado en el aumento de fuerza máxima.",
      volume: "Volumen moderado: 4-6 series de 3-6 repeticiones por ejercicio principal.",
      frequency: "Cada patrón de movimiento 2 veces por semana.",
      intensity: "Intensidad alta (80-90% de 1RM).",
      rest: "2-5 minutos entre series de ejercicios principales.",
      techniques: [
        "Periodización lineal o no lineal",
        "Ejercicios compuestos prioritarios",
        "Trabajo con porcentajes de 1RM",
        "Progresión de carga sistemática",
        "Enfoque en la técnica perfecta"
      ],
      sampleRoutine: [
        "Día 1: Fuerza inferior - Sentadillas 5x5, Peso muerto 3x5, Prensa 3x8, Accesorios 2-3x10.",
        "Día 2: Fuerza superior (empuje) - Press de banca 5x5, Press militar 4x6, Fondos lastrados 3x8, Accesorios 2-3x10.",
        "Día 3: Descanso o cardio de baja intensidad.",
        "Día 4: Fuerza inferior - Sentadilla frontal 4x6, Peso muerto rumano 4x6, Zancadas 3x8, Accesorios 2-3x10.",
        "Día 5: Fuerza superior (tracción) - Dominadas lastradas 5x5, Remo pendlay 4x6, Remo con barra T 3x8, Accesorios 2-3x10."
      ]
    },
    endurance: {
      description: "Plan enfocado en resistencia muscular y cardiovascular.",
      volume: "Alto volumen: 2-3 series de 15-30 repeticiones o trabajo por tiempo.",
      frequency: "Entrenamiento total corporal 3-4 veces por semana.",
      intensity: "Intensidad baja a moderada (40-60% de 1RM).",
      rest: "30 segundos o menos entre ejercicios, formato circuito.",
      techniques: [
        "Circuitos de alta densidad",
        "HIIT (Entrenamiento Interválico de Alta Intensidad)",
        "AMRAP (As Many Rounds As Possible)",
        "EMOM (Every Minute On the Minute)",
        "Complejos con pesos ligeros"
      ],
      sampleRoutine: [
        "Circuito 1 (4 rondas): Sentadillas con peso corporal x20, Push-ups x15, Mountain climbers x30, Remo invertido x15, Jumping jacks x30 (30s descanso entre rondas).",
        "Circuito 2 (4 rondas): Burpees x10, Dominadas x8, Kettlebell swings x15, Zancadas alternantes x20, Plancha 45s (30s descanso entre rondas).",
        "HIIT en cinta: 10 series de 30s sprint máximo + 90s recuperación activa.",
        "EMOM 20 minutos: Minutos impares - 15 wall balls, Minutos pares - 10 push-ups + 5 dominadas."
      ]
    },
    fatLoss: {
      description: "Plan enfocado en la pérdida de grasa corporal.",
      volume: "Volumen moderado-alto con ejercicios compuestos.",
      frequency: "4-5 sesiones semanales combinando fuerza y cardio.",
      intensity: "Intensidad mixta, enfocada en densidad de entrenamiento.",
      rest: "Descansos breves (30-60s) en fuerza, intervalos en cardio.",
      techniques: [
        "Entrenamiento en circuito",
        "Superseries de grupos musculares antagonistas",
        "Cardio HIIT",
        "Complejos con pesas",
        "Entrenamiento metabólico"
      ],
      sampleRoutine: [
        "Día 1: Full Body + HIIT - Circuito 3 rondas: Sentadilla goblet x15, Press en banco x12, Remo con mancuerna x12, Zancadas x10/pierna, Mountain climbers x30 + Finalizador: 10 minutos de HIIT (30s:30s).",
        "Día 2: Cardio estable 30-45 minutos (60-70% FCmax).",
        "Día 3: Upper Body + Core - Superseries 3 rondas: A1) Push-ups x15 + A2) Remo en TRX x15, B1) Press hombro x12 + B2) Jalón al pecho x12, C1) Extensión tríceps x15 + C2) Curl bíceps x15 + Circuito core 3 rondas.",
        "Día 4: HIIT 20-25 minutos (sprint/recuperación o circuito de cuerpo completo).",
        "Día 5: Lower Body + HIIT - Circuito 3 rondas: Peso muerto rumano x12, Prensa x15, Extensión rodilla x15, Curl femoral x15, Elevación pantorrillas x20 + Finalizador: Tabata (8 rondas de 20s:10s)."
      ],
      nutritionTips: [
        "Mantén un déficit calórico moderado (15-20% por debajo del mantenimiento).",
        "Consumo de proteína alto (1.8-2.2g por kg de peso).",
        "Timing de carbohidratos alrededor del entrenamiento.",
        "Mantén alta ingesta de agua y fibra.",
        "Considera 2-3 días de refeed para entrenamientos intensos."
      ]
    }
  },
  
  // Nutrición
  nutrition: {
    protein: {
      description: "La proteína es esencial para la recuperación y crecimiento muscular.",
      requirements: {
        sedentary: "0.8-1.0g por kg de peso corporal",
        active: "1.2-1.6g por kg de peso corporal",
        athlete: "1.6-2.2g por kg de peso corporal",
        cuttingAthlete: "2.0-2.6g por kg de peso corporal"
      },
      sources: [
        "Carnes magras (pollo, pavo, ternera magra)",
        "Pescado y mariscos (atún, salmón, gambas)",
        "Huevos y claras de huevo",
        "Lácteos (requesón, yogur griego, queso bajo en grasa)",
        "Legumbres (lentejas, garbanzos, frijoles)",
        "Tofu y tempeh",
        "Suplementos (proteína de suero, caseína, vegana)"
      ],
      timing: "Distribuye la ingesta de proteínas uniformemente a lo largo del día en 4-5 comidas, con 20-40g por comida. Considera consumir proteína dentro de las 2 horas posteriores al entrenamiento para optimizar la recuperación."
    },
    carbohydrates: {
      description: "Los carbohidratos son la principal fuente de energía para entrenamientos intensos.",
      requirements: {
        fatLoss: "2-3g por kg de peso corporal",
        maintenance: "4-5g por kg de peso corporal",
        highVolume: "6-8g por kg de peso corporal",
        athlete: "8-10g por kg de peso corporal"
      },
      sources: [
        "Granos enteros (arroz integral, quinoa, avena)",
        "Tubérculos (patatas, batatas)",
        "Frutas (plátanos, manzanas, bayas)",
        "Legumbres (combinan carbohidratos y proteínas)",
        "Verduras (todas, especialmente las almidonadas)"
      ],
      timing: "Concentra la mayor parte de los carbohidratos alrededor del entrenamiento (1-2 horas antes y dentro de la hora posterior). Para rendimiento óptimo, considera 0.25-0.5g/kg 1 hora antes del entrenamiento."
    },
    fats: {
      description: "Las grasas son esenciales para la producción hormonal y la salud general.",
      requirements: {
        minimum: "0.5-0.6g por kg de peso corporal",
        general: "0.8-1.5g por kg de peso corporal"
      },
      sources: [
        "Aceites saludables (oliva virgen extra, coco, aguacate)",
        "Frutos secos y semillas (almendras, nueces, chía, lino)",
        "Aguacates",
        "Pescado graso (salmón, caballa, sardinas)",
        "Huevos enteros",
        "Lácteos enteros (con moderación)"
      ],
      tips: "Prioriza las grasas monoinsaturadas y poliinsaturadas, especialmente los ácidos grasos omega-3. Limita las grasas trans y reduce las grasas saturadas."
    },
    mealTiming: {
      general: "Distribuye tu ingesta calórica en 3-5 comidas al día, espaciadas cada 3-5 horas.",
      preWorkout: "Consume una comida con carbohidratos y proteínas 1-2 horas antes del entrenamiento. Si entrenas a primera hora, considera un snack pequeño como un plátano o una rebanada de pan con mantequilla de cacahuete.",
      postWorkout: "Consume proteínas (20-40g) y carbohidratos (0.5-1g/kg) dentro de los 60 minutos posteriores al entrenamiento para maximizar la recuperación.",
      beforeBed: "Una comida rica en proteínas de digestión lenta (como caseína o requesón) antes de dormir puede ayudar a la síntesis proteica durante la noche."
    }
  },
  
  // Técnica y biomecánica
  biomechanics: {
    principles: [
      "Mantén siempre la columna en posición neutral durante los ejercicios.",
      "Crea estabilidad en el core antes de cualquier movimiento con carga.",
      "Controla el movimiento durante toda la amplitud, especialmente en la fase excéntrica.",
      "Comprende las palancas: cuanto más alejado esté un peso del punto de apoyo, mayor será el esfuerzo requerido.",
      "La tensión mecánica es el principal estímulo para el crecimiento muscular.",
      "La conexión mente-músculo aumenta la activación muscular y la efectividad del ejercicio."
    ],
    commonErrors: [
      "Compensar con músculos secundarios cuando los principales se fatigan.",
      "Sacrificar la técnica por levantar más peso.",
      "No trabajar en el rango completo de movimiento.",
      "Movimientos bruscos o usando el impulso en lugar de la fuerza muscular.",
      "No mantener la tensión en el músculo objetivo durante todo el movimiento."
    ],
    jointMovements: {
      shoulder: ["Flexión/extensión", "Abducción/aducción", "Rotación interna/externa", "Circunducción"],
      elbow: ["Flexión/extensión", "Pronación/supinación del antebrazo"],
      spine: ["Flexión/extensión", "Flexión lateral", "Rotación"],
      hip: ["Flexión/extensión", "Abducción/aducción", "Rotación interna/externa"],
      knee: ["Flexión/extensión"],
      ankle: ["Flexión dorsal/flexión plantar", "Inversión/eversión"]
    }
  },
  
  // Adaptación para lesiones
  injuryAdaptations: {
    shoulder: {
      description: "Problemas en el manguito rotador, inestabilidad o pinzamiento subacromial.",
      avoid: [
        "Press por encima de la cabeza con dolor",
        "Press de banca con codos a 90°",
        "Fondos profundos",
        "Elevaciones laterales por encima de la línea del hombro"
      ],
      alternatives: [
        "Press de banca con agarre cerrado",
        "Remo con retracción escapular",
        "Press landmine",
        "Face pulls",
        "Elevaciones laterales controladas a baja altura"
      ],
      rehabilitation: [
        "Ejercicios de manguito rotador con bandas",
        "Trabajo de estabilidad escapular",
        "Movimientos controlados sin carga para restaurar el rango de movimiento"
      ]
    },
    back: {
      description: "Problemas lumbares, herniación o tensión muscular.",
      avoid: [
        "Flexión lumbar bajo carga",
        "Rotación lumbar con peso",
        "Peso muerto con técnica incorrecta",
        "Hiperextensión forzada"
      ],
      alternatives: [
        "Hip thrust para trabajar glúteos sin carga lumbar",
        "Pull-through con cable",
        "Peso muerto con barra trampa",
        "Ejercicios de tracción horizontal en lugar de vertical",
        "Elevaciones de rodilla colgando en lugar de elevaciones de piernas"
      ],
      rehabilitation: [
        "Ejercicios de estabilidad core (plancha, bird-dog)",
        "Glute bridges",
        "Trabajo de respiración y bracing",
        "Movilidad de cadera para reducir compensaciones"
      ]
    },
    knee: {
      description: "Problemas patelofemorales, meniscos o ligamentos.",
      avoid: [
        "Sentadillas profundas con dolor",
        "Extensiones de rodilla con cargas pesadas",
        "Saltos de alto impacto",
        "Zancadas muy profundas"
      ],
      alternatives: [
        "Box squats a la altura apropiada",
        "Step-ups controlados",
        "Prensa de piernas con rango limitado",
        "Peso muerto rumano para trabajar cadena posterior",
        "Hip thrust para glúteos"
      ],
      rehabilitation: [
        "Fortalecimiento de cuádriceps isométrico",
        "Activación de VMO (vasto medial oblicuo)",
        "Ejercicios de estabilidad en una pierna",
        "Fortalecimiento de cadena lateral (abductores/aductores)"
      ]
    }
  },
  
  // Recuperación
  recovery: {
    sleep: {
      importance: "El sueño es el factor de recuperación más importante. Durante el sueño profundo se secreta la hormona del crecimiento y ocurre la mayor parte de la reparación muscular.",
      recommendations: [
        "Duerme 7-9 horas diarias, idealmente en el mismo horario.",
        "Crea una rutina de sueño: limita la luz azul 1-2 horas antes de dormir.",
        "Mantén la habitación fresca (18-20°C) y completamente oscura.",
        "Considera la suplementación con melatonina si tienes dificultades para conciliar el sueño (consulta a un profesional).",
        "Las siestas cortas (20-30 minutos) pueden ayudar a la recuperación si no afectan al sueño nocturno."
      ]
    },
    activeTechniques: [
      "Cardio de baja intensidad (30-40% FCmax) para aumentar el flujo sanguíneo sin fatiga adicional.",
      "Movilidad activa y ejercicios de amplitud de movimiento.",
      "Foam rolling y liberación miofascial para reducir la tensión muscular.",
      "Estiramientos dinámicos (no estáticos inmediatamente después del entrenamiento).",
      "Caminatas ligeras, natación suave o ciclismo recreativo."
    ],
    passiveTechniques: [
      "Crioterapia (compresas de hielo, baños de hielo) para reducir la inflamación.",
      "Termoterapia (sauna, baños calientes) para aumentar el flujo sanguíneo y la relajación muscular.",
      "Masaje terapéutico para reducir las adhesiones musculares y mejorar la circulación.",
      "Compresión (prendas de compresión, botas de recuperación) para mejorar el retorno venoso.",
      "Mindfulness y técnicas de relajación para reducir el estrés y mejorar la calidad del sueño."
    ],
    nutrition: [
      "Rehidratación con electrolitos para recuperar el equilibrio hídrico.",
      "Proteínas de rápida absorción post-entrenamiento (20-40g) para iniciar la síntesis proteica.",
      "Carbohidratos post-entrenamiento para reponer el glucógeno muscular (0.5-1g/kg).",
      "Alimentos antiinflamatorios (bayas, pescado graso, cúrcuma, jengibre).",
      "Adecuada ingesta calórica total para soportar la recuperación."
    ],
    timing: "Programa al menos 48 horas de recuperación para un grupo muscular antes de volver a entrenarlo intensamente. Los músculos más grandes como las piernas pueden necesitar 72 horas o más."
  },
  
  // Suplementación
  supplements: {
    essential: [
      {
        name: "Proteína en polvo (Whey, Caseína, Vegetal)",
        benefits: "Facilita alcanzar las necesidades diarias de proteína, especialmente conveniente post-entrenamiento.",
        dosage: "20-40g por porción, según necesidades individuales",
        timing: "Post-entrenamiento o entre comidas. La caseína es ideal antes de dormir por su absorción lenta."
      },
      {
        name: "Creatina monohidrato",
        benefits: "Aumenta los niveles de fosfocreatina, mejorando la producción de ATP para esfuerzos de alta intensidad. Aumenta fuerza, potencia y volumen muscular.",
        dosage: "3-5g diarios",
        timing: "Diariamente, sin necesidad de fase de carga. El momento del día no es crítico."
      },
      {
        name: "Cafeína",
        benefits: "Mejora el rendimiento, reduce la percepción del esfuerzo y aumenta la alerta mental. Potencial efecto termogénico.",
        dosage: "3-6mg por kg de peso corporal",
        timing: "30-60 minutos antes del entrenamiento"
      }
    ],
    conditional: [
      {
        name: "Beta-alanina",
        benefits: "Aumenta los niveles de carnosina muscular, mejorando el rendimiento en esfuerzos de 1-4 minutos (resistencia muscular).",
        dosage: "3-5g diarios",
        timing: "Diariamente, dividido en dosis más pequeñas para minimizar la parestesia (hormigueo)."
      },
      {
        name: "Citrulina malato",
        benefits: "Aumenta la producción de óxido nítrico, mejorando el flujo sanguíneo y la entrega de nutrientes. Puede reducir la fatiga y el dolor muscular.",
        dosage: "6-8g",
        timing: "30-60 minutos antes del entrenamiento"
      },
      {
        name: "HMB (Beta-hidroxi beta-metilbutirato)",
        benefits: "Puede reducir el catabolismo muscular, especialmente útil durante períodos de déficit calórico o entrenamientos muy intensos.",
        dosage: "3g diarios (1g tres veces al día)",
        timing: "Con las comidas, distribuido a lo largo del día"
      },
      {
        name: "Omega-3 (EPA y DHA)",
        benefits: "Efectos antiinflamatorios, mejora la salud cardiovascular y puede ayudar en la recuperación muscular.",
        dosage: "1-3g de EPA+DHA combinados",
        timing: "Con las comidas para mejorar la absorción"
      }
    ],
    caution: "Los suplementos deben usarse para complementar una dieta adecuada, no para reemplazarla. Siempre consulta con un profesional de la salud antes de iniciar un régimen de suplementación, especialmente si tienes condiciones médicas preexistentes."
  },
  
  // Fallback para preguntas no identificadas
  fallback: [
    "Esa es una pregunta interesante sobre fitness. ¿Podrías darme más detalles para proporcionarte información más precisa?",
    "Comprendo tu consulta sobre entrenamiento. Para darte una respuesta basada en evidencia, necesitaría conocer más sobre tu situación particular.",
    "Las necesidades de entrenamiento y nutrición son muy individuales. ¿Podrías especificar más tu pregunta para que pueda ayudarte mejor?",
    "Para ese tipo de consulta específica, sería recomendable consultar con un profesional de la salud o un entrenador certificado que pueda evaluar tu caso particular."
  ]
};

// Función mejorada para determinar la categoría de la pregunta
const analyzeUserQuery = (message) => {
  message = message.toLowerCase();
  
  // Verificamos si es un saludo
  if (/^(hola|saludos|buenos días|buenas|hi|hello|hey)/.test(message)) {
    return { category: "greeting" };
  }
  
  // Verificamos si pregunta por ejercicios específicos
  if (message.includes("sentadilla") || message.includes("squat")) {
    return { category: "exercises", subCategory: "squat" };
  }
  if (message.includes("peso muerto") || message.includes("deadlift")) {
    return { category: "exercises", subCategory: "deadlift" };
  }
  if (message.includes("press de banca") || message.includes("bench press")) {
    return { category: "exercises", subCategory: "benchPress" };
  }
  
  // Verificamos categorías de planificación
  if ((message.includes("hipertrofia") || message.includes("ganar músculo") || message.includes("masa muscular")) && 
      (message.includes("plan") || message.includes("rutina") || message.includes("programa"))) {
    return { category: "trainingPlanning", subCategory: "hypertrophy" };
  }
  if ((message.includes("fuerza") || message.includes("strength")) && 
      (message.includes("plan") || message.includes("rutina") || message.includes("programa"))) {
    return { category: "trainingPlanning", subCategory: "strength" };
  }
  if ((message.includes("resistencia") || message.includes("endurance") || message.includes("aguante")) && 
      (message.includes("plan") || message.includes("rutina") || message.includes("programa"))) {
    return { category: "trainingPlanning", subCategory: "endurance" };
  }
  if ((message.includes("pérdida") || message.includes("perder") || message.includes("adelgazar") || message.includes("grasa")) && 
      (message.includes("plan") || message.includes("rutina") || message.includes("programa"))) {
    return { category: "trainingPlanning", subCategory: "fatLoss" };
  }
  
  // Verificamos categorías de nutrición
  if (message.includes("proteína") || message.includes("protein")) {
    return { category: "nutrition", subCategory: "protein" };
  }
  if (message.includes("carbohidratos") || message.includes("carbs") || message.includes("hidratos")) {
    return { category: "nutrition", subCategory: "carbohydrates" };
  }
  if (message.includes("grasas") || message.includes("fats") || message.includes("aceites")) {
    return { category: "nutrition", subCategory: "fats" };
  }
  if (message.includes("comida") || message.includes("meal") || message.includes("timing") || 
      (message.includes("cuando") && message.includes("comer"))) {
    return { category: "nutrition", subCategory: "mealTiming" };
  }
  
  // Verificamos categorías generales
  if (message.includes("técnica") || message.includes("technique") || message.includes("form") || 
      message.includes("biomecánica") || message.includes("biomechanics") || message.includes("postura")) {
    return { category: "biomechanics", subCategory: "principles" };
  }
  
  if (message.includes("lesión") || message.includes("dolor") || message.includes("injury") || 
      message.includes("recuperarme de") || message.includes("alternativa") || message.includes("me duele")) {
    if (message.includes("hombro") || message.includes("shoulder")) {
      return { category: "injuryAdaptations", subCategory: "shoulder" };
    }
    if (message.includes("espalda") || message.includes("back") || message.includes("lumbar")) {
      return { category: "injuryAdaptations", subCategory: "back" };
    }
    if (message.includes("rodilla") || message.includes("knee")) {
      return { category: "injuryAdaptations", subCategory: "knee" };
    }
    return { category: "injuryAdaptations" };
  }
  
  if (message.includes("recuperación") || message.includes("recovery") || message.includes("descanso") || 
      message.includes("rest") || message.includes("dormir") || message.includes("sleep")) {
    if (message.includes("dormir") || message.includes("sueño") || message.includes("sleep")) {
      return { category: "recovery", subCategory: "sleep" };
    }
    return { category: "recovery" };
  }
  
  if (message.includes("suplemento") || message.includes("supplement") || message.includes("creatina") || 
      message.includes("proteína en polvo") || message.includes("whey") || message.includes("bcaa")) {
    return { category: "supplements" };
  }
  
  // Si no coincide con ninguna categoría específica
  return { category: "fallback" };
};

// Función para generar respuestas basadas en el análisis de la consulta
const generateFitnessResponse = (message) => {
  const analysis = analyzeUserQuery(message);
  
  // Respuestas para saludos
  if (analysis.category === "greeting") {
    return fitnessKnowledgeBase.greeting[Math.floor(Math.random() * fitnessKnowledgeBase.greeting.length)];
  }
  
  // Respuestas para ejercicios específicos
  if (analysis.category === "exercises" && analysis.subCategory) {
    const exercise = fitnessKnowledgeBase.exercises[analysis.subCategory];
    return `**${exercise.name}**\n\n${exercise.description}\n\n**Ejecución:**\n${exercise.execution.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n**Músculos trabajados:** ${exercise.muscles.join(', ')}\n\n**Errores comunes:**\n${exercise.commonMistakes.map(mistake => `- ${mistake}`).join('\n')}\n\n**Variaciones según nivel:**\n- Principiante: ${exercise.variations.beginner.join(', ')}\n- Intermedio: ${exercise.variations.intermediate.join(', ')}\n- Avanzado: ${exercise.variations.advanced.join(', ')}\n\n**Consejo:** ${exercise.tips}`;
  }
  
  // Respuestas para planificación de entrenamientos
  if (analysis.category === "trainingPlanning" && analysis.subCategory) {
    const plan = fitnessKnowledgeBase.trainingPlanning[analysis.subCategory];
    return `**Plan de entrenamiento para ${analysis.subCategory === 'hypertrophy' ? 'Hipertrofia' : 
                                           analysis.subCategory === 'strength' ? 'Fuerza' :
                                           analysis.subCategory === 'endurance' ? 'Resistencia' : 'Pérdida de Grasa'}**\n\n${plan.description}\n\n**Características:**\n- Volumen: ${plan.volume}\n- Frecuencia: ${plan.frequency}\n- Intensidad: ${plan.intensity}\n- Descanso: ${plan.rest}\n\n**Técnicas recomendadas:**\n${plan.techniques.map(tech => `- ${tech}`).join('\n')}\n\n**Ejemplo de rutina:**\n${plan.sampleRoutine.map(day => `- ${day}`).join('\n')}${plan.nutritionTips ? `\n\n**Consejos nutricionales:**\n${plan.nutritionTips.map(tip => `- ${tip}`).join('\n')}` : ''}`;
  }
  
  // Respuestas para nutrición
  if (analysis.category === "nutrition" && analysis.subCategory) {
    const nutritionInfo = fitnessKnowledgeBase.nutrition[analysis.subCategory];
    
    if (analysis.subCategory === "protein") {
      return `**Proteínas**\n\n${nutritionInfo.description}\n\n**Requerimientos diarios:**\n- Sedentario: ${nutritionInfo.requirements.sedentary}\n- Activo: ${nutritionInfo.requirements.active}\n- Atleta: ${nutritionInfo.requirements.athlete}\n- Atleta en déficit: ${nutritionInfo.requirements.cuttingAthlete}\n\n**Fuentes principales:**\n${nutritionInfo.sources.map(source => `- ${source}`).join('\n')}\n\n**Timing:** ${nutritionInfo.timing}`;
    }
    
    if (analysis.subCategory === "carbohydrates") {
      return `**Carbohidratos**\n\n${nutritionInfo.description}\n\n**Requerimientos diarios:**\n- Pérdida de grasa: ${nutritionInfo.requirements.fatLoss}\n- Mantenimiento: ${nutritionInfo.requirements.maintenance}\n- Alto volumen: ${nutritionInfo.requirements.highVolume}\n- Atleta: ${nutritionInfo.requirements.athlete}\n\n**Fuentes principales:**\n${nutritionInfo.sources.map(source => `- ${source}`).join('\n')}\n\n**Timing:** ${nutritionInfo.timing}`;
    }
    
    if (analysis.subCategory === "fats") {
      return `**Grasas**\n\n${nutritionInfo.description}\n\n**Requerimientos diarios:**\n- Mínimo recomendado: ${nutritionInfo.requirements.minimum}\n- General: ${nutritionInfo.requirements.general}\n\n**Fuentes principales:**\n${nutritionInfo.sources.map(source => `- ${source}`).join('\n')}\n\n**Consejos:** ${nutritionInfo.tips}`;
    }
    
    if (analysis.subCategory === "mealTiming") {
      return `**Timing de comidas**\n\n**Recomendaciones generales:**\n${nutritionInfo.general}\n\n**Pre-entrenamiento:**\n${nutritionInfo.preWorkout}\n\n**Post-entrenamiento:**\n${nutritionInfo.postWorkout}\n\n**Antes de dormir:**\n${nutritionInfo.beforeBed}`;
    }
  }
  
  // Respuestas para biomecánica
  if (analysis.category === "biomechanics") {
    return `**Principios de biomecánica para el entrenamiento**\n\n**Conceptos fundamentales:**\n${fitnessKnowledgeBase.biomechanics.principles.map(principle => `- ${principle}`).join('\n')}\n\n**Errores comunes:**\n${fitnessKnowledgeBase.biomechanics.commonErrors.map(error => `- ${error}`).join('\n')}\n\n**Movimientos articulares básicos:**\n- Hombro: ${fitnessKnowledgeBase.biomechanics.jointMovements.shoulder.join(', ')}\n- Codo: ${fitnessKnowledgeBase.biomechanics.jointMovements.elbow.join(', ')}\n- Columna: ${fitnessKnowledgeBase.biomechanics.jointMovements.spine.join(', ')}\n- Cadera: ${fitnessKnowledgeBase.biomechanics.jointMovements.hip.join(', ')}\n- Rodilla: ${fitnessKnowledgeBase.biomechanics.jointMovements.knee.join(', ')}\n- Tobillo: ${fitnessKnowledgeBase.biomechanics.jointMovements.ankle.join(', ')}`;
  }
  
  // Respuestas para adaptaciones a lesiones
  if (analysis.category === "injuryAdaptations") {
    if (analysis.subCategory) {
      const injuryInfo = fitnessKnowledgeBase.injuryAdaptations[analysis.subCategory];
      return `**Adaptaciones para problemas de ${analysis.subCategory === 'shoulder' ? 'hombro' : analysis.subCategory === 'back' ? 'espalda' : 'rodilla'}**\n\n${injuryInfo.description}\n\n**Ejercicios a evitar:**\n${injuryInfo.avoid.map(ex => `- ${ex}`).join('\n')}\n\n**Alternativas recomendadas:**\n${injuryInfo.alternatives.map(alt => `- ${alt}`).join('\n')}\n\n**Ejercicios de rehabilitación:**\n${injuryInfo.rehabilitation.map(rehab => `- ${rehab}`).join('\n')}\n\n**Nota importante:** Estas recomendaciones son generales. Siempre consulta con un fisioterapeuta o médico deportivo para un diagnóstico y tratamiento personalizados.`;
    } else {
      return "Para darte recomendaciones específicas sobre adaptaciones por lesión, necesito saber qué área está afectada (hombro, espalda, rodilla, etc.). ¿Podrías darme más detalles?";
    }
  }
  
  // Respuestas para recuperación
  if (analysis.category === "recovery") {
    if (analysis.subCategory === "sleep") {
      return `**La importancia del sueño en la recuperación**\n\n${fitnessKnowledgeBase.recovery.sleep.importance}\n\n**Recomendaciones para optimizar el sueño:**\n${fitnessKnowledgeBase.recovery.sleep.recommendations.map(rec => `- ${rec}`).join('\n')}`;
    } else {
      return `**Estrategias de recuperación para optimizar resultados**\n\n**Técnicas de recuperación activa:**\n${fitnessKnowledgeBase.recovery.activeTechniques.map(tech => `- ${tech}`).join('\n')}\n\n**Técnicas de recuperación pasiva:**\n${fitnessKnowledgeBase.recovery.passiveTechniques.map(tech => `- ${tech}`).join('\n')}\n\n**Nutrición para la recuperación:**\n${fitnessKnowledgeBase.recovery.nutrition.map(tip => `- ${tip}`).join('\n')}\n\n**Timing de recuperación:** ${fitnessKnowledgeBase.recovery.timing}\n\n**Sueño:** ${fitnessKnowledgeBase.recovery.sleep.importance}`;
    }
  }
  
  // Respuestas para suplementación
  if (analysis.category === "supplements") {
    return `**Guía de suplementación para fitness**\n\n**Suplementos esenciales con mayor evidencia científica:**\n${fitnessKnowledgeBase.supplements.essential.map(supp => `- **${supp.name}**: ${supp.benefits}\n  Dosis: ${supp.dosage}\n  Timing: ${supp.timing}`).join('\n\n')}\n\n**Suplementos condicionales (beneficio según objetivos específicos):**\n${fitnessKnowledgeBase.supplements.conditional.map(supp => `- **${supp.name}**: ${supp.benefits}\n  Dosis: ${supp.dosage}\n  Timing: ${supp.timing}`).join('\n\n')}\n\n**Nota importante:** ${fitnessKnowledgeBase.supplements.caution}`;
  }
  
  // Respuesta fallback
  return fitnessKnowledgeBase.fallback[Math.floor(Math.random() * fitnessKnowledgeBase.fallback.length)];
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hola, soy tu asistente especializado en fitness. Puedo responder preguntas sobre ejercicios, técnicas, biomecánica, planificación de entrenamientos y adaptaciones según tu nivel y objetivos. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Generar una respuesta especializada basada en la consulta del usuario
    const response = generateFitnessResponse(inputText);
    
    // Simulate bot response after a delay (typing effect)
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Función para convertir texto con formato Markdown a HTML
  const formatMessage = (text: string) => {
    // Procesar negritas
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Procesar listas
    formattedText = formattedText.replace(/^- (.*)/gm, '<li>$1</li>');
    formattedText = formattedText.replace(/<li>.*?<\/li>/gs, (match) => `<ul class="list-disc pl-5 my-2">${match}</ul>`);
    
    // Procesar saltos de línea
    formattedText = formattedText.replace(/\n\n/g, '<br/><br/>');
    formattedText = formattedText.replace(/\n(?![<])/g, '<br/>');
    
    return formattedText;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat con IA</h1>
        <p className="text-muted-foreground">
          Consulta cualquier duda sobre entrenamiento, nutrición o progreso
        </p>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary">
              <AvatarFallback><Dumbbell className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Asistente GymWise</CardTitle>
              <CardDescription>
                Tu experto en entrenamiento y nutrición
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={message.sender === "user" ? "bg-primary" : "bg-muted"}>
                      <AvatarFallback>
                        {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-4 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div 
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                        className="message-content text-sm"
                      />
                      <span className="text-xs opacity-70 block mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-muted">
                      <AvatarFallback>
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-4 bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex w-full items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Escribe tu pregunta sobre fitness..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              {inputText.trim().length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setInputText("")}
                  >
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isTyping}
              className="bg-primary"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chat;
