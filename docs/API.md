# API Documentation

## Аутентификация

### Регистрация
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Вход
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Выход
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## Пользователи

### Получение профиля
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Обновление профиля
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890"
}
```

### Изменение пароля
```http
PUT /api/users/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

## Поездки

### Создание поездки
```http
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "from": {
    "address": "Moscow",
    "coordinates": {
      "latitude": 55.7558,
      "longitude": 37.6173
    }
  },
  "to": {
    "address": "Saint Petersburg",
    "coordinates": {
      "latitude": 59.9343,
      "longitude": 30.3061
    }
  },
  "date": "2024-03-20T10:00:00Z",
  "price": 1000,
  "seats": 3,
  "description": "Comfortable ride"
}
```

### Поиск поездок
```http
GET /api/trips/search
Authorization: Bearer <token>
Query Parameters:
  from: string
  to: string
  date: string (ISO)
  seats: number
```

### Получение деталей поездки
```http
GET /api/trips/:id
Authorization: Bearer <token>
```

### Обновление местоположения
```http
POST /api/trips/:id/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 55.7558,
  "longitude": 37.6173,
  "speed": 60,
  "heading": 90
}
```

## Чат

### Получение списка чатов
```http
GET /api/chats
Authorization: Bearer <token>
```

### Получение сообщений чата
```http
GET /api/chats/:id/messages
Authorization: Bearer <token>
```

### Отправка сообщения
```http
POST /api/chats/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Hello!",
  "type": "text"
}
```

## Платежи

### Пополнение баланса
```http
POST /api/payments/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "card"
}
```

### Вывод средств
```http
POST /api/payments/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "cardNumber": "4111111111111111"
}
```

### Получение истории транзакций
```http
GET /api/payments/transactions
Authorization: Bearer <token>
```

## Уведомления

### Регистрация устройства
```http
POST /api/notifications/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "expo-push-token"
}
```

### Получение настроек уведомлений
```http
GET /api/notifications/settings
Authorization: Bearer <token>
```

### Обновление настроек уведомлений
```http
PUT /api/notifications/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "tripUpdates": true,
  "chatMessages": true,
  "paymentUpdates": true
}
```

## Обработка ошибок

Все API эндпоинты возвращают ошибки в следующем формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Коды ошибок

- `AUTH_INVALID_CREDENTIALS` - Неверные учетные данные
- `AUTH_TOKEN_EXPIRED` - Токен истек
- `AUTH_TOKEN_INVALID` - Неверный токен
- `VALIDATION_ERROR` - Ошибка валидации
- `NOT_FOUND` - Ресурс не найден
- `FORBIDDEN` - Доступ запрещен
- `SERVER_ERROR` - Внутренняя ошибка сервера 