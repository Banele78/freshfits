import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi"; // optional: for backend /auth/me
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Restore session from backend if token exists
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  // Set auth helper (used by Google OAuth redirect)
  const setAuth = ({ accessToken, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setAuth({ accessToken: res.data.accessToken, user: res.data.user });
  };

  const logout = async () => {
    try {
      // Call backend to clear refresh token cookie
      await authApi.logout();

      // Clear local storage and state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to home or login page
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // Still clear local state even if backend fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, setAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
