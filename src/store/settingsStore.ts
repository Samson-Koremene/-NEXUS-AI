import { create } from 'zustand';
import { storage } from '../lib/storage';

interface SettingsState {
  keys: Record<string, string>;
  setKey: (provider: string, key: string) => void;
  removeKey: (provider: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  keys: storage.getKeys(),
  setKey: (provider, key) => set((state) => {
    const newKeys = { ...state.keys, [provider]: key };
    storage.setKeys(newKeys);
    return { keys: newKeys };
  }),
  removeKey: (provider) => set((state) => {
    const newKeys = { ...state.keys };
    delete newKeys[provider];
    storage.setKeys(newKeys);
    return { keys: newKeys };
  }),
}));
