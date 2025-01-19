import { motion } from "framer-motion";
import { useState } from "react";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import { Button } from "@/components/ui/button";

type SortType = "wins" | "earnings";

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<SortType>("wins");

  // Temporary mock data - replace with API calls
  const players = [
    { id: 1, rank: 1, name: "Alex Smith", wins: 15, totalEarnings: 5000 },
    { id: 2, rank: 2, name: "Sarah Johnson", wins: 12, totalEarnings: 4200 },
    { id: 3, rank: 3, name: "Mike Brown", wins: 10, totalEarnings: 3800 },
    { id: 4, rank: 4, name: "Emma Davis", wins: 8, totalEarnings: 3000 },
  ];

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === "wins") {
      return b.wins - a.wins;
    }
    return b.totalEarnings - a.totalEarnings;
  }).map((player, index) => ({ ...player, rank: index + 1 }));

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

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={sortBy === "wins" ? "default" : "outline"}
            onClick={() => setSortBy("wins")}
          >
            Sort by Wins
          </Button>
          <Button
            variant={sortBy === "earnings" ? "default" : "outline"}
            onClick={() => setSortBy("earnings")}
          >
            Sort by Earnings
          </Button>
        </div>

        <div className="space-y-4">
          {sortedPlayers.map((player) => (
            <LeaderboardCard key={player.id} {...player} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;