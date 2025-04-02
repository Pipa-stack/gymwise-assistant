
import { useState } from "react";
import { Bot, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

type ChatTabProps = {
  selectedLanguage: "es" | "en";
  setSelectedLanguage: (lang: "es" | "en") => void;
};

export const ChatTab = ({ selectedLanguage, setSelectedLanguage }: ChatTabProps) => {
  const { messages, isTyping, handleSendMessage } = useChat();

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>GymWise Assistant</CardTitle>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost" 
              size="sm"
              className={selectedLanguage === "es" ? "bg-primary/10" : ""}
              onClick={() => setSelectedLanguage("es")}
            >
              <Globe className="h-4 w-4 mr-1" /> ES
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              className={selectedLanguage === "en" ? "bg-primary/10" : ""}
              onClick={() => setSelectedLanguage("en")}
            >
              <Globe className="h-4 w-4 mr-1" /> EN
            </Button>
          </div>
        </div>
        <CardDescription>
          {selectedLanguage === "es" 
            ? "Tu entrenador personal virtual para gimnasio"
            : "Your virtual personal gym trainer"}
        </CardDescription>
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
      
      <div className="p-4 border-t">
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
