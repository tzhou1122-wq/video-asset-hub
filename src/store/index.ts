import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FieldPreferences {
  title: boolean;
  uploader: boolean;
  city: boolean;
  tags: boolean;
  duration: boolean;
  uploadTime: boolean;
  fileSize: boolean;
}

interface AppState {
  activeTab: 'assets' | 'dashboard';
  setActiveTab: (tab: 'assets' | 'dashboard') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fieldPreferences: FieldPreferences;
  toggleFieldPreference: (field: keyof FieldPreferences) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'assets',
      setActiveTab: (tab) => set({ activeTab: tab }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      fieldPreferences: {
        title: true,
        uploader: true,
        city: true,
        tags: true,
        duration: true,
        uploadTime: true,
        fileSize: true,
      },
      toggleFieldPreference: (field) =>
        set((state) => ({
          fieldPreferences: {
            ...state.fieldPreferences,
            [field]: !state.fieldPreferences[field],
          },
        })),
    }),
    {
      name: 'cinematic-ledger-storage',
      partialize: (state) => ({ fieldPreferences: state.fieldPreferences }),
    }
  )
);
