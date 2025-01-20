import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { format } from "date-fns";
import supabase from "@/lib/supabaseClient";
import { useSessionContext } from '@/contexts/SessionContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GAME_TYPES = ["Texas Hold'em", "Omaha", "Seven Card Stud", "Five Card Draw"];

interface Session {
  id: string;
  date: string;
  time: string;
  location: string;
  gameType: string;
  buyIn: number;
  name: string;
  description?: string;
}

const SessionList = () => {
  const { sessions, fetchSessions } = useSessionContext();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editGameType, setEditGameType] = useState("");
  const [editBuyIn, setEditBuyIn] = useState(0);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      await fetchSessions();
      setLoading(false);
    };
    loadSessions();
  }, [fetchSessions]);

  const handleEdit = (session: Session) => {
    setEditingId(session.id);
    setEditName(session.name);
    setEditDate(session.date);
    setEditTime(session.time);
    setEditLocation(session.location);
    setEditGameType(session.gameType);
    setEditBuyIn(session.buyIn);
    setEditDescription(session.description || "");
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Sessions')
        .update({
          name: editName,
          date: editDate,
          time: editTime,
          location: editLocation,
          gameType: editGameType,
          buyIn: editBuyIn,
          description: editDescription
        })
        .eq('id', id);

      if (error) throw error;
      await fetchSessions();
      setEditingId(null);
      toast.success("Session updated successfully");
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error("Failed to update session");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSessions();
      toast.success("Session deleted successfully");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <div
          key={session.id}
          className="p-4 bg-card rounded-lg border space-y-2"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {editingId === session.id ? (
                <div className="space-y-4">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Session Name"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <Input
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                  </div>
                  <Input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Location"
                  />
                  <Select
                    value={editGameType}
                    onValueChange={setEditGameType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select game type" />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={editBuyIn}
                    onChange={(e) => setEditBuyIn(Number(e.target.value))}
                    placeholder="Buy-in Amount"
                  />
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-semibold">
                    {session.name || "Unnamed Session"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(`${session.date}T${session.time}`), "PPp")}
                  </p>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <span className="font-medium">Game Type:</span> {session.gameType}
                    </div>
                    <div>
                      <span className="font-medium">Buy-in:</span> ${session.buyIn}
                    </div>
                  </div>
                  {session.description && (
                    <div className="mt-3 border-t pt-2">
                      <span className="text-xs font-medium text-muted-foreground">Notes:</span>
                      <p className="text-sm text-foreground mt-1">{session.description}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              {editingId === session.id ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSave(session.id)}
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
                    onClick={() => handleEdit(session)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionList;