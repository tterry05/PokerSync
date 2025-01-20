import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Save, X } from "lucide-react";
import supabase from "@/lib/supabaseClient";

interface Player {
  id: string;
  name: string;
  earnings: number;
  wins: number;
}

const PlayerList = forwardRef((props, ref) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEarnings, setEditEarnings] = useState(0);
  const [editWins, setEditWins] = useState(0);
  const [loading, setLoading] = useState(true);

  useImperativeHandle(ref, () => ({
    fetchPlayers
  }));

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('Players')
        .select('id, name, earnings, wins')
        .order('earnings', { ascending: false }); // Change to false for descending order

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditEarnings(player.earnings);
    setEditWins(player.wins);
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Players')
        .update({
          name: editName,
          earnings: editEarnings,
          wins: editWins
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPlayers(); // Refresh the list
      setEditingId(null);
      toast.success("Player updated successfully");
    } catch (error) {
      console.error("Error updating player:", error);
      toast.error("Failed to update player");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Players')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPlayers(); // Refresh the list
      toast.success("Player deleted successfully");
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player");
    }
  };

  if (loading) {
    return <div>Loading players...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-3 gap-8 px-4 py-2 font-semibold text-black">
          <div>Name</div>
          <div>Money</div>
          <div>Wins</div>
        </div>
        <div className="w-[88px]"></div>

        {players.map(player => (
          <div
            key={player.id}
            className="col-span-2 flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            {editingId === player.id ? (
              <div className="grid grid-cols-3 gap-8 flex-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
                <Input
                  type="number"
                  value={editEarnings}
                  onChange={(e) => setEditEarnings(Number(e.target.value))}
                  placeholder="Money"
                />
                <Input
                  type="number"
                  value={editWins}
                  onChange={(e) => setEditWins(Number(e.target.value))}
                  placeholder="Wins"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-8 flex-1">
                <span>{player.name}</span>
                <span>${player.earnings.toLocaleString()}</span>
                <span>{player.wins} wins</span>
              </div>
            )}
            
            <div className="flex gap-2 ml-4">
              {editingId === player.id ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSave(player.id)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(player)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(player.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PlayerList.displayName = "PlayerList";
export default PlayerList;