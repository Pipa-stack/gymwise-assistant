
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { generateProgressSummary } from "@/utils/progressUtils";
import { ClientHeader } from "@/components/client-detail/ClientHeader";
import { ClientProfile } from "@/components/client-detail/ClientProfile";
import { ClientProgress } from "@/components/client-detail/ClientProgress";

const ClientDetail = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, mode } = useAppContext();
  
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
  
  const latestProgress = client.progress && client.progress.length > 0 
    ? client.progress[client.progress.length - 1] 
    : null;
  
  const progressSummary = generateProgressSummary(client);

  return (
    <div className="space-y-6">
      <ClientHeader />
      
      <div className="flex flex-col md:flex-row gap-6">
        <ClientProfile client={client} latestProgress={latestProgress} />
        
        <div className="md:w-2/3">
          <ClientProgress client={client} progressSummary={progressSummary} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
