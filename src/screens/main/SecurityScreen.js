import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Surface, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SecurityScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = await AsyncStorage.getItem('token');

      await axios.post(
        'http://localhost:8000/api/users/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = await AsyncStorage.getItem('token');

      await axios.post(
        'http://localhost:8000/api/users/toggle-two-factor',
        {
          enabled: !twoFactorEnabled,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(
        twoFactorEnabled
          ? 'Двухфакторная аутентификация отключена'
          : 'Двухфакторная аутентификация включена'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при изменении настроек безопасности');
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
          <Text style={styles.title}>Безопасность</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Изменение пароля</Text>

            <TextInput
              label="Текущий пароль"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />

            <TextInput
              label="Новый пароль"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />

            <TextInput
              label="Подтвердите новый пароль"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />

            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
              loading={loading}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Изменить пароль
            </Button>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Дополнительная безопасность</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Двухфакторная аутентификация</Text>
                <Text style={styles.settingDescription}>
                  Добавьте дополнительный уровень безопасности к вашему аккаунту
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={handleToggleTwoFactor}
                disabled={loading}
              />
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  success: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SecurityScreen; 