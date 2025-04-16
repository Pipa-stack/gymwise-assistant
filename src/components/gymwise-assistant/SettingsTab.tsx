
import { Settings, Globe, Brain, Database, Code, Trash2, Download, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type SettingsTabProps = {
  selectedLanguage: "es" | "en";
  setSelectedLanguage: (lang: "es" | "en") => void;
};

export const SettingsTab = ({ selectedLanguage, setSelectedLanguage }: SettingsTabProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Configuración
        </CardTitle>
        <CardDescription>
          Personaliza tu experiencia con el asistente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Idioma preferido
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedLanguage === "es" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("es")}
              className="min-w-[120px]"
            >
              <span className="mr-2">🇪🇸</span> Español
            </Button>
            <Button 
              variant={selectedLanguage === "en" ? "default" : "outline"}
              onClick={() => setSelectedLanguage("en")}
              className="min-w-[120px]"
            >
              <span className="mr-2">🇬🇧</span> English
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Modelo de IA
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Modelo en la nube</div>
                <div className="text-sm text-muted-foreground">
                  Procesamiento rápido con última versión
                </div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Modelo local
                  <Badge variant="outline" className="ml-2">Próximamente</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Procesa localmente para mayor privacidad
                </div>
              </div>
              <Switch disabled />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Datos y privacidad
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Limpiar historial
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar datos
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Personalización avanzada
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Sugerencias proactivas</div>
                <div className="text-sm text-muted-foreground">
                  El asistente sugiere ejercicios basados en tu historial
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Modo desarrollador</div>
                <div className="text-sm text-muted-foreground">
                  Accede a funciones experimentales
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
