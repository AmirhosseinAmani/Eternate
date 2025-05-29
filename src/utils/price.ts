
export const calculatePrice = (
  popularityScore: number,
  weight: number,
  goldPrice: number
): number => {
  return Math.round((popularityScore + 1) * weight * goldPrice);
};


export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};


export const popularityToStars = (popularityScore: number): number => {
  return Math.round(popularityScore * 5 * 10) / 10;
};