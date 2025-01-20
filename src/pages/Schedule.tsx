import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameCard from "@/components/schedule/GameCard";
import { format, isFuture, parseISO } from "date-fns";
import supabase from "../lib/supabaseClient";

const Index = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('Sessions')
        .select('id, date, time, location, gameType, buyIn, name');

      if (error) {
        console.error("Error fetching games:", error);
      } else {
        setGames(data);
      }
    };

    fetchGames();
  }, []);

  const sortedGames = [...games].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const futureGames = sortedGames.filter(game => 
    isFuture(parseISO(`${game.date}T${game.time}`))
  );

  const pastGames = sortedGames.filter(game => 
    !isFuture(parseISO(`${game.date}T${game.time}`))
  ).reverse(); // Most recent first

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-poker-gold px-3 py-1 bg-poker-gold/10 rounded-full">
            Game Schedule
          </span>
          <h1 className="mt-4 text-4xl font-bold">Upcoming Games</h1>
          <p className="mt-2 text-muted-foreground">
            View upcoming poker sessions
          </p>
        </motion.div>

        {futureGames.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Games</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {futureGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </div>
        )}

        {pastGames.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-2xl font-semibold">Past Games</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {pastGames.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;