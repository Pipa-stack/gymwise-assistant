
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { 
  Home, 
  Users, 
  Dumbbell, 
  Calendar, 
  MessageCircle, 
  Menu, 
  X,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { mode } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinksTrainer = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Clientes", path: "/clients", icon: <Users className="h-5 w-5" /> },
    { name: "Planes", path: "/training-plans", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Ejercicios", path: "/exercises", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Calendario", path: "/calendar", icon: <Calendar className="h-5 w-5" /> },
    { name: "Asistente", path: "/chat", icon: <MessageCircle className="h-5 w-5" /> }
  ];

  const navLinksClient = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Mi Perfil", path: "/profile", icon: <User className="h-5 w-5" /> },
    { name: "Mi Plan", path: "/my-plan", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Ejercicios", path: "/exercises", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Calendario", path: "/calendar", icon: <Calendar className="h-5 w-5" /> },
    { name: "Asistente", path: "/chat", icon: <MessageCircle className="h-5 w-5" /> }
  ];

  const navLinks = mode === "trainer" ? navLinksTrainer : navLinksClient;

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-300",
        scrolled 
          ? "bg-background/80 border-b shadow-sm" 
          : "bg-background/50"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary text-primary-foreground">
              <Dumbbell className="absolute inset-0 m-auto h-5 w-5" />
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">
              GymWise
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {mode === "trainer" ? "Entrenador" : "Cliente"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "group flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                location.pathname === link.path
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.icon}
              <span>{link.name}</span>
              {location.pathname === link.path && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-50 origin-top transform bg-background/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out md:hidden",
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0 pointer-events-none"
        )}
      >
        <div className="space-y-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center space-x-2 rounded-md px-4 py-3 text-sm font-medium transition-all",
                location.pathname === link.path
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              )}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
