import express from 'express';
// Import PrismaClient - adjust path as needed
const { PrismaClient } = require('@prisma/client');
import { authenticateToken, requireAdmin, AuthRequest } from '../utils/auth.js';
import { sendSellerApprovalEmail, sendProductStatusEmail } from '../utils/email.js';

// Define enums locally since they might not be exported from Prisma client
enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

enum SellerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and admin role to all routes
router.use(authenticateToken, requireAdmin);

// Get dashboard stats
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    // Active sellers (approved with recent activity)
    const activeSellers = await prisma.sellerProfile.count({
      where: {
        status: SellerStatus.APPROVED,
        products: {
          some: {
            status: ProductStatus.APPROVED,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    });

    // Products by status
    const productStats = await prisma.product.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    // Sales and returns
    const salesStats = await prisma.order.aggregate({
      where: {
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      _sum: { total: true },
      _count: { id: true },
    });

    // Mock return stats for now (add return table later)
    const returnStats = { _count: 0 };

    // Reviews stats (mock for now)
    const reviewStats = { _count: 0, _avg: { rating: 0 } };
    const pendingReviews = 0;

    // Payment status breakdown (mock for now)
    const paymentStats: any[] = [];

    res.json({
      activeSellers,
      productStats: productStats.reduce((acc: Record<string, number>, stat: any) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
      salesStats: {
        totalSales: salesStats._sum.total || 0,
        totalOrders: salesStats._count,
        totalReturns: returnStats._count,
        returnRate: salesStats._count > 0 ? (returnStats._count / salesStats._count) * 100 : 0,
      },
      reviewStats: {
        totalReviews: reviewStats._count,
        averageRating: reviewStats._avg.rating || 0,
        pendingModeration: pendingReviews,
      },
      paymentStats: paymentStats.reduce((acc: Record<string, { count: number; amount: number }>, stat: any) => {
        acc[stat.status] = {
          count: stat._count.status,
          amount: stat._sum.amount || 0,
        };
        return acc;
      }, {} as Record<string, { count: number; amount: number }>),
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending sellers
router.get('/sellers/pending', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [sellers, total] = await Promise.all([
      prisma.sellerProfile.findMany({
        where: { status: SellerStatus.PENDING },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.sellerProfile.count({
        where: { status: SellerStatus.PENDING },
      }),
    ]);

    res.json({
      sellers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get pending sellers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject seller
router.post('/sellers/:id/review', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject"' });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
      },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const updateData: any = {
      status: action === 'approve' ? SellerStatus.APPROVED : SellerStatus.REJECTED,
      approvedBy: req.user!.id,
    };

    if (action === 'approve') {
      updateData.approvedAt = new Date();
    } else {
      updateData.rejectionReason = reason;
    }

    const updatedProfile = await prisma.sellerProfile.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Send notification email
    try {
      await sendSellerApprovalEmail(
        sellerProfile.user.email,
        sellerProfile.businessName,
        action === 'approve'
      );
    } catch (emailError) {
      console.error('Failed to send seller approval email:', emailError);
    }

    // Log audit event (commented out for now - add audit table later)
    // await prisma.auditEvent.create({
    //   data: {
    //     userId: req.user!.id,
    //     entityType: 'seller_profile',
    //     entityId: id,
    //     action: action === 'approve' ? 'approved' : 'rejected',
    //     newValues: JSON.stringify(updateData),
    //     metadata: JSON.stringify({ reason }),
    //   },
    // });

    res.json({
      message: `Seller ${action}d successfully`,
      sellerProfile: updatedProfile,
    });
  } catch (error) {
    console.error('Review seller error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending products
router.get('/products/pending', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: ProductStatus.PENDING_APPROVAL },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: 'asc' },
        include: {
          category: { select: { name: true, slug: true } },
          seller: {
            select: {
              businessName: true,
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
        },
      }),
      prisma.product.count({
        where: { status: ProductStatus.PENDING_APPROVAL },
      }),
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get pending products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve/Reject product
router.post('/products/:id/review', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject"' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData: any = {
      status: action === 'approve' ? ProductStatus.APPROVED : ProductStatus.REJECTED,
      approvedBy: req.user!.id,
    };

    if (action === 'approve') {
      updateData.approvedAt = new Date();
    } else {
      updateData.rejectionReason = reason;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // Send notification email
    try {
      await sendProductStatusEmail(
        product.seller.user.email,
        product.name,
        action === 'approve' ? 'APPROVED' : 'REJECTED',
        reason
      );
    } catch (emailError) {
      console.error('Failed to send product status email:', emailError);
    }

    // Log audit event (commented out for now - add audit table later)
    // await prisma.auditEvent.create({
    //   data: {
    //     userId: req.user!.id,
    //     entityType: 'product',
    //     entityId: id,
    //     action: action === 'approve' ? 'approved' : 'rejected',
    //     newValues: JSON.stringify(updateData),
    //     metadata: JSON.stringify({ reason }),
    //   },
    // });

    res.json({
      message: `Product ${action}d successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Review product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk approve/reject products
router.post('/products/bulk-review', async (req: AuthRequest, res) => {
  try {
    const { productIds, action, reason } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs array is required' });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject"' });
    }

    const updateData: any = {
      status: action === 'approve' ? ProductStatus.APPROVED : ProductStatus.REJECTED,
      approvedBy: req.user!.id,
    };

    if (action === 'approve') {
      updateData.approvedAt = new Date();
    } else {
      updateData.rejectionReason = reason;
    }

    const result = await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        status: ProductStatus.PENDING_APPROVAL,
      },
      data: updateData,
    });

    // Log audit events for each product (commented out for now - add audit table later)
    // const auditEvents = productIds.map(productId => ({
    //   userId: req.user!.id,
    //   entityType: 'product',
    //   entityId: productId,
    //   action: action === 'approve' ? 'approved' : 'rejected',
    //   newValues: JSON.stringify(updateData),
    //   metadata: JSON.stringify({ reason, bulkAction: true }),
    // }));

    // await prisma.auditEvent.createMany({
    //   data: auditEvents,
    // });

    res.json({
      message: `${result.count} products ${action}d successfully`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error('Bulk review products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sellers
router.get('/sellers', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [sellers, total] = await Promise.all([
      prisma.sellerProfile.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              products: true,
              orders: true,
            },
          },
        },
      }),
      prisma.sellerProfile.count({ where }),
    ]);

    res.json({
      sellers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
    
   },
    });
  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Suspend/Activate seller
router.post('/sellers/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED', 'SUSPENDED'

    if (!['APPROVED', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedProfile = await prisma.sellerProfile.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log audit event (commented out for now - add audit table later)
    // await prisma.auditEvent.create({
    //   data: {
    //     userId: req.user!.id,
    //     entityType: 'seller_profile',
    //     entityId: id,
    //     action: status === 'SUSPENDED' ? 'suspended' : 'activated',
    //     newValues: JSON.stringify({ status }),
    //   },
    // });

    res.json({
      message: `Seller ${status.toLowerCase()} successfully`,
      sellerProfile: updatedProfile,
    });
  } catch (error) {
    console.error('Update seller status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sellers with enhanced data
router.get('/sellers', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const sellers = await prisma.sellerProfile.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // Add mock data for totalSales since we don't have orders table connected yet
    const sellersWithStats = sellers.map((seller: any) => ({
      ...seller,
      totalProducts: seller._count.products,
      totalSales: Math.floor(Math.random() * 1000), // Mock data
    }));

    const total = await prisma.sellerProfile.count({ where });

    res.json(sellersWithStats);
  } catch (error) {
    console.error('Get sellers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update seller status
router.put('/sellers/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedSeller = await prisma.sellerProfile.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedSeller);
  } catch (error) {
    console.error('Update seller status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all products for admin
router.get('/products', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        seller: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product status
router.put('/products/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders for admin
router.get('/orders', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (paymentStatus && paymentStatus !== 'ALL') {
      where.paymentStatus = paymentStatus;
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
                seller: {
                  select: {
                    businessName: true,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

// Get analytics data
router.get('/analytics', async (req: AuthRequest, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date range
    let startDate = new Date();
    switch (range) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default: // 30d
        startDate.setDate(startDate.getDate() - 30);
    }

    // Mock analytics data for now
    const analytics = {
      salesOverview: {
        totalRevenue: 125000,
        totalOrders: 1250,
        averageOrderValue: 100,
        revenueGrowth: 15.5,
        ordersGrowth: 12.3,
      },
      topProducts: [
        { id: '1', name: 'Product 1', totalSold: 150, revenue: 15000, seller: 'Seller 1' },
        { id: '2', name: 'Product 2', totalSold: 120, revenue: 12000, seller: 'Seller 2' },
      ],
      topSellers: [
        { id: '1', businessName: 'Business 1', totalProducts: 25, totalSales: 300, revenue: 30000 },
        { id: '2', businessName: 'Business 2', totalProducts: 20, totalSales: 250, revenue: 25000 },
      ],
      categoryPerformance: [
        { category: 'Electronics', totalSales: 500, revenue: 50000, growth: 20 },
        { category: 'Clothing', totalSales: 400, revenue: 40000, growth: 15 },
      ],
      monthlyRevenue: [
        { month: 'Jan 2024', revenue: 10000, orders: 100 },
        { month: 'Feb 2024', revenue: 12000, orders: 120 },
        { month: 'Mar 2024', revenue: 15000, orders: 150 },
      ],
      customerMetrics: {
        totalCustomers: 5000,
        newCustomers: 500,
        returningCustomers: 4500,
        customerGrowth: 10.5,
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get/Update system settings
router.get('/settings', async (req: AuthRequest, res) => {
  try {
    // Mock settings data for now
    const settings = {
      general: {
        siteName: 'Bharat-Sanchaya',
        siteDescription: 'Your trusted marketplace for quality products',
        siteUrl: 'https://bharat-sanchaya.com',
        contactEmail: 'contact@bharat-sanchaya.com',
        supportEmail: 'support@bharat-sanchaya.com',
        logo: '',
        favicon: '',
      },
      business: {
        companyName: 'Bharat-Sanchaya Inc.',
        companyAddress: '123 Commerce St, City, State 12345',
        companyPhone: '+1 (555) 123-4567',
        companyEmail: 'business@bharat-sanchaya.com',
        taxId: '12-3456789',
        currency: 'USD',
        timezone: 'UTC',
      },
      seller: {
        commissionRate: 5.0,
        autoApproveProducts: false,
        autoApproveSellers: false,
        minCommissionAmount: 1.0,
        payoutSchedule: 'MONTHLY',
      },
      shipping: {
        freeShippingThreshold: 50.0,
        defaultShippingRate: 5.99,
        internationalShipping: true,
        shippingZones: ['US', 'CA', 'MX'],
      },
      payment: {
        stripePublicKey: '',
        stripeSecretKey: '',
        paypalClientId: '',
        paypalClientSecret: '',
        enableCOD: false,
      },
      email: {
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: 'noreply@bharat-sanchaya.com',
        fromName: 'Bharat-Sanchaya',
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderNotifications: true,
        sellerNotifications: true,
      },
    };

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/settings', async (req: AuthRequest, res) => {
  try {
    // In a real app, you'd save these settings to a database
    // For now, just return success
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;