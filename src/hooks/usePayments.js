import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from './useAuth';
import { useSettings } from './useSettings';

export const usePayments = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
    loadBalance();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getTransactions();
      setTransactions(response);
    } catch (err) {
      setError('Ошибка при загрузке транзакций');
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getBalance();
      setBalance(response.balance);
    } catch (err) {
      setError('Ошибка при загрузке баланса');
    } finally {
      setLoading(false);
    }
  };

  const addFunds = async (amount, paymentMethod) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.addFunds(amount, paymentMethod);
      setBalance(prev => prev + amount);
      setTransactions(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError('Ошибка при пополнении баланса');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async (amount, withdrawalMethod) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.withdrawFunds(amount, withdrawalMethod);
      setBalance(prev => prev - amount);
      setTransactions(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError('Ошибка при выводе средств');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const payForTrip = async (tripId, amount) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.payForTrip(tripId, amount);
      setBalance(prev => prev - amount);
      setTransactions(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError('Ошибка при оплате поездки');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refundTrip = async (tripId, amount) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.refundTrip(tripId, amount);
      setBalance(prev => prev + amount);
      setTransactions(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError('Ошибка при возврате средств');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    const currency = settings.currency;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getTransactionStatus = (status) => {
    const statusMap = {
      pending: 'В обработке',
      completed: 'Завершено',
      failed: 'Ошибка',
      refunded: 'Возвращено',
    };
    return statusMap[status] || status;
  };

  const getTransactionType = (type) => {
    const typeMap = {
      deposit: 'Пополнение',
      withdrawal: 'Вывод',
      payment: 'Оплата',
      refund: 'Возврат',
      commission: 'Комиссия',
    };
    return typeMap[type] || type;
  };

  return {
    transactions,
    balance,
    loading,
    error,
    addFunds,
    withdrawFunds,
    payForTrip,
    refundTrip,
    formatAmount,
    getTransactionStatus,
    getTransactionType,
    refreshTransactions: loadTransactions,
    refreshBalance: loadBalance,
  };
}; 