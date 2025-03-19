import { Settings } from '../types';

export const API_URL = process.env.API_URL || 'http://localhost:3000/api';

export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'settings',
  CACHE_PREFIX: 'cache_',
} as const;

export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

export const LOCATION_UPDATE_INTERVAL = 5000; // 5 seconds

export const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50 MB

export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'RUB'] as const;

export const SUPPORTED_DISTANCE_UNITS = ['km', 'mi'] as const;

export const DEFAULT_SETTINGS: Settings = {
  notifications: {
    tripUpdates: true,
    chatMessages: true,
    paymentUpdates: true,
  },
  theme: 'system',
  language: 'en',
  currency: 'USD',
  distanceUnit: 'km',
};

export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Неверные учетные данные',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Токен истек',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Неверный токен',
  [ERROR_CODES.VALIDATION_ERROR]: 'Ошибка валидации',
  [ERROR_CODES.NOT_FOUND]: 'Ресурс не найден',
  [ERROR_CODES.FORBIDDEN]: 'Доступ запрещен',
  [ERROR_CODES.SERVER_ERROR]: 'Внутренняя ошибка сервера',
} as const;

export const NETWORK_TYPES = {
  WIFI: 'wifi',
  CELLULAR: 'cellular',
  NONE: 'none',
} as const;

export const NETWORK_QUALITY = {
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export const BIOMETRIC_TYPES = {
  FINGERPRINT: 'fingerprint',
  FACE_ID: 'faceID',
} as const;

export const CAMERA_TYPES = {
  BACK: 'back',
  FRONT: 'front',
} as const;

export const IMAGE_QUALITY = {
  LOW: 0.5,
  MEDIUM: 0.7,
  HIGH: 0.9,
} as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const MAX_VIDEO_DURATION = 60 * 1000; // 60 seconds

export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB 