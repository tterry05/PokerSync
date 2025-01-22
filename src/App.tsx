import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Schedule from "./pages/Schedule";
import Leaderboard from "./pages/Leaderboard";
import Players from "./pages/Players";
import Sessions from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import Error404 from "./pages/Error404";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
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
                <Route path="/session/:sessionId" element={<SessionDetails />} />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </AnimatePresence>
          </div>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;