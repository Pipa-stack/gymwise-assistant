
import { useState } from "react";
import { Bot, Globe, Brain, Dumbbell, Scale } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Badge } from "@/components/ui/badge";

type ChatTabProps = {
  selectedLanguage: "es" | "en";
  setSelectedLanguage: (lang: "es" | "en") => void;
};

export const ChatTab = ({ selectedLanguage, setSelectedLanguage }: ChatTabProps) => {
  const { messages, isTyping, handleSendMessage } = useChat();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: selectedLanguage === "es" ? "Todo" : "All", icon: Brain },
    { id: "exercises", label: selectedLanguage === "es" ? "Ejercicios" : "Exercises", icon: Dumbbell },
    { id: "nutrition", label: selectedLanguage === "es" ? "Nutrición" : "Nutrition", icon: Scale },
  ];

  return (
    <Card className="h-[80vh] flex flex-col bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>GymWise Assistant</CardTitle>
              <CardDescription>
                {selectedLanguage === "es" 
                  ? "Tu entrenador personal virtual"
                  : "Your virtual personal trainer"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedLanguage === "es" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedLanguage("es")}
              className="gap-1"
            >
              <Globe className="h-4 w-4" /> ES
            </Button>
            <Button
              variant={selectedLanguage === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLanguage("en")}
              className="gap-1"
            >
              <Globe className="h-4 w-4" /> EN
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
        
        <Separator className="mt-3" />
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="rounded-lg p-4 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
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
      
      <div className="p-4 border-t bg-background/95">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping} 
          placeholder={selectedLanguage === "es" 
            ? "Pregúntame sobre entrenamientos, nutrición o rutinas..." 
            : "Ask me about workouts, nutrition, or routines..."}
        />
      </div>
    </Card>
  );
};
