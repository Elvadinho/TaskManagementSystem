import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../api/axios";
import {
  type User,
  type AuthResponse,
  type SignUpPayload,
  type LoginPayload,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  signup: (data: SignUpPayload) => Promise<User>;
  login: (data: LoginPayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const persistSession = (data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (formData: SignUpPayload): Promise<User> => {
    const res = await api.post<AuthResponse>("/auth/register", formData);
    persistSession(res.data);
    return res.data.user;
  };

  const login = async (formData: LoginPayload): Promise<User> => {
    const res = await api.post<AuthResponse>("/auth/login", formData);
    persistSession(res.data);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
