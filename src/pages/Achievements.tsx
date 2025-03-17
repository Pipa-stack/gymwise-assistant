
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Medal, Star, Trophy, Users, TrendingUp, Target, Clock } from "lucide-react";

// Types for achievement data
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  date?: string;
  clientId?: string;
  progress?: number;
  isUnlocked: boolean;
}

const Achievements = () => {
  const { clients } = useAppContext();
  const [activeTab, setActiveTab] = useState("trainer");

  // Sample trainer achievements
  const trainerAchievements: Achievement[] = [
    {
      id: "ta1",
      title: "Entrenador Estrella",
      description: "Alcanza una valoración media de 4.5 estrellas de tus clientes",
      icon: <Star className="h-10 w-10 text-yellow-400" />,
      progress: 85,
      isUnlocked: true
    },
    {
      id: "ta2",
      title: "Mentor de Campeones",
      description: "Ayuda a 5 clientes a alcanzar sus objetivos principales",
      icon: <Trophy className="h-10 w-10 text-amber-500" />,
      progress: 60,
      isUnlocked: false
    },
    {
      id: "ta3",
      title: "Experto en Nutrición",
      description: "Crea 10 planes de nutrición personalizados",
      icon: <Award className="h-10 w-10 text-emerald-500" />,
      progress: 40,
      isUnlocked: false
    },
    {
      id: "ta4",
      title: "Constructor de Comunidad",
      description: "Alcanza los 20 clientes activos",
      icon: <Users className="h-10 w-10 text-blue-500" />,
      progress: 15,
      isUnlocked: false
    },
    {
      id: "ta5",
      title: "Maestro de la Constancia",
      description: "Mantén una tasa de asistencia del 90% en tus sesiones durante 3 meses",
      icon: <Clock className="h-10 w-10 text-indigo-500" />,
      progress: 75,
      isUnlocked: false
    }
  ];

  // Sample client achievements based on existing clients
  const clientAchievements: Achievement[] = clients.flatMap(client => [
    {
      id: `ca1-${client.id}`,
      title: "Primer Objetivo",
      description: `${client.name} ha alcanzado su primer objetivo de entrenamiento`,
      icon: <Target className="h-10 w-10 text-green-500" />,
      clientId: client.id,
      date: "2023-11-15",
      isUnlocked: Math.random() > 0.5
    },
    {
      id: `ca2-${client.id}`,
      title: "Progreso Constante",
      description: `${client.name} ha mantenido una progresión durante 8 semanas`,
      icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
      clientId: client.id,
      date: "2023-12-01",
      isUnlocked: Math.random() > 0.7
    }
  ]);

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Logros y Reconocimientos</h1>
            <p className="text-muted-foreground">
              Sigue tu progreso y celebra tus éxitos como entrenador
            </p>
          </div>
          
          <Tabs defaultValue="trainer" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="trainer">Mis Logros</TabsTrigger>
              <TabsTrigger value="clients">Logros de Clientes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6">
          {activeTab === "trainer" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainerAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clientAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const { clients } = useAppContext();
  const client = achievement.clientId 
    ? clients.find(c => c.id === achievement.clientId) 
    : undefined;

  return (
    <Card className={`border overflow-hidden transition-all duration-300 ${
      achievement.isUnlocked 
        ? "bg-gradient-to-br from-background to-primary/5" 
        : "bg-muted/30 opacity-75"
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {achievement.title}
              {achievement.isUnlocked && (
                <Medal className="h-4 w-4 text-yellow-500" />
              )}
            </CardTitle>
            <CardDescription>
              {client ? `Cliente: ${client.name}` : null}
              {achievement.date && ` • ${new Date(achievement.date).toLocaleDateString('es-ES')}`}
            </CardDescription>
          </div>
          <div className={`p-2 rounded-full ${
            achievement.isUnlocked 
              ? "bg-primary/10" 
              : "bg-muted/50"
          }`}>
            {achievement.icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        
        {achievement.progress !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progreso</span>
              <span className="font-medium">{achievement.progress}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  achievement.isUnlocked ? "bg-primary" : "bg-muted"
                }`}
                style={{ width: `${achievement.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Achievements;
