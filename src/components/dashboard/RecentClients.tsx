
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientCard from "@/components/ClientCard";
import { Client } from "@/context/AppContext";

interface RecentClientsProps {
  clients: Client[];
}

const RecentClients = ({ clients }: RecentClientsProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>Clientes Recientes</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
          Ver Todos
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
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
