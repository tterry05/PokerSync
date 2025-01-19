import { motion } from "framer-motion";
import GameCard from "@/components/schedule/GameCard";

const Index = () => {
  // Temporary mock data - replace with API calls
  const upcomingGames = [
    {
      id: 1,
      date: "2024-04-20",
      time: "19:00",
      location: "John's Place",
      gameType: "Texas Hold'em",
      buyIn: 100,
    },
    {
      id: 2,
      date: "2024-04-27",
      time: "20:00",
      location: "Poker Room",
      gameType: "Omaha",
      buyIn: 200,
    },
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
            Game Schedule
          </span>
          <h1 className="mt-4 text-4xl font-bold">Upcoming Games</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your upcoming poker sessions
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {upcomingGames.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;