import { create } from "zustand";

export type UserRole = "ADMIN" | "USER" | "CUSTOMER";

type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
  profile?: {
    id: number;
    name: string;
    register_number: string | null;
    phone_number: string | null;
    birthdate: string | null;
    userId: number;
    wallet?: {
      balance: number;
      pending: number;
    } | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

type AuthStore = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      loading: false
    }),

  setLoading: (loading) => set({ loading }),

  refreshUser: async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }

      const data = await response.json();
      set({
        user: data,
        isAuthenticated: true,
        loading: false
      });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } finally {
      set({ user: null, isAuthenticated: false, loading: false });
      window.location.href = "/"; 
    }
  }
}));