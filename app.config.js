export default {
  name: 'LetsGo',
  slug: 'letsgo',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.letsgo.app',
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'Приложению необходим доступ к геолокации для определения вашего местоположения и поиска ближайших поездок.',
      NSLocationAlwaysUsageDescription: 'Приложению необходим доступ к геолокации для определения вашего местоположения и поиска ближайших поездок.',
      NSCameraUsageDescription: 'Приложению необходим доступ к камере для добавления фотографий профиля.',
      NSPhotoLibraryUsageDescription: 'Приложению необходим доступ к галерее для добавления фотографий профиля.',
      NSMicrophoneUsageDescription: 'Приложению необходим доступ к микрофону для голосовых сообщений.',
      NSContactsUsageDescription: 'Приложению необходим доступ к контактам для приглашения друзей.',
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.letsgo.app',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'RECORD_AUDIO',
      'READ_CONTACTS',
      'WRITE_CONTACTS',
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Приложению необходим доступ к геолокации для определения вашего местоположения и поиска ближайших поездок.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Приложению необходим доступ к галерее для добавления фотографий профиля.',
        cameraPermission: 'Приложению необходим доступ к камере для добавления фотографий профиля.',
      },
    ],
    [
      'expo-contacts',
      {
        contactsPermission: 'Приложению необходим доступ к контактам для приглашения друзей.',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'your-project-id'
    }
  }
}; 