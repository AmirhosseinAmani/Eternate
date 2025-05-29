import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, className = '' }) => {
  
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasPartialStar ? 1 : 0);
  const partialStarPercentage = hasPartialStar ? (rating % 1) * 100 : 0;

  return (
    <div className={`flex items-center ${className}`}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-amber-400 text-amber-400" />
      ))}
      
      {/* Partial star */}
      {hasPartialStar && (
        <div className="relative w-5 h-5">
          <Star className="absolute w-5 h-5 text-amber-400" />
          <div className="absolute overflow-hidden\" style={{ width: `${partialStarPercentage}%` }}>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-amber-400" />
      ))}
      
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;