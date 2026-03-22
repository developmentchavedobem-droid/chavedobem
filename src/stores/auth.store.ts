import { create } from "zustand";

// Definimos um tipo para as Roles para evitar erros de digitação
export type UserRole = "ADMIN" | "USER" | "CUSTOMER";

type AuthUser = {
  id: number;
  email: string;
  role: UserRole; // Alterado de 'type' para 'role'
  profile?: {
    id: number;
    name: string;
    register_number: string | null;
    phone_number: string | null;
    birthdate: string | null;
    userId: number;
    // Removi roleId daqui pois a Role agora está no User (conforme seu novo schema)
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
      loading: false // Ao setar o usuário, paramos o loading
    }),

  setLoading: (loading) => set({ loading }),

  refreshUser: async () => {
    // Não setamos loading: true aqui se o usuário já existir para evitar "flicker" na UI
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
        user: data, // Certifique-se que a API /api/auth/me retorna o campo 'role'
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
      // Limpa tudo e redireciona (o redirecionamento pode ser feito no componente)
      set({ user: null, isAuthenticated: false, loading: false });
      window.location.href = "/login"; // Força um reload para limpar caches do Next.js
    }
  }
}));