import { create } from 'zustand';

/**
 * Zustand store for managing Club-related UI state.
 * Actual data fetching is handled by TanStack Query.
 */
export const useClubsStore = create((set) => ({
    selectedClubId: null,
    selectClub: (id) => set({ selectedClubId: id }),
    clearSelection: () => set({ selectedClubId: null }),

    // Example of client-side filter
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
