import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../apiConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Add a request interceptor to include the token in the header
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true
        });
        if (res.data.success) {
          const userData = res.data.user;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          // Session missing or expired (but returned 200)
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.log("No active session found");
        // Don't clear localStorage here if user is offline, but maybe clear if 401
        if (err.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // --- LOGOUT FUNCTION WITH REDIRECT ---
  const logout = async () => {
    try {
      // 1. Backend call with credentials for cookies
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { 
        withCredentials: true 
      });
      
      toast.success("Logged out successfully! 👋");
    } catch (err) {
      console.error("Logout Error:", err);
      // Backend fail ho tab bhi local session clear karna zaruri hai
      toast.error("Session cleared locally.");
    } finally {
      // 2. Client side cleanup (Always runs)
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Agar token alag se rakha hai toh

      // 3. HOME PAGE PE NAVIGATE KAREIN
      navigate("/"); 
    }
  };

  // --- LOGIN FUNCTION ---
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Login ke baad dashboard pe bhejna hai toh yahan bhi navigate use kar sakte hain
    // navigate("/admin/dashboard"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
