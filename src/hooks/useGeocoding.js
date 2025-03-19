import { useState, useCallback } from 'react';
import { API_URL } from '../config';

export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());

  const geocodeAddress = useCallback(async (address) => {
    try {
      // Проверяем кэш
      if (cache.has(address)) {
        return cache.get(address);
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Ошибка при геокодировании адреса');
      }

      const data = await response.json();
      if (data.status !== 'OK' || !data.results.length) {
        throw new Error('Адрес не найден');
      }

      const result = data.results[0];
      const location = {
        address: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        placeId: result.place_id,
        components: result.address_components.reduce((acc, component) => {
          acc[component.types[0]] = component.long_name;
          return acc;
        }, {}),
      };

      // Сохраняем в кэш
      setCache((prev) => new Map(prev).set(address, location));

      return location;
    } catch (err) {
      console.error('Ошибка при геокодировании адреса:', err);
      setError('Ошибка при геокодировании адреса');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      const key = `${latitude},${longitude}`;
      
      // Проверяем кэш
      if (cache.has(key)) {
        return cache.get(key);
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Ошибка при обратном геокодировании');
      }

      const data = await response.json();
      if (data.status !== 'OK' || !data.results.length) {
        throw new Error('Координаты не найдены');
      }

      const result = data.results[0];
      const location = {
        address: result.formatted_address,
        latitude,
        longitude,
        placeId: result.place_id,
        components: result.address_components.reduce((acc, component) => {
          acc[component.types[0]] = component.long_name;
          return acc;
        }, {}),
      };

      // Сохраняем в кэш
      setCache((prev) => new Map(prev).set(key, location));

      return location;
    } catch (err) {
      console.error('Ошибка при обратном геокодировании:', err);
      setError('Ошибка при обратном геокодировании');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  const geocodeBatch = useCallback(async (addresses) => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await Promise.all(
        addresses.map((address) => geocodeAddress(address))
      );

      return results;
    } catch (err) {
      console.error('Ошибка при пакетном геокодировании:', err);
      setError('Ошибка при пакетном геокодировании');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [geocodeAddress]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const getGeocodingStatus = () => {
    return {
      isLoading,
      error,
      cacheSize: cache.size,
    };
  };

  return {
    geocodeAddress,
    reverseGeocode,
    geocodeBatch,
    clearCache,
    getGeocodingStatus,
  };
}; 