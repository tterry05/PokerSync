import { motion } from "framer-motion";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

interface GameCardProps {
  date: string;
  time: string;
  location: string;
  gameType: string;
  buyIn: number;
}

const GameCard = ({ date, time, location, gameType, buyIn }: GameCardProps) => {
  const formattedTime = format(parseISO(`${date}T${time}`), "EEEE hh:mm a");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-background/50 backdrop-blur-lg border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-poker-gold px-3 py-1 bg-poker-gold/10 rounded-full">
            {gameType}
          </span>
          <span className="text-lg font-bold">${buyIn}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPinIcon className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;