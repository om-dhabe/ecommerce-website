import express from 'express';
// Import PrismaClient - adjust path as needed
const { PrismaClient } = require('@prisma/client');

// Define UserRole enum locally
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}
import { authenticateToken, requireSeller, AuthRequest } from '../utils/auth.js';
import { validateRequest, sellerProfileSchema } from '../utils/validation.js';
import { sendSellerApprovalEmail } from '../utils/email.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all seller routes
router.use(authenticateToken);

// Create seller profile
router.post('/profile', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { businessName, businessEmail, businessPhone, businessAddress, taxId } = req.body;

    // Check if user already has a seller profile
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Seller profile already exists' });
    }

    // Update user role to SELLER if not already
    await prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.SELLER },
    });

    // Create seller profile
    const sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId,
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
        taxId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Seller profile created successfully. Awaiting admin approval.',
      sellerProfile,
    });
  } catch (error) {
    console.error('Create seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller profile
router.get('/profile', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    res.json({ sellerProfile });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update seller profile
router.put('/profile', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { businessName, businessEmail, businessPhone, businessAddress, taxId } = req.body;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const updatedProfile = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        businessName,
        businessEmail,
        businessPhone,
        businessAddress,
        taxId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    res.json({
      message: 'Seller profile updated successfully',
      sellerProfile: updatedProfile,
    });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller dashboard stats
router.get('/dashboard', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Get product counts by status
    const productStats = await prisma.product.groupBy({
      by: ['status'],
      where: { sellerId: sellerProfile.id },
      _count: { status: true },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { sellerId: sellerProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        customer: {
          select: { firstName: true, lastName: true, email: true },
        },
        items: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
    });

    // Get total sales
    const salesStats = await prisma.order.aggregate({
      where: {
        sellerId: sellerProfile.id,
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // Get pending returns
    const pendingReturns = await prisma.return.count({
      where: {
        order: { sellerId: sellerProfile.id },
        status: 'REQUESTED',
      },
    });

    res.json({
      productStats: productStats.reduce((acc: Record<string, number>, stat: any) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
      recentOrders,
      salesStats: {
        totalSales: salesStats._sum.total || 0,
        totalOrders: salesStats._count,
      },
      pendingReturns,
    });
  } catch (error) {
    console.error('Get seller dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller products
router.get('/products', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const where: any = { sellerId: sellerProfile.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { updatedAt: 'desc' },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', requireSeller, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Verify product belongs to seller
    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: sellerProfile.id,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or not owned by seller' });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller orders
router.get('/orders', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const where: any = { sellerId: sellerProfile.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', requireSeller, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user!.id;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Verify order belongs to seller
    const order = await prisma.order.findFirst({
      where: {
        id,
        sellerId: sellerProfile.id,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found or not owned by seller' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller analytics
router.get('/analytics', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { range = '30d' } = req.query;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Mock analytics data for now
    const analytics = {
      salesOverview: {
        totalRevenue: 25000,
        totalOrders: 250,
        totalProducts: 15,
        averageOrderValue: 100,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
      },
      topProducts: [
        { id: '1', name: 'Product 1', totalSold: 50, revenue: 5000, views: 1200 },
        { id: '2', name: 'Product 2', totalSold: 40, revenue: 4000, views: 1000 },
      ],
      monthlyRevenue: [
        { month: 'Jan 2024', revenue: 2000, orders: 20 },
        { month: 'Feb 2024', revenue: 2500, orders: 25 },
        { month: 'Mar 2024', revenue: 3000, orders: 30 },
      ],
      categoryPerformance: [
        { category: 'Electronics', totalSales: 100, revenue: 10000, growth: 15 },
        { category: 'Clothing', totalSales: 80, revenue: 8000, growth: 10 },
      ],
      recentOrders: [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customer: 'John Doe',
          total: 150,
          status: 'DELIVERED',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get seller analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get/Update seller profile (extended)
router.get('/profile', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Mock extended profile data
    const extendedProfile = {
      ...sellerProfile,
      businessDescription: 'A great business description',
      businessType: 'LLC',
      bankAccountNumber: '****1234',
      bankRoutingNumber: '****5678',
      bankAccountHolderName: 'Business Name',
      logo: '',
      banner: '',
      socialLinks: {
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
      },
      businessHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: true },
      },
    };

    res.json(extendedProfile);
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update seller profile (extended)
router.put('/profile', requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const profileData = req.body;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Update basic fields that exist in the database
    const updatedProfile = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        businessName: profileData.businessName,
        businessEmail: profileData.businessEmail,
        businessPhone: profileData.businessPhone,
        businessAddress: profileData.businessAddress,
        taxId: profileData.taxId,
      },
    });

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get/Update seller settings
router.get('/settings', requireSeller, async (req: AuthRequest, res) => {
  try {
    // Mock settings data
    const settings = {
      notifications: {
        orderNotifications: true,
        paymentNotifications: true,
        productNotifications: true,
        marketingEmails: false,
        smsNotifications: false,
      },
      shipping: {
        freeShippingThreshold: 50,
        defaultShippingRate: 5.99,
        processingTime: 2,
        shippingZones: ['US'],
        internationalShipping: false,
      },
      inventory: {
        lowStockThreshold: 10,
        autoReorderEnabled: false,
        trackInventory: true,
        allowBackorders: false,
      },
      payments: {
        paymentMethods: ['CREDIT_CARD', 'PAYPAL'],
        taxRate: 8.25,
        currency: 'USD',
        payoutFrequency: 'MONTHLY',
      },
      privacy: {
        profileVisibility: 'PUBLIC',
        showContactInfo: true,
        allowReviews: true,
        dataRetention: 24,
      },
    };

    res.json(settings);
  } catch (error) {
    console.error('Get seller settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/settings', requireSeller, async (req: AuthRequest, res) => {
  try {
    // In a real app, you'd save these settings to a database
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update seller settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;