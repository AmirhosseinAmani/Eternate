export interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
}

export type GoldColor = 'yellow' | 'rose' | 'white';

export interface FilterOptions {
  priceRange: [number, number];
  popularityRange: [number, number];
}