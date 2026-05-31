import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogin, linkORCID } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user_info") || "null");

  const [user, setUser] = useState(storedUser || null);
  const [role, setRole] = useState(localStorage.getItem("user_role") || null);
  const [loading, setLoading] = useState(true);
  const [showOrcidModal, setShowOrcidModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && storedUser) {
      setUser(storedUser);
      setRole(localStorage.getItem("user_role") || null);
    } else {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  }, []);

  const login = async (googleToken) => {
    try {
      const payload = JSON.parse(atob(googleToken.split('.')[1]));
      const userInfo = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      const data = await googleLogin(googleToken, userInfo);

      const newUser = {
        id: data.user_id,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      setUser(newUser);
      setRole(data.role || null);

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const linkOrcid = async (orcidId) => {
    const data = await linkORCID({ orcid_id: orcidId });

    if (data.status === "linked") {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_role", data.role);

      setRole(data.role);

      if (data.user) {
        const updatedUser = {
          ...user,
          id: data.user.id ?? user?.id,
        };
        setUser(updatedUser);
        localStorage.setItem("user_info", JSON.stringify(updatedUser));
      }
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    setUser(null);
    setRole(null);
    setShowOrcidModal(false);
  };

  const value = {
    user,
    role,
    login,
    logout,
    loading,
    linkOrcid,
    showOrcidModal,
    setShowOrcidModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
