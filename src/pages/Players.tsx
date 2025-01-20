import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlayerList from "@/components/players/PlayerList";
import AddPlayerForm from "@/components/players/AddPlayerForm";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const Players = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const playerListRef = useRef<{ fetchPlayers: () => void } | null>(null);

  const handlePlayerAdded = () => {
    setShowAddForm(false);
    playerListRef.current?.fetchPlayers();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 pt-20"
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <CardTitle>Players</CardTitle>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              variant="outline"
            >
              {showAddForm ? "Cancel" : "Add New Player"}
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {showAddForm && (
              <div className="mb-6 border-b pb-6">
                <AddPlayerForm onSubmitComplete={handlePlayerAdded} />
              </div>
            )}
            <PlayerList ref={playerListRef} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Players;