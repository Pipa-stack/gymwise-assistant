
import FriendProfileCard from "@/components/social/FriendProfileCard";

// Sample data for friends
const sampleFriends = [
  {
    id: "f1",
    username: "stronglifter",
    name: "Javier Martínez",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop",
    location: "Madrid",
    bio: "Apasionado del powerlifting. 3 años de experiencia.",
    workouts: 154,
    followers: 432,
    following: 208,
    isFollowing: true,
    routines: ["Full Body", "Push Pull Legs"],
    socialLinks: {
      instagram: "@stronger_lifter",
      facebook: "javiermartinez.fitness",
      twitter: "@javierfit"
    }
  },
  {
    id: "f2",
    username: "fit_ana",
    name: "Ana García",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
    location: "Barcelona",
    bio: "Entrenadora personal y amante del fitness funcional.",
    workouts: 287,
    followers: 1243,
    following: 365,
    isFollowing: true,
    routines: ["HIIT", "Core Stability"],
    socialLinks: {
      instagram: "@fit_ana",
      facebook: "anagarcia.fit",
      twitter: "@fit_ana"
    }
  },
  {
    id: "f3",
    username: "carlos_runner",
    name: "Carlos Pérez",
    photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=2187&auto=format&fit=crop",
    location: "Valencia",
    bio: "Corredor de maratones y entusiasta de la nutrición deportiva.",
    workouts: 205,
    followers: 876,
    following: 192,
    isFollowing: false,
    routines: ["Running Plan", "Resistance Training"],
    socialLinks: {
      instagram: "@carlos_runs",
      facebook: "carlosperez.runner",
      twitter: "@carlos_runner"
    }
  }
];

const SocialProfileGrid = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Amigos y Compañeros</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleFriends.map(friend => (
          <FriendProfileCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default SocialProfileGrid;
