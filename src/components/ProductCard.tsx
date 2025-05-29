import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, GoldColor } from '../types';
import { calculatePrice, formatPrice, popularityToStars } from '../utils/price';
import StarRating from './StarRating';
import ColorPicker from './ColorPicker';
import Carousel from './Carousel';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Check, Heart, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  goldPrice: number;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, goldPrice, index }) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<GoldColor>('yellow');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { dispatch: cartDispatch } = useCart();
  const { state: favoritesState, dispatch: favoritesDispatch } = useFavorites();
  
  const price = calculatePrice(product.popularityScore, product.weight, goldPrice);
  const formattedPrice = formatPrice(price);
  const starRating = popularityToStars(product.popularityScore);
  
  const currentImage = product.images[selectedColor];
  
  const isFavorite = favoritesState.items.some(item => item.product.name === product.name);

  const handleColorChange = (color: GoldColor) => {
    setSelectedColor(color);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleEnterPage = () => {
    navigate(`/product/${encodeURIComponent(product.name)}`);
  };

  // Calculate staggered animation delay based on index
  const animationDelay = `${index * 100}ms`;

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover-lift animate-scale cursor-pointer relative"
        style={{ animationDelay }}
      >
        <div className={`relative ${!isImageLoaded ? 'bg-gray-100' : ''}`}>
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loading-spinner" />
            </div>
          )}
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
            images={[currentImage]} 
            alt={product.name}
            onImageLoad={() => setIsImageLoaded(true)}
          />
        </div>
        
        <div className="p-5">
          <h2 className="text-xl font-serif font-medium text-gray-800 mb-2 animate-fade-in"
              style={{ animationDelay: `${parseInt(animationDelay) + 100}ms` }}>
            {product.name}
          </h2>
          
          <div className="flex justify-between items-start mb-3">
            <div className="animate-slide-up"
                style={{ animationDelay: `${parseInt(animationDelay) + 200}ms` }}>
              <p className="text-2xl font-semibold text-gray-900">{formattedPrice}</p>
              <p className="text-sm text-gray-500">Weight: {product.weight}g</p>
            </div>
            <div className="animate-fade-in"
                style={{ animationDelay: `${parseInt(animationDelay) + 300}ms` }}>
              <StarRating rating={starRating} />
            </div>
          </div>
          
          <div className="animate-fade-in"
              style={{ animationDelay: `${parseInt(animationDelay) + 400}ms` }}>
            <ColorPicker 
              selectedColor={selectedColor} 
              onColorChange={handleColorChange} 
            />
          </div>
          
          <div className="flex gap-2 mt-5">
            <button 
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 click-feedback animate-fade-in flex items-center justify-center ${
                isAdded 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              style={{ animationDelay: `${parseInt(animationDelay) + 500}ms` }}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Added
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
            <button
              onClick={handleDetailsClick}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-all duration-300 click-feedback animate-fade-in flex items-center gap-2"
              style={{ animationDelay: `${parseInt(animationDelay) + 500}ms` }}
            >
              <Info className="w-4 h-4" />
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-scale">
            <h3 className="text-xl font-serif mb-4">View Details</h3>
            <p className="text-gray-600 mb-6">
              Would you like to see more details about this beautiful piece?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnterPage}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;