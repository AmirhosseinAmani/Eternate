import React, { useState } from 'react';
import { FilterOptions } from '../types';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';

interface FilterPanelProps {
  initialFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  initialFilters, 
  onFilterChange,
  maxPrice = 10000 
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [expanded, setExpanded] = useState(false);

  const handlePriceChange = (values: [number, number]) => {
    const newFilters = { ...filters, priceRange: values };
    setFilters(newFilters);
  };

  const handlePopularityChange = (values: [number, number]) => {
    const newFilters = { ...filters, popularityRange: values };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setExpanded(false);
  };

  const resetFilters = () => {
    const resetFilters = {
      priceRange: [0, 10000],
      popularityRange: [0, 1],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 10000 ||
    filters.popularityRange[0] > 0 ||
    filters.popularityRange[1] < 1;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 mb-6">
      <button 
        className="w-full px-6 py-4 flex items-center justify-between text-gray-800 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="space-y-6 pt-6">
            {/* Price Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Price Range</h3>
                <span className="text-sm text-gray-500">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-2 bg-gray-800 rounded-full"
                      style={{
                        left: `${(filters.priceRange[0] / 10000) * 100}%`,
                        right: `${100 - (filters.priceRange[1] / 10000) * 100}%`
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange([parseInt(e.target.value), filters.priceRange[1]])}
                    className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
                    className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Popularity Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Popularity</h3>
                <span className="text-sm text-gray-500">
                  {Math.round(filters.popularityRange[0] * 100)}% - {Math.round(filters.popularityRange[1] * 100)}%
                </span>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-2 bg-gray-800 rounded-full"
                      style={{
                        left: `${filters.popularityRange[0] * 100}%`,
                        right: `${100 - filters.popularityRange[1] * 100}%`
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={filters.popularityRange[0]}
                    onChange={(e) => handlePopularityChange([parseFloat(e.target.value), filters.popularityRange[1]])}
                    className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={filters.popularityRange[1]}
                    onChange={(e) => handlePopularityChange([filters.popularityRange[0], parseFloat(e.target.value)])}
                    className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={resetFilters}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors click-feedback"
              >
                <X className="w-4 h-4 mr-1" />
                Reset All
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors click-feedback"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;