import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, Surface, Button, Avatar, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';

const TripDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const response = await axios.get(`http://localhost:8000/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrip(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке деталей поездки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTripDetails();
    setRefreshing(false);
  };

  const handleJoinTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/trips/${tripId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTripDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при присоединении к поездке');
    }
  };

  const handleCancelTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`http://localhost:8000/api/trips/${tripId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отмене поездки');
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

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Поездка не найдена</Text>
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
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: trip.startLocation.coordinates[1],
            longitude: trip.startLocation.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: trip.startLocation.coordinates[1],
              longitude: trip.startLocation.coordinates[0],
            }}
            title="Отправление"
          />
          <Marker
            coordinate={{
              latitude: trip.endLocation.coordinates[1],
              longitude: trip.endLocation.coordinates[0],
            }}
            title="Назначение"
            pinColor="red"
          />
        </MapView>

        <View style={styles.driverInfo}>
          <Avatar.Text
            size={50}
            label={trip.driver.name.substring(0, 2).toUpperCase()}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{trip.driver.name}</Text>
            <Text style={styles.driverPhone}>{trip.driver.phone}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.tripDetails}>
          <Text style={styles.label}>Откуда:</Text>
          <Text style={styles.value}>{trip.startLocation.address}</Text>

          <Text style={styles.label}>Куда:</Text>
          <Text style={styles.value}>{trip.endLocation.address}</Text>

          <Text style={styles.label}>Время отправления:</Text>
          <Text style={styles.value}>
            {new Date(trip.startTime).toLocaleString()}
          </Text>

          <Text style={styles.label}>Цена:</Text>
          <Text style={styles.value}>{trip.price} ₽</Text>

          <Text style={styles.label}>Свободных мест:</Text>
          <Text style={styles.value}>
            {trip.seats - trip.passengers.length} из {trip.seats}
          </Text>

          {trip.description && (
            <>
              <Text style={styles.label}>Описание:</Text>
              <Text style={styles.value}>{trip.description}</Text>
            </>
          )}
        </View>

        <View style={styles.passengersList}>
          <Text style={styles.sectionTitle}>Пассажиры:</Text>
          {trip.passengers.map((passenger) => (
            <View key={passenger.id} style={styles.passengerItem}>
              <Avatar.Text
                size={40}
                label={passenger.name.substring(0, 2).toUpperCase()}
              />
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>{passenger.name}</Text>
                <Text style={styles.passengerPhone}>{passenger.phone}</Text>
              </View>
            </View>
          ))}
        </View>

        {trip.status === 'pending' && (
          <Button
            mode="contained"
            onPress={handleJoinTrip}
            style={styles.button}
            disabled={trip.passengers.length >= trip.seats}
          >
            Присоединиться к поездке
          </Button>
        )}

        {trip.status === 'active' && trip.driver.id === user.id && (
          <Button
            mode="contained"
            onPress={handleCancelTrip}
            style={styles.button}
            color="red"
          >
            Отменить поездку
          </Button>
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
  map: {
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverDetails: {
    marginLeft: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverPhone: {
    color: '#666',
  },
  divider: {
    marginVertical: 20,
  },
  tripDetails: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
  passengersList: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  passengerDetails: {
    marginLeft: 15,
  },
  passengerName: {
    fontSize: 16,
  },
  passengerPhone: {
    color: '#666',
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default TripDetailsScreen; 