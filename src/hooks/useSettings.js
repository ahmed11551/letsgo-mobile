import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/api';
import { useAuth } from './useAuth';

const SETTINGS_STORAGE_KEY = '@user_settings';

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      tripUpdates: true,
      messages: true,
      reviews: true,
      promotions: false,
    },
    privacy: {
      showPhone: true,
      showEmail: false,
      showLocation: true,
    },
    language: 'ru',
    theme: 'system',
    currency: 'RUB',
    distanceUnit: 'km',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загрузка настроек с сервера
      const serverSettings = await userService.getSettings();
      
      // Загрузка локальных настроек
      const localSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      
      // Объединение настроек
      const mergedSettings = {
        ...settings,
        ...serverSettings,
        ...(localSettings ? JSON.parse(localSettings) : {}),
      };

      setSettings(mergedSettings);
    } catch (err) {
      setError('Ошибка при загрузке настроек');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      setError(null);

      // Обновление на сервере
      await userService.updateSettings(newSettings);

      // Сохранение локально
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings)
      );

      setSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении настроек');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async (key, value) => {
    try {
      const newSettings = {
        ...settings,
        notifications: {
          ...settings.notifications,
          [key]: value,
        },
      };
      await updateSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении настроек уведомлений');
      throw err;
    }
  };

  const updatePrivacySettings = async (key, value) => {
    try {
      const newSettings = {
        ...settings,
        privacy: {
          ...settings.privacy,
          [key]: value,
        },
      };
      await updateSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении настроек конфиденциальности');
      throw err;
    }
  };

  const updateLanguage = async (language) => {
    try {
      const newSettings = {
        ...settings,
        language,
      };
      await updateSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении языка');
      throw err;
    }
  };

  const updateTheme = async (theme) => {
    try {
      const newSettings = {
        ...settings,
        theme,
      };
      await updateSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении темы');
      throw err;
    }
  };

  const updateCurrency = async (currency) => {
    try {
      const newSettings = {
        ...settings,
        currency,
      };
      await updateSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении валюты');
      throw err;
    }
  };

  const updateDistanceUnit = async (unit) => {
    try {
      const newSettings = {
        ...settings,
        distanceUnit: unit,
      };
      await updateSettings(newSettings);
    } catch (err) {
      setError('Ошибка при обновлении единицы измерения расстояния');
      throw err;
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Сброс на сервере
      await userService.resetSettings();

      // Удаление локальных настроек
      await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);

      setSettings({
        notifications: {
          tripUpdates: true,
          messages: true,
          reviews: true,
          promotions: false,
        },
        privacy: {
          showPhone: true,
          showEmail: false,
          showLocation: true,
        },
        language: 'ru',
        theme: 'system',
        currency: 'RUB',
        distanceUnit: 'km',
      });
    } catch (err) {
      setError('Ошибка при сбросе настроек');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    updateLanguage,
    updateTheme,
    updateCurrency,
    updateDistanceUnit,
    resetSettings,
    refreshSettings: loadSettings,
  };
}; 