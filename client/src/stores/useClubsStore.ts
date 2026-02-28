import { create } from 'zustand';

interface ClubsState {
  selectedClubId: string | null;
  selectClub: (id: string) => void;
  clearSelection: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useClubsStore = create<ClubsState>((set) => ({
    selectedClubId: null,
    selectClub: (id: string) => set({ selectedClubId: id }),
    clearSelection: () => set({ selectedClubId: null }),

    // Example of client-side filter
    searchQuery: '',
    setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
