
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import TrainingPlans from "./pages/TrainingPlans";
import CreateRoutine from "./pages/CreateRoutine";
import Exercises from "./pages/Exercises";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Calendar from "./pages/Calendar";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import GymwiseAssistant from "./pages/GymwiseAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:clientId" element={<ClientDetail />} />
              <Route path="/training-plans" element={<TrainingPlans />} />
              <Route path="/create-routine" element={<CreateRoutine />} />
              <Route path="/create-routine/:routineId" element={<CreateRoutine />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/exercise-library" element={<ExerciseLibrary />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/gymwise-assistant" element={<GymwiseAssistant />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
