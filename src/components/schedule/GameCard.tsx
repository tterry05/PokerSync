import { motion } from "framer-motion";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { format, parseISO } from "date-fns";

interface GameCardProps {
  date: string;
  time: string;
  location: string;
  gameType: string;
  buyIn: number;
  name: string;
  description?: string;
}

const GameCard = ({ date, time, location, gameType, buyIn, name, description }: GameCardProps) => {
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
          <div className="flex flex-col space-y-2">
            {name && (
              <span className="text-lg font-bold text-foreground">
                {name}
              </span>
            )}
            <span className="text-sm font-medium text-poker-gold px-3 py-1 bg-poker-gold/10 rounded-full">
              {gameType}
            </span>
          </div>
          <span className="text-lg font-bold">${buyIn}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>{format(parseISO(date), "MM/dd/yyyy")}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <ClockIcon className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPinIcon className="w-4 h-4" />
            <span>{location}</span>
          </div>
          {description && (
            <div className="mt-3 border-t pt-2">
              <span className="text-xs font-medium text-muted-foreground">Description:</span>
              <p className="text-sm text-foreground mt-1">{description}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;