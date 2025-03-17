
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import ClientCard from "@/components/ClientCard";
import { Client } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, PlusCircle } from "lucide-react";

const Clients = () => {
  const { clients, mode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  const [staggerLoaded, setStaggerLoaded] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (mode !== "trainer") {
      // Redirect or show error if not in trainer mode
      return;
    }

    // Filter clients based on search query
    setFilteredClients(
      clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.goal.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [clients, searchQuery, mode]);

  useEffect(() => {
    // Stagger load animation for client cards
    const timers: NodeJS.Timeout[] = [];
    
    filteredClients.forEach((client, index) => {
      const timer = setTimeout(() => {
        setStaggerLoaded(prev => ({...prev, [client.id]: true}));
      }, 100 + (index * 50));
      
      timers.push(timer);
    });
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [filteredClients]);

  if (mode !== "trainer") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-medium">Solo disponible en modo entrenador</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta sección solo está disponible cuando te encuentras en modo entrenador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <p className="text-muted-foreground">
          Gestiona tus clientes y su progreso.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre u objetivo..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={`transition-all duration-500 ${
                staggerLoaded[client.id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <ClientCard client={client} onClick={() => {}} />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No se encontraron clientes</CardTitle>
            <CardDescription>
              No hay clientes que coincidan con tu búsqueda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <Users className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;
