# LetsGo Mobile

Мобильное приложение для поиска попутчиков и организации совместных поездок.

## Функциональность

- Авторизация и регистрация пользователей
- Создание и поиск поездок
- Чат между пользователями
- Геолокация и построение маршрутов
- Система рейтингов и отзывов
- Платежная система
- Уведомления
- Настройки профиля и приложения

## Технологии

- React Native
- TypeScript
- Expo
- React Navigation
- Redux Toolkit
- React Query
- Axios
- Socket.io
- Google Maps API
- Stripe API

## Установка

1. Клонировать репозиторий:
```bash
git clone https://github.com/ahmed11551/letsgo-mobile.git
```

2. Установить зависимости:
```bash
cd letsgo_mobile
npm install
```

3. Запустить Metro сервер:
```bash
npm start
```

4. Запустить приложение:
```bash
# Для Android
npm run android

# Для iOS
npm run ios
```

## Требования

- Node.js 14+
- npm 6+
- Android Studio (для Android)
- Xcode (для iOS, только на macOS)
- JDK 11
- Android SDK
- iOS SDK

## Структура проекта

```
src/
  ├── api/          # API клиенты и интеграции
  ├── components/   # React компоненты
  ├── hooks/        # Кастомные хуки
  ├── navigation/   # Навигация
  ├── screens/      # Экраны приложения
  ├── store/        # Redux store
  ├── types/        # TypeScript типы
  └── utils/        # Утилиты и хелперы
```

## Лицензия

MIT
