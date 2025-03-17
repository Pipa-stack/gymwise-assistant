
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Calendar, BarChart2 } from "lucide-react";
import FriendProfileCard from "@/components/social/FriendProfileCard";
import WorkoutTimeChart from "@/components/social/WorkoutTimeChart";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockFriends = [
  {
    id: "1",
    username: "strongdavid",
    name: "David García",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    location: "San Francisco",
    bio: "Trying to gain muscle!",
    workouts: 56,
    followers: 72,
    following: 55,
    isFollowing: true,
    routines: [
      "Chest and Triceps Day",
      "Back and Biceps Day",
      "Legs and Abs",
      "Core Routine"
    ]
  },
  {
    id: "2",
    username: "fitanna",
    name: "Ana López",
    photo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    location: "Madrid",
    bio: "Fitness instructor & nutrition coach",
    workouts: 124,
    followers: 845,
    following: 200,
    isFollowing: false,
    routines: [
      "HIIT Cardio",
      "Full Body Workout",
      "Active Recovery"
    ]
  },
  {
    id: "3",
    username: "powerlifter_mike",
    name: "Miguel Torres",
    photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3",
    location: "Barcelona",
    bio: "Powerlifting athlete | Personal trainer",
    workouts: 87,
    followers: 315,
    following: 112,
    isFollowing: true,
    routines: [
      "Squat Day",
      "Bench Day",
      "Deadlift Day",
      "Accessory Work"
    ]
  }
];

const Social = () => {
  const [selectedFriend, setSelectedFriend] = useState(mockFriends[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = mockFriends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Comunidad Social</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Sigue a tus Amigos
              </CardTitle>
              <CardDescription>Encuentra y sigue a otros atletas</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredFriends.map(friend => (
                    <div 
                      key={friend.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedFriend.id === friend.id ? 'bg-accent' : 'hover:bg-muted'}`}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                          <img 
                            src={friend.photo} 
                            alt={friend.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{friend.username}</div>
                          <div className="text-sm text-muted-foreground truncate">{friend.name}</div>
                        </div>
                        {friend.isFollowing && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Siguiendo
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <FriendProfileCard friend={selectedFriend} />
          
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>Horas de entrenamiento por semana</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkoutTimeChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Rutinas
                </CardTitle>
                <CardDescription>Rutinas de entrenamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedFriend.routines.map((routine, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                      <h3 className="font-medium">{index + 1}. {routine}</h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
