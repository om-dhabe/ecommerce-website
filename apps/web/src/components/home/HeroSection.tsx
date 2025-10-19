"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 70% Off",
    description: "Discover amazing deals on fashion, electronics, and more",
    buttonText: "Shop Now",
    buttonLink: "/categories/sale",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Latest Collection",
    description: "Explore the newest products from top brands",
    buttonText: "Explore",
    buttonLink: "/categories/new",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    bgColor: "bg-gradient-to-r from-green-600 to-blue-600",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Trusted by Millions",
    description: "Shop with confidence from verified vendors",
    buttonText: "Learn More",
    buttonLink: "/about",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    bgColor: "bg-gradient-to-r from-purple-600 to-pink-600",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : 
            index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className={`${slide.bgColor} h-full flex items-center`}>
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                  <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-2xl lg:text-3xl font-semibold mb-4 text-yellow-300">
                    {slide.subtitle}
                  </p>
                  <p className="text-xl mb-8 text-gray-100">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      {slide.buttonText}
                    </Link>
                    <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-lg shadow-2xl"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
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

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}