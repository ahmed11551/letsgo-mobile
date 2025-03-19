import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { getUserData, setUserData, removeUserData } from '../utils';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      setError('Ошибка при проверке аутентификации');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      await setUserData(response.user);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при входе');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      await setUserData(response.user);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
      await removeUserData();
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при выходе');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      await setUserData(response.user);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении токена');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };
}; 