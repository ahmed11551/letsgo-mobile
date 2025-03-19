import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './useAuth';

export const useBiometrics = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricSettings();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      setIsAvailable(compatible && enrolled);
    } catch (err) {
      console.error('Ошибка при проверке доступности биометрии:', err);
      setError('Ошибка при проверке доступности биометрии');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBiometricSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('biometricSettings');
      if (settings) {
        const { enabled } = JSON.parse(settings);
        setIsEnabled(enabled);
      }
    } catch (err) {
      console.error('Ошибка при загрузке настроек биометрии:', err);
      setError('Ошибка при загрузке настроек биометрии');
    }
  };

  const saveBiometricSettings = async (enabled) => {
    try {
      await AsyncStorage.setItem(
        'biometricSettings',
        JSON.stringify({ enabled })
      );
      setIsEnabled(enabled);
    } catch (err) {
      console.error('Ошибка при сохранении настроек биометрии:', err);
      setError('Ошибка при сохранении настроек биометрии');
    }
  };

  const authenticate = async (options = {}) => {
    try {
      if (!isAvailable) {
        throw new Error('Биометрия недоступна');
      }

      setIsLoading(true);
      setError(null);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || 'Подтвердите свою личность',
        fallbackLabel: options.fallbackLabel || 'Использовать пароль',
        disableDeviceFallback: options.disableDeviceFallback || false,
        cancelLabel: options.cancelLabel || 'Отмена',
        fallbackToPasscode: options.fallbackToPasscode || true,
        requireConfirmation: options.requireConfirmation || false,
        ...options,
      });

      return result;
    } catch (err) {
      console.error('Ошибка при аутентификации:', err);
      setError('Ошибка при аутентификации');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const enableBiometrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authenticate({
        promptMessage: 'Включить биометрическую аутентификацию',
        fallbackLabel: 'Использовать пароль',
      });

      if (result.success) {
        await saveBiometricSettings(true);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Ошибка при включении биометрии:', err);
      setError('Ошибка при включении биометрии');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disableBiometrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authenticate({
        promptMessage: 'Отключить биометрическую аутентификацию',
        fallbackLabel: 'Использовать пароль',
      });

      if (result.success) {
        await saveBiometricSettings(false);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Ошибка при отключении биометрии:', err);
      setError('Ошибка при отключении биометрии');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricType = async () => {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'fingerprint';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'face';
      }
      
      return null;
    } catch (err) {
      console.error('Ошибка при определении типа биометрии:', err);
      setError('Ошибка при определении типа биометрии');
      return null;
    }
  };

  const getBiometricTypeText = async () => {
    const type = await getBiometricType();
    switch (type) {
      case 'fingerprint':
        return 'Отпечаток пальца';
      case 'face':
        return 'Распознавание лица';
      default:
        return 'Биометрия';
    }
  };

  const getBiometricStatus = () => {
    return {
      isAvailable,
      isEnabled,
      isLoading,
      error,
    };
  };

  return {
    isAvailable,
    isEnabled,
    isLoading,
    error,
    authenticate,
    enableBiometrics,
    disableBiometrics,
    getBiometricType,
    getBiometricTypeText,
    getBiometricStatus,
  };
}; 