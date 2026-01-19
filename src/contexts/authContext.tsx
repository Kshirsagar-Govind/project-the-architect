import { createContext } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: [];
};

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { user: AuthUser; token: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

