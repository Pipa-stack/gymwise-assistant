
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import BookingCalendar from "@/components/BookingCalendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CalendarPage = () => {
  const { mode, clients } = useAppContext();
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    mode === "client" ? clients[0]?.id : undefined
  );
  const navigate = useNavigate();
  
  const handleBookingSuccess = () => {
    console.log("Booking success callback triggered");
    
    // Set a flag in sessionStorage to indicate a booking was just made
    sessionStorage.setItem("justBooked", "true");
    
    // Navigate back to the dashboard
    console.log("Navigating back to home after successful booking");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center">
          <Calendar className="mr-2 h-6 w-6 text-primary" />
          Reserva de Sesiones
        </h2>
        <p className="text-muted-foreground">
          Consulta la disponibilidad y reserva tus sesiones de entrenamiento
        </p>
      </div>

      {mode === "trainer" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Selecciona un Cliente
            </CardTitle>
            <CardDescription>
              Selecciona el cliente para el que deseas reservar una sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`p-4 border rounded-lg flex items-center gap-3 transition-colors ${
                    selectedClientId === client.id 
                      ? "bg-primary/10 border-primary/30" 
                      : "hover:bg-accent"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {client.photo ? (
                      <img src={client.photo} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.email || "Sin email"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Horarios Disponibles
          </CardTitle>
          <CardDescription>
            Selecciona un horario disponible para tu sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingCalendar 
            clientId={selectedClientId} 
            onBookingSuccess={handleBookingSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
