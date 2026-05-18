import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { Session } from '../types/chat';

export function useSession() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    setSessions(storage.getSessions());
  }, []);

  const refreshSessions = () => {
    setSessions(storage.getSessions());
  };

  const deleteSession = (id: string) => {
    storage.deleteSession(id);
    refreshSessions();
  };

  return { sessions, refreshSessions, deleteSession };
}
