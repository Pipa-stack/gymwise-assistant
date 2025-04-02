
import { Code, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SettingsTabProps = {
  selectedLanguage: "es" | "en";
  setSelectedLanguage: (lang: "es" | "en") => void;
};

export const SettingsTab = ({ selectedLanguage, setSelectedLanguage }: SettingsTabProps) => {
  return (
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
  );
};
