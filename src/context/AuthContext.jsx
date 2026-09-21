import { useState, useEffect } from 'react';
import { AuthContext } from './contexts';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '../utils/storage';
import { DEFAULT_USERS } from '../utils/dummyData';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const active = getStorageItem(STORAGE_KEYS.AUTH_USER, null);
    if (active?.role === 'Admin') {
      active.role = 'Instructor';
      setStorageItem(STORAGE_KEYS.AUTH_USER, active);
    }
    return active;
  });

  const [users, setUsers] = useState(() => {
    const existing = getStorageItem(STORAGE_KEYS.USERS);
    if (!existing || existing.length === 0) {
      setStorageItem(STORAGE_KEYS.USERS, DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    const sanitized = existing.filter((u) => u.role !== 'Admin');
    if (sanitized.length !== existing.length) {
      setStorageItem(STORAGE_KEYS.USERS, sanitized);
    }
    return sanitized;
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

  // Switch role directly for quick role preview
  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    setStorageItem(STORAGE_KEYS.AUTH_USER, updatedUser);

    // Also update in users list if present
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, role: newRole } : u))
    );
    return updatedUser;
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updatedUser = {
        ...user,
        ...profileData
      };
      setUser(updatedUser);
      setStorageItem(STORAGE_KEYS.AUTH_USER, updatedUser);

      // Also update in users list
      setUsers((prev) => {
        const next = prev.map((u) => {
          if (String(u.id) === String(user?.id) || u.email?.toLowerCase() === user?.email?.toLowerCase()) {
            return { ...u, ...profileData };
          }
          return u;
        });
        setStorageItem(STORAGE_KEYS.USERS, next);
        return next;
      });

      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  // Change Password handler
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const matched = users.find(
        (u) => String(u.id) === String(user?.id) || u.email?.toLowerCase() === user?.email?.toLowerCase()
      );
      if (matched && matched.password && matched.password !== currentPassword) {
        throw new Error('Current password does not match.');
      }

      setUsers((prev) => {
        const next = prev.map((u) => {
          if (String(u.id) === String(user?.id) || u.email?.toLowerCase() === user?.email?.toLowerCase()) {
            return { ...u, password: newPassword };
          }
          return u;
        });
        setStorageItem(STORAGE_KEYS.USERS, next);
        return next;
      });

      return true;
    } finally {
      setLoading(false);
    }
  };

  const isStudent = user?.role === 'Student';
  const isInstructor = user?.role === 'Instructor';
  const canManageCourses = isInstructor;

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        isAuthenticated: !!user,
        role: user?.role || 'Student',
        isStudent,
        isInstructor,
        canManageCourses,
        switchRole,
        updateProfile,
        changePassword,
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
