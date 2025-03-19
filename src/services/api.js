import axios from 'axios';
import { API_URL } from '../constants';
import { getAuthToken } from '../utils';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена к каждому запросу
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  toggleTwoFactor: async (enabled) => {
    const response = await api.post('/users/toggle-two-factor', { enabled });
    return response.data;
  },

  getCreatedTrips: async () => {
    const response = await api.get('/users/created-trips');
    return response.data;
  },

  getJoinedTrips: async () => {
    const response = await api.get('/users/joined-trips');
    return response.data;
  },
};

// Trip Services
export const tripService = {
  getAllTrips: async (params) => {
    const response = await api.get('/trips', { params });
    return response.data;
  },

  getTripById: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  updateTrip: async (tripId, tripData) => {
    const response = await api.patch(`/trips/${tripId}`, tripData);
    return response.data;
  },

  deleteTrip: async (tripId) => {
    const response = await api.delete(`/trips/${tripId}`);
    return response.data;
  },

  joinTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/join`);
    return response.data;
  },

  leaveTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/leave`);
    return response.data;
  },

  cancelTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/cancel`);
    return response.data;
  },

  completeTrip: async (tripId) => {
    const response = await api.post(`/trips/${tripId}/complete`);
    return response.data;
  },
};

// Notification Services
export const notificationService = {
  getAllNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Review Services
export const reviewService = {
  createReview: async (tripId, reviewData) => {
    const response = await api.post(`/trips/${tripId}/reviews`, reviewData);
    return response.data;
  },

  getTripReviews: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/reviews`);
    return response.data;
  },

  getUserReviews: async (userId) => {
    const response = await api.get(`/users/${userId}/reviews`);
    return response.data;
  },
};

export default api; 