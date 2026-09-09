import { create } from "zustand";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: AdminUser | null;
  accessToken: string | null;
  setSession: (accessToken: string, user: AdminUser) => void;
  setUser: (user: AdminUser | null) => void;
  clearSession: () => void;
};

const TOKEN_KEY = "sosbd_admin_access_token";
const initialToken = typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: initialToken,
  setSession(accessToken, user) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    set({ accessToken, user });
  },
  setUser(user) {
    set({ user });
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    set({ accessToken: null, user: null });
  },
}));
