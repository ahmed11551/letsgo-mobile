import { useState, useEffect } from 'react';
import { tripService } from '../services/api';

export const useTrips = (params = {}) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.getAllTrips(params);
      setTrips(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке поездок');
    } finally {
      setLoading(false);
    }
  };

  const refreshTrips = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await tripService.getAllTrips(params);
      setTrips(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении поездок');
    } finally {
      setRefreshing(false);
    }
  };

  const createTrip = async (tripData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.createTrip(tripData);
      setTrips([response, ...trips]);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId, tripData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.updateTrip(tripId, tripData);
      setTrips(trips.map(trip => 
        trip._id === tripId ? response : trip
      ));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      await tripService.deleteTrip(tripId);
      setTrips(trips.filter(trip => trip._id !== tripId));
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.joinTrip(tripId);
      setTrips(trips.map(trip => 
        trip._id === tripId ? response : trip
      ));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при присоединении к поездке');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.leaveTrip(tripId);
      setTrips(trips.map(trip => 
        trip._id === tripId ? response : trip
      ));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при выходе из поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.cancelTrip(tripId);
      setTrips(trips.map(trip => 
        trip._id === tripId ? response : trip
      ));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отмене поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tripService.completeTrip(tripId);
      setTrips(trips.map(trip => 
        trip._id === tripId ? response : trip
      ));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при завершении поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [params]);

  return {
    trips,
    loading,
    error,
    refreshing,
    refreshTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    joinTrip,
    leaveTrip,
    cancelTrip,
    completeTrip,
  };
}; 