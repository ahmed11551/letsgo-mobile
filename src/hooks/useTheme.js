import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@theme_mode';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (err) {
      console.error('Ошибка при загрузке темы:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setTheme(newTheme);
    } catch (err) {
      console.error('Ошибка при сохранении темы:', err);
    }
  };

  const setSystemTheme = async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      setTheme(systemColorScheme);
    } catch (err) {
      console.error('Ошибка при сбросе темы:', err);
    }
  };

  const colors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: theme === 'dark' ? '#000000' : '#FFFFFF',
    card: theme === 'dark' ? '#1C1C1E' : '#F2F2F7',
    text: theme === 'dark' ? '#FFFFFF' : '#000000',
    border: theme === 'dark' ? '#38383A' : '#C6C6C8',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5856D6',
    placeholder: theme === 'dark' ? '#8E8E93' : '#C7C7CC',
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 10,
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: theme === 'dark' ? 0.25 : 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    text: {
      color: colors.text,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.8,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    input: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
    },
    label: {
      color: colors.text,
      fontSize: 14,
      marginBottom: 4,
    },
    error: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
  };

  return {
    theme,
    loading,
    colors,
    styles,
    toggleTheme,
    setSystemTheme,
  };
}; 