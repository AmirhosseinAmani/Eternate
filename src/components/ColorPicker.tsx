import React from 'react';
import { GoldColor } from '../types';

interface ColorPickerProps {
  selectedColor: GoldColor;
  onColorChange: (color: GoldColor) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  const colors: { value: GoldColor; label: string; bgClass: string }[] = [
    { value: 'yellow', label: '18K Yellow Gold', bgClass: 'bg-amber-400' },
    { value: 'rose', label: '18K Rose Gold', bgClass: 'bg-rose-300' },
    { value: 'white', label: '18K White Gold', bgClass: 'bg-gray-200' },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Metal Options</h3>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <div key={color.value} className="relative group">
            <button
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedColor === color.value
                  ? 'ring-2 ring-offset-2 ring-gray-800 scale-110'
                  : 'ring-1 ring-gray-300 hover:scale-105'
              } click-feedback`}
              onClick={() => onColorChange(color.value)}
              aria-label={`Select ${color.label}`}
            >
              <span className={`w-8 h-8 rounded-full ${color.bgClass}`}></span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {color.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;