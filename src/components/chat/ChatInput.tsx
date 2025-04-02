
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity, Send } from "lucide-react";

type ChatInputProps = {
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  placeholder?: string; // Make placeholder optional
};

export const ChatInput = ({ onSendMessage, isTyping, placeholder }: ChatInputProps) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex w-full items-center space-x-2">
      <div className="flex-1 relative">
        <Input
          placeholder={placeholder || "Escribe tu pregunta sobre fitness..."}
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
        onClick={handleSend} 
        disabled={!inputText.trim() || isTyping}
        className="bg-primary"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
