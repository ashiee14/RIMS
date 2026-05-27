import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogin } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(
  localStorage.getItem("user_info")
);

const [user, setUser] = useState(storedUser || null);


  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (token && storedUser) {
    setUser(storedUser);
  } else {
    setUser(null);
  }

  setLoading(false);
}, []);


  /*const login = async (googleToken) => {
    try {
      const API = axios.create({
        baseURL: "/api",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await API.post("/users/auth/google/", { token: googleToken });
      console.log("LOGIN RESPONSE:", res.data);
      
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // Decode Google token to get user info
      const payload = JSON.parse(atob(googleToken.split('.')[1]));
          setUser({
        id: res.data.user?.id,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      localStorage.setItem(
        "user_info",
        JSON.stringify({
          id: res.data.user?.id,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        })
      );

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };*/

  const login = async (googleToken) => {
    try {
      const payload = JSON.parse(atob(googleToken.split('.')[1]));

      const data = await googleLogin(googleToken, {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      setUser({
        id: data.user?.id,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem("user_info");
    
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