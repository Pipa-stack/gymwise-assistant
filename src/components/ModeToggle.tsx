
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const ModeToggle = () => {
  const { mode, setMode } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const newMode = mode === "trainer" ? "client" : "trainer";
    
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
      
      toast.success(
        `Modo cambiado a: ${newMode === "trainer" ? "Entrenador" : "Cliente"}`,
        {
          position: "bottom-center",
          duration: 3000,
        }
      );
    }, 300);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleMode}
            disabled={isAnimating}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95",
              isAnimating && "animate-pulse"
            )}
            aria-label={`Cambiar a modo ${mode === "trainer" ? "cliente" : "entrenador"}`}
          >
            <div className="relative h-6 w-6 text-primary-foreground">
              {mode === "trainer" ? (
                <User className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isAnimating 
                    ? "opacity-0 rotate-90 scale-0" 
                    : "opacity-100 rotate-0 scale-100"
                )} />
              ) : (
                <Users className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isAnimating 
                    ? "opacity-0 rotate-90 scale-0" 
                    : "opacity-100 rotate-0 scale-100"
                )} />
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          <p>Cambiar a modo {mode === "trainer" ? "Cliente" : "Entrenador"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ModeToggle;
