import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const watchId = useRef(null);

  const defaultOptions = {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000,
    distanceInterval: 10,
    ...options,
  };

  useEffect(() => {
    return () => {
      if (watchId.current) {
        stopWatching();
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
        throw new Error('Необходимы разрешения на использование геолокации');
      }

      return true;
    } catch (err) {
      console.error('Ошибка при проверке разрешений:', err);
      setError('Ошибка при проверке разрешений');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: defaultOptions.accuracy,
      });

      setLocation(location);
      return location;
    } catch (err) {
      console.error('Ошибка при получении местоположения:', err);
      setError('Ошибка при получении местоположения');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startWatching = async () => {
    try {
      setError(null);
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        return;
      }

      watchId.current = await Location.watchPositionAsync(
        {
          accuracy: defaultOptions.accuracy,
          timeInterval: defaultOptions.timeInterval,
          distanceInterval: defaultOptions.distanceInterval,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      setIsWatching(true);
    } catch (err) {
      console.error('Ошибка при отслеживании местоположения:', err);
      setError('Ошибка при отслеживании местоположения');
      setIsWatching(false);
    }
  };

  const stopWatching = () => {
    if (watchId.current) {
      Location.removeWatcher(watchId.current);
      watchId.current = null;
      setIsWatching(false);
    }
  };

  const getAddressFromCoordinates = async (coords) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      return address;
    } catch (err) {
      console.error('Ошибка при получении адреса:', err);
      setError('Ошибка при получении адреса');
      return null;
    }
  };

  const getCoordinatesFromAddress = async (address) => {
    try {
      const coordinates = await Location.geocodeAsync(address);
      return coordinates[0];
    } catch (err) {
      console.error('Ошибка при получении координат:', err);
      setError('Ошибка при получении координат');
      return null;
    }
  };

  const calculateDistance = (point1, point2) => {
    try {
      const distance = Location.distanceBetween(
        point1.latitude,
        point1.longitude,
        point2.latitude,
        point2.longitude
      );
      return distance;
    } catch (err) {
      console.error('Ошибка при расчете расстояния:', err);
      setError('Ошибка при расчете расстояния');
      return null;
    }
  };

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} км`;
    }
    return `${Math.round(meters)} м`;
  };

  const getLocationStatus = () => {
    return {
      location,
      error,
      isLoading,
      isWatching,
    };
  };

  return {
    location,
    error,
    isLoading,
    isWatching,
    getCurrentLocation,
    startWatching,
    stopWatching,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    calculateDistance,
    formatDistance,
    getLocationStatus,
  };
}; 