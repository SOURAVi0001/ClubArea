import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  role: string | null;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
  hydrate: (payload: { loggedIn: boolean; user?: User }) => void;
  getDisplayProps: () => any;
}

const initialState = {
  user: null,
  isLoggedIn: false,
  role: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  /** Set user after login. Backend sends { name, email, role, clubName?, clubId? } */
  setUser: (user: User | null, token?: string) => {
    if (token) localStorage.setItem('auth_token', token);
    set({
      user: user ?? null,
      isLoggedIn: !!user,
      role: user?.role ?? null,
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set(initialState);
  },

  /** Hydrate from check-session API: { loggedIn, user: { name, email, role } } */
  hydrate: (payload: { loggedIn: boolean; user?: User }) => {
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
