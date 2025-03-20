
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useAppContext } from "@/context/AppContext";
import ModeToggle from "./ModeToggle";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { loading } = useAppContext();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    setIsPageTransitioning(true);
    const timeout = setTimeout(() => {
      setContent(children);
      setIsPageTransitioning(false);
    }, 200);
    
    return () => clearTimeout(timeout);
  }, [location.pathname, children]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="space-y-2 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={cn(
        "flex-1 px-4 py-6 transition-all duration-300",
        isPageTransitioning ? "opacity-0" : "opacity-100"
      )}>
        <div className="mx-auto w-full max-w-7xl">
          {content}
        </div>
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Layout;
