import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSettings } from './useSettings';
import { API_URL } from '../config';

export const useStatistics = () => {
  const [statistics, setStatistics] = useState({
    trips: {
      total: 0,
      completed: 0,
      cancelled: 0,
      upcoming: 0,
    },
    earnings: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
    },
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    },
    distance: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
    },
    passengers: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/statistics`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке статистики');
      }

      const data = await response.json();
      setStatistics(data);
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err);
      setError('Ошибка при загрузке статистики');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  const formatDistance = (meters) => {
    if (settings.distanceUnit === 'km') {
      return `${(meters / 1000).toFixed(1)} км`;
    }
    return `${(meters * 0.621371).toFixed(1)} миль`;
  };

  const getCompletionRate = () => {
    if (statistics.trips.total === 0) {
      return 0;
    }
    return ((statistics.trips.completed / statistics.trips.total) * 100).toFixed(1);
  };

  const getEarningsGrowth = () => {
    if (statistics.earnings.monthly === 0) {
      return 0;
    }
    return ((statistics.earnings.monthly / statistics.earnings.total) * 100).toFixed(1);
  };

  const getDistanceGrowth = () => {
    if (statistics.distance.monthly === 0) {
      return 0;
    }
    return ((statistics.distance.monthly / statistics.distance.total) * 100).toFixed(1);
  };

  const getPassengersGrowth = () => {
    if (statistics.passengers.monthly === 0) {
      return 0;
    }
    return ((statistics.passengers.monthly / statistics.passengers.total) * 100).toFixed(1);
  };

  const getRatingDistribution = () => {
    const total = Object.values(statistics.ratings.distribution).reduce(
      (sum, count) => sum + count,
      0
    );

    if (total === 0) {
      return Object.keys(statistics.ratings.distribution).map((rating) => ({
        rating: parseInt(rating),
        percentage: 0,
      }));
    }

    return Object.entries(statistics.ratings.distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      percentage: ((count / total) * 100).toFixed(1),
    }));
  };

  const getMonthlyStats = async (month, year) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/statistics/monthly?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка при загрузке месячной статистики');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Ошибка при загрузке месячной статистики:', err);
      setError('Ошибка при загрузке месячной статистики');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getStatisticsStatus = () => {
    return {
      isLoading,
      error,
      hasData: statistics.trips.total > 0,
    };
  };

  return {
    statistics,
    isLoading,
    error,
    formatAmount,
    formatDistance,
    getCompletionRate,
    getEarningsGrowth,
    getDistanceGrowth,
    getPassengersGrowth,
    getRatingDistribution,
    getMonthlyStats,
    getStatisticsStatus,
  };
}; 