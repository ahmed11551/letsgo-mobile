import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Surface, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const CreateTripScreen = () => {
  const navigation = useNavigation();
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');
  const [startTime, setStartTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Необходим доступ к геолокации');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setStartLocation({
        coordinates: [location.coords.longitude, location.coords.latitude],
        address: 'Текущее местоположение',
      });
    } catch (err) {
      setError('Ошибка при получении геолокации');
    }
  };

  const handleCreateTrip = async () => {
    try {
      setLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const tripData = {
        driver: user.id,
        startLocation,
        endLocation,
        price: parseFloat(price),
        seats: parseInt(seats),
        startTime: new Date(startTime).toISOString(),
        description,
      };

      await axios.post('http://localhost:8000/api/trips', tripData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigation.goBack();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании поездки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text style={styles.title}>Создать поездку</Text>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: startLocation?.coordinates[1] || 55.7558,
              longitude: startLocation?.coordinates[0] || 37.6173,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {startLocation && (
              <Marker
                coordinate={{
                  latitude: startLocation.coordinates[1],
                  longitude: startLocation.coordinates[0],
                }}
                title="Отправление"
              />
            )}
            {endLocation && (
              <Marker
                coordinate={{
                  latitude: endLocation.coordinates[1],
                  longitude: endLocation.coordinates[0],
                }}
                title="Назначение"
                pinColor="red"
              />
            )}
          </MapView>

          <TextInput
            label="Цена"
            value={price}
            onChangeText={setPrice}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Количество мест"
            value={seats}
            onChangeText={setSeats}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Время отправления"
            value={startTime}
            onChangeText={setStartTime}
            mode="outlined"
            style={styles.input}
            placeholder="YYYY-MM-DD HH:mm"
          />

          <TextInput
            label="Описание"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleCreateTrip}
            style={styles.button}
            loading={loading}
            disabled={!startLocation || !endLocation || !price || !seats || !startTime}
          >
            Создать поездку
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
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
  map: {
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default CreateTripScreen; 