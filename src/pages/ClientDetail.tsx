
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProgressChart from "@/components/ProgressChart";
import WorkoutTracker from "@/components/WorkoutTracker";
import { generateProgressSummary, calculateBMI, getBMICategory } from "@/utils/progressUtils";
import { ArrowLeft, Mail, Phone, User, Calendar, Target, ScrollText, LineChart, Dumbbell, MessageSquare } from "lucide-react";

const ClientDetail = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, trainingPlans, mode } = useAppContext();
  const [activeTab, setActiveTab] = useState("overview");
  
  const client = clients.find(c => c.id === clientId);
  
  useEffect(() => {
    if (mode !== "trainer") {
      navigate("/");
    }
    
    if (!client) {
      navigate("/clients");
    }
  }, [client, mode, navigate]);
  
  if (!client) {
    return <div className="p-8 text-center">Cliente no encontrado</div>;
  }
  
  const clientPlans = trainingPlans.filter(plan => plan.clientId === client.id);
  const progressSummary = generateProgressSummary(client);
  
  const latestProgress = client.progress && client.progress.length > 0 
    ? client.progress[client.progress.length - 1] 
    : null;
    
  const bmi = client.height && latestProgress 
    ? calculateBMI(latestProgress.weight, client.height) 
    : 0;
    
  const bmiCategory = getBMICategory(bmi);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Clientes
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Mensaje
          </Button>
          <Button>
            <ScrollText className="mr-2 h-4 w-4" />
            Editar Plan
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={client.photo} alt={client.name} />
              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <CardTitle>{client.name}</CardTitle>
            <CardDescription>{client.goal}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.age} años</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Cliente desde {new Date(client.startDate).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Objetivo: {client.goal}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Datos físicos actuales</h4>
                {latestProgress ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border p-2">
                      <div className="text-xs text-muted-foreground">Peso</div>
                      <div className="font-medium">{latestProgress.weight} kg</div>
                    </div>
                    {latestProgress.bodyFat !== undefined && (
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">% Grasa</div>
                        <div className="font-medium">{latestProgress.bodyFat}%</div>
                      </div>
                    )}
                    {client.height && (
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Altura</div>
                        <div className="font-medium">{client.height} m</div>
                      </div>
                    )}
                    {bmi > 0 && (
                      <div className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">IMC</div>
                        <div className="font-medium">{bmi.toFixed(1)} ({bmiCategory})</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay datos disponibles</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Progreso</CardTitle>
              <CardDescription>
                {progressSummary}
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span>Progreso</span>
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-1">
                <Dumbbell className="h-4 w-4" />
                <span>Entrenamiento</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-1">
                <ScrollText className="h-4 w-4" />
                <span>Notas</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {client.progress && client.progress.length > 0 ? (
                <ProgressChart 
                  data={client.progress}
                  metrics={["weight", "bodyFat", "musclePercentage"]}
                  height={300}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Sin datos de progreso</CardTitle>
                    <CardDescription>
                      No hay mediciones registradas para este cliente.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-6">
                    <Button>Añadir Medición</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="training" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <WorkoutTracker clientId={client.id} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Planes Asignados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientPlans.length > 0 ? (
                      <div className="space-y-3">
                        {clientPlans.map(plan => (
                          <div key={plan.id} className="flex justify-between items-center p-2 border rounded-md">
                            <div>
                              <div className="font-medium text-sm">{plan.name}</div>
                              <div className="text-xs text-muted-foreground">{plan.goal}</div>
                            </div>
                            <Button variant="outline" size="sm">Ver Detalles</Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground text-sm mb-4">No hay planes asignados</p>
                        <Button>Asignar Plan</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notas del Entrenador</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium text-sm">Avance en fuerza</div>
                        <div className="text-xs text-muted-foreground">12/04/2023</div>
                      </div>
                      <p className="text-sm">
                        Ha mejorado considerablemente en los ejercicios de pierna. 
                        Aumentamos peso en sentadilla y peso muerto.
                      </p>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium text-sm">Problema en rodilla</div>
                        <div className="text-xs text-muted-foreground">28/03/2023</div>
                      </div>
                      <p className="text-sm">
                        Notó molestia en la rodilla derecha durante las estocadas.
                        Ajustamos la técnica y reducimos peso.
                      </p>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <ScrollText className="mr-2 h-4 w-4" />
                      Añadir Nota
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
