import { create } from 'zustand';
import type { Message, Session } from '../types/chat';
import type { ChatMode } from '../types/modes';
import { storage } from '../lib/storage';

interface ChatState {
  currentSessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  activeModel: string;
  chatMode: ChatMode;
  inputDraft: string;
  setSession: (session: Session | null) => void;
  setInputDraft: (text: string) => void;
  addMessage: (message: Message) => void;
  removeLastMessage: () => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  setModel: (modelId: string) => void;
  setChatMode: (mode: ChatMode) => void;
  clearSession: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentSessionId: null,
  messages: [],
  isLoading: false,
  activeModel: storage.getModel() || 'nvidia/nemotron-3-ultra-550b-a55b',
  chatMode: 'normal',
  inputDraft: '',

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

  removeLastMessage: () => set((state) => ({ messages: state.messages.slice(0, -1) })),

  setLoading: (isLoading) => set({ isLoading }),

  setModel: (modelId) => {
    storage.setModel(modelId);
    set({ activeModel: modelId });
  },

  setChatMode: (chatMode) => set({ chatMode }),

  setInputDraft: (inputDraft) => set({ inputDraft }),

  clearSession: () => set({ currentSessionId: null, messages: [], chatMode: 'normal' }),
}));
