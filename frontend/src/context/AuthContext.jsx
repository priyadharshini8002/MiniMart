// context/AuthContext.jsx
// Keeps track of who is logged in. Every component can read it with useAuth().
// The JWT token is saved in localStorage so the user stays logged in after refresh.

import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check the saved token

  // When the app opens: if a token is saved, ask the backend who the user is
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("minimart_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("minimart_token"); // token is invalid or expired
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  const saveLogin = (data) => {
    localStorage.setItem("minimart_token", data.token);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveLogin(data);
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    saveLogin(data);
  };

  const logout = () => {
    localStorage.removeItem("minimart_token");
    sessionStorage.removeItem("minimart_shipping");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
