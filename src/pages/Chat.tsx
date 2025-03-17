
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Fitness knowledge base with categorized responses
const fitnessResponses = {
  greeting: [
    "¡Hola! Soy tu asistente de entrenamiento. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! Estoy aquí para responder tus preguntas sobre fitness. ¿Qué necesitas saber?",
    "¡Hola! ¿Tienes alguna duda sobre tu entrenamiento o nutrición?"
  ],
  nutrition: [
    "Para optimizar tu nutrición, asegúrate de consumir suficiente proteína (1.6-2g por kg de peso corporal) para la recuperación muscular.",
    "Mantenerse hidratado es crucial. Intenta beber al menos 2-3 litros de agua al día, especialmente en días de entrenamiento.",
    "Los carbohidratos complejos son excelentes para la energía de entrenamientos largos. Considera consumirlos 1-2 horas antes de ejercitarte.",
    "Las grasas saludables son esenciales para la hormona testosterona, importante para el crecimiento muscular. Incluye aguacates, frutos secos y aceite de oliva en tu dieta."
  ],
  training: [
    "Para hipertrofia, se recomienda entrenar cada grupo muscular 2-3 veces por semana con 10-20 series semanales por grupo.",
    "El descanso entre series para hipertrofia suele ser de 1-2 minutos, mientras que para fuerza puede ser de 3-5 minutos.",
    "Considera cambiar tu rutina cada 4-6 semanas para evitar el estancamiento y mantener el progreso.",
    "La técnica correcta siempre es más importante que el peso que levantas. Enfócate en la conexión mente-músculo."
  ],
  recovery: [
    "El descanso es tan importante como el entrenamiento. Trata de dormir 7-8 horas cada noche para una óptima recuperación.",
    "Considera técnicas como el foam rolling o estiramientos para mejorar la recuperación muscular.",
    "Las saunas y los baños de hielo pueden ayudar a reducir la inflamación y acelerar la recuperación.",
    "Escucha a tu cuerpo. Si sientes dolor (no confundir con la molestia normal), es mejor descansar un día adicional."
  ],
  goals: [
    "Para ganar músculo, necesitas estar en un superávit calórico moderado (200-300 calorías extra) y seguir un programa de entrenamiento progresivo.",
    "Para perder grasa, un déficit calórico de 300-500 calorías y mantener el entrenamiento de fuerza es clave para preservar la masa muscular.",
    "Ser consistente es más importante que ser perfecto. Pequeños cambios sostenibles en el tiempo darán mejores resultados.",
    "Establece metas SMART: específicas, medibles, alcanzables, relevantes y con tiempo definido."
  ],
  motivation: [
    "El progreso lleva tiempo, mantén la consistencia y los resultados llegarán.",
    "Recuerda por qué empezaste cuando sientas que quieres rendirte.",
    "Celebra los pequeños logros en el camino, no solo el objetivo final.",
    "Encuentra un compañero de entrenamiento o únete a una comunidad para mantenerte motivado."
  ],
  supplements: [
    "La creatina es uno de los suplementos más estudiados y efectivos para mejorar el rendimiento y la hipertrofia.",
    "La proteína en polvo es conveniente, pero no es mejor que obtener proteína de alimentos enteros.",
    "Los BCAAs generalmente no son necesarios si consumes suficiente proteína en tu dieta.",
    "La cafeína puede mejorar el rendimiento, especialmente en entrenamientos de alta intensidad."
  ],
  fallback: [
    "Interesante pregunta. Te recomendaría consultar directamente con tu entrenador para obtener una respuesta más personalizada.",
    "No tengo información específica sobre eso, pero puedo ayudarte con preguntas sobre nutrición, entrenamiento, recuperación y suplementos.",
    "Entiendo tu consulta, pero necesitaría más información para darte una respuesta precisa. ¿Podrías darme más detalles?",
    "Esa es una pregunta compleja. Considera programar una sesión con tu entrenador para discutir esto más a fondo."
  ]
};

// Function to determine the most relevant category for a user's message
const getCategoryForMessage = (message: string): keyof typeof fitnessResponses => {
  message = message.toLowerCase();
  
  if (message.includes("hola") || message.includes("saludos") || message.includes("buenos días") || message.includes("buenas")) {
    return "greeting";
  } else if (message.includes("comer") || message.includes("comida") || message.includes("nutri") || message.includes("dieta") || message.includes("proteína") || message.includes("carbohidrato") || message.includes("grasa")) {
    return "nutrition";
  } else if (message.includes("entrena") || message.includes("ejercicio") || message.includes("series") || message.includes("repeticiones") || message.includes("peso") || message.includes("rutina") || message.includes("hipertrofia")) {
    return "training";
  } else if (message.includes("recupera") || message.includes("descanso") || message.includes("dormir") || message.includes("sueño") || message.includes("dolor")) {
    return "recovery";
  } else if (message.includes("objetivo") || message.includes("meta") || message.includes("adelgazar") || message.includes("perder") || message.includes("ganar") || message.includes("músculo") || message.includes("grasa")) {
    return "goals";
  } else if (message.includes("motiva") || message.includes("ánimo") || message.includes("rendir") || message.includes("continuar")) {
    return "motivation";
  } else if (message.includes("suplement") || message.includes("proteína en polvo") || message.includes("creatina") || message.includes("bcaa") || message.includes("cafeína")) {
    return "supplements";
  } else {
    return "fallback";
  }
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hola, soy tu asistente de entrenamiento. ¿En qué puedo ayudarte hoy?",
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
    
    // Determine the appropriate response category
    const category = getCategoryForMessage(inputText);
    const categoryResponses = fitnessResponses[category];
    
    // Select a random response from the chosen category
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    
    // Simulate bot response after a delay (typing effect)
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
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
          <CardTitle>Asistente GymWise</CardTitle>
          <CardDescription>
            Tu asistente de entrenamiento personal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
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
                      <p>{message.text}</p>
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
            <Input
              placeholder="Escribe tu mensaje..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!inputText.trim() || isTyping}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chat;
