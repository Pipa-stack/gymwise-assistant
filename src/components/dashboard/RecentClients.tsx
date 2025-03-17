
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientCard from "@/components/ClientCard";
import { Client } from "@/context/AppContext";

interface RecentClientsProps {
  clients: Client[];
}

const RecentClients = ({ clients }: RecentClientsProps) => {
  const navigate = useNavigate();
  const [recentLoaded, setRecentLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading effect for recent clients
    const timer = setTimeout(() => {
      setRecentLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="md:col-span-8 lg:col-span-12 animate-slide-in-up [animation-delay:700ms]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Clientes Recientes</CardTitle>
          <CardDescription>Los últimos clientes añadidos</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
          Ver Todos
        </Button>
      </CardHeader>
      <CardContent>
        <div className={`space-y-3 transition-opacity duration-500 ${recentLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {clients.slice(0, 3).map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => navigate(`/clients/${client.id}`)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentClients;
