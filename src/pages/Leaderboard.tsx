import { motion } from "framer-motion";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";

const Leaderboard = () => {
  // Temporary mock data - replace with API calls
  const players = [
    { id: 1, rank: 1, name: "Alex Smith", wins: 15, totalEarnings: 5000 },
    { id: 2, rank: 2, name: "Sarah Johnson", wins: 12, totalEarnings: 4200 },
    { id: 3, rank: 3, name: "Mike Brown", wins: 10, totalEarnings: 3800 },
    { id: 4, rank: 4, name: "Emma Davis", wins: 8, totalEarnings: 3000 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-poker-gold px-3 py-1 bg-poker-gold/10 rounded-full">
            Rankings
          </span>
          <h1 className="mt-4 text-4xl font-bold">Leaderboard</h1>
          <p className="mt-2 text-muted-foreground">
            Track player performance and rankings
          </p>
        </motion.div>

        <div className="space-y-4">
          {players.map((player) => (
            <LeaderboardCard key={player.id} {...player} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;