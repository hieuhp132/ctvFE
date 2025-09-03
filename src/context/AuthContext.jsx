// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const LS_SESSION = "authSession"; // stored in sessionStorage to isolate per tab
const ONE_HOUR_MS = 60 * 60 * 1000;

function readSession() {
  try {
    const raw = sessionStorage.getItem(LS_SESSION);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.expiresAt) return null;
    if (Date.now() > data.expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

function writeSession(user) {
  try {
    const data = { user, expiresAt: Date.now() + ONE_HOUR_MS };
    sessionStorage.setItem(LS_SESSION, JSON.stringify(data));
  } catch {}
}

function clearSession() {
  try {
    sessionStorage.removeItem(LS_SESSION);
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  // restore session on mount
  useEffect(() => {
    const s = readSession();
    if (s?.user) {
      setUser(s.user);
    }
    setAuthReady(true);
  }, []);

  // auto-logout when expired (check every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const s = readSession();
      if (!s?.user) {
        if (user) {
          setUser(null);
          navigate("/login");
        }
        return;
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const login = (nextUser) => {
    setUser(nextUser);
    writeSession(nextUser);
    if (nextUser.role === "admin") navigate("/admin");
    else navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    clearSession();
    navigate("/login");
  };

  const value = useMemo(() => ({ user, authReady, login, logout }), [user, authReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
