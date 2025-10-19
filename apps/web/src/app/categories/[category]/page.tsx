"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, setSelectedCategory } from "@/store/slices/productsSlice";
import { fetchProducts } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const dispatch = useAppDispatch();
  const { items: products, loading, selectedCategory } = useAppSelector((state) => state.products);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(fetchProductsStart());
      dispatch(setSelectedCategory(category));
      try {
        const productsData = await fetchProducts();
        // Filter products by category if not "all"
        const filteredProducts = category === "all" 
          ? productsData 
          : productsData.filter((product: any) => 
              product.category?.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
            );
        dispatch(fetchProductsSuccess(filteredProducts));
      } catch (error) {
        dispatch(fetchProductsFailure(error instanceof Error ? error.message : 'Failed to fetch products'));
      }
    };

    loadProducts();
  }, [dispatch, category]);

  const categoryTitle = category === "all" 
    ? "All Products" 
    : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryTitle}</h1>
          <p className="text-gray-600">
            {loading ? "Loading products..." : `${products.length} products found`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-gray-700">Sort by:</span>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}