import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Schedule" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/players", label: "Players" },
    { to: "/sessions", label: "Sessions" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-poker-gold">
            PokerSync
          </Link>
          <div className="hidden md:flex space-x-8">
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