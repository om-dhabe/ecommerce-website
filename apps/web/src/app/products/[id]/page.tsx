"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchProduct } from "@/lib/api";
import { Product } from "@/store/slices/productsSlice";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const dispatch = useAppDispatch();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await fetchProduct(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }));
    }
  };

  const renderStars = (rating: number = 0) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop"}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium">{product.rating}</span>
                {product.reviews && (
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.price > 200 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-sm text-gray-500">On orders over $50</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-sm text-gray-500">100% protected</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-sm text-gray-500">30-day policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}