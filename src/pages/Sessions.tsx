import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SessionList from "@/components/sessions/SessionList";
import AddSessionForm from "@/components/sessions/AddSessionForm";
import { SessionProvider } from '@/contexts/SessionContext';
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const Sessions = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <SessionProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 pt-20"
      >
        <div className="grid gap-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="outline"
              className="gap-2"
            >
              {showForm ? (
                <>
                  <X className="h-4 w-4" /> Hide Form
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add New Session
                </>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddSessionForm />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent>
              <SessionList />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </SessionProvider>
  );
};

export default Sessions;