"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, setSearchQuery } from "@/store/slices/productsSlice";
import { fetchProducts } from "@/lib/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(fetchProductsStart());
      dispatch(setSearchQuery(query));
      try {
        const productsData = await fetchProducts();
        // Filter products based on search query
        const filteredProducts = query 
          ? productsData.filter((product: any) => 
              product.title.toLowerCase().includes(query.toLowerCase()) ||
              product.description?.toLowerCase().includes(query.toLowerCase()) ||
              product.category?.toLowerCase().includes(query.toLowerCase())
            )
          : productsData;
        dispatch(fetchProductsSuccess(filteredProducts));
      } catch (error) {
        dispatch(fetchProductsFailure(error instanceof Error ? error.message : 'Failed to fetch products'));
      }
    };

    loadProducts();
  }, [dispatch, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>

          <div className="text-center">
            {query ? (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Search Results for "{query}"
                </h1>
                <p className="text-gray-600">
                  {loading ? "Searching..." : `${products.length} products found`}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Products</h1>
                <p className="text-gray-600">Enter a search term to find products</p>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        {query && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-medium text-gray-700">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {query ? (
          <ProductGrid products={products} loading={loading} />
        ) : (
          <div className="text-center py-12">
            <Search className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h2>
            <p className="text-gray-600">Use the search bar above to find products you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}