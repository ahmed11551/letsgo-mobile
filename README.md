# LetsGo Mobile App

Мобильное приложение для поиска попутчиков и организации поездок.

## Возможности

- 🔐 Аутентификация пользователей
- 🗺️ Поиск маршрутов и попутчиков
- 📍 Отслеживание местоположения
- 💬 Чат между пользователями
- 🔔 Push-уведомления
- 💳 Платежная система
- 📱 Адаптивный дизайн
- 🌙 Поддержка темной темы
- 🔒 Биометрическая аутентификация
- 📸 Загрузка фотографий

## Технологии

- React Native
- Expo
- TypeScript
- React Navigation
- Redux Toolkit
- React Native Maps
- Expo Location
- Expo Notifications
- Expo Camera
- Expo Local Authentication

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/letsgo-mobile.git
cd letsgo-mobile
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне проекта и добавьте необходимые переменные окружения:
```env
API_URL=your_api_url
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Запустите приложение:
```bash
# Для iOS
npm run ios

# Для Android
npm run android
```

## Разработка

### Скрипты

- `npm start` - Запуск Metro bundler
- `npm run ios` - Запуск на iOS
- `npm run android` - Запуск на Android
- `npm test` - Запуск тестов
- `npm run test:watch` - Запуск тестов в режиме watch
- `npm run test:coverage` - Запуск тестов с отчетом о покрытии
- `npm run lint` - Проверка кода линтером
- `npm run lint:fix` - Исправление ошибок линтера
- `npm run format` - Форматирование кода

### Структура проекта

```
src/
├── components/     # Переиспользуемые компоненты
├── screens/        # Экраны приложения
├── navigation/     # Настройки навигации
├── hooks/         # Пользовательские хуки
├── services/      # Сервисы для работы с API
├── store/         # Redux store
├── utils/         # Вспомогательные функции
├── constants/     # Константы
└── types/         # TypeScript типы
```

### Тестирование

Проект использует Jest и React Testing Library для тестирования. Тесты находятся в директории `__tests__`.

### Линтинг и форматирование

- ESLint для проверки кода
- Prettier для форматирования
- Husky для pre-commit хуков
- lint-staged для проверки только измененных файлов

## Лицензия

MIT
