
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";

const appointments = [
  {
    id: 1,
    client: "Carlos Ruiz",
    date: addDays(new Date(), 1),
    time: "09:00 - 10:00",
    type: "Personal Training"
  },
  {
    id: 2,
    client: "Laura Méndez",
    date: addDays(new Date(), 2),
    time: "15:30 - 16:30",
    type: "Assessment"
  },
  {
    id: 3,
    client: "Sergio González",
    date: addDays(new Date(), 3),
    time: "18:00 - 19:00",
    type: "Personal Training"
  },
  {
    id: 4,
    client: "María Jiménez",
    date: new Date(),
    time: "11:00 - 12:00",
    type: "Personal Training"
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<string>("day");

  // Filter appointments for the selected date
  const filteredAppointments = appointments.filter(
    appointment => 
      date && 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        <Select value={view} onValueChange={setView}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Vista diaria</SelectItem>
            <SelectItem value="week">Vista semanal</SelectItem>
            <SelectItem value="month">Vista mensual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>Selecciona una fecha para ver tus citas</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Citas</CardTitle>
              <CardDescription>
                {date ? (
                  <>
                    {date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </>
                ) : (
                  "Selecciona una fecha"
                )}
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex gap-1 items-center">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{filteredAppointments.length} citas</span>
            </Badge>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{appointment.client}</div>
                        <div className="text-sm text-muted-foreground">{appointment.time}</div>
                      </div>
                    </div>
                    <Badge>{appointment.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No hay citas programadas para esta fecha</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
