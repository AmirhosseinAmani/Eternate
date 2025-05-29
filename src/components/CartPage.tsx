import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/price';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, dispatch: cartDispatch } = useCart();

  const updateQuantity = (productName: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartState.items.find(
      item => item.product.name === productName && item.color === color
    );
    
    if (!item) return;
    
    cartDispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        product: item.product,
        color: item.color,
        quantity: newQuantity
      }
    });
  };

  const removeItem = (productName: string, color: string) => {
    const item = cartState.items.find(
      item => item.product.name === productName && item.color === color
    );
    
    if (!item) return;
    
    cartDispatch({
      type: 'REMOVE_ITEM',
      payload: {
        product: item.product,
        color: item.color
      }
    });
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </button>
        
        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Continue Shopping
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-serif mb-6">Shopping Cart</h1>
          
          <div className="space-y-4">
            {cartState.items.map((item, index) => (
              <div 
                key={`${item.product.name}-${item.color}-${index}`}
                className="bg-white rounded-lg shadow-md p-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[item.color]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-serif text-lg mb-1">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Color: {item.color.charAt(0).toUpperCase() + item.color.slice(1)} Gold
                    </p>
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.name, item.color, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.name, item.color, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.product.name, item.color)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-serif mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartState.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(cartState.total)}</span>
              </div>
            </div>
            
            <button 
              className="w-full py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              onClick={() => {/* Implement checkout */}}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;