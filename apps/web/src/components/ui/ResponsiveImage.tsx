"use client";

import { useState } from "react";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/4';
  priority?: boolean;
}

export function ResponsiveImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'square',
  priority = false 
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    'square': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/4': 'aspect-[3/4]'
  };

  const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

  return (
    <div className={`relative overflow-hidden ${aspectClasses[aspectRatio]} ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton" />
      )}
      
      <img
        src={hasError ? fallbackImage : src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        loading={priority ? "eager" : "lazy"}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded"></div>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}