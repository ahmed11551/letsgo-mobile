import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text, Card, Button, FAB, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getLocation();
    fetchTrips();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Необходим доступ к геолокации');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (err) {
      setError('Ошибка при получении геолокации');
    }
  };

  const fetchTrips = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/trips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(response.data);
    } catch (err) {
      setError('Ошибка при загрузке поездок');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  const handleTripPress = (trip) => {
    navigation.navigate('TripDetails', { trip });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords?.latitude || 55.7558,
          longitude: location?.coords?.longitude || 37.6173,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {trips.map((trip) => (
          <Marker
            key={trip._id}
            coordinate={{
              latitude: trip.startLocation.coordinates[1],
              longitude: trip.startLocation.coordinates[0],
            }}
            title={trip.description || 'Поездка'}
            description={`${trip.price} ₽`}
          />
        ))}
      </MapView>

      <Surface style={styles.tripsContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            trips.map((trip) => (
              <Card
                key={trip._id}
                style={styles.tripCard}
                onPress={() => handleTripPress(trip)}
              >
                <Card.Content>
                  <Text variant="titleMedium">
                    {trip.startLocation.address || 'Отправление'}
                  </Text>
                  <Text variant="bodyMedium">
                    {trip.endLocation.address || 'Назначение'}
                  </Text>
                  <Text variant="bodyMedium">
                    {new Date(trip.startTime).toLocaleString()}
                  </Text>
                  <Text variant="bodyMedium">
                    Цена: {trip.price} ₽
                  </Text>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      </Surface>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTrip')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
  tripsContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  tripCard: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen; 