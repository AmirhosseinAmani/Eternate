import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useGoldPrice } from '../hooks/useGoldPrice';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';
import { FilterOptions, GoldColor } from '../types';
import { calculatePrice } from '../utils/price';
import { Range } from 'react-range';

const ProductList: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<Record<string, GoldColor>>({});
  const [tempFilters, setTempFilters] = useState<FilterOptions>({
    priceRange: [0, 10000] as [number, number],
    popularityRange: [0, 1] as [number, number]
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>(tempFilters);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [maxVisibleItems, setMaxVisibleItems] = useState(window.innerWidth < 768 ? 1 : 4);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const { products, loading } = useProducts(appliedFilters);
  const { goldPrice } = useGoldPrice();

  const totalItems = 8;
  const maxIndex = Math.max(0, totalItems - maxVisibleItems);

  useEffect(() => {
    const updateDimensions = () => {
      if (itemRef.current && carouselRef.current) {
        const item = itemRef.current;
        const container = carouselRef.current;
        
        const itemStyle = window.getComputedStyle(item);
        const itemWidthWithMargin = item.offsetWidth + 
          parseFloat(itemStyle.marginLeft) + 
          parseFloat(itemStyle.marginRight);
        
        setItemWidth(itemWidthWithMargin); 
        setContainerWidth(container.offsetWidth);
      }
    };

    const timer = setTimeout(updateDimensions, 100);
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, [isMobile, maxVisibleItems]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setMaxVisibleItems(mobile ? 1 : 4);
      
      if (mobile !== isMobile) {
        setCurrentIndex(0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const nextItem = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevItem = () => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleColorChange = (productName: string, color: GoldColor) => {
    setSelectedColors(prev => ({
      ...prev,
      [productName]: color
    }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    setTempFilters(prev => ({
      ...prev,
      priceRange: [values[0], values[1]] as [number, number]
    }));
  };

  const handlePopularityRangeChange = (values: number[]) => {
    setTempFilters(prev => ({
      ...prev,
      popularityRange: [values[0], values[1]] as [number, number]
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 10000] as [number, number],
      popularityRange: [0, 1] as [number, number]
    };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="text-center mb-8 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl font-light tracking-wide">Product List</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <h2 className="text-base sm:text-lg font-medium">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm text-gray-600">Price Range</label>
              <span className="text-sm text-gray-500">
                ${tempFilters.priceRange[0]} - ${tempFilters.priceRange[1]}
              </span>
            </div>
            <div className="px-2 py-3 sm:py-4">
              <Range
                step={100}
                min={0}
                max={10000}
                values={tempFilters.priceRange}
                onChange={handlePriceRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 w-full bg-gray-200 rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        #1f2937 0%, 
                        #1f2937 ${(tempFilters.priceRange[0] / 10000) * 100}%, 
                        #e5e7eb ${(tempFilters.priceRange[0] / 10000) * 100}%, 
                        #e5e7eb ${(tempFilters.priceRange[1] / 10000) * 100}%, 
                        #1f2937 ${(tempFilters.priceRange[1] / 10000) * 100}%, 
                        #1f2937 100%)`
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 sm:h-5 sm:w-5 bg-white rounded-full shadow-md border-2 border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm text-gray-600">Popularity Score</label>
              <span className="text-sm text-gray-500">
                {(tempFilters.popularityRange[0] * 5).toFixed(1)} - {(tempFilters.popularityRange[1] * 5).toFixed(1)} stars
              </span>
            </div>
            <div className="px-2 py-3 sm:py-4">
              <Range
                step={0.1}
                min={0}
                max={1}
                values={tempFilters.popularityRange}
                onChange={handlePopularityRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 w-full bg-gray-200 rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        #1f2937 0%, 
                        #1f2937 ${tempFilters.popularityRange[0] * 100}%, 
                        #e5e7eb ${tempFilters.popularityRange[0] * 100}%, 
                        #e5e7eb ${tempFilters.popularityRange[1] * 100}%, 
                        #1f2937 ${tempFilters.popularityRange[1] * 100}%, 
                        #1f2937 100%)`
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 sm:h-5 sm:w-5 bg-white rounded-full shadow-md border-2 border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 pt-4 border-t">
          <button
            onClick={resetFilters}
            className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={applyFilters}
            className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="relative px-4 sm:px-12 overflow-hidden" ref={carouselRef}>
        <button
          onClick={prevItem}
          disabled={isAnimating || currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-8"
            style={{
              transform: `translateX(-${currentIndex * (containerWidth / maxVisibleItems)}px)`,
              width: `${totalItems * (containerWidth / maxVisibleItems)}px`,
            }}
          >
            {products.slice(0, totalItems).map((product, index) => {
              const selectedColor = selectedColors[product.name] || 'yellow';
              return (
                <div 
                  key={product.name} 
                  ref={index === 0 ? itemRef : null}
                  className="flex-none space-y-3 sm:space-y-4 px-1 sm:px-2"
                  style={{ width: `${containerWidth / maxVisibleItems}px` }}
                >
                   <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <img
                      src={product.images[selectedColor]}
                      alt={product.name}
                      className="w-full aspect-square object-contain rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="font-light text-lg sm:text-xl">{product.name}</h2>
                    <p className="font-light text-base sm:text-lg">${calculatePrice(product.popularityScore, product.weight, goldPrice)} USD</p>
                    <p className="text-sm text-gray-500">Weight: {product.weight}g</p>
                    
                    <div className="flex items-center gap-2 pl-1">
                      <button 
                        onClick={() => handleColorChange(product.name, 'yellow')}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-300 border transition-all ${
                          selectedColor === 'yellow' 
                            ? 'ring-2 ring-gray-400 scale-110' 
                            : 'border-gray-200 hover:ring-1 hover:ring-300'
                        }`}
                        aria-label="Select Yellow Gold"
                      />
                      <button 
                        onClick={() => handleColorChange(product.name, 'white')}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 border transition-all ${
                          selectedColor === 'white' 
                            ? 'ring-2 ring-gray-400 scale-110' 
                            : 'border-gray-200 hover:ring-1 hover:ring-300'
                        }`}
                        aria-label="Select White Gold"
                      />
                      <button 
                        onClick={() => handleColorChange(product.name, 'rose')}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-200 border transition-all ${
                          selectedColor === 'rose' 
                            ? 'ring-2 ring-gray-400 scale-110' 
                            : 'border-gray-200 hover:ring-1 hover:ring-300'
                        }`}
                        aria-label="Select Rose Gold"
                      />
                    </div>
                    <p className="text-sm sm:text-base text-gray-500 pl-1">
                      {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Gold
                    </p>
                    <div className="flex items-center gap-1 pl-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.floor(product.popularityScore * 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="text-sm sm:text-base text-gray-500 ml-1">
                        {(product.popularityScore * 5).toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={nextItem}
          disabled={isAnimating || currentIndex >= maxIndex}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Next item"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductList;