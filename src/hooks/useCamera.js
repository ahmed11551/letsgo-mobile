import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from './useAuth';
import { API_URL } from '../config';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
    } catch (err) {
      console.error('Ошибка при проверке разрешений:', err);
      setError('Ошибка при проверке разрешений');
    }
  };

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const takePicture = async (options = {}) => {
    try {
      if (!cameraRef.current) {
        throw new Error('Камера не инициализирована');
      }

      setIsLoading(true);
      setError(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: options.quality || 1,
        base64: options.base64 || false,
        exif: options.exif || false,
        skipProcessing: options.skipProcessing || false,
      });

      // Обработка изображения
      const processedPhoto = await processImage(photo, options);

      // Загрузка на сервер
      if (options.upload) {
        await uploadImage(processedPhoto);
      }

      return processedPhoto;
    } catch (err) {
      console.error('Ошибка при съемке фото:', err);
      setError('Ошибка при съемке фото');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const processImage = async (photo, options) => {
    try {
      const { width, height } = photo;
      const resizeWidth = options.resizeWidth || width;
      const resizeHeight = options.resizeHeight || height;
      const quality = options.quality || 0.7;

      const processed = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            resize: {
              width: resizeWidth,
              height: resizeHeight,
            },
          },
          {
            compress: quality,
          },
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return processed;
    } catch (err) {
      console.error('Ошибка при обработке изображения:', err);
      throw err;
    }
  };

  const uploadImage = async (photo) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
      });

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Ошибка при загрузке изображения:', err);
      throw err;
    }
  };

  const startRecording = async (options = {}) => {
    try {
      if (!cameraRef.current) {
        throw new Error('Камера не инициализирована');
      }

      setIsLoading(true);
      setError(null);

      const video = await cameraRef.current.recordAsync({
        quality: options.quality || Camera.Constants.VideoQuality['720p'],
        maxDuration: options.maxDuration || 60,
        maxFileSize: options.maxFileSize || 50 * 1024 * 1024, // 50MB
      });

      // Обработка видео
      const processedVideo = await processVideo(video, options);

      // Загрузка на сервер
      if (options.upload) {
        await uploadVideo(processedVideo);
      }

      return processedVideo;
    } catch (err) {
      console.error('Ошибка при записи видео:', err);
      setError('Ошибка при записи видео');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!cameraRef.current) {
        throw new Error('Камера не инициализирована');
      }

      setIsRecording(false);
      await cameraRef.current.stopRecording();
    } catch (err) {
      console.error('Ошибка при остановке записи:', err);
      setError('Ошибка при остановке записи');
    }
  };

  const processVideo = async (video, options) => {
    try {
      // Здесь можно добавить обработку видео
      // Например, сжатие, изменение размера и т.д.
      return video;
    } catch (err) {
      console.error('Ошибка при обработке видео:', err);
      throw err;
    }
  };

  const uploadVideo = async (video) => {
    try {
      const formData = new FormData();
      formData.append('video', {
        uri: video.uri,
        type: 'video/mp4',
        name: `video_${Date.now()}.mp4`,
      });

      const response = await fetch(`${API_URL}/upload/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке видео');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Ошибка при загрузке видео:', err);
      throw err;
    }
  };

  const pickImage = async (options = {}) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        ...options,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (err) {
      console.error('Ошибка при выборе изображения:', err);
      setError('Ошибка при выборе изображения');
      return null;
    }
  };

  const pickVideo = async (options = {}) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        ...options,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
      return null;
    } catch (err) {
      console.error('Ошибка при выборе видео:', err);
      setError('Ошибка при выборе видео');
      return null;
    }
  };

  const saveToGallery = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      return asset;
    } catch (err) {
      console.error('Ошибка при сохранении в галерею:', err);
      setError('Ошибка при сохранении в галерею');
      return null;
    }
  };

  const getCameraStatus = () => {
    return {
      hasPermission,
      isLoading,
      error,
      type,
      flash,
      isRecording,
    };
  };

  const getCameraRef = () => {
    return cameraRef;
  };

  const isCameraReady = () => {
    return cameraRef.current !== null;
  };

  const getSupportedCameraTypes = async () => {
    try {
      const types = await Camera.getAvailableCameraTypesAsync();
      return types;
    } catch (err) {
      console.error('Ошибка при получении поддерживаемых типов камеры:', err);
      setError('Ошибка при получении поддерживаемых типов камеры');
      return [];
    }
  };

  return {
    hasPermission,
    type,
    flash,
    isRecording,
    isLoading,
    error,
    cameraRef,
    toggleCameraType,
    toggleFlash,
    takePicture,
    startRecording,
    stopRecording,
    pickImage,
    pickVideo,
    saveToGallery,
    getCameraStatus,
    getCameraRef,
    isCameraReady,
    getSupportedCameraTypes,
  };
}; 