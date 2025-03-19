export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  driverId: string;
  from: Location;
  to: Location;
  date: string;
  price: number;
  seats: number;
  availableSeats: number;
  description?: string;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type TripStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Chat {
  id: string;
  tripId: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  type: MessageType;
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'location';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Settings {
  notifications: {
    tripUpdates: boolean;
    chatMessages: boolean;
    paymentUpdates: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  distanceUnit: 'km' | 'mi';
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isWifiEnabled: boolean;
  isCellularEnabled: boolean;
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresIn?: number;
} 