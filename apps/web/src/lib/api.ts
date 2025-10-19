const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  status: string;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  seller: {
    businessName: string;
  };
  avgRating: number;
  reviewCount: number;
}

export interface ApiResponse<T> {
  data?: T;
  products?: T;
  categories?: T;
  error?: string;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const data: ApiResponse<Product[]> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch products');
    }
    
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data for development
    return [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality sound with noise cancellation technology',
        basePrice: 299.99,
        status: 'APPROVED',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'],
        category: { name: 'Electronics', slug: 'electronics' },
        seller: { businessName: 'TechStore Pro' },
        avgRating: 4.8,
        reviewCount: 125
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals with advanced sensors',
        basePrice: 199.99,
        status: 'APPROVED',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'],
        category: { name: 'Electronics', slug: 'electronics' },
        seller: { businessName: 'FitTech Solutions' },
        avgRating: 4.6,
        reviewCount: 89
      },
      {
        id: '3',
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and sustainable fashion for everyday wear',
        basePrice: 29.99,
        status: 'APPROVED',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'],
        category: { name: 'Fashion', slug: 'fashion' },
        seller: { businessName: 'EcoWear' },
        avgRating: 4.5,
        reviewCount: 45
      },
      {
        id: '4',
        name: 'Professional Camera Lens',
        description: 'Capture stunning photos with crystal clear clarity',
        basePrice: 599.99,
        status: 'APPROVED',
        images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop'],
        category: { name: 'Electronics', slug: 'electronics' },
        seller: { businessName: 'PhotoGear Pro' },
        avgRating: 4.9,
        reviewCount: 234
      }
    ];
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }
    
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data for development
    return [
      { id: '1', name: 'Electronics', slug: 'electronics', _count: { products: 5 } },
      { id: '2', name: 'Fashion', slug: 'fashion', _count: { products: 3 } },
      { id: '3', name: 'Home & Garden', slug: 'home-garden', _count: { products: 2 } },
      { id: '4', name: 'Sports', slug: 'sports', _count: { products: 4 } },
      { id: '5', name: 'Books', slug: 'books', _count: { products: 6 } },
      { id: '6', name: 'Beauty', slug: 'beauty', _count: { products: 3 } }
    ];
  }
}