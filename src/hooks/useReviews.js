import { useState, useEffect } from 'react';
import { reviewService } from '../services/api';
import { useAuth } from './useAuth';

export const useReviews = (tripId = null, userId = null) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [tripId, userId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (tripId) {
        response = await reviewService.getTripReviews(tripId);
      } else if (userId) {
        response = await reviewService.getUserReviews(userId);
      }

      setReviews(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при загрузке отзывов');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.createReview(tripId, reviewData);
      setReviews(prev => [response, ...prev]);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при создании отзыва');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.updateReview(reviewId, reviewData);
      setReviews(prev => 
        prev.map(review => 
          review._id === reviewId ? response : review
        )
      );
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при обновлении отзыва');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      setLoading(true);
      setError(null);
      await reviewService.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review._id !== reviewId));
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении отзыва');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    return distribution;
  };

  return {
    reviews,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    refreshReviews: loadReviews,
    calculateAverageRating,
    getRatingDistribution,
  };
}; 