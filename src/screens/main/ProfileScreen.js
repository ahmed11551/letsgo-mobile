import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, Surface, Button, Avatar, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await AsyncStorage.getItem('token');
      const userData = JSON.parse(await AsyncStorage.getItem('user'));

      const response = await axios.get(`http://localhost:8000/api/users/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      navigation.replace('Login');
    } catch (err) {
      setError('Ошибка при выходе из системы');
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Пользователь не найден</Text>
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
        <View style={styles.header}>
          <Avatar.Text
            size={80}
            label={user.name.substring(0, 2).toUpperCase()}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>
            {user.role === 'driver' ? 'Водитель' : 'Пассажир'}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Item
            title="Email"
            description={user.email}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Телефон"
            description={user.phone}
            left={props => <List.Icon {...props} icon="phone" />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>Статистика</List.Subheader>
          <List.Item
            title="Созданных поездок"
            description={user.createdTrips?.length || 0}
            left={props => <List.Icon {...props} icon="car" />}
          />
          <List.Item
            title="Присоединенных поездок"
            description={user.joinedTrips?.length || 0}
            left={props => <List.Icon {...props} icon="account-group" />}
          />
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader>Настройки</List.Subheader>
          <List.Item
            title="Редактировать профиль"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <List.Item
            title="Уведомления"
            left={props => <List.Icon {...props} icon="bell" />}
            onPress={() => navigation.navigate('Notifications')}
          />
          <List.Item
            title="Безопасность"
            left={props => <List.Icon {...props} icon="shield-lock" />}
            onPress={() => navigation.navigate('Security')}
          />
        </List.Section>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          color="red"
        >
          Выйти
        </Button>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    marginVertical: 20,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default ProfileScreen; 