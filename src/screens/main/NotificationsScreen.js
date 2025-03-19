import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, Surface, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get('http://localhost:8000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке уведомлений');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification) => {
    if (notification.type === 'trip_request' || notification.type === 'trip_accepted') {
      navigation.navigate('TripDetails', { tripId: notification.tripId });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trip_request':
        return 'car';
      case 'trip_accepted':
        return 'check-circle';
      case 'trip_cancelled':
        return 'close-circle';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'trip_request':
        return '#2196F3';
      case 'trip_accepted':
        return '#4CAF50';
      case 'trip_cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Surface style={styles.surface}>
        <Text style={styles.title}>Уведомления</Text>

        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>Нет новых уведомлений</Text>
        ) : (
          notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <List.Item
                title={notification.title}
                description={notification.message}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={getNotificationIcon(notification.type)}
                    color={getNotificationColor(notification.type)}
                  />
                )}
                onPress={() => handleNotificationPress(notification)}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification
                ]}
              />
              <Divider />
            </React.Fragment>
          ))
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  notificationItem: {
    paddingVertical: 10,
  },
  unreadNotification: {
    backgroundColor: '#E3F2FD',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default NotificationsScreen; 