import { motion } from "framer-motion";
import { useState } from "react";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

type SortType = "wins" | "earnings";

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<SortType>("wins");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from('Players')
        .select('id, name, wins, earnings');

      if (error) {
        console.error("Error fetching games:", error);
      } else {
        setPlayers(data);
      }
    };

    fetchPlayers();
  }, []);

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortBy === "wins") {
      // First sort by wins, then by earnings if wins are equal
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return b.earnings - a.earnings;
    } else {
      // First sort by earnings, then by wins if earnings are equal
      if (b.earnings !== a.earnings) {
        return b.earnings - a.earnings;
      }
      return b.wins - a.wins;
    }
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
          {sortedPlayers.map((player, index) => (
            <LeaderboardCard 
              key={player.id} 
              {...player} 
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;