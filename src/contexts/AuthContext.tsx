import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { authService, userService } from '@/services';
import { AuthContext, type User, type AuthContextType, type RegisterData, type UpdateUserData } from './AuthContextDefinition';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
  }, [logout]);

  const login = async (email: string, password: string, recaptchaToken: string) => {
    try {
      const response = await authService.login({
        email,
        password,
        recaptcha_token: recaptchaToken,
      });

      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);

      localStorage.setItem('token', response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const deleteUser = async () => {
    try {
      await userService.deleteAccount();
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  };

  const getPortalUrl = async (returnUrl?: string) => {
    try {
      return await authService.getPortalUrl(returnUrl);
    } catch (error) {
      console.error('Get portal URL error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };

    initAuth();
  }, [token, fetchUser]);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    deleteUser,
    getPortalUrl,
    loading,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};