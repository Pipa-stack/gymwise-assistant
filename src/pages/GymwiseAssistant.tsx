
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, Info, History, Settings } from "lucide-react";
import { ChatTab } from "@/components/gymwise-assistant/ChatTab";
import { DocumentationTab } from "@/components/gymwise-assistant/DocumentationTab";
import { HistoryTab } from "@/components/gymwise-assistant/HistoryTab";
import { SettingsTab } from "@/components/gymwise-assistant/SettingsTab";

const GymwiseAssistant = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"es" | "en">("es");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Bot className="mr-2 h-6 w-6 text-primary" />
          GymWise Assistant
        </h2>
        <p className="text-muted-foreground">
          Asistente de IA especializado para entrenadores y clientes de gimnasio
        </p>
      </div>
      
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="chat"><MessageSquare className="h-4 w-4 mr-2" /> Chat</TabsTrigger>
          <TabsTrigger value="docs"><Info className="h-4 w-4 mr-2" /> Documentación</TabsTrigger>
          <TabsTrigger value="history"><History className="h-4 w-4 mr-2" /> Historial</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-4 w-4 mr-2" /> Ajustes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-6">
          <ChatTab 
            selectedLanguage={selectedLanguage} 
            setSelectedLanguage={setSelectedLanguage} 
          />
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6 space-y-4">
          <DocumentationTab />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <HistoryTab />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <SettingsTab 
            selectedLanguage={selectedLanguage} 
            setSelectedLanguage={setSelectedLanguage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GymwiseAssistant;
