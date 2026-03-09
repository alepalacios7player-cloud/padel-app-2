import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentSession, logout as authLogout } from '../services/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setUser({ id: session.userId, name: session.name, email: session.email });
    }
    setLoading(false);
  }, []);

  function signIn(userData) {
    setUser(userData);
  }

  function signOut() {
    authLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
