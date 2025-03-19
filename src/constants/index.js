export const API_URL = 'http://localhost:8000/api';

export const TRIP_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const TRIP_STATUS_COLORS = {
  [TRIP_STATUS.PENDING]: '#FFA000',
  [TRIP_STATUS.ACTIVE]: '#4CAF50',
  [TRIP_STATUS.COMPLETED]: '#2196F3',
  [TRIP_STATUS.CANCELLED]: '#F44336',
};

export const TRIP_STATUS_TEXT = {
  [TRIP_STATUS.PENDING]: 'Ожидает',
  [TRIP_STATUS.ACTIVE]: 'В пути',
  [TRIP_STATUS.COMPLETED]: 'Завершена',
  [TRIP_STATUS.CANCELLED]: 'Отменена',
};

export const USER_ROLES = {
  DRIVER: 'driver',
  PASSENGER: 'passenger',
};

export const USER_ROLE_TEXT = {
  [USER_ROLES.DRIVER]: 'Водитель',
  [USER_ROLES.PASSENGER]: 'Пассажир',
};

export const NOTIFICATION_TYPES = {
  TRIP_REQUEST: 'trip_request',
  TRIP_ACCEPTED: 'trip_accepted',
  TRIP_CANCELLED: 'trip_cancelled',
  TRIP_COMPLETED: 'trip_completed',
};

export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.TRIP_REQUEST]: 'car',
  [NOTIFICATION_TYPES.TRIP_ACCEPTED]: 'check-circle',
  [NOTIFICATION_TYPES.TRIP_CANCELLED]: 'close-circle',
  [NOTIFICATION_TYPES.TRIP_COMPLETED]: 'flag',
};

export const NOTIFICATION_COLORS = {
  [NOTIFICATION_TYPES.TRIP_REQUEST]: '#2196F3',
  [NOTIFICATION_TYPES.TRIP_ACCEPTED]: '#4CAF50',
  [NOTIFICATION_TYPES.TRIP_CANCELLED]: '#F44336',
  [NOTIFICATION_TYPES.TRIP_COMPLETED]: '#2196F3',
};

export const MAP_INITIAL_REGION = {
  latitude: 55.7558,
  longitude: 37.6173,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const SCREEN_NAMES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  TRIPS: 'Trips',
  PROFILE: 'Profile',
  CREATE_TRIP: 'CreateTrip',
  TRIP_DETAILS: 'TripDetails',
  EDIT_PROFILE: 'EditProfile',
  NOTIFICATIONS: 'Notifications',
  SECURITY: 'Security',
};

export const THEME = {
  colors: {
    primary: '#2196F3',
    secondary: '#4CAF50',
    error: '#F44336',
    warning: '#FFA000',
    success: '#4CAF50',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  elevation: {
    sm: 2,
    md: 4,
    lg: 8,
  },
}; 