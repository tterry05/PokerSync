import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import supabase from "@/lib/supabaseClient";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsLoginOpen(false);
      toast.success("Logged in successfully");
      navigate(location.pathname); // Refresh current route
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logged out successfully");
      navigate("/"); // Redirect to home
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const publicLinks = [
    { to: "/", label: "Schedule" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  const authenticatedLinks = [
    { to: "/players", label: "Players" },
    { to: "/sessions", label: "Sessions" },
  ];

  const links = [...publicLinks, ...(user ? authenticatedLinks : [])];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-poker-gold">
            PokerSync
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative group"
                >
                  <span className="text-foreground/70 hover:text-foreground transition-colors">
                    {link.label}
                  </span>
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[1.5px] left-0 right-0 h-[2px] bg-poker-gold"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {user ? (
              <Button 
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Login</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <button className="md:hidden">
            <span className="sr-only">Open menu</span>
            {/* Add your menu icon here */}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;