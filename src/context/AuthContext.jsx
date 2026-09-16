import { createContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storage';
import { DEFAULT_USERS } from '../utils/dummyData';

export const AuthContext = createContext(null);
export { useAuth } from './useAuth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStorageItem(STORAGE_KEYS.AUTH_USER, null);
  });

  const [users, setUsers] = useState(() => {
    const existing = getStorageItem(STORAGE_KEYS.USERS);
    if (!existing || existing.length === 0) {
      setStorageItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    return existing;
  });

  const [loading, setLoading] = useState(false);

  // Sync state if localStorage changes
  useEffect(() => {
    if (user) {
      setStorageItem(STORAGE_KEYS.AUTH_USER, user);
    } else {
      removeStorageItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [user]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate minor network latency
      await new Promise((resolve) => setTimeout(resolve, 400));

      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matchedUser) {
        throw new Error('Invalid email or password. Check credentials or use demo accounts.');
      }

      // Strip password for active session
      const { password: _, ...safeUser } = matchedUser;
      setUser(safeUser);
      return safeUser;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (newUserData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const emailExists = users.some(
        (u) => u.email.toLowerCase() === newUserData.email.toLowerCase()
      );

      if (emailExists) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        role: newUserData.role || 'Student',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUserData.name)}`
      };

      const updatedUsers = [newUser, ...users];
      setUsers(updatedUsers);
      setStorageItem(STORAGE_KEYS.USERS, updatedUsers);

      return newUser;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const found = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        throw new Error('No registered account was found with that email address.');
      }
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    removeStorageItem(STORAGE_KEYS.AUTH_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
