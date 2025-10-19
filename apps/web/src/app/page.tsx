"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } from "@/store/slices/productsSlice";
import { fetchProducts } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductGrid } from "@/components/products/ProductGrid";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(fetchProductsStart());
      try {
        const productsData = await fetchProducts();
        dispatch(fetchProductsSuccess(productsData));
      } catch (error) {
        dispatch(fetchProductsFailure(error instanceof Error ? error.message : 'Failed to fetch products'));
      }
    };

    loadProducts();
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <FeaturedCategories />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
          <TrendingProducts products={products.slice(0, 4)} loading={loading} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
          <ProductGrid products={products} loading={loading} />
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}