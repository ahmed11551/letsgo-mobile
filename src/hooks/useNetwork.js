import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [networkType, setNetworkType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setNetworkType(state.type);
      setIsLoading(false);
    });

    // Получаем начальное состояние сети
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setNetworkType(state.type);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setNetworkType(state.type);
    } catch (err) {
      console.error('Ошибка при проверке подключения:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNetworkInfo = () => {
    return {
      isConnected,
      isInternetReachable,
      networkType,
      isWifi: networkType === 'wifi',
      isCellular: networkType === 'cellular',
      isEthernet: networkType === 'ethernet',
      isVpn: networkType === 'vpn',
      isUnknown: networkType === 'unknown',
      isNone: networkType === 'none',
    };
  };

  const getNetworkTypeText = () => {
    switch (networkType) {
      case 'wifi':
        return 'Wi-Fi';
      case 'cellular':
        return 'Мобильный интернет';
      case 'ethernet':
        return 'Ethernet';
      case 'vpn':
        return 'VPN';
      case 'none':
        return 'Нет подключения';
      default:
        return 'Неизвестный тип';
    }
  };

  const getNetworkStatusText = () => {
    if (!isConnected) {
      return 'Нет подключения к сети';
    }

    if (!isInternetReachable) {
      return 'Нет доступа к интернету';
    }

    return `Подключено через ${getNetworkTypeText()}`;
  };

  const isNetworkAvailable = () => {
    return isConnected && isInternetReachable;
  };

  const isWifiAvailable = () => {
    return isConnected && isInternetReachable && networkType === 'wifi';
  };

  const isCellularAvailable = () => {
    return isConnected && isInternetReachable && networkType === 'cellular';
  };

  const getNetworkQuality = () => {
    if (!isConnected || !isInternetReachable) {
      return 'none';
    }

    switch (networkType) {
      case 'wifi':
        return 'high';
      case 'cellular':
        return 'medium';
      case 'ethernet':
        return 'high';
      case 'vpn':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getNetworkIcon = () => {
    if (!isConnected) {
      return 'wifi-off';
    }

    switch (networkType) {
      case 'wifi':
        return 'wifi';
      case 'cellular':
        return 'signal-cellular-4-bar';
      case 'ethernet':
        return 'ethernet';
      case 'vpn':
        return 'vpn-lock';
      default:
        return 'wifi-tethering';
    }
  };

  const getNetworkColor = () => {
    if (!isConnected || !isInternetReachable) {
      return '#FF0000';
    }

    switch (networkType) {
      case 'wifi':
        return '#4CAF50';
      case 'cellular':
        return '#2196F3';
      case 'ethernet':
        return '#4CAF50';
      case 'vpn':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  return {
    isConnected,
    isInternetReachable,
    networkType,
    isLoading,
    checkConnection,
    getNetworkInfo,
    getNetworkTypeText,
    getNetworkStatusText,
    isNetworkAvailable,
    isWifiAvailable,
    isCellularAvailable,
    getNetworkQuality,
    getNetworkIcon,
    getNetworkColor,
  };
}; 