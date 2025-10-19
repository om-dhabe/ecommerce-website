"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Play, Pause } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 70% Off",
    description: "Discover amazing deals on fashion, electronics, and more",
    buttonText: "Shop Now",
    buttonLink: "/categories/sale",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    bgColor: "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Collection",
    description: "Explore the newest products from top brands",
    buttonText: "Explore",
    buttonLink: "/categories/new",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
    bgColor: "bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Trusted by Millions",
    description: "Shop with confidence from verified vendors",
    buttonText: "Learn More",
    buttonLink: "/about",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
    bgColor: "bg-gradient-to-br from-purple-600 via-pink-600 to-red-500",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(heroSlides.length).fill(false));

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isAutoPlaying]);

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <section 
      className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      role="region"
      aria-label="Hero carousel"
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide 
              ? "opacity-100 translate-x-0 scale-100" 
              : index < currentSlide 
                ? "opacity-0 -translate-x-full scale-95" 
                : "opacity-0 translate-x-full scale-95"
          }`}
          aria-hidden={index !== currentSlide}
        >
          <div className={`${slide.bgColor} h-full flex items-center relative overflow-hidden`}>
            {/* Background pattern for visual interest */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>
            
            <div className="container relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="text-white text-center lg:text-left fade-in">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                    <span className="block slide-up" style={{ animationDelay: '200ms' }}>
                      {slide.title}
                    </span>
                  </h1>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 text-yellow-300 slide-up" style={{ animationDelay: '400ms' }}>
                    {slide.subtitle}
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl mb-8 text-gray-100 leading-relaxed slide-up" style={{ animationDelay: '600ms' }}>
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start slide-up" style={{ animationDelay: '800ms' }}>
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 bounce-on-click scale-on-hover"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      {slide.buttonText}
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 bounce-on-click"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                
                <div className="hidden lg:block slide-up" style={{ animationDelay: '1000ms' }}>
                  <div className="relative">
                    {!imageLoaded[index] && (
                      <div className="aspect-[4/3] skeleton rounded-lg"></div>
                    )}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`rounded-lg shadow-2xl transition-all duration-500 hover:scale-105 ${
                        imageLoaded[index] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(index)}
                      loading="lazy"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg scale-on-hover">
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">4.9/5</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Trusted by 10M+ customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 bounce-on-click backdrop-blur-sm hidden sm:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 bounce-on-click backdrop-blur-sm hidden sm:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 bounce-on-click backdrop-blur-sm hidden sm:block"
        aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isAutoPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ 
            width: isAutoPlaying ? '100%' : '0%',
            animation: isAutoPlaying ? 'progress 5s linear infinite' : 'none'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}