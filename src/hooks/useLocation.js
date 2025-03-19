import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useGeocoding } from './useGeocoding';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAddressFromCoordinates } = useGeocoding();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Необходим доступ к геолокации');
        return false;
      }
      return true;
    } catch (err) {
      setError('Ошибка при проверке разрешений');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(location);
      return location;
    } catch (err) {
      setError('Ошибка при получении местоположения');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startLocationUpdates = async (callback) => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setLocation(location);
          if (callback) {
            callback(location);
          }
        }
      );

      return subscription;
    } catch (err) {
      setError('Ошибка при запуске отслеживания местоположения');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const stopLocationUpdates = async (subscription) => {
    try {
      if (subscription) {
        await subscription.remove();
      }
    } catch (err) {
      setError('Ошибка при остановке отслеживания местоположения');
    }
  };

  const getLocationAddress = async () => {
    try {
      if (!location) {
        const currentLocation = await getCurrentLocation();
        if (!currentLocation) {
          return null;
        }
        location = currentLocation;
      }

      const address = await getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      return address;
    } catch (err) {
      setError('Ошибка при получении адреса');
      return null;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // радиус Земли в метрах
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // расстояние в метрах
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    startLocationUpdates,
    stopLocationUpdates,
    getLocationAddress,
    calculateDistance,
  };
}; 