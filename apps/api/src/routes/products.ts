import express from 'express';
import { PrismaClient, ProductStatus } from '@prisma/client';
import { authenticateToken, requireSeller, requireAdmin, AuthRequest } from '../utils/auth.js';
import { validateRequest, productSchema, productVariantSchema } from '../utils/validation.js';
import { sendProductStatusEmail } from '../utils/email.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {
      status: ProductStatus.APPROVED,
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Number(minPrice);
      if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy as string]: sortOrder },
        include: {
          category: { select: { name: true, slug: true } },
          seller: { 
            select: { 
              businessName: true,
              user: { select: { firstName: true, lastName: true } }
            } 
          },
          variants: {
            where: { isActive: true },
            select: { id: true, name: true, price: true, comparePrice: true, inventory: true }
          },
          reviews: {
            where: { isApproved: true },
            select: { rating: true }
          },
          _count: { select: { reviews: true } }
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average ratings and parse images
    const productsWithRatings = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      
      const { reviews, ...productData } = product;
      return {
        ...productData,
        images: JSON.parse(productData.images || '[]'), // Parse JSON string to array
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product._count.reviews,
      };
    });

    res.json({
      products: productsWithRatings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        seller: { 
          select: { 
            businessName: true,
            user: { select: { firstName: true, lastName: true } }
          } 
        },
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        },
        reviews: {
          where: { isApproved: true },
          include: {
            customer: { select: { firstName: true, lastName: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    if (!product || product.status !== ProductStatus.APPROVED || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    res.json({
      ...product,
      images: JSON.parse(product.images || '[]'), // Parse JSON string to array
      avgRating: Math.round(avgRating * 10) / 10,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (seller only)
router.post('/', authenticateToken, requireSeller, validateRequest(productSchema), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { name, description, shortDescription, categoryId, basePrice, images } = req.validatedData;

    // Get seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    if (sellerProfile.status !== 'APPROVED') {
      return res.status(403).json({ error: 'Seller account must be approved to create products' });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        shortDescription,
        categoryId,
        basePrice,
        images: JSON.stringify(images), // Convert array to JSON string
        sellerId: sellerProfile.id,
      },
      include: {
        category: { select: { name: true, slug: true } },
        seller: { 
          select: { 
            businessName: true,
            user: { select: { firstName: true, lastName: true } }
          } 
        },
      },
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get seller's products
router.get('/seller/my-products', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
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

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
          variants: {
            select: { id: true, name: true, price: true, inventory: true }
          },
          _count: { select: { reviews: true } }
        },
      }),
      prisma.product.count({ where }),
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
    console.error('Get seller products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit product for approval
router.post('/:id/submit', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const product = await prisma.product.findFirst({
      where: { 
        id, 
        sellerId: sellerProfile.id,
        status: ProductStatus.DRAFT
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or cannot be submitted' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status: ProductStatus.PENDING_APPROVAL },
    });

    res.json({
      message: 'Product submitted for approval',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Submit product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit multiple products for approval
router.post('/bulk/submit', authenticateToken, requireSeller, async (req: AuthRequest, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.user!.id;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs array is required' });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const result = await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        sellerId: sellerProfile.id,
        status: ProductStatus.DRAFT,
      },
      data: { status: ProductStatus.PENDING_APPROVAL },
    });

    res.json({
      message: `${result.count} products submitted for approval`,
      submittedCount: result.count,
    });
  } catch (error) {
    console.error('Bulk submit products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;