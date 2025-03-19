import { useState, useEffect } from 'react';
import { useLocation } from './useLocation';
import { useSettings } from './useSettings';

export const useRoutes = () => {
  const { location, getAddressFromCoordinates } = useLocation();
  const { settings } = useSettings();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRoute = async (origin, destination) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      const data = await response.json();
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const polyline = route.overview_polyline.points;
        const decodedPolyline = decodePolyline(polyline);
        const steps = route.legs[0].steps.map(step => ({
          ...step,
          polyline: decodePolyline(step.polyline.points),
        }));

        setRoute({
          distance: route.legs[0].distance.value,
          duration: route.legs[0].duration.value,
          polyline: decodedPolyline,
          steps,
          bounds: route.bounds,
        });
      } else {
        setError('Маршрут не найден');
      }
    } catch (err) {
      setError('Ошибка при получении маршрута');
    } finally {
      setLoading(false);
    }
  };

  const getRouteFromAddresses = async (originAddress, destinationAddress) => {
    try {
      setLoading(true);
      setError(null);

      const origin = await getCoordinatesFromAddress(originAddress);
      const destination = await getCoordinatesFromAddress(destinationAddress);

      if (origin && destination) {
        await getRoute(origin, destination);
      } else {
        setError('Не удалось определить координаты адресов');
      }
    } catch (err) {
      setError('Ошибка при получении маршрута');
    } finally {
      setLoading(false);
    }
  };

  const getRouteFromCurrentLocation = async (destination) => {
    try {
      setLoading(true);
      setError(null);

      if (location) {
        await getRoute(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          destination
        );
      } else {
        setError('Не удалось определить текущее местоположение');
      }
    } catch (err) {
      setError('Ошибка при получении маршрута');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (distance) => {
    const unit = settings.distanceUnit;
    if (unit === 'km') {
      return `${(distance / 1000).toFixed(1)} км`;
    }
    return `${distance.toFixed(0)} м`;
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    }
    return `${minutes} мин`;
  };

  const getRouteInfo = () => {
    if (!route) return null;

    return {
      distance: formatDistance(route.distance),
      duration: formatDuration(route.duration),
      polyline: route.polyline,
      steps: route.steps,
      bounds: route.bounds,
    };
  };

  // Функция для декодирования полилинии
  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let shift = 0, result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      lat += ((result & 1) ? ~(result >> 1) : (result >> 1));

      shift = 0;
      result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      lng += ((result & 1) ? ~(result >> 1) : (result >> 1));

      points.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5,
      });
    }

    return points;
  };

  return {
    route,
    loading,
    error,
    getRoute,
    getRouteFromAddresses,
    getRouteFromCurrentLocation,
    getRouteInfo,
    formatDistance,
    formatDuration,
  };
}; 