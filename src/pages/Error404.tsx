import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <span className="text-sm font-medium text-poker-gold px-3 py-1 bg-poker-gold/10 rounded-full">
          404 Error
        </span>
        <h1 className="mt-4 text-4xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button onClick={() => navigate("/")}>
          Return Home
        </Button>
      </motion.div>
    </div>
  );
};

export default Error404;
