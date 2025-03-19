import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, Surface, List, Divider, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TripsScreen = () => {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('created');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const endpoint = viewMode === 'created'
        ? `http://localhost:8000/api/users/${user.id}/created-trips`
        : `http://localhost:8000/api/users/${user.id}/joined-trips`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrips(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке поездок');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [viewMode]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  };

  const handleTripPress = (trip) => {
    navigation.navigate('TripDetails', { tripId: trip.id });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA000';
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'active':
        return 'В пути';
      case 'completed':
        return 'Завершена';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
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
        <Text style={styles.title}>Мои поездки</Text>

        <SegmentedButtons
          value={viewMode}
          onValueChange={setViewMode}
          buttons={[
            { value: 'created', label: 'Созданные' },
            { value: 'joined', label: 'Присоединенные' },
          ]}
          style={styles.segmentedButtons}
        />

        {trips.length === 0 ? (
          <Text style={styles.emptyText}>
            {viewMode === 'created'
              ? 'У вас пока нет созданных поездок'
              : 'Вы пока не присоединились ни к одной поездке'}
          </Text>
        ) : (
          trips.map((trip) => (
            <React.Fragment key={trip.id}>
              <List.Item
                title={`${trip.startLocation.address} → ${trip.endLocation.address}`}
                description={`${new Date(trip.startTime).toLocaleString()} • ${trip.price} ₽`}
                left={props => (
                  <List.Icon
                    {...props}
                    icon="car"
                    color={getStatusColor(trip.status)}
                  />
                )}
                right={props => (
                  <Text {...props} style={[styles.status, { color: getStatusColor(trip.status) }]}>
                    {getStatusText(trip.status)}
                  </Text>
                )}
                onPress={() => handleTripPress(trip)}
                style={styles.tripItem}
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
  segmentedButtons: {
    marginBottom: 20,
  },
  tripItem: {
    paddingVertical: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
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

export default TripsScreen; 