import { createContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null); // để lưu setTimeout

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  // login
  const login = ({ token }) => {
    localStorage.setItem("token", token);
    setToken(token);

    try {
      const decoded = jwtDecode(token);
      console.log("JWT decoded:", decoded);
      setUser(decoded);
      if (decoded.exp) {
        const timeout = decoded.exp * 1000 - Date.now();

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
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const now = Date.now() / 1000; // giây
        if (decoded.exp && decoded.exp < now) {
          logout(); // token hết hạn
        } else {
          setUser(decoded);
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
