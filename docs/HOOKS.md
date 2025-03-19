# Хуки

## Аутентификация

### useAuth
```jsx
import { useAuth } from '../hooks/useAuth';

const { user, isLoading, error, login, register, logout } = useAuth();
```

#### Возвращаемые значения
- `user` (object | null) - Данные пользователя
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `login` (function) - Функция входа
- `register` (function) - Функция регистрации
- `logout` (function) - Функция выхода
- `updateProfile` (function) - Функция обновления профиля
- `changePassword` (function) - Функция изменения пароля

## Геолокация

### useLocation
```jsx
import { useLocation } from '../hooks/useLocation';

const { location, isLoading, error, getCurrentLocation, startTracking, stopTracking } = useLocation();
```

#### Возвращаемые значения
- `location` (object | null) - Текущее местоположение
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `getCurrentLocation` (function) - Получение текущего местоположения
- `startTracking` (function) - Начало отслеживания
- `stopTracking` (function) - Остановка отслеживания

### useGeocoding
```jsx
import { useGeocoding } from '../hooks/useGeocoding';

const { geocode, reverseGeocode, isLoading, error } = useGeocoding();
```

#### Возвращаемые значения
- `geocode` (function) - Преобразование адреса в координаты
- `reverseGeocode` (function) - Преобразование координат в адрес
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка

## Поездки

### useTrips
```jsx
import { useTrips } from '../hooks/useTrips';

const { trips, isLoading, error, createTrip, searchTrips, getTripDetails } = useTrips();
```

#### Возвращаемые значения
- `trips` (array) - Список поездок
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `createTrip` (function) - Создание поездки
- `searchTrips` (function) - Поиск поездок
- `getTripDetails` (function) - Получение деталей поездки

### useTripSearch
```jsx
import { useTripSearch } from '../hooks/useTripSearch';

const { searchResults, isLoading, error, search } = useTripSearch();
```

#### Возвращаемые значения
- `searchResults` (array) - Результаты поиска
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `search` (function) - Функция поиска

## Чат

### useChat
```jsx
import { useChat } from '../hooks/useChat';

const { messages, isLoading, error, sendMessage, loadMessages } = useChat(chatId);
```

#### Возвращаемые значения
- `messages` (array) - Список сообщений
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `sendMessage` (function) - Отправка сообщения
- `loadMessages` (function) - Загрузка сообщений

## Уведомления

### useNotifications
```jsx
import { useNotifications } from '../hooks/useNotifications';

const { registerForPushNotifications, handleNotification } = useNotifications();
```

#### Возвращаемые значения
- `registerForPushNotifications` (function) - Регистрация для push-уведомлений
- `handleNotification` (function) - Обработка уведомления
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка

## Платежи

### usePayments
```jsx
import { usePayments } from '../hooks/usePayments';

const { balance, transactions, isLoading, error, addFunds, withdrawFunds } = usePayments();
```

#### Возвращаемые значения
- `balance` (number) - Баланс
- `transactions` (array) - История транзакций
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `addFunds` (function) - Пополнение баланса
- `withdrawFunds` (function) - Вывод средств

## Настройки

### useSettings
```jsx
import { useSettings } from '../hooks/useSettings';

const { settings, isLoading, error, updateSetting } = useSettings();
```

#### Возвращаемые значения
- `settings` (object) - Настройки пользователя
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `updateSetting` (function) - Обновление настройки

## Биометрия

### useBiometrics
```jsx
import { useBiometrics } from '../hooks/useBiometrics';

const { isAvailable, isEnabled, authenticate, enableBiometrics, disableBiometrics } = useBiometrics();
```

#### Возвращаемые значения
- `isAvailable` (boolean) - Доступна ли биометрия
- `isEnabled` (boolean) - Включена ли биометрия
- `authenticate` (function) - Аутентификация
- `enableBiometrics` (function) - Включение биометрии
- `disableBiometrics` (function) - Отключение биометрии

## Камера

### useCamera
```jsx
import { useCamera } from '../hooks/useCamera';

const { takePicture, recordVideo, isLoading, error } = useCamera();
```

#### Возвращаемые значения
- `takePicture` (function) - Сделать фото
- `recordVideo` (function) - Записать видео
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка

## Сеть

### useNetwork
```jsx
import { useNetwork } from '../hooks/useNetwork';

const { isConnected, networkType, isLoading, error } = useNetwork();
```

#### Возвращаемые значения
- `isConnected` (boolean) - Подключено ли устройство
- `networkType` (string) - Тип сети
- `isLoading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка

## Кэш

### useCache
```jsx
import { useCache } from '../hooks/useCache';

const { setItem, getItem, removeItem, clear } = useCache();
```

#### Возвращаемые значения
- `setItem` (function) - Сохранение в кэш
- `getItem` (function) - Получение из кэша
- `removeItem` (function) - Удаление из кэша
- `clear` (function) - Очистка кэша 