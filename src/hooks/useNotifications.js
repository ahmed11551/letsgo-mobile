import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuth } from './useAuth';
import { API_URL } from '../config';

export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    registerForPushNotifications();
    setupNotificationHandlers();

    return () => {
      cleanupNotificationHandlers();
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Проверяем, поддерживает ли устройство push-уведомления
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      setPermissions(existingStatus);

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissions(status);
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

      // Получаем токен для push-уведомлений
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });
      setExpoPushToken(token.data);

      // Отправляем токен на сервер
      if (user) {
        await updatePushToken(token.data);
      }
    } catch (err) {
      console.error('Ошибка при регистрации push-уведомлений:', err);
      setError('Ошибка при регистрации push-уведомлений');
    } finally {
      setIsLoading(false);
    }
  };

  const setupNotificationHandlers = () => {
    // Обработчик получения уведомления в фоновом режиме
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Обработчик получения уведомления в активном приложении
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        handleNotification(notification);
      }
    );

    // Обработчик нажатия на уведомление
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationResponse(response);
      }
    );

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  };

  const cleanupNotificationHandlers = () => {
    Notifications.removeAllNotificationListeners();
  };

  const handleNotification = (notification) => {
    // Обработка полученного уведомления
    console.log('Получено уведомление:', notification);
  };

  const handleNotificationResponse = (response) => {
    // Обработка нажатия на уведомление
    console.log('Нажато уведомление:', response);
  };

  const updatePushToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/users/push-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении push-токена');
      }
    } catch (err) {
      console.error('Ошибка при обновлении push-токена:', err);
      setError('Ошибка при обновлении push-токена');
    }
  };

  const scheduleNotification = useCallback(async (notification) => {
    try {
      setIsLoading(true);
      setError(null);

      const { title, body, data, trigger } = notification;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger,
      });

      return identifier;
    } catch (err) {
      console.error('Ошибка при планировании уведомления:', err);
      setError('Ошибка при планировании уведомления');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelNotification = useCallback(async (identifier) => {
    try {
      setIsLoading(true);
      setError(null);

      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (err) {
      console.error('Ошибка при отмене уведомления:', err);
      setError('Ошибка при отмене уведомления');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelAllNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.error('Ошибка при отмене всех уведомлений:', err);
      setError('Ошибка при отмене всех уведомлений');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNotificationStatus = () => {
    return {
      isLoading,
      error,
      permissions,
      hasToken: !!expoPushToken,
    };
  };

  return {
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getNotificationStatus,
  };
}; 