import { useState } from "react";
import { Brain, Code, Dumbbell, Info, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type DocView = "overview" | "exercises" | "nutrition" | "technical";

export const DocumentationTab = () => {
  const [docView, setDocView] = useState<DocView>("overview");
  
  return (
    <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" />
            Documentación
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={docView === "overview" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDocView("overview")}
              className="gap-2"
            >
              <Brain className="h-4 w-4" />
              Visión General
            </Button>
            <Button 
              variant={docView === "exercises" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDocView("exercises")}
              className="gap-2"
            >
              <Dumbbell className="h-4 w-4" />
              Ejercicios
            </Button>
            <Button 
              variant={docView === "nutrition" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDocView("nutrition")}
              className="gap-2"
            >
              <Scale className="h-4 w-4" />
              Nutrición
            </Button>
            <Button 
              variant={docView === "technical" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDocView("technical")}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Técnico
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          {docView === "overview" && <OverviewContent />}
          {docView === "exercises" && <ExercisesContent />}
          {docView === "nutrition" && <NutritionContent />}
          {docView === "technical" && <TechnicalContent />}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const OverviewContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-3">GymWise Assistant</h3>
      <p className="text-muted-foreground">
        Un asistente de IA especializado para el contexto de gimnasios y entrenamiento físico, 
        diseñado para ayudar tanto a entrenadores como a clientes.
      </p>
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h4 className="font-semibold mb-2">Características principales</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Badge variant="outline">✓</Badge>
            Interfaz de chat intuitiva
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="outline">✓</Badge>
            Soporte multilingüe
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="outline">✓</Badge>
            Persistencia de datos
          </li>
        </ul>
      </Card>
      
      <Card className="p-4">
        <h4 className="font-semibold mb-2">Beneficios</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Badge variant="outline">✓</Badge>
            Respuestas instantáneas
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="outline">✓</Badge>
            Seguimiento personalizado
          </li>
          <li className="flex items-center gap-2">
            <Badge variant="outline">✓</Badge>
            Sugerencias adaptadas
          </li>
        </ul>
      </Card>
    </div>
  </div>
);

const ExercisesContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-3">Base de Ejercicios</h3>
      <p className="text-muted-foreground mb-4">
        Accede a una completa base de datos de ejercicios con instrucciones detalladas y recomendaciones.
      </p>
    </div>
    
    <div className="grid gap-4">
      {["Fuerza", "Cardio", "Flexibilidad", "Balance"].map((category) => (
        <Card key={category} className="p-4">
          <h4 className="font-semibold mb-2">{category}</h4>
          <p className="text-sm text-muted-foreground">
            Descubre ejercicios específicos para {category.toLowerCase()} y mejora tu rendimiento.
          </p>
        </Card>
      ))}
    </div>
  </div>
);

const NutritionContent = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold mb-3">Guía Nutricional</h3>
      <p className="text-muted-foreground mb-4">
        Información detallada sobre nutrición deportiva y planes alimenticios.
      </p>
    </div>
    
    <div className="grid gap-4">
      {[
        "Macronutrientes",
        "Suplementación",
        "Pre-entreno",
        "Post-entreno"
      ].map((topic) => (
        <Card key={topic} className="p-4">
          <h4 className="font-semibold mb-2">{topic}</h4>
          <p className="text-sm text-muted-foreground">
            Aprende sobre {topic.toLowerCase()} y optimiza tu nutrición.
          </p>
        </Card>
      ))}
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
