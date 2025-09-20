import { createContext, useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null); // để lưu setTimeout

  // logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  // login
  const login = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp) {
        const now = Date.now();
        const timeout = decoded.exp * 1000 - now;

        if (timeout > 0) {
          // đặt timer tự động logout
          logoutTimer.current = setTimeout(() => {
            logout();
          }, timeout);
        } else {
          // token đã hết hạn → logout ngay
          logout();
        }
      }
    } catch {
      logout();
    }
  };

  // load user + token khi mount app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const now = Date.now() / 1000; // giây
        if (decoded.exp && decoded.exp < now) {
          logout(); // token hết hạn
        } else {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);

          // đặt timer logout còn lại
          const timeout = decoded.exp * 1000 - Date.now();
          logoutTimer.current = setTimeout(() => {
            logout();
          }, timeout);
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
