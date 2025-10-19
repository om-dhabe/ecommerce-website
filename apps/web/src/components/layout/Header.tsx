"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart,
  MapPin 
} from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const categories = [
    "Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty"
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="container py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Free shipping on orders over $50
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/help" className="hover:text-gray-300">Help</Link>
            <Link href="/track-order" className="hover:text-gray-300">Track Order</Link>
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="hover:text-gray-300">Sign In</Link>
                <Link href="/register" className="hover:text-gray-300">Register</Link>
              </>
            ) : (
              <span>Welcome, {user?.name || user?.email}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">EcommercePro</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Link href="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
              <Heart className="w-6 h-6" />
              <span className="text-xs mt-1">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex flex-col items-center text-gray-700 hover:text-blue-600 relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs mt-1">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link href={isAuthenticated ? "/profile" : "/login"} className="flex flex-col items-center text-gray-700 hover:text-blue-600">
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="border-t border-gray-200">
        <div className="container">
          <nav className="flex items-center space-x-8 py-3 overflow-x-auto">
            <Link href="/categories/all" className="whitespace-nowrap text-gray-700 hover:text-blue-600 font-medium">
              All Categories
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="whitespace-nowrap text-gray-700 hover:text-blue-600"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container py-4">
            <div className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}