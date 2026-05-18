import { Session } from '../types/chat';

export const storage = {
  getKeys: () => {
    try {
      const keys = localStorage.getItem('nexus:keys');
      return keys ? JSON.parse(keys) : {};
    } catch {
      return {};
    }
  },
  setKeys: (keys: Record<string, string>) => {
    localStorage.setItem('nexus:keys', JSON.stringify(keys));
  },
  getSessions: (): Session[] => {
    try {
      const sessions = localStorage.getItem('nexus:sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  },
  saveSession: (session: Session) => {
    const sessions = storage.getSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem('nexus:sessions', JSON.stringify(sessions));
  },
  deleteSession: (id: string) => {
    const sessions = storage.getSessions().filter((s) => s.id !== id);
    localStorage.setItem('nexus:sessions', JSON.stringify(sessions));
  },
  getModel: (): string => {
    return localStorage.getItem('nexus:model') || 'gpt-4o';
  },
  setModel: (model: string) => {
    localStorage.setItem('nexus:model', model);
  }
};
