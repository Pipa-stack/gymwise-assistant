
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Instagram, Facebook, Twitter } from "lucide-react";

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

interface Friend {
  id: string;
  username: string;
  name: string;
  photo: string;
  location: string;
  bio: string;
  workouts: number;
  followers: number;
  following: number;
  isFollowing: boolean;
  routines: string[];
  socialLinks?: SocialLinks;
}

interface FriendProfileCardProps {
  friend: Friend;
}

const FriendProfileCard = ({ friend }: FriendProfileCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
            <img
              src={friend.photo}
              alt={friend.username}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{friend.username}</h2>
              <p className="text-sm text-muted-foreground">{friend.name}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{friend.location}</span>
              </div>
              <p className="mt-2">{friend.bio}</p>
            </div>
            
            <div className="flex justify-around sm:justify-start sm:gap-12">
              <div className="text-center">
                <div className="font-semibold">{friend.workouts}</div>
                <div className="text-sm text-muted-foreground">Entrenamientos</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{friend.followers}</div>
                <div className="text-sm text-muted-foreground">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{friend.following}</div>
                <div className="text-sm text-muted-foreground">Siguiendo</div>
              </div>
            </div>
            
            {friend.socialLinks && (
              <div className="flex justify-center sm:justify-start space-x-3 pt-2">
                {friend.socialLinks.instagram && (
                  <a 
                    href={`https://instagram.com/${friend.socialLinks.instagram.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {friend.socialLinks.facebook && (
                  <a 
                    href={`https://facebook.com/${friend.socialLinks.facebook}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {friend.socialLinks.twitter && (
                  <a 
                    href={`https://twitter.com/${friend.socialLinks.twitter.replace('@', '')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-500 hover:text-sky-600 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div>
            <Button
              className="w-full sm:w-auto"
              variant={friend.isFollowing ? "outline" : "default"}
            >
              {friend.isFollowing ? "Siguiendo" : "Seguir"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendProfileCard;
