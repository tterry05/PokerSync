import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlayerList from "@/components/players/PlayerList";
import AddPlayerForm from "@/components/players/AddPlayerForm";

const Players = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 pt-20"
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Player</CardTitle>
          </CardHeader>
          <CardContent>
            <AddPlayerForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player List</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerList />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Players;