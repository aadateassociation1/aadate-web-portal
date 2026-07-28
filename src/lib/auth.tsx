import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_CREDS, type UserRole } from "./mock";

export interface AuthUser {
  role: UserRole;
  name: string;
  username: string;
  mobile: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (identifier: string, password: string, role: UserRole) => { ok: boolean; message: string };
  logout: () => void;
  loading: boolean;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  login: () => ({ ok: false, message: "" }),
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const login: AuthCtx["login"] = (identifier, password, role) => {
    const creds = DEMO_CREDS[role];
    if (!creds) return { ok: false, message: "Unknown role" };
    const idOk = identifier === creds.username || identifier === creds.mobile;
    if (!idOk) return { ok: false, message: "Mobile number / username not recognised for this role." };
    if (password !== creds.password) return { ok: false, message: "Incorrect password." };
    const u: AuthUser = { role, name: creds.name, username: creds.username, mobile: creds.mobile };
    setUser(u);
    localStorage.setItem("auth_user", JSON.stringify(u));
    return { ok: true, message: "Signed in successfully." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
