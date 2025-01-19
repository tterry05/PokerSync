import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Schedule from "./pages/Schedule";
import Leaderboard from "./pages/Leaderboard";
import Players from "./pages/Players";
import Sessions from "./pages/Sessions";

const queryClient = new QueryClient();

// TODO: Replace with actual auth check
const isAdmin = () => {
  // This should be replaced with actual auth logic
  return localStorage.getItem("isAdmin") === "true";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Schedule />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route 
                path="/players" 
                element={
                  <ProtectedRoute>
                    <Players />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sessions" 
                element={
                  <ProtectedRoute>
                    <Sessions />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;