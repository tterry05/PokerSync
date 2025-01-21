import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Save, X } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
  const [editEarnings, setEditEarnings] = useState<number | null>(0);
  const [editWins, setEditWins] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

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
    setEditEarnings(player.earnings || null);
    setEditWins(player.wins || null);
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Players')
        .update({
          name: editName,
          earnings: editEarnings ?? 0,
          wins: editWins ?? 0
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

  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;
    
    try {
      const { error } = await supabase
        .from('Players')
        .delete()
        .eq('id', playerToDelete.id);

      if (error) throw error;
      
      await fetchPlayers();
      toast.success("Player deleted successfully");
      setDeleteConfirmOpen(false);
      setPlayerToDelete(null);
      setEditingId(null);
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
      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-3 gap-8 px-4 py-2 font-semibold text-black">
          <div>Name</div>
          <div>Money</div>
          <div>Wins</div>
        </div>
        <div className="w-[88px]"></div>
      </div>

      {/* Player List */}
      {players.map(player => (
        <div
          key={player.id}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 bg-card rounded-lg border"
        >
          {editingId === player.id ? (
            <div className="flex-1 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
              <div className="space-y-2 md:space-y-0">
                <label className="block text-sm font-medium md:hidden">Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="space-y-2 md:space-y-0">
                <label className="block text-sm font-medium md:hidden">Money</label>
                <Input
                  type="number"
                  value={editEarnings ?? ''}
                  onChange={(e) => setEditEarnings(e.target.value === '' ? null : Number(e.target.value))}
                  placeholder="Money"
                />
              </div>
              <div className="space-y-2 md:space-y-0">
                <label className="block text-sm font-medium md:hidden">Wins</label>
                <Input
                  type="number"
                  value={editWins ?? ''}
                  onChange={(e) => setEditWins(e.target.value === '' ? null : Number(e.target.value))}
                  placeholder="Wins"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-2 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
              <div>
                <span className="block text-sm font-medium md:hidden">Name</span>
                <span>{player.name}</span>
              </div>
              <div>
                <span className="block text-sm font-medium md:hidden">Money</span>
                <span>${player.earnings.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-sm font-medium md:hidden">Wins</span>
                <span>{player.wins} wins</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4 md:mt-0 md:ml-4">
            {editingId === player.id ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => handleSave(player.id)}
                >
                  <Save className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => handleDeleteClick(player)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => handleEdit(player)}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {playerToDelete?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

PlayerList.displayName = "PlayerList";
export default PlayerList;