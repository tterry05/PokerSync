import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface LeaderboardCardProps {
  rank: number;
  name: string;
  wins: number;
  totalEarnings: number;
  avatarUrl?: string;
}

const LeaderboardCard = ({ rank, name, wins, totalEarnings, avatarUrl }: LeaderboardCardProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-poker-gold";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-700";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-background/50 backdrop-blur-lg border border-border rounded-lg p-4 flex items-center space-x-4"
    >
      <div className={`text-2xl font-bold ${getRankColor(rank)} w-8`}>
        {rank <= 3 ? <Trophy className="w-6 h-6" /> : rank}
      </div>
      
      <div className="flex-1 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-medium">{name[0]}</span>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{wins} wins</p>
        </div>
        
        <div className="text-right">
          <p className="font-medium">${totalEarnings}</p>
          <p className="text-sm text-muted-foreground">Total earnings</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardCard;