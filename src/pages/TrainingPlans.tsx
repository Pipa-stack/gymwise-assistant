
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dumbbell, Search, PlusCircle, Calendar, List, Users, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ExerciseViewer from "@/components/ExerciseViewer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

// Esquema de validación para el formulario de plan
const planFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres" }),
  goal: z.string().min(1, { message: "Debes seleccionar un objetivo" }),
  duration: z.coerce.number().min(1, { message: "La duración debe ser al menos 1 semana" }).max(52, { message: "La duración máxima es 52 semanas" }),
  clientId: z.string().optional(),
});

const TrainingPlans = () => {
  const { mode, trainingPlans, clients, setTrainingPlans } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlans, setFilteredPlans] = useState(trainingPlans);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loaded, setLoaded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Configuración del formulario
  const form = useForm<z.infer<typeof planFormSchema>>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      description: "",
      goal: "",
      duration: 4,
      clientId: "",
    },
  });

  useEffect(() => {
    // Filter training plans based on search query and active tab
    const filtered = trainingPlans.filter((plan) => {
      const matchesSearch = 
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.goal.toLowerCase().includes(searchQuery.toLowerCase());
        
      if (activeTab === "all") return matchesSearch;
      if (activeTab === "templates") return matchesSearch && !plan.clientId;
      if (activeTab === "assigned") return matchesSearch && !!plan.clientId;
      
      return matchesSearch;
    });
    
    setFilteredPlans(filtered);
  }, [trainingPlans, searchQuery, activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Obtener el plan seleccionado
  const selectedPlanData = trainingPlans.find(plan => plan.id === selectedPlan);

  // Manejar la creación de un nuevo plan
  const onSubmit = (data: z.infer<typeof planFormSchema>) => {
    // Crear un nuevo ID único para el plan
    const newPlanId = `p${Date.now()}`;
    
    // Crear el nuevo plan
    const newPlan = {
      id: newPlanId,
      name: data.name,
      description: data.description,
      goal: data.goal,
      duration: data.duration,
      createdAt: new Date().toISOString().split('T')[0],
      clientId: data.clientId || undefined,
      workouts: [],
    };
    
    // Actualizar el estado de los planes
    setTrainingPlans([...trainingPlans, newPlan]);
    
    // Cerrar el diálogo y resetear el formulario
    setIsCreateDialogOpen(false);
    form.reset();
    
    // Mostrar mensaje de éxito
    toast({
      title: "Plan creado",
      description: `El plan "${data.name}" ha sido creado correctamente.`,
    });
  };

  // Pantalla para modo cliente
  if (mode === "client") {
    const clientPlans = trainingPlans.filter(
      plan => plan.clientId === clients[0]?.id
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Mi Plan de Entrenamiento</h2>
          <p className="text-muted-foreground">
            Consulta tu plan de entrenamiento personalizado
          </p>
        </div>

        {clientPlans.length > 0 ? (
          <div className="grid gap-6">
            <ExerciseViewer clientId={clients[0]?.id} />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Plan de Entrenamiento</CardTitle>
              <CardDescription>No tienes ningún plan de entrenamiento asignado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <Dumbbell className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
                <p className="text-muted-foreground">
                  Todavía no tienes un plan de entrenamiento asignado
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Pantalla para modo entrenador
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Planes de Entrenamiento</h2>
        <p className="text-muted-foreground">
          Crea y gestiona planes de entrenamiento para tus clientes.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1.5">
              <List className="h-4 w-4" />
              <span>Todos</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4" />
              <span>Plantillas</span>
            </TabsTrigger>
            <TabsTrigger value="assigned" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Asignados</span>
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar planes..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="w-full sm:w-auto whitespace-nowrap"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </div>
        </div>

        <TabsContent 
          value="all" 
          className={cn(
            "grid gap-4 sm:grid-cols-2 transition-all duration-500",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <Card key={plan.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {plan.goal}
                    </Badge>
                    {plan.clientId && (
                      <Badge variant="secondary">Asignado</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration} semanas</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{plan.workouts.length} sesiones</span>
                    </div>
                  </div>
                  {plan.clientId && (
                    <div className="mt-3 text-sm font-medium">
                      Cliente: {clients.find(c => c.id === plan.clientId)?.name || "Desconocido"}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary/5 transition-colors duration-300"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <span>Ver detalles</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>No se encontraron planes</CardTitle>
                <CardDescription>
                  No hay planes que coincidan con tu búsqueda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6">
                  <Dumbbell className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent 
          value="templates" 
          className={cn(
            "grid gap-4 sm:grid-cols-2 transition-all duration-500",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {filteredPlans.filter(plan => !plan.clientId).length > 0 ? (
            filteredPlans.filter(plan => !plan.clientId).map((plan) => (
              <Card key={plan.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {plan.goal}
                  </Badge>
                  <CardTitle className="mt-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration} semanas</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{plan.workouts.length} sesiones</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5 transition-colors duration-300">
                    <span>Ver detalles</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>No se encontraron plantillas</CardTitle>
                <CardDescription>
                  No hay plantillas de entrenamiento que coincidan con tu búsqueda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6">
                  <Dumbbell className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent 
          value="assigned" 
          className={cn(
            "grid gap-4 sm:grid-cols-2 transition-all duration-500",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {filteredPlans.filter(plan => !!plan.clientId).length > 0 ? (
            filteredPlans.filter(plan => !!plan.clientId).map((plan) => (
              <Card key={plan.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {plan.goal}
                    </Badge>
                    <Badge variant="secondary">Asignado</Badge>
                  </div>
                  <CardTitle className="mt-2">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{plan.duration} semanas</span>
                    </div>
                    <div className="flex items-center">
                      <Dumbbell className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{plan.workouts.length} sesiones</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-medium">
                    Cliente: {clients.find(c => c.id === plan.clientId)?.name || "Desconocido"}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5 transition-colors duration-300">
                    <span>Ver detalles</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>No se encontraron planes asignados</CardTitle>
                <CardDescription>
                  No hay planes asignados a clientes que coincidan con tu búsqueda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6">
                  <Users className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo para mostrar detalles del plan */}
      <Dialog
        open={!!selectedPlan}
        onOpenChange={(open) => {
          if (!open) setSelectedPlan(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl sm:max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Plan de Entrenamiento</DialogTitle>
          </DialogHeader>
          <ExerciseViewer planId={selectedPlan || undefined} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear un nuevo plan */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Plan de Entrenamiento</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Plan</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Plan de hipertrofia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe el objetivo y estructura del plan..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un objetivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Hipertrofia">Hipertrofia</SelectItem>
                          <SelectItem value="Fuerza">Fuerza</SelectItem>
                          <SelectItem value="Resistencia">Resistencia</SelectItem>
                          <SelectItem value="Pérdida de peso">Pérdida de peso</SelectItem>
                          <SelectItem value="Definición">Definición</SelectItem>
                          <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración (semanas)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="52" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente (opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente o deja vacío para crear una plantilla" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Ninguno (Plantilla)</SelectItem>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Si no asignas un cliente, este plan se guardará como plantilla
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  form.reset();
                }}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Plan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingPlans;
