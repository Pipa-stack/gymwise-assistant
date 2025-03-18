
export type Exercise = {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  target: string[];
  steps: string[];
  imageUrl?: string;
  videoUrl?: string;
};

export const exercisesData: Exercise[] = [
  // Ejercicios de Pecho - Principiante
  {
    id: "chest-pushup",
    name: "Flexiones",
    description: "Ejercicio básico para pecho, hombros y tríceps",
    difficulty: "beginner",
    category: "Pecho",
    target: ["Pecho", "Hombros", "Tríceps"],
    steps: [
      "Colócate en posición de plancha con las manos a la altura de los hombros",
      "Mantén el cuerpo recto y el core activado",
      "Baja el pecho hacia el suelo flexionando los codos",
      "Empuja hacia arriba hasta la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4"
  },
  // Ejercicios de Pecho - Intermedio
  {
    id: "chest-dumbbell-press",
    name: "Press con Mancuernas",
    description: "Press de pecho con mancuernas en banco plano",
    difficulty: "intermediate",
    category: "Pecho",
    target: ["Pecho", "Hombros", "Tríceps"],
    steps: [
      "Acuéstate en un banco plano con una mancuerna en cada mano",
      "Mantén las mancuernas a los lados del pecho",
      "Empuja las mancuernas hacia arriba",
      "Baja controladamente hasta la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=VmB1G1K7v94"
  },
  // Ejercicios de Pecho - Avanzado
  {
    id: "chest-weighted-dips",
    name: "Fondos Lastrados",
    description: "Fondos en paralelas con peso adicional",
    difficulty: "advanced",
    category: "Pecho",
    target: ["Pecho", "Hombros", "Tríceps"],
    steps: [
      "Coloca el cinturón con peso",
      "Agarra las barras paralelas",
      "Baja el cuerpo flexionando los codos",
      "Empuja hacia arriba hasta extender los brazos"
    ],
    videoUrl: "https://www.youtube.com/watch?v=v8uqVEtD6-w"
  },

  // Ejercicios de Espalda - Principiante
  {
    id: "back-assisted-pullup",
    name: "Dominadas Asistidas",
    description: "Dominadas con máquina de asistencia o banda elástica",
    difficulty: "beginner",
    category: "Espalda",
    target: ["Espalda", "Bíceps", "Antebrazos"],
    steps: [
      "Ajusta el peso de asistencia o la banda",
      "Agarra la barra con las manos más anchas que los hombros",
      "Tira del cuerpo hacia arriba hasta que la barbilla supere la barra",
      "Baja controladamente"
    ],
    videoUrl: "https://www.youtube.com/watch?v=ZHllQTJf7eA"
  },
  // Ejercicios de Espalda - Intermedio
  {
    id: "back-barbell-row",
    name: "Remo con Barra",
    description: "Remo horizontal con barra para espalda",
    difficulty: "intermediate",
    category: "Espalda",
    target: ["Espalda", "Bíceps", "Trapecio"],
    steps: [
      "Inclínate hacia adelante con la espalda recta",
      "Agarra la barra con las manos más anchas que los hombros",
      "Tira de la barra hacia el abdomen",
      "Baja controladamente"
    ],
    videoUrl: "https://www.youtube.com/watch?v=9efgcAjQe7E"
  },
  // Ejercicios de Espalda - Avanzado
  {
    id: "back-weighted-pullup",
    name: "Dominadas Lastradas",
    description: "Dominadas con peso adicional",
    difficulty: "advanced",
    category: "Espalda",
    target: ["Espalda", "Bíceps", "Antebrazos"],
    steps: [
      "Coloca el cinturón con peso",
      "Agarra la barra con agarre prono",
      "Tira del cuerpo hacia arriba",
      "Baja controladamente manteniendo la tensión"
    ],
    videoUrl: "https://www.youtube.com/watch?v=0oeIB6wi3es"
  },

  // Ejercicios de Piernas - Principiante
  {
    id: "legs-bodyweight-squat",
    name: "Sentadilla Sin Peso",
    description: "Sentadilla básica con peso corporal",
    difficulty: "beginner",
    category: "Piernas",
    target: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    steps: [
      "Ponte de pie con los pies a la anchura de los hombros",
      "Flexiona las rodillas y caderas",
      "Baja hasta que los muslos estén paralelos al suelo",
      "Empuja a través de los talones para subir"
    ],
    videoUrl: "https://www.youtube.com/watch?v=aclHkVaku9U"
  },
  // Ejercicios de Piernas - Intermedio
  {
    id: "legs-bulgarian-split",
    name: "Zancada Búlgara",
    description: "Zancada con pie trasero elevado",
    difficulty: "intermediate",
    category: "Piernas",
    target: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    steps: [
      "Coloca el pie trasero sobre un banco",
      "Mantén el torso recto",
      "Baja la rodilla trasera hacia el suelo",
      "Empuja con el pie delantero para subir"
    ],
    videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE"
  },
  // Ejercicios de Piernas - Avanzado
  {
    id: "legs-pistol-squat",
    name: "Sentadilla a Una Pierna",
    description: "Sentadilla pistol con una sola pierna",
    difficulty: "advanced",
    category: "Piernas",
    target: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    steps: [
      "Mantén una pierna extendida frente a ti",
      "Mantén los brazos extendidos para equilibrio",
      "Baja sobre la pierna de apoyo",
      "Empuja para volver a la posición inicial"
    ],
    videoUrl: "https://www.youtube.com/watch?v=vq5-vdgJc0I"
  },

  // Ejercicios de Hombros - Principiante
  {
    id: "shoulders-lateral-raise",
    name: "Elevaciones Laterales",
    description: "Elevaciones laterales con mancuernas",
    difficulty: "beginner",
    category: "Hombros",
    target: ["Deltoides Lateral", "Deltoides"],
    steps: [
      "De pie con mancuernas a los lados",
      "Eleva los brazos hasta la altura de los hombros",
      "Mantén un ligero doblez en los codos",
      "Baja controladamente"
    ],
    videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
  },
  
  // Ejercicios de Bíceps - Intermedio
  {
    id: "biceps-hammer-curl",
    name: "Curl Martillo",
    description: "Curl de bíceps con agarre neutro",
    difficulty: "intermediate",
    category: "Bíceps",
    target: ["Bíceps", "Braquial", "Antebrazos"],
    steps: [
      "De pie con mancuernas en agarre neutro",
      "Curl hacia arriba manteniendo los codos pegados",
      "Aprieta el bíceps en la parte superior",
      "Baja controladamente"
    ],
    videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4"
  },

  // Ejercicios de Tríceps - Avanzado
  {
    id: "triceps-weighted-dips",
    name: "Fondos Lastrados para Tríceps",
    description: "Fondos con peso adicional enfocados en tríceps",
    difficulty: "advanced",
    category: "Tríceps",
    target: ["Tríceps", "Pecho", "Hombros"],
    steps: [
      "Coloca el cinturón con peso",
      "Mantén el torso vertical",
      "Baja controladamente",
      "Extiende completamente los brazos al subir"
    ],
    videoUrl: "https://www.youtube.com/watch?v=v8uqVEtD6-w"
  },

  // Ejercicios de Core - Principiante
  {
    id: "core-plank",
    name: "Plancha",
    description: "Ejercicio isométrico para core",
    difficulty: "beginner",
    category: "Core",
    target: ["Abdominales", "Oblicuos", "Espalda Baja"],
    steps: [
      "Apóyate sobre antebrazos y pies",
      "Mantén el cuerpo en línea recta",
      "Activa el core",
      "Mantén la posición"
    ],
    videoUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c"
  }
];
