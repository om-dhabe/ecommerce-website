import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  BookOpen, 
  Heart, 
  Gamepad2, 
  Car,
  Laptop,
  Watch,
  Camera,
  Headphones
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categories - Bharat-Sanchaya',
  description: 'Browse products by category on Bharat-Sanchaya marketplace.',
};

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Smartphones, laptops, gadgets and more',
    icon: Smartphone,
    image: '/images/categories/electronics.jpg',
    productCount: 1250,
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming']
  },
  {
    id: 'clothing',
    name: 'Clothing & Fashion',
    description: 'Trendy clothes for men, women and kids',
    icon: Shirt,
    image: '/images/categories/clothing.jpg',
    productCount: 2100,
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Shoes', 'Accessories', 'Jewelry']
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Furniture, decor and garden supplies',
    icon: Home,
    image: '/images/categories/home-garden.jpg',
    productCount: 890,
    subcategories: ['Furniture', 'Home Decor', 'Kitchen', 'Garden', 'Tools', 'Storage']
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'Fitness equipment and outdoor gear',
    icon: Dumbbell,
    image: '/images/categories/sports.jpg',
    productCount: 650,
    subcategories: ['Fitness', 'Outdoor Recreation', 'Team Sports', 'Water Sports', 'Winter Sports', 'Cycling']
  },
  {
    id: 'books',
    name: 'Books & Media',
    description: 'Books, movies, music and more',
    icon: BookOpen,
    image: '/images/categories/books.jpg',
    productCount: 1800,
    subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Movies', 'Music', 'Games']
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    description: 'Skincare, makeup and wellness products',
    icon: Heart,
    image: '/images/categories/health-beauty.jpg',
    productCount: 750,
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Health', 'Personal Care']
  },
  {
    id: 'toys-games',
    name: 'Toys & Games',
    description: 'Fun for kids and adults alike',
    icon: Gamepad2,
    image: '/images/categories/toys.jpg',
    productCount: 420,
    subcategories: ['Action Figures', 'Board Games', 'Educational Toys', 'Outdoor Toys', 'Video Games', 'Puzzles']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car parts, accessories and tools',
    icon: Car,
    image: '/images/categories/automotive.jpg',
    productCount: 380,
    subcategories: ['Car Parts', 'Accessories', 'Tools', 'Tires', 'Electronics', 'Maintenance']
  }
];

const featuredCategories = [
  {
    name: 'Laptops & Computers',
    icon: Laptop,
    link: '/products?category=electronics&subcategory=laptops',
    color: 'bg-blue-500'
  },
  {
    name: 'Watches',
    icon: Watch,
    link: '/products?category=electronics&subcategory=watches',
    color: 'bg-purple-500'
  },
  {
    name: 'Cameras',
    icon: Camera,
    link: '/products?category=electronics&subcategory=cameras',
    color: 'bg-green-500'
  },
  {
    name: 'Headphones',
    icon: Headphones,
    link: '/products?category=electronics&subcategory=audio',
    color: 'bg-red-500'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-xl">Discover thousands of products across all categories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                href={category.link}
                className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className={`p-4 rounded-full ${category.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 text-center">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Category Image */}
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <div className="p-2 bg-white/90 rounded-lg">
                      <category.icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.productCount} products</p>
                  </div>
                  {/* Placeholder for category image */}
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  
                  {/* Subcategories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Popular in {category.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">
            Use our search feature to find specific products or browse all items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse All Products
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}