
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Code, Globe, History, Info, MessageSquare, Settings } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

const GymwiseAssistant = () => {
  const { messages, isTyping, handleSendMessage } = useChat();
  const [selectedLanguage, setSelectedLanguage] = useState<"es" | "en">("es");
  
  // Document view state
  const [docView, setDocView] = useState<"overview" | "technical" | "usage">("overview");
  
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
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Documentación
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={docView === "overview" ? "bg-primary/10" : ""}
                    onClick={() => setDocView("overview")}
                  >
                    Visión General
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={docView === "usage" ? "bg-primary/10" : ""}
                    onClick={() => setDocView("usage")}
                  >
                    Uso
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={docView === "technical" ? "bg-primary/10" : ""}
                    onClick={() => setDocView("technical")}
                  >
                    Técnico
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[50vh]">
                {docView === "overview" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">GymWise Assistant</h3>
                      <p>Un asistente de IA especializado para el contexto de gimnasios y entrenamiento físico, diseñado para ayudar tanto a entrenadores como a clientes.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Características principales</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Interfaz de chat intuitiva para consultas sobre entrenamiento y nutrición</li>
                        <li>Soporte multilingüe (Español e Inglés)</li>
                        <li>Persistencia de datos para personalizar la experiencia</li>
                        <li>Diseño modular para fácil extensibilidad</li>
                        <li>Integración con planes de entrenamiento existentes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Beneficios</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Respuestas instantáneas a dudas comunes sobre fitness</li>
                        <li>Seguimiento personalizado del progreso</li>
                        <li>Sugerencias adaptadas al historial y objetivos del usuario</li>
                        <li>Acceso a conocimiento especializado en formato conversacional</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {docView === "usage" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Guía de uso</h3>
                      <p>El GymWise Assistant está diseñado para ser intuitivo y fácil de usar.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Consultas recomendadas</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Ejercicios:</strong> "¿Cómo hago correctamente una sentadilla?"</li>
                        <li><strong>Nutrición:</strong> "¿Cuánta proteína necesito al día?"</li>
                        <li><strong>Planes:</strong> "Necesito una rutina para ganar fuerza"</li>
                        <li><strong>Lesiones:</strong> "Tengo dolor en la rodilla al correr"</li>
                        <li><strong>Progreso:</strong> "¿Cómo puedo superar mi estancamiento en press de banca?"</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cambio de idioma</h3>
                      <p>Puedes cambiar entre español e inglés usando los botones de idioma en la parte superior del chat.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Historial</h3>
                      <p>Todas tus conversaciones se guardan automáticamente en la pestaña "Historial" para que puedas revisarlas más tarde.</p>
                    </div>
                  </div>
                )}
                
                {docView === "technical" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Arquitectura</h3>
                      <p>GymWise Assistant está construido con una arquitectura modular que separa:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>Interfaz de usuario:</strong> React con componentes reutilizables</li>
                        <li><strong>Lógica de negocio:</strong> Módulos de JavaScript para procesamiento de consultas</li>
                        <li><strong>Persistencia:</strong> Almacenamiento local para historial y preferencias</li>
                        <li><strong>Multilenguaje:</strong> Sistema de traducción basado en diccionarios JSON</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tecnologías</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge>React</Badge>
                        <Badge>TypeScript</Badge>
                        <Badge>shadcn/ui</Badge>
                        <Badge>Tailwind CSS</Badge>
                        <Badge>localStorage API</Badge>
                        <Badge>i18n</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Implementación de IA</h3>
                      <p>El asistente utiliza un sistema de clasificación de consultas para identificar la intención del usuario y generar respuestas apropiadas.</p>
                      
                      <div className="mt-4">
                        <h4 className="text-md font-medium mb-2">Ejemplo de código de clasificación:</h4>
                        <Card className="bg-muted">
                          <CardContent className="p-4">
                            <pre className="text-xs">
                              <code>
{`const analyzeQuery = (message: string): ChatResponse => {
  message = message.toLowerCase();
  
  // Exercises detection
  if (/(sentadilla|squat|press de banca|deadlift)/i.test(message)) {
    return { category: "exercises", subCategory: "..." };
  }
  
  // Nutrition detection
  if (/(proteína|carbohidratos|grasas|dieta)/i.test(message)) {
    return { category: "nutrition", subCategory: "..." };
  }
  
  return { category: "general" };
};`}
                              </code>
                            </pre>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Extensibilidad</h3>
                      <p>El sistema está diseñado para ser ampliado con:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Nuevos idiomas mediante archivos de traducción</li>
                        <li>Nuevos dominios de conocimiento (yoga, crossfit, etc.)</li>
                        <li>Integración con modelos LLM locales para mayor privacidad</li>
                        <li>APIs externas para información nutricional o ejercicios</li>
                      </ul>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-primary" />
                Historial de conversaciones
              </CardTitle>
              <CardDescription>
                Revisa tus conversaciones anteriores con el asistente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Consulta sobre nutrición</CardTitle>
                        <Badge variant="outline" className="text-xs">Hoy</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">Preguntas sobre proteínas y suplementación post-entrenamiento...</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Rutina para hipertrofia</CardTitle>
                        <Badge variant="outline" className="text-xs">Ayer</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">Discusión sobre métodos de entrenamiento para ganar masa muscular...</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">Técnica de sentadilla</CardTitle>
                        <Badge variant="outline" className="text-xs">Hace 3 días</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">Revisión de la técnica correcta para sentadillas con barra...</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Configuración
              </CardTitle>
              <CardDescription>
                Personaliza tu experiencia con el asistente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-4">Idioma preferido</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    className={selectedLanguage === "es" ? "bg-primary/10" : ""}
                    onClick={() => setSelectedLanguage("es")}
                  >
                    Español
                  </Button>
                  <Button 
                    variant="outline"
                    className={selectedLanguage === "en" ? "bg-primary/10" : ""}
                    onClick={() => setSelectedLanguage("en")}
                  >
                    English
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-md font-medium mb-4">Modelo de IA</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" className="bg-primary/10">
                    En la nube
                  </Button>
                  <Button variant="outline" disabled>
                    Local (próximamente)
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  El modo local permitirá ejecutar modelos de IA en tu dispositivo para mayor privacidad
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-md font-medium mb-4">Persistencia de datos</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="destructive" size="sm">
                    Limpiar historial
                  </Button>
                  <Button variant="outline" size="sm">
                    Exportar datos
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-md font-medium mb-4">Desarrollo</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Modo desarrollador
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Activa opciones avanzadas para personalizar y extender el asistente
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GymwiseAssistant;
