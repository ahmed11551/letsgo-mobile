import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import { useSettings } from './useSettings';
import { API_URL } from '../config';

export const useTripSearch = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: null,
    time: null,
    seats: 1,
    price: {
      min: 0,
      max: null,
    },
    rating: 0,
    distance: 50, // км
  });
  const [sortBy, setSortBy] = useState('price'); // price, distance, rating, time
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const { location, getCurrentLocation } = useGeolocation();
  const { settings } = useSettings();

  const searchTrips = useCallback(async (searchParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const currentLocation = await getCurrentLocation();
      if (!currentLocation) {
        throw new Error('Не удалось получить текущее местоположение');
      }

      const params = new URLSearchParams({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        date: filters.date?.toISOString(),
        time: filters.time,
        seats: filters.seats,
        minPrice: filters.price.min,
        maxPrice: filters.price.max,
        minRating: filters.rating,
        maxDistance: filters.distance,
        sortBy,
        sortOrder,
        page,
        ...searchParams,
      });

      const response = await fetch(`${API_URL}/trips/search?${params}`);
      if (!response.ok) {
        throw new Error('Ошибка при поиске поездок');
      }

      const data = await response.json();
      setTrips((prevTrips) => [...prevTrips, ...data.trips]);
      setHasMore(data.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error('Ошибка при поиске поездок:', err);
      setError('Ошибка при поиске поездок');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, sortOrder, page, getCurrentLocation]);

  const resetSearch = () => {
    setTrips([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    resetSearch();
  };

  const updateSort = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    resetSearch();
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      searchTrips();
    }
  };

  const selectTrip = (trip) => {
    setSelectedTrip(trip);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: settings.currency,
    }).format(price);
  };

  const formatDistance = (distance) => {
    if (settings.distanceUnit === 'km') {
      return `${distance.toFixed(1)} км`;
    }
    return `${(distance * 0.621371).toFixed(1)} миль`;
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}ч ${minutes}м`;
  };

  const getTripDetails = async (tripId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/trips/${tripId}`);
      if (!response.ok) {
        throw new Error('Ошибка при получении деталей поездки');
      }

      const trip = await response.json();
      setSelectedTrip(trip);
      return trip;
    } catch (err) {
      console.error('Ошибка при получении деталей поездки:', err);
      setError('Ошибка при получении деталей поездки');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchStatus = () => {
    return {
      isLoading,
      error,
      hasMore,
      totalTrips: trips.length,
      currentPage: page,
    };
  };

  return {
    trips,
    selectedTrip,
    isLoading,
    error,
    filters,
    sortBy,
    sortOrder,
    hasMore,
    searchTrips,
    resetSearch,
    updateFilters,
    updateSort,
    loadMore,
    selectTrip,
    formatPrice,
    formatDistance,
    formatDuration,
    getTripDetails,
    getSearchStatus,
  };
}; 