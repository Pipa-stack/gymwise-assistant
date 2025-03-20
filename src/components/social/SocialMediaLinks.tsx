
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Twitter } from "lucide-react";

interface SocialMediaLinksProps {
  isEditing: boolean;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SocialMediaLinks = ({ isEditing, socialLinks, onChange }: SocialMediaLinksProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Redes Sociales</h4>
      
      {isEditing ? (
        <>
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-pink-500" />
            <Input 
              name="instagram"
              value={socialLinks.instagram}
              onChange={onChange}
              placeholder="Usuario de Instagram"
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Facebook className="h-4 w-4 text-blue-600" />
            <Input 
              name="facebook"
              value={socialLinks.facebook}
              onChange={onChange}
              placeholder="Usuario de Facebook"
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Twitter className="h-4 w-4 text-sky-500" />
            <Input 
              name="twitter"
              value={socialLinks.twitter}
              onChange={onChange}
              placeholder="Usuario de Twitter"
              className="text-sm"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-2">
          {socialLinks.instagram && (
            <a href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 hover:text-pink-500 transition-colors">
              <Instagram className="h-4 w-4 text-pink-500" />
              <span>{socialLinks.instagram}</span>
            </a>
          )}
          {socialLinks.facebook && (
            <a href={`https://facebook.com/${socialLinks.facebook}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Facebook className="h-4 w-4 text-blue-600" />
              <span>{socialLinks.facebook}</span>
            </a>
          )}
          {socialLinks.twitter && (
            <a href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 hover:text-sky-500 transition-colors">
              <Twitter className="h-4 w-4 text-sky-500" />
              <span>{socialLinks.twitter}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialMediaLinks;
