# Компоненты

## Общие компоненты

### Button
```jsx
import { Button } from '../components/common/Button';

<Button
  title="Нажми меня"
  onPress={() => {}}
  variant="primary"
  size="medium"
  disabled={false}
/>
```

#### Props
- `title` (string) - Текст кнопки
- `onPress` (function) - Обработчик нажатия
- `variant` (string) - Вариант стиля ('primary' | 'secondary' | 'outline')
- `size` (string) - Размер кнопки ('small' | 'medium' | 'large')
- `disabled` (boolean) - Отключена ли кнопка
- `loading` (boolean) - Показывать ли индикатор загрузки

### Input
```jsx
import { Input } from '../components/common/Input';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Введите email"
  keyboardType="email-address"
  error="Неверный email"
/>
```

#### Props
- `label` (string) - Метка поля
- `value` (string) - Значение поля
- `onChangeText` (function) - Обработчик изменения
- `placeholder` (string) - Подсказка
- `keyboardType` (string) - Тип клавиатуры
- `error` (string) - Текст ошибки
- `secureTextEntry` (boolean) - Скрывать ли текст

### Card
```jsx
import { Card } from '../components/common/Card';

<Card>
  <Text>Содержимое карточки</Text>
</Card>
```

#### Props
- `children` (node) - Содержимое карточки
- `style` (object) - Дополнительные стили
- `onPress` (function) - Обработчик нажатия

## Компоненты поездок

### TripCard
```jsx
import { TripCard } from '../components/trips/TripCard';

<TripCard
  trip={{
    id: '1',
    from: 'Moscow',
    to: 'Saint Petersburg',
    date: '2024-03-20',
    price: 1000,
    seats: 3,
  }}
  onPress={() => {}}
/>
```

#### Props
- `trip` (object) - Данные поездки
- `onPress` (function) - Обработчик нажатия

### TripForm
```jsx
import { TripForm } from '../components/trips/TripForm';

<TripForm
  onSubmit={handleSubmit}
  initialValues={{
    from: '',
    to: '',
    date: new Date(),
    price: 0,
    seats: 1,
  }}
/>
```

#### Props
- `onSubmit` (function) - Обработчик отправки формы
- `initialValues` (object) - Начальные значения

## Компоненты чата

### ChatList
```jsx
import { ChatList } from '../components/chat/ChatList';

<ChatList
  chats={chats}
  onChatPress={(chat) => {}}
/>
```

#### Props
- `chats` (array) - Список чатов
- `onChatPress` (function) - Обработчик выбора чата

### ChatMessage
```jsx
import { ChatMessage } from '../components/chat/ChatMessage';

<ChatMessage
  message={{
    id: '1',
    text: 'Привет!',
    sender: 'user',
    timestamp: new Date(),
  }}
/>
```

#### Props
- `message` (object) - Данные сообщения

## Компоненты профиля

### ProfileHeader
```jsx
import { ProfileHeader } from '../components/profile/ProfileHeader';

<ProfileHeader
  user={{
    name: 'John Doe',
    avatar: 'url',
    rating: 4.5,
  }}
  onEditPress={() => {}}
/>
```

#### Props
- `user` (object) - Данные пользователя
- `onEditPress` (function) - Обработчик нажатия на кнопку редактирования

### SettingsList
```jsx
import { SettingsList } from '../components/profile/SettingsList';

<SettingsList
  settings={{
    notifications: true,
    darkMode: false,
    language: 'ru',
  }}
  onSettingChange={(key, value) => {}}
/>
```

#### Props
- `settings` (object) - Настройки пользователя
- `onSettingChange` (function) - Обработчик изменения настроек

## Компоненты карты

### MapView
```jsx
import { MapView } from '../components/map/MapView';

<MapView
  initialRegion={{
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  markers={markers}
  onMarkerPress={(marker) => {}}
/>
```

#### Props
- `initialRegion` (object) - Начальный регион карты
- `markers` (array) - Маркеры на карте
- `onMarkerPress` (function) - Обработчик нажатия на маркер

### RouteMap
```jsx
import { RouteMap } from '../components/map/RouteMap';

<RouteMap
  route={{
    from: { latitude: 55.7558, longitude: 37.6173 },
    to: { latitude: 59.9343, longitude: 30.3061 },
  }}
  currentLocation={{
    latitude: 55.7558,
    longitude: 37.6173,
  }}
/>
```

#### Props
- `route` (object) - Маршрут
- `currentLocation` (object) - Текущее местоположение 