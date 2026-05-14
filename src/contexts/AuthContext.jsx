import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // TODO: Call an endpoint to get user info or decode JWT
        setUser({ name: 'User', email: 'user@example.com' }); // Placeholder
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (googleToken) => {
    try {
      const API = axios.create({
        baseURL: "/api",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await API.post("/users/auth/google/", { token: googleToken });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Decode Google token to get user info
      const payload = JSON.parse(atob(googleToken.split('.')[1]));
      setUser({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};