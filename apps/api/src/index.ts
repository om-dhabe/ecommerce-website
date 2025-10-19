import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(helmet());
app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true 
}));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    description: "High-quality sound with noise cancellation technology",
    price: 299.99,
    category: "Electronics",
    rating: 4.8,
    reviews: 1250,
    inStock: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    description: "Track your health and fitness goals with advanced sensors",
    price: 199.99,
    category: "Electronics",
    rating: 4.6,
    reviews: 890,
    inStock: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable fashion for everyday wear",
    price: 29.99,
    category: "Fashion",
    rating: 4.5,
    reviews: 456,
    inStock: true,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Professional Camera Lens",
    description: "Capture stunning photos with crystal clear clarity",
    price: 599.99,
    category: "Electronics",
    rating: 4.9,
    reviews: 234,
    inStock: true,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Ergonomic Office Chair",
    description: "Comfortable seating for long work sessions",
    price: 249.99,
    category: "Home & Garden",
    rating: 4.7,
    reviews: 678,
    inStock: true,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Yoga Mat Premium",
    description: "Non-slip yoga mat for all your fitness needs",
    price: 49.99,
    category: "Sports",
    rating: 4.4,
    reviews: 321,
    inStock: true,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Bestseller Novel Collection",
    description: "Collection of award-winning contemporary fiction",
    price: 39.99,
    category: "Books",
    rating: 4.8,
    reviews: 892,
    inStock: true,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Natural Face Serum",
    description: "Anti-aging serum with natural ingredients",
    price: 79.99,
    category: "Beauty",
    rating: 4.6,
    reviews: 445,
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop"
  }
];

app.get("/products", async (_req, res) => {
  try {
    // For now, return mock data. Later this will fetch from database
    res.json(mockProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Admin/CMS endpoints
app.post("/admin/products", async (req, res) => {
  try {
    const { title, description, price, category, image, inStock } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !category || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new product (in real app, this would save to database)
    const newProduct = {
      id: mockProducts.length + 1,
      title,
      description,
      price: parseFloat(price),
      category,
      image,
      inStock: inStock !== false,
      rating: 4.5,
      reviews: 0,
    };

    mockProducts.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, price, category, image, inStock } = req.body;
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      title: title || mockProducts[productIndex].title,
      description: description || mockProducts[productIndex].description,
      price: price ? parseFloat(price) : mockProducts[productIndex].price,
      category: category || mockProducts[productIndex].category,
      image: image || mockProducts[productIndex].image,
      inStock: inStock !== undefined ? inStock : mockProducts[productIndex].inStock,
    };

    res.json(mockProducts[productIndex]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/admin/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = mockProducts.splice(productIndex, 1)[0];
    res.json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Dashboard stats endpoint
app.get("/admin/stats", async (_req, res) => {
  try {
    const stats = {
      totalProducts: mockProducts.length,
      totalUsers: 1234,
      ordersToday: 56,
      revenue: 12345.67,
      recentOrders: [
        { id: "001", customer: "John Doe", total: 299.99, status: "Completed", date: "2024-01-15" },
        { id: "002", customer: "Jane Smith", total: 199.99, status: "Processing", date: "2024-01-14" },
        { id: "003", customer: "Bob Johnson", total: 449.99, status: "Shipped", date: "2024-01-13" },
      ],
      topProducts: [
        { name: "Wireless Headphones", sales: 45 },
        { name: "Smart Watch", sales: 32 },
        { name: "Camera Lens", sales: 28 },
      ],
    };
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});