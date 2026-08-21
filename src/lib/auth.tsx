import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserRole } from "./mock";

export interface AuthUser {
  role: UserRole;
  name: string;
  username: string;
  mobile: string;
  photoUrl?: string | null;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (identifier: string, password: string, role: UserRole) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  login: () => ({ ok: false, message: "" }),
  logout: () => {},
  loading: true,
});

function getStorageKey(role?: UserRole) {
  if (role) return role === "owner" ? "trader_auth_user" : "admin_auth_user";
  return window.location.pathname.startsWith("/admin") ? "admin_auth_user" : "trader_auth_user";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storageKey = getStorageKey();
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        localStorage.removeItem("auth_user");
        setLoading(false);
        return;
      }

      try {
        const stored = JSON.parse(raw) as AuthUser;
        const apiRole = stored.role === "owner" ? "TRADER" : stored.role === "main_admin" ? "MAIN_ADMIN" : "USER_ADMIN";
        const response = await fetch(`/api/v1/auth/me?role=${apiRole}`, {
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          localStorage.removeItem(storageKey);
          localStorage.removeItem("auth_user");
          setUser(null);
          return;
        }

        const apiUser = result.user || result.session;
        if (!apiUser) throw new Error("Session expired");
        const role: UserRole = apiUser.role === "MEMBER" ? "owner" : apiUser.role === "TRADER" ? "owner" : apiUser.role === "MAIN_ADMIN" ? "main_admin" : "user_admin";
        const freshUser: AuthUser = {
          role,
          name: apiUser.name || stored.name,
          username: apiUser.username || stored.username,
          mobile: apiUser.mobile || stored.mobile,
          photoUrl: apiUser.photoUrl || stored.photoUrl || null,
        };
        setUser(freshUser);
        localStorage.setItem(getStorageKey(role), JSON.stringify(freshUser));
        localStorage.removeItem("auth_user");
      } catch {
        localStorage.removeItem(storageKey);
        localStorage.removeItem("auth_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login: AuthCtx["login"] = async (identifier, password, role) => {
    const apiRole = role === "owner" ? "TRADER" : role === "main_admin" ? "MAIN_ADMIN" : "USER_ADMIN";
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role: apiRole }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        return { ok: false, message: result.error || "Login failed." };
      }
      const u: AuthUser = {
        role,
        name: result.user.name,
        username: result.user.username,
        mobile: result.user.mobile,
        photoUrl: result.user.photoUrl || null,
      };
      setUser(u);
      localStorage.setItem(getStorageKey(role), JSON.stringify(u));
      localStorage.removeItem("auth_user");
      return { ok: true, message: "Signed in successfully." };
    } catch {
      return { ok: false, message: "Backend is not reachable. Please start the backend API." };
    }
  };

  const logout = () => {
    const apiRole = user?.role === "owner" ? "TRADER" : user?.role === "main_admin" ? "MAIN_ADMIN" : user?.role === "user_admin" ? "USER_ADMIN" : "";
    fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: apiRole }),
    }).catch(() => undefined);
    setUser(null);
    localStorage.removeItem(getStorageKey(user?.role));
    localStorage.removeItem("auth_user");
  };

  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
