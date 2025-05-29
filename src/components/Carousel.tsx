import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  alt: string;
  onImageLoad?: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ images, alt, onImageLoad }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const minSwipeDistance = 50;

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current) return;
      
      // Check if the carousel is in the viewport
      const rect = carouselRef.current.getBoundingClientRect();
      const isVisible = 
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;
      
      if (!isVisible) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={carouselRef}
      className="relative w-full h-80 md:h-96 lg:h-[32rem] overflow-hidden rounded-2xl"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Image carousel"
    >
      <div 
        className="flex h-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={() => setIsTransitioning(false)}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full flex-shrink-0 transition-opacity duration-300"
            style={{
              opacity: index === currentIndex ? 1 : 0.3,
              transform: `scale(${index === currentIndex ? 1 : 0.9})`,
              transition: 'all 500ms ease-out'
            }}
          >
            <img
              src={image}
              alt={`${alt} - View ${index + 1}`}
              className="w-full h-full object-contain rounded-2xl"
              loading="lazy"
              onLoad={onImageLoad}
            />
          </div>
        ))}
      </div>
      
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 click-feedback transform hover:-translate-x-1"
        onClick={goToPrevious}
        disabled={isTransitioning}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>
      
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-2xl shadow-lg transition-all duration-200 hover:scale-110 click-feedback transform hover:translate-x-1"
        onClick={goToNext}
        disabled={isTransitioning}
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-xl transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-gray-800 w-6 scale-110' 
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }
            }}
            disabled={isTransitioning}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;