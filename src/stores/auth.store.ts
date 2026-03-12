import { create } from "zustand";

type AuthUser = {
  id: number;
  email: string;
  type: string;
  profile?: {
    id: number;
    name: string;
    register_number: string | null;
    phone_number: string | null;
    birthdate: string | null;
    userId: number;
    roleId: number;
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
      isAuthenticated: !!user
    }),

  setLoading: (loading) => set({ loading }),

  refreshUser: async () => {
    set({ loading: true });

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      const data = await response.json();

      set({
        user: data,
        isAuthenticated: true,
        loading: false
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  }
}));