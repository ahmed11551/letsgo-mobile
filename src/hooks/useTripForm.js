import { useState } from 'react';
import { useLocation } from './useLocation';
import { useTrips } from './useTrips';
import { useNavigation } from '@react-navigation/native';

export const useTripForm = () => {
  const navigation = useNavigation();
  const { location, getAddressFromCoordinates, getCoordinatesFromAddress } = useLocation();
  const { createTrip, loading, error } = useTrips();

  const [formData, setFormData] = useState({
    startLocation: {
      address: '',
      coordinates: null,
    },
    endLocation: {
      address: '',
      coordinates: null,
    },
    date: new Date(),
    time: new Date(),
    price: '',
    seats: '',
    description: '',
    carModel: '',
    carColor: '',
    carNumber: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startLocation.address) {
      newErrors.startLocation = 'Укажите начальную точку маршрута';
    }

    if (!formData.endLocation.address) {
      newErrors.endLocation = 'Укажите конечную точку маршрута';
    }

    if (!formData.price) {
      newErrors.price = 'Укажите стоимость поездки';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Некорректная стоимость';
    }

    if (!formData.seats) {
      newErrors.seats = 'Укажите количество мест';
    } else if (isNaN(formData.seats) || Number(formData.seats) <= 0) {
      newErrors.seats = 'Некорректное количество мест';
    }

    if (!formData.description) {
      newErrors.description = 'Добавьте описание поездки';
    }

    if (!formData.carModel) {
      newErrors.carModel = 'Укажите модель автомобиля';
    }

    if (!formData.carColor) {
      newErrors.carColor = 'Укажите цвет автомобиля';
    }

    if (!formData.carNumber) {
      newErrors.carNumber = 'Укажите номер автомобиля';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleLocationSelect = async (type, address) => {
    try {
      const coordinates = await getCoordinatesFromAddress(address);
      setFormData(prev => ({
        ...prev,
        [type]: {
          address,
          coordinates,
        },
      }));
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        [type]: 'Ошибка при определении местоположения',
      }));
    }
  };

  const handleCurrentLocation = async (type) => {
    if (location) {
      try {
        const address = await getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );
        setFormData(prev => ({
          ...prev,
          [type]: {
            address: `${address.street || ''} ${address.name || ''}`.trim(),
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Ошибка при определении текущего местоположения',
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const tripData = {
        ...formData,
        startLocation: formData.startLocation.coordinates,
        endLocation: formData.endLocation.coordinates,
        price: Number(formData.price),
        seats: Number(formData.seats),
        date: formData.date.toISOString(),
        time: formData.time.toISOString(),
      };

      await createTrip(tripData);
      navigation.goBack();
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: 'Ошибка при создании поездки',
      }));
    }
  };

  return {
    formData,
    errors,
    loading,
    error,
    handleInputChange,
    handleLocationSelect,
    handleCurrentLocation,
    handleSubmit,
  };
}; 