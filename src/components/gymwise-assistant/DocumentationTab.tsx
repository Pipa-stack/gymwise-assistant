
import { useState } from "react";
import { Code, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type DocView = "overview" | "technical" | "usage";

export const DocumentationTab = () => {
  const [docView, setDocView] = useState<DocView>("overview");
  
  return (
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
          {docView === "overview" && <OverviewContent />}
          {docView === "usage" && <UsageContent />}
          {docView === "technical" && <TechnicalContent />}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const OverviewContent = () => (
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
);

const UsageContent = () => (
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
);

const TechnicalContent = () => (
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
);
