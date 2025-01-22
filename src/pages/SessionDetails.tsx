import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Error404 from "./Error404";

export default function SessionDetails() {
  const { sessionId } = useParams();
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [buyIn, setBuyIn] = useState('');
  const [cashOutAmount, setCashOutAmount] = useState({});
  const [rebuyAmount, setRebuyAmount] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    fetchSession();
    fetchSessionPlayers();
    fetchAvailablePlayers();
  }, [sessionId]);

  useEffect(() => {
    if (session) {
      setBuyIn(session.buyIn.toString());
    }
  }, [session]);

  const fetchSession = async () => {
    const { data, error } = await supabase
      .from('Sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error || !data) {
      setNotFound(true);
    } else {
      setSession(data);
    }
  };

const fetchAvailablePlayers = async () => {
    const { data: sessionPlayersData } = await supabase
        .from('Session_players')
        .select('player_id')
        .eq('session_id', sessionId);

    const sessionPlayerIds = sessionPlayersData.map(player => player.player_id);

    const { data, error } = await supabase
        .from('Players')
        .select('id, name')
        .not('id', 'in', `(${sessionPlayerIds.join(',')})`)
        .order('name');
    
    if (error) {
        toast({
            title: "Error",
            description: "Failed to fetch players",
            variant: "destructive",
        });
    } else {
        setPlayers(data || []);
    }
};

  const fetchSessionPlayers = async () => {
    const { data, error } = await supabase
      .from('Session_players')
      .select(`
        id,
        player_id,
        initial_buy_in,
        total_buy_in,
        cash_out,
        status,
        Players (id, name)
      `)
      .eq('session_id', sessionId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch session players",
        variant: "destructive",
      });
    } else {
      setSessionPlayers(data || []);
    }
  };

  const addPlayerToSession = async () => {
    if (!selectedPlayer || !buyIn) {
      toast({
        title: "Error",
        description: "Please select a player and enter buy-in amount",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await supabase
      .from('Session_players')
      .insert({
        session_id: sessionId,
        player_id: selectedPlayer,
        initial_buy_in: parseFloat(buyIn),
        total_buy_in: parseFloat(buyIn),
        status: 'playing'
      });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add player to session",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Player added to session",
      });
      fetchSessionPlayers();
      setSelectedPlayer(null);
      setPlayers(players.filter(player => player.id !== selectedPlayer));
      setBuyIn('');
    }
  };

  const updateCashOut = async (playerId, amount) => {
    const { error: sessionError } = await supabase
      .from('Session_players')
      .update({
        cash_out: parseInt(amount),
        status: 'completed'
      })
      .match({ session_id: sessionId, player_id: playerId });
    
    if (sessionError) {
      toast({
        title: "Error",
        description: "Failed to update cash out amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Cash out updated",
    });
    fetchSessionPlayers();
  };

  const handleCashOut = async (playerId) => {
    if (!cashOutAmount[playerId]) return;
    await updateCashOut(playerId, cashOutAmount[playerId]);
    setCashOutAmount(prev => ({ ...prev, [playerId]: '' }));
  };

  const handleRebuy = async (playerId, currentTotal) => {
    if (!rebuyAmount[playerId]) return;
    
    const { error } = await supabase
      .from('Session_players')
      .update({
        total_buy_in: currentTotal + parseFloat(rebuyAmount[playerId])
      })
      .match({ session_id: sessionId, player_id: playerId });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to process rebuy",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Rebuy processed successfully",
      });
      fetchSessionPlayers();
      setRebuyAmount(prev => ({ ...prev, [playerId]: '' }));
    }
  };

  if (notFound) {
    return <Error404 />;
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-2 sm:pt-20 sm:pb-12 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        {session && (
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">{session.name}</h1>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8">
              <div>
                <p className="text-muted-foreground">Date: {session.date}</p>
                <p className="text-muted-foreground">Time: {session.time}</p>
                <p className="text-muted-foreground">Location: {session.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Game Type: {session.gameType}</p>
                <p className="text-muted-foreground">Buy In: ${session.buyIn}</p>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Add Player</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select onValueChange={setSelectedPlayer}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Buy-In Amount"
                value={buyIn}
                onChange={(e) => setBuyIn(e.target.value)}
              />
              <Button onClick={addPlayerToSession}>Add Player</Button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Players</h2>
          <div className="space-y-2 sm:space-y-4">
            {sessionPlayers.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 border rounded-lg">
                <div className="w-full sm:flex-1">
                  <p className="font-medium text-lg">{player.Players.name}</p>
                  <div className="grid grid-cols-2 gap-x-4 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Initial Buy-in: ${player.initial_buy_in}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Buy-in: ${player.total_buy_in}
                    </p>
                    {player.cash_out !== null && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Cash-out: ${player.cash_out}
                        </p>
                        {player.status === 'completed' && (
                          <p className={`text-sm font-medium ${
                            player.cash_out - player.total_buy_in > 0 
                              ? 'text-green-600' 
                              : player.cash_out - player.total_buy_in < 0 
                                ? 'text-red-600' 
                                : 'text-muted-foreground'
                          }`}>
                            Profit: ${player.cash_out - player.total_buy_in}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {isAuthenticated && player.status === 'playing' && (
                  <div className="flex flex-col w-full sm:w-auto gap-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Rebuy amount"
                        value={rebuyAmount[player.player_id] || ''}
                        onChange={(e) => setRebuyAmount(prev => ({
                          ...prev,
                          [player.player_id]: e.target.value
                        }))}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => handleRebuy(player.player_id, player.total_buy_in)}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        Rebuy
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Cash-out amount"
                        value={cashOutAmount[player.player_id] || ''}
                        onChange={(e) => setCashOutAmount(prev => ({
                          ...prev,
                          [player.player_id]: e.target.value
                        }))}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => handleCashOut(player.player_id)}
                        className="whitespace-nowrap"
                      >
                        Cash Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
