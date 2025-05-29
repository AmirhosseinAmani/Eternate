import React, { createContext, useContext, useReducer } from 'react';
import { Product, GoldColor } from '../types';

interface CartItem {
  product: Product;
  color: GoldColor;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { product: Product; color: GoldColor } }
  | { type: 'UPDATE_QUANTITY'; payload: { product: Product; color: GoldColor; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.name === action.payload.product.name && 
               item.color === action.payload.color
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          items: newItems,
          total: state.total + action.payload.price * action.payload.quantity
        };
      }

      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price * action.payload.quantity
      };
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(
        item => item.product.name === action.payload.product.name && 
               item.color === action.payload.color
      );
      
      if (!itemToRemove) return state;

      return {
        items: state.items.filter(
          item => !(item.product.name === action.payload.product.name && 
                   item.color === action.payload.color)
        ),
        total: state.total - (itemToRemove.price * itemToRemove.quantity)
      };
    }

    case 'UPDATE_QUANTITY': {
      const itemIndex = state.items.findIndex(
        item => item.product.name === action.payload.product.name && 
               item.color === action.payload.color
      );
      
      if (itemIndex === -1) return state;

      const newItems = [...state.items];
      const oldTotal = newItems[itemIndex].price * newItems[itemIndex].quantity;
      newItems[itemIndex].quantity = action.payload.quantity;
      const newTotal = newItems[itemIndex].price * action.payload.quantity;

      return {
        items: newItems,
        total: state.total - oldTotal + newTotal
      };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};