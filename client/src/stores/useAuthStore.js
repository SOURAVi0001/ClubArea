import { create } from 'zustand';

/**
 * Session user shape matching backend req.session.user (leader + member).
 * Backend passes Leader_Name, Club_Name, etc. to EJS; React reads the same from this store
 * after login/hydration.
 */
const initialState = {
  user: null,
  isLoggedIn: false,
  /** 'leader' | 'member' | null */
  role: null,
};

export const useAuthStore = create((set) => ({
  ...initialState,

  /** Set user after login. Backend sends { name, email, role, clubName?, clubId? } */
  setUser: (user) =>
    set({
      user: user ?? null,
      isLoggedIn: !!user,
      role: user?.role ?? null,
    }),

  logout: () => set(initialState),

  /** Hydrate from check-session API: { loggedIn, user: { name, email, role } } */
  hydrate: (payload) => {
    if (payload?.loggedIn && payload?.user) {
      set({
        user: payload.user,
        isLoggedIn: true,
        role: payload.user.role ?? null,
      });
    } else {
      set(initialState);
    }
  },

  /** Convenience: same props as EJS (Leader_Name, Club_Name, etc.) */
  getDisplayProps: () => {
    const state = useAuthStore.getState();
    const u = state.user;
    if (!u) return { leaderName: null, clubName: null, memberName: null };
    return {
      leaderName: u.name,
      clubName: u.clubName ?? null,
      memberName: u.name,
      email: u.email,
      clubId: u.clubId ?? null,
    };
  },
}));
