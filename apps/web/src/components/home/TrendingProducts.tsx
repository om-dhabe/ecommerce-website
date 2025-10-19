import { Product } from "@/store/slices/productsSlice";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface TrendingProductsProps {
  products: Product[];
  loading: boolean;
}

const SkeletonCard = ({ index }: { index: number }) => (
  <div 
    className="flex-none w-72 bg-white rounded-lg shadow-md overflow-hidden stagger-item"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="aspect-square skeleton"></div>
    <div className="p-4">
      <div className="skeleton h-3 w-16 mb-2"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
      <div className="skeleton h-4 w-3/4 mb-3"></div>
      <div className="flex items-center space-x-1 mb-3">
        <div className="skeleton h-3 w-16"></div>
        <div className="skeleton h-3 w-8"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="skeleton h-6 w-20"></div>
        <div className="skeleton h-8 w-20 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function TrendingProducts({ products, loading }: TrendingProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Width of one card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 -ml-4"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 -mr-4"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-none w-72 stagger-item"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}