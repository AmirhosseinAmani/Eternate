import { useState, useEffect } from 'react';
import { fetchGoldPrice } from '../api/goldPrice';

export const useGoldPrice = () => {
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getGoldPrice = async () => {
      try {
        setLoading(true);
        const price = await fetchGoldPrice();
        setGoldPrice(price);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gold price'));
      } finally {
        setLoading(false);
      }
    };

    getGoldPrice();
    
    // Refresh gold price every 5 minutes
    const interval = setInterval(getGoldPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { goldPrice, loading, error };
};