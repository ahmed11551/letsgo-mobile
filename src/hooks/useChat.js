import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { API_URL } from '../config';

export const useChat = (tripId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const ws = useRef(null);

  useEffect(() => {
    if (tripId && user) {
      connectWebSocket();
      loadMessages();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [tripId, user]);

  const connectWebSocket = () => {
    try {
      ws.current = new WebSocket(`${API_URL.replace('http', 'ws')}/chat/${tripId}`);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Ошибка соединения с чатом');
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Ошибка при подключении к WebSocket:', err);
      setError('Ошибка при подключении к чату');
    }
  };

  const disconnectWebSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/chat/${tripId}/messages`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке сообщений');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Ошибка при загрузке сообщений:', err);
      setError('Ошибка при загрузке сообщений');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    try {
      if (!isConnected) {
        throw new Error('Нет соединения с чатом');
      }

      const message = {
        text,
        senderId: user.id,
        senderName: user.name,
        timestamp: new Date().toISOString(),
      };

      ws.current.send(JSON.stringify(message));

      // Добавляем сообщение локально для мгновенного отображения
      setMessages((prev) => [...prev, message]);

      // Отправляем сообщение на сервер для сохранения
      const response = await fetch(`${API_URL}/chat/${tripId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения');
      }
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Ошибка при отправке сообщения');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/chat/${tripId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении сообщения');
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error('Ошибка при удалении сообщения:', err);
      setError('Ошибка при удалении сообщения');
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`${API_URL}/chat/${tripId}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при отметке сообщения как прочитанного');
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error('Ошибка при отметке сообщения как прочитанного:', err);
      setError('Ошибка при отметке сообщения как прочитанного');
    }
  };

  const getChatStatus = () => {
    return {
      isLoading,
      error,
      isConnected,
      messageCount: messages.length,
    };
  };

  return {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    deleteMessage,
    markAsRead,
    getChatStatus,
  };
}; 