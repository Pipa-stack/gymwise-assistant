
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Search, PlusCircle, Calendar, List, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TrainingPlans = () => {
  const { mode, trainingPlans, clients } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlans, setFilteredPlans] = useState(trainingPlans);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loaded, setLoaded] = useState(false);

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

  if (mode !== "trainer") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-medium">Solo disponible en modo entrenador</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta sección solo está disponible cuando te encuentras en modo entrenador.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to get client name
  const getClientName = (clientId: string | undefined) => {
    if (!clientId) return "Sin asignar";
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente desconocido";
  };

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
            <Button className="w-full sm:w-auto whitespace-nowrap">
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
                      Cliente: {getClientName(plan.clientId)}
                    </div>
                  )}
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
                    Cliente: {getClientName(plan.clientId)}
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
    </div>
  );
};

export default TrainingPlans;
