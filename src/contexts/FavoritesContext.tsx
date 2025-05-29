import React, { createContext, useContext, useReducer } from 'react';
import { Product } from '../types';

interface FavoriteItem {
  product: Product;
}

interface FavoritesState {
  items: FavoriteItem[];
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: { product: Product } };

const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
} | null>(null);

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const exists = state.items.some(
        item => item.product.name === action.payload.product.name
      );

      if (exists) return state;

      return {
        items: [...state.items, action.payload],
      };
    }

    case 'REMOVE_FAVORITE': {
      return {
        items: state.items.filter(
          item => item.product.name !== action.payload.product.name
        ),
      };
    }

    default:
      return state;
  }
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] });

  return (
    <FavoritesContext.Provider value={{ state, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};