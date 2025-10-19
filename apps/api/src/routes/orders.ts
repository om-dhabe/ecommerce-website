import express from 'express';
import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, requireSeller, AuthRequest } from '../utils/auth.js';
import { validateRequest, orderSchema } from '../utils/validation.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create order
router.post('/', authenticateToken, validateRequest(orderSchema), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { items, shippingAddress, billingAddress, paymentMethod } = req.validatedData;

    // Validate and calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { 
          id: item.productId,
          status: 'APPROVED',
          isActive: true,
        },
        include: {
          variants: item.variantId ? {
            where: { id: item.variantId, isActive: true }
          } : false,
          seller: true,
        },
      });

      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found or unavailable` });
      }

      let price = product.basePrice;
      let variant = null;

      if (item.variantId) {
        variant = product.variants?.[0];
        if (!variant) {
          return res.status(400).json({ error: `Product variant ${item.variantId} not found` });
        }
        price = variant.price;

        // Check inventory
        if (variant.inventory < item.quantity) {
          return res.status(400).json({ error: `Insufficient inventory for ${product.name} - ${variant.name}` });
        }
      }

      const itemTotal = Number(price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        price: Number(price),
        total: itemTotal,
        sellerId: product.sellerId,
      });
    }

    // Group items by seller to create separate orders
    const ordersBySeller = orderItems.reduce((acc, item) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = [];
      }
      acc[item.sellerId].push(item);
      return acc;
    }, {} as Record<string, typeof orderItems>);

    const createdOrders = [];

    // Create separate orders for each seller
    for (const [sellerId, sellerItems] of Object.entries(ordersBySeller)) {
      const sellerSubtotal = sellerItems.reduce((sum, item) => sum + item.total, 0);
      const tax = sellerSubtotal * 0.1; // 10% tax
      const shipping = 10; // Fixed shipping
      const total = sellerSubtotal + tax + shipping;

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: userId,
          sellerId,
          subtotal: sellerSubtotal,
          tax,
          shipping,
          total,
          status: OrderStatus.CREATED,
          paymentStatus: paymentMethod === 'cod' ? PaymentStatus.CASH_ON_DELIVERY : PaymentStatus.INITIATED,
          
          // Shipping address
          shippingFirstName: shippingAddress.firstName,
          shippingLastName: shippingAddress.lastName,
          shippingAddress1: shippingAddress.address1,
          shippingAddress2: shippingAddress.address2,
          shippingCity: shippingAddress.city,
          shippingState: shippingAddress.state,
          shippingZip: shippingAddress.zip,
          shippingCountry: shippingAddress.country,
          shippingPhone: shippingAddress.phone,

          // Billing address
          billingFirstName: billingAddress.firstName,
          billingLastName: billingAddress.lastName,
          billingAddress1: billingAddress.address1,
          billingAddress2: billingAddress.address2,
          billingCity: billingAddress.city,
          billingState: billingAddress.state,
          billingZip: billingAddress.zip,
          billingCountry: billingAddress.country,

          items: {
            create: sellerItems.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: { select: { name: true } },
              variant: { select: { name: true } },
            },
          },
          seller: {
            select: {
              businessName: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
      });

      // Create payment record
      const idempotencyKey = uuidv4();
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          status: paymentMethod === 'cod' ? PaymentStatus.CASH_ON_DELIVERY : PaymentStatus.INITIATED,
          paymentMethod,
          idempotencyKey,
        },
      });

      // Update inventory for variants
      for (const item of sellerItems) {
        if (item.variantId) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      createdOrders.push(order);
    }

    res.status(201).json({
      message: 'Orders created successfully',
      orders: createdOrders,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId: userId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { name: true, images: true } },
              variant: { select: { name: true } },
            },
          },
          seller: {
            select: {
              businessName: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
          payments: { select: { status: true, paymentMethod: true } },
          shipments: { select: { trackingNumber: true, carrier: true, shippedAt: true, deliveredAt: true } },
        },
      }),
      prisma.order.count({ where: { customerId: userId } }),
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller's orders
router.get('/seller/orders', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 20, status } = req.query;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = { sellerId: sellerProfile.id };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { firstName: true, lastName: true, email: true },
          },
          items: {
            include: {
              product: { select: { name: true, images: true } },
              variant: { select: { name: true } },
            },
          },
          payments: { select: { status: true, paymentMethod: true } },
          shipments: { select: { trackingNumber: true, carrier: true, shippedAt: true, deliveredAt: true } },
          returns: { select: { id: true, status: true, reason: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (seller only)
router.put('/:id/status', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
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

    const order = await prisma.order.findFirst({
      where: { 
        id, 
        sellerId: sellerProfile.id,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Log audit event
    await prisma.auditEvent.create({
      data: {
        userId,
        entityType: 'order',
        entityId: id,
        action: 'status_updated',
        oldValues: JSON.stringify({ status: order.status }),
        newValues: JSON.stringify({ status }),
      },
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;