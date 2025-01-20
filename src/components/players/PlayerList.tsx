import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Save, X } from "lucide-react";

interface Player {
  id: string;
  name: string;
  earnings: number;
  wins: number;
}

const PlayerList = () => {
  // Mock data updated with new fields
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "John Doe", earnings: 1000, wins: 5 },
    { id: "2", name: "Jane Smith", earnings: 2500, wins: 8 },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEarnings, setEditEarnings] = useState(0);
  const [editWins, setEditWins] = useState(0);

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditEarnings(player.earnings);
    setEditWins(player.wins);
  };

  const handleSave = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      console.log("Updating player:", id, { name: editName, earnings: editEarnings, wins: editWins });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setPlayers(players.map(p => 
        p.id === id ? { ...p, name: editName, earnings: editEarnings, wins: editWins } : p
      ));
      setEditingId(null);
      toast.success("Player updated successfully");
    } catch (error) {
      console.error("Error updating player:", error);
      toast.error("Failed to update player");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      console.log("Deleting player:", id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setPlayers(players.filter(p => p.id !== id));
      toast.success("Player deleted successfully");
    } catch (error) {
      console.error("Error deleting player:", error);
      toast.error("Failed to delete player");
    }
  };

  return (
    <div className="space-y-4">
      {players.map(player => (
        <div
          key={player.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border"
        >
          {editingId === player.id ? (
            <div className="flex gap-4">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="max-w-[200px]"
                placeholder="Name"
              />
              <Input
                type="number"
                value={editEarnings}
                onChange={(e) => setEditEarnings(Number(e.target.value))}
                className="max-w-[120px]"
                placeholder="Earnings"
              />
              <Input
                type="number"
                value={editWins}
                onChange={(e) => setEditWins(Number(e.target.value))}
                className="max-w-[80px]"
                placeholder="Wins"
              />
            </div>
          ) : (
            <div className="flex gap-8">
              <span>{player.name}</span>
              <span>€{player.earnings}</span>
              <span>{player.wins} wins</span>
            </div>
          )}
          
          <div className="flex gap-2">
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
  );
};

export default PlayerList;