import { motion } from "framer-motion";
import GameCard from "@/components/schedule/GameCard";
import { format, isFuture, parseISO } from "date-fns";

const Index = () => {
  // Temporary mock data - replace with API calls
  const games = [
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
      date: "2024-01-15", // Past date
      time: "20:00",
      location: "Poker Room",
      gameType: "Omaha",
      buyIn: 200,
    },
  ];

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