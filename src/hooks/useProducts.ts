import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/products';
import { FilterOptions, Product } from '../types';

export const useProducts = (filters?: Partial<FilterOptions>) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(filters);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [filters]);

  return { products, loading, error };
};