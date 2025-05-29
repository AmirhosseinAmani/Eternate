import { Product, FilterOptions } from '../types';


export const fetchProducts = async (filters?: Partial<FilterOptions>): Promise<Product[]> => {
 
  const response = await fetch('/data/products.json');
  const products: Product[] = await response.json();
  
 
  if (filters) {
    return filterProducts(products, filters);
  }
  
  return products;
};


const filterProducts = (products: Product[], filters: Partial<FilterOptions>): Product[] => {
  let filtered = [...products];
  
  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange;
    filtered = filtered.filter(product => {
      const price = Math.round((product.popularityScore + 1) * product.weight * 65); // Using fixed gold price for demo
      return price >= minPrice && price <= maxPrice;
    });
  }
  
  if (filters.popularityRange) {
    const [minPopularity, maxPopularity] = filters.popularityRange;
    filtered = filtered.filter(
      product => product.popularityScore >= minPopularity && product.popularityScore <= maxPopularity
    );
  }
  
  return filtered;
};