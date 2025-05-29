import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Check } from 'lucide-react';
import { Product, GoldColor } from '../types';
import { calculatePrice, formatPrice, popularityToStars } from '../utils/price';
import StarRating from './StarRating';
import ColorPicker from './ColorPicker';
import Carousel from './Carousel';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ProductDetailProps {
  products: Product[];
  goldPrice: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ products, goldPrice }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<GoldColor>('yellow');
  const [isAdded, setIsAdded] = useState(false);
  
  const { dispatch: cartDispatch } = useCart();
  const { state: favoritesState, dispatch: favoritesDispatch } = useFavorites();
  
  const product = products.find(p => p.name === decodeURIComponent(productId || ''));
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Product not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-gray-800 hover:text-gray-600 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const price = calculatePrice(product.popularityScore, product.weight, goldPrice);
  const formattedPrice = formatPrice(price);
  const starRating = popularityToStars(product.popularityScore);
  const isFavorite = favoritesState.items.some(item => item.product.name === product.name);

  const handleAddToCart = () => {
    cartDispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        color: selectedColor,
        quantity: 1,
        price
      }
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      favoritesDispatch({
        type: 'REMOVE_FAVORITE',
        payload: { product }
      });
    } else {
      favoritesDispatch({
        type: 'ADD_FAVORITE',
        payload: { product }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <button
            onClick={toggleFavorite}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 ${
              isFavorite ? 'text-red-500' : 'text-gray-600'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <Carousel
            images={[product.images[selectedColor]]}
            alt={product.name}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-medium text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-semibold text-gray-900">{formattedPrice}</p>
              <StarRating rating={starRating} />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600">
                This exquisite engagement ring showcases exceptional craftsmanship and timeless elegance. 
                Meticulously handcrafted by our master jewelers, it features a weight of {product.weight}g 
                and is available in three stunning 18K gold options.
              </p>
            </div>
          </div>

          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Product Details</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>• Weight: {product.weight}g of 18K Gold</li>
              <li>• Available in Yellow, Rose, and White Gold</li>
              <li>• Handcrafted in our Istanbul atelier</li>
              <li>• Free shipping and returns</li>
              <li>• Lifetime warranty</li>
            </ul>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full py-4 px-8 rounded-md transition-all duration-300 text-lg font-medium ${
              isAdded 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isAdded ? (
              <span className="flex items-center justify-center">
                <Check className="w-5 h-5 mr-2" />
                Added to Cart
              </span>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;