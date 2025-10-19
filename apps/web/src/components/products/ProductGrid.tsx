import { Product } from "@/store/slices/productsSlice";
import { ProductCard } from "./ProductCard";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

const SkeletonCard = ({ index }: { index: number }) => (
  <div 
    className="bg-white rounded-lg shadow-md overflow-hidden stagger-item"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="aspect-square sm:aspect-[4/3] skeleton"></div>
    <div className="p-3 sm:p-4">
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

const EmptyState = () => (
  <div className="col-span-full text-center py-16 fade-in">
    <div className="max-w-md mx-auto">
      <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-500 mb-6">
        We couldn't find any products matching your criteria. Try adjusting your search or filters.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Refresh Results
      </button>
    </div>
  </div>
);

export function ProductGrid({ products, loading }: ProductGridProps) {
  // Responsive grid classes - max 4 cards per row
  const gridClasses = "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (loading) {
    return (
      <div className={gridClasses}>
        {[...Array(12)].map((_, index) => (
          <SkeletonCard key={index} index={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={gridClasses}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          index={index}
        />
      ))}
    </div>
  );
}