// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // store user object here



  useEffect(() => {
    if (token) {

      try {
        // Decode manually
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        // console.log(decoded)
        setUser({
          email: decoded.email,
          isAdmin: decoded.isAdmin,
          id: decoded.id,
        });
      } catch (err) {
        console.error("Failed to decode token", err);
        setUser(null);
      }
    } else {

      setUser(null);
    }
  }, [token]);

  // Keep token in sync with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
