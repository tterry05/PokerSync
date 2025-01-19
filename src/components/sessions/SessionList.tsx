import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Session {
  id: string;
  date: string;
  time: string;
  location: string;
  gameType: string;
  buyIn: number;
  players: string[];
}

const SessionList = () => {
  // TODO: Replace with actual API data
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      date: "2024-01-19",
      time: "19:00",
      location: "John's Place",
      gameType: "Texas Hold'em",
      buyIn: 50,
      players: ["John Doe", "Jane Smith"],
    },
  ]);

  const handleEdit = (session: Session) => {
    // TODO: Implement edit functionality
    console.log("Editing session:", session);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      console.log("Deleting session:", id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setSessions(sessions.filter(s => s.id !== id));
      toast.success("Session deleted successfully");
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    }
  };

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <div
          key={session.id}
          className="p-4 bg-card rounded-lg border space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {format(new Date(`${session.date}T${session.time}`), "PPp")}
              </h3>
              <p className="text-sm text-muted-foreground">{session.location}</p>
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Game Type:</span> {session.gameType}
            </div>
            <div>
              <span className="font-medium">Buy-in:</span> ${session.buyIn}
            </div>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Players:</span>{" "}
            {session.players.join(", ")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionList;