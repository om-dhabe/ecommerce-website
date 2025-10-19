"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const categories = [
    "Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Beauty"
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? 'shadow-lg' : 'shadow-md'
    }`}>
      {/* Top Bar - Hidden on mobile for space */}
      <div className="bg-gray-900 text-white text-sm hidden sm:block">
        <div className="container py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center transition-all duration-200 hover:text-blue-300">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="hidden md:inline">Free shipping on orders over $50</span>
              <span className="md:hidden">Free shipping $50+</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/help" className="hover:text-gray-300 transition-colors duration-200 text-xs sm:text-sm">
              Help
            </Link>
            <Link href="/track-order" className="hover:text-gray-300 transition-colors duration-200 text-xs sm:text-sm hidden sm:inline">
              Track Order
            </Link>
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="hover:text-gray-300 transition-colors duration-200 text-xs sm:text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="hover:text-gray-300 transition-colors duration-200 text-xs sm:text-sm hidden sm:inline">
                  Register
                </Link>
              </>
            ) : (
              <span className="text-xs sm:text-sm truncate max-w-32">
                Welcome, {user?.name || user?.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 scale-on-hover">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-blue-700">
              <span className="text-white font-bold text-lg sm:text-xl">E</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:block">
              Bharat-Sanchaya
            </span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">
              EP
            </span>
          </Link>

          {/* Search Bar - Responsive */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4 lg:mx-8">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 sm:py-3 border border-gray-300 rounded-lg input text-sm sm:text-base"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-md hover:bg-blue-700 transition-all duration-200 bounce-on-click"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions - Responsive */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Wishlist - Hidden on small mobile */}
            <Link href="/wishlist" className="hidden xs:flex flex-col items-center text-gray-700 hover:text-blue-600 transition-all duration-200 scale-on-hover">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs mt-1 hidden sm:block">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex flex-col items-center text-gray-700 hover:text-blue-600 relative transition-all duration-200 scale-on-hover">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs mt-1 hidden sm:block">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Profile - Hidden on small mobile */}
            <Link href={isAuthenticated ? "/profile" : "/login"} className="hidden xs:flex flex-col items-center text-gray-700 hover:text-blue-600 transition-all duration-200 scale-on-hover">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs mt-1 hidden sm:block">Profile</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 p-1 transition-all duration-200 bounce-on-click"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 absolute transition-all duration-200 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-200 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation - Desktop */}
      <div className="border-t border-gray-200 hidden lg:block">
        <div className="container">
          <nav className="flex items-center space-x-8 py-3 overflow-x-auto scrollbar-hide">
            <Link href="/categories/all" className="whitespace-nowrap text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
              All Categories
            </Link>
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="whitespace-nowrap text-gray-700 hover:text-blue-600 transition-all duration-200 hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white border-t border-gray-200 mobile-menu ${isMenuOpen ? 'open' : ''} absolute w-full shadow-lg`}>
        <div className="container py-4">
          <div className="flex flex-col space-y-1">
            {/* Mobile-only profile and wishlist links */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-2">
              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>{isAuthenticated ? 'My Account' : 'Sign In'}</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </Link>
            </div>
            
            {/* Categories */}
            <Link
              href="/categories/all"
              className="text-gray-700 hover:text-blue-600 py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Categories
            </Link>
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-700 hover:text-blue-600 py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 stagger-item"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {category}
              </Link>
            ))}
            
            {/* Mobile-only links */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <Link
                href="/help"
                className="text-gray-700 hover:text-blue-600 py-2 px-2 block transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Help & Support
              </Link>
              <Link
                href="/track-order"
                className="text-gray-700 hover:text-blue-600 py-2 px-2 block transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}