"use client";

import { useEffect } from "react";
import Link from "next/link";
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
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 fade-in">
            Shop by Category
          </h2>
          <FeaturedCategories />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold slide-up">
              Trending Now
            </h2>
            <Link
              href="/categories/all"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 scale-on-hover text-sm sm:text-base"
            >
              View All →
            </Link>
          </div>
          <TrendingProducts products={products.slice(0, 8)} loading={loading} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold slide-up">
              Featured Products
            </h2>
            <Link
              href="/categories/all"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 scale-on-hover text-sm sm:text-base"
            >
              View All →
            </Link>
          </div>
          <ProductGrid products={products} loading={loading} />
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}