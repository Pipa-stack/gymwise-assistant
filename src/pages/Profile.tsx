import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit3, 
  Save, 
  User, 
  Calendar, 
  Target, 
  Mail, 
  Phone, 
  Activity, 
  FileText, 
  BarChart2,
  Award,
  Image,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import ProgressChart from "@/components/ProgressChart";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import SocialMediaLinks from "@/components/social/SocialMediaLinks";
import TrainingGallery from "@/components/social/TrainingGallery";

const Profile = () => {
  const { clients, mode } = useAppContext();
  const { toast } = useToast();
  
  // En modo cliente, usamos el primer cliente de ejemplo
  // En una aplicación real, esto vendría de la sesión del usuario
  const clientData = clients[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: clientData.name,
    email: clientData.email,
    phone: clientData.phone,
    goal: clientData.goal,
    notes: "Me gustaría enfocarme en mejorar mi técnica de sentadilla.",
    socialLinks: {
      instagram: "@fitness_user",
      facebook: "fitnessuser",
      twitter: "@fitness_user"
    }
  });

  // Calculamos el progreso hacia la meta
  // Simulamos un progreso del 65%
  const progressToGoal = 65;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      socialLinks: { ...prev.socialLinks, [name]: value } 
    }));
  };

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar los cambios
    setIsEditing(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus datos han sido actualizados correctamente.",
    });
  };

  // Calculamos cuánto tiempo lleva entrenando
  const daysTraining = Math.ceil(
    Math.abs(new Date().getTime() - new Date(clientData.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Sample training photos
  const trainingPhotos = [
    { id: "1", url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", description: "Entrenamiento de piernas", date: "2023-11-20" },
    { id: "2", url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop", description: "PR en press de banca", date: "2023-12-05" },
    { id: "3", url: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop", description: "Entrenamiento de espalda", date: "2024-01-15" },
    { id: "4", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", description: "Cardio matutino", date: "2024-02-10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          size="sm" 
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          className="flex items-center gap-1"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              <span>Editar Perfil</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="relative pb-0">
            <div className="absolute top-6 right-6">
              <Badge variant="outline" className="bg-primary/10 text-primary font-medium">
                {clientData.goal}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                {clientData.photo ? (
                  <img 
                    src={clientData.photo} 
                    alt={clientData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl">{clientData.name}</CardTitle>
                <CardDescription>
                  Cliente desde {format(new Date(clientData.startDate), "MMMM yyyy")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Correo Electrónico
                </span>
                {isEditing ? (
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clientData.email}</span>
                )}
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Teléfono
                </span>
                {isEditing ? (
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clientData.phone}</span>
                )}
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Edad
                </span>
                <span>{clientData.age} años</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  Objetivo
                </span>
                {isEditing ? (
                  <Input 
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{clientData.goal}</span>
                )}
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  Días entrenando
                </span>
                <div className="flex items-center gap-2">
                  <span>{daysTraining}</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 font-medium">
                    {daysTraining > 180 ? "Avanzado" : daysTraining > 60 ? "Intermedio" : "Principiante"}
                  </Badge>
                </div>
              </div>

              <SocialMediaLinks 
                isEditing={isEditing}
                socialLinks={formData.socialLinks}
                onChange={handleSocialInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="progress">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información Detallada</CardTitle>
                <TabsList>
                  <TabsTrigger value="progress" className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Progreso</span>
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Notas</span>
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">Logros</span>
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    <span className="hidden sm:inline">Galería</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <TabsContent value="progress">
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Progreso hacia tu objetivo: {clientData.goal}</h4>
                      <span className="text-sm font-medium">{progressToGoal}%</span>
                    </div>
                    <Progress value={progressToGoal} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Progreso en el tiempo</h4>
                    {clientData.progress && clientData.progress.length > 0 ? (
                      <div className="h-[300px]">
                        <ProgressChart 
                          data={clientData.progress} 
                          metrics={["weight", "bodyFat"]} 
                        />
                      </div>
                    ) : (
                      <div className="flex h-60 items-center justify-center">
                        <p className="text-muted-foreground">No hay datos de progreso disponibles</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Peso Actual</div>
                      <div className="text-2xl font-semibold">
                        {clientData.progress && clientData.progress.length > 0
                          ? `${clientData.progress[clientData.progress.length - 1].weight} kg`
                          : "N/A"}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">% Grasa</div>
                      <div className="text-2xl font-semibold">
                        {clientData.progress && clientData.progress.length > 0 && clientData.progress[clientData.progress.length - 1].bodyFat
                          ? `${clientData.progress[clientData.progress.length - 1].bodyFat}%`
                          : "N/A"}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Cambio de Peso</div>
                      <div className="text-2xl font-semibold flex items-center">
                        {clientData.progress && clientData.progress.length > 1
                          ? (
                              <span className={
                                clientData.progress[clientData.progress.length - 1].weight - clientData.progress[0].weight < 0 
                                  ? "text-red-500" 
                                  : "text-green-500"
                              }>
                                {(clientData.progress[clientData.progress.length - 1].weight - clientData.progress[0].weight).toFixed(1)} kg
                              </span>
                            )
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">Registrar Nueva Medición</Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="notes">
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes" className="text-base font-medium">Notas personales</Label>
                    {isEditing ? (
                      <Textarea 
                        id="notes" 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleInputChange}
                        placeholder="Escribe aquí tus notas personales..."
                        className="h-40 mt-2"
                      />
                    ) : (
                      <div className="p-3 border rounded-md mt-2">
                        <p>{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="achievements">
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 border rounded-lg">
                    <div className="rounded-full bg-primary/10 p-3 mr-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Primer mes completado</h4>
                      <p className="text-sm text-muted-foreground">Completaste tu primer mes de entrenamiento</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg">
                    <div className="rounded-full bg-primary/10 p-3 mr-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">10 sesiones completadas</h4>
                      <p className="text-sm text-muted-foreground">Completaste 10 sesiones de entrenamiento</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg opacity-50">
                    <div className="rounded-full bg-muted p-3 mr-4">
                      <Award className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">Primera meta alcanzada</h4>
                      <p className="text-sm text-muted-foreground">Alcanza tu primera meta de entrenamiento</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg opacity-50">
                    <div className="rounded-full bg-muted p-3 mr-4">
                      <Award className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">3 meses consecutivos</h4>
                      <p className="text-sm text-muted-foreground">Completa 3 meses de entrenamiento consecutivo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="gallery">
              <CardContent>
                <TrainingGallery photos={trainingPhotos} />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Añadir nueva foto
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
