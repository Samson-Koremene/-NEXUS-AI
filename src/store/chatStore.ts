import { create } from 'zustand';
import type { Message, Session } from '../types/chat';
import { storage } from '../lib/storage';

interface ChatState {
  currentSessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  activeModel: string;
  setSession: (session: Session | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  setModel: (modelId: string) => void;
  clearSession: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentSessionId: null,
  messages: [],
  isLoading: false,
  activeModel: storage.getModel(),

  setSession: (session) => {
    if (session) {
      set({ currentSessionId: session.id, messages: session.messages, activeModel: session.model });
    } else {
      set({ currentSessionId: null, messages: [] });
    }
  },

  addMessage: (message) => set((state) => {
    const newMessages = [...state.messages, message];
    // We defer actual saving to the hook or a middleware to keep store simple, 
    // but typically we'd update the session in storage here.
    return { messages: newMessages };
  }),

  updateMessage: (id, updates) => set((state) => {
    const newMessages = state.messages.map(m => m.id === id ? { ...m, ...updates } : m);
    return { messages: newMessages };
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setModel: (modelId) => {
    storage.setModel(modelId);
    set({ activeModel: modelId });
  },

  clearSession: () => set({ currentSessionId: null, messages: [] }),
}));
