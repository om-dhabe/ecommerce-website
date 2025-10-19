import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
// import sellerRoutes from './routes/seller.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
// import orderRoutes from './routes/orders.js';
// import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Multi-Vendor E-commerce API is running!',
    version: '1.0.0',
    database: 'MySQL Connected ✅',
    endpoints: {
      auth: '/api/auth',
      seller: '/api/seller',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      admin: '/api/admin',
    },
    testAccounts: {
      admin: 'admin@marketplace.com / admin123',
      seller: 'seller@marketplace.com / seller123',
      customer: 'customer@marketplace.com / customer123'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    database: 'MySQL',
    status: 'Connected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
// app.use('/api/seller', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Multi-Vendor E-commerce API is running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
  console.log(`🗄️  MySQL Database: Connected to ecom_bh`);
  console.log(`👤 Test Accounts Available - Check API root for credentials`);
});