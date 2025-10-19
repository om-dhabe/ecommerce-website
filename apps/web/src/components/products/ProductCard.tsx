"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/store/slices/productsSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    }));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating: number = 0) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center space-x-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}>
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-200"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
              }`}
            />
          </button>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Out of Stock
            </div>
          )}

          {/* Discount Badge */}
          {product.price < 100 && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Sale
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.title}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating}
              </span>
              {product.reviews && (
                <span className="text-sm text-gray-500">
                  ({product.reviews} reviews)
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.price > 200 && (
                <span className="text-sm text-gray-500 line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}