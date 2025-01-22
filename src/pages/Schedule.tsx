import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameCard from "@/components/schedule/GameCard";
import { format, isFuture, parseISO } from "date-fns";
import supabase from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetchSessionsWithPlayers = async () => {
      // First fetch all sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('Sessions')
        .select('*')
        .gte('date', currentDate);

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        return;
      }

      // Then fetch players for each session
      const sessionsWithPlayers = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: playerData, error: playerError } = await supabase
            .from('Session_players')
            .select(`
              Players (
                id,
                name
              )
            `)
            .eq('session_id', session.id);

          if (playerError) {
            console.error("Error fetching players for session:", playerError);
            return session;
          }

          return {
            ...session,
            players: playerData
              ?.map(sp => sp.Players)
              .filter(Boolean)
          };
        })
      );

      setGames(sessionsWithPlayers);
    };

    fetchSessionsWithPlayers();
  }, [currentDate]);

  const sortedGames = [...games].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const futureGames = sortedGames.filter(game => 
    isFuture(parseISO(`${game.date}T${game.time}`))
  );

  const pastGames = sortedGames.filter(game => 
    !isFuture(parseISO(`${game.date}T${game.time}`))
  ).reverse(); // Most recent first

  const handleGameClick = (gameId) => {
    navigate(`/session/${gameId}`);
  };

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
                <div key={game.id} onClick={() => handleGameClick(game.id)} className="cursor-pointer">
                  <GameCard {...game} players={game.players} />
                </div>
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
                <GameCard key={game.id} {...game} players={game.players} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;