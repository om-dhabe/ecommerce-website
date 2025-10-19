"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock || addingToCart) return;
    
    setAddingToCart(true);
    
    // Add subtle delay for better UX feedback
    setTimeout(() => {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }));
      setAddingToCart(false);
    }, 300);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating: number = 0) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden card stagger-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square sm:aspect-[4/3]">
          {/* Image skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          
          <img
            src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop"}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Mobile-first overlay actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-4 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
          } sm:bg-black/40 sm:items-center sm:justify-center sm:p-0`}>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                className={`bg-white text-gray-900 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-200 bounce-on-click disabled:opacity-50 disabled:cursor-not-allowed ${
                  addingToCart ? 'scale-95' : ''
                }`}
                aria-label="Add to cart"
              >
                <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 ${addingToCart ? 'animate-pulse' : ''}`} />
              </button>
              <Link
                href={`/products/${product.id}`}
                className="bg-white text-gray-900 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-all duration-200 bounce-on-click"
                aria-label="View product"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full transition-all duration-200 bounce-on-click backdrop-blur-sm"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                isWishlisted ? "text-red-500 fill-current scale-110" : "text-gray-600"
              }`}
            />
          </button>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col space-y-1">
            {!product.inStock && (
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Out of Stock
              </div>
            )}
            {product.price < 100 && product.inStock && (
              <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Sale
              </div>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="mb-2">
            <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base leading-tight">
            {product.title}
          </h3>
          
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1 sm:space-x-2 mb-3">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {product.rating}
              </span>
              {product.reviews && (
                <span className="text-xs text-gray-500 hidden sm:inline">
                  ({product.reviews.toLocaleString()})
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-lg sm:text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.price > 200 && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Mobile: Icon button, Desktop: Text button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || addingToCart}
              className="btn-primary text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[32px] sm:min-h-[36px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </span>
              <ShoppingCart className="w-4 h-4 sm:hidden" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}