
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const predefinedResponses = [
  "Para mejorar tus resultados, asegúrate de mantener una técnica adecuada durante los ejercicios.",
  "Recuerda que el descanso es tan importante como el entrenamiento. Trata de dormir 7-8 horas cada noche.",
  "La nutrición juega un papel crucial en tus objetivos. Asegúrate de consumir suficiente proteína para la recuperación muscular.",
  "El progreso lleva tiempo, mantén la consistencia y los resultados llegarán.",
  "Para evitar el estancamiento, considera cambiar tu rutina cada 4-6 semanas.",
  "No olvides la importancia de la hidratación durante el entrenamiento.",
  "Recuerda hacer ejercicios de calentamiento antes de comenzar tu rutina para prevenir lesiones.",
  "El entrenamiento de fuerza es beneficioso para todos, no solo para quienes buscan ganar músculo.",
  "Para maximizar el crecimiento muscular, enfócate en la conexión mente-músculo durante los ejercicios.",
];

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
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const randomResponse = predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
      
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
          <ScrollArea className="h-full p-6">
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
