import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import supabase from '@/lib/supabaseClient';

interface Session {
  description: any;
  id: string;
  date: string;
  time: string;
  location: string;
  gameType: string;
  buyIn: number;
  name: string;
}

interface SessionContextType {
  sessions: Session[];
  fetchSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = useCallback(async () => {
    const { data, error } = await supabase
      .from('Sessions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
    } else {
      setSessions(data || []);
    }
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, fetchSessions }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
