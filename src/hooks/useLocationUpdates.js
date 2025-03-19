import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocation } from './useLocation';
import { useAuth } from './useAuth';
import { API_URL } from '../constants';

export const useLocationUpdates = (tripId) => {
  const { location, getCurrentLocation } = useLocation();
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);
  const locationSubscription = useRef(null);
  const updateInterval = useRef(null);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = async () => {
    try {
      setError(null);

      // Запрос разрешения на фоновое отслеживание
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Разрешение на фоновое отслеживание не предоставлено');
        return;
      }

      // Настройка фонового отслеживания
      await Location.startLocationUpdatesAsync('location-updates', {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
        foregroundService: {
          notificationTitle: 'Отслеживание поездки',
          notificationBody: 'Ваше местоположение отслеживается',
        },
      });

      // Начало отправки обновлений на сервер
      updateInterval.current = setInterval(sendLocationUpdate, 5000);
      setIsTracking(true);
    } catch (err) {
      setError('Ошибка при запуске отслеживания');
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      Location.removeWatcher(locationSubscription.current);
    }
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }
    setIsTracking(false);
  };

  const sendLocationUpdate = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) return;

      await fetch(`${API_URL}/trips/${tripId}/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          speed: currentLocation.coords.speed,
          heading: currentLocation.coords.heading,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Ошибка при отправке обновления местоположения:', err);
    }
  };

  const getEstimatedArrivalTime = async (destination) => {
    try {
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) return null;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${destination.latitude},${destination.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      const data = await response.json();
      if (data.routes && data.routes[0]) {
        const duration = data.routes[0].legs[0].duration.value;
        const arrivalTime = new Date(Date.now() + duration * 1000);
        return arrivalTime;
      }
      return null;
    } catch (err) {
      console.error('Ошибка при получении расчетного времени прибытия:', err);
      return null;
    }
  };

  const getDistanceToDestination = async (destination) => {
    try {
      const currentLocation = await getCurrentLocation();
      if (!currentLocation) return null;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.coords.latitude},${currentLocation.coords.longitude}&destination=${destination.latitude},${destination.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      const data = await response.json();
      if (data.routes && data.routes[0]) {
        return data.routes[0].legs[0].distance.value;
      }
      return null;
    } catch (err) {
      console.error('Ошибка при получении расстояния до пункта назначения:', err);
      return null;
    }
  };

  return {
    isTracking,
    error,
    startTracking,
    stopTracking,
    getEstimatedArrivalTime,
    getDistanceToDestination,
  };
}; 