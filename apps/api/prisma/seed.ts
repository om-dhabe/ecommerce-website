import { PrismaClient, UserRole, SellerStatus, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.com' },
    update: {},
    create: {
      email: 'admin@marketplace.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isEmailVerified: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create seller user
  const sellerPassword = await bcrypt.hash('seller123', 12);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@marketplace.com' },
    update: {},
    create: {
      email: 'seller@marketplace.com',
      password: sellerPassword,
      firstName: 'John',
      lastName: 'Seller',
      role: UserRole.SELLER,
      isEmailVerified: true,
    },
  });
  console.log('✅ Created seller user:', seller.email);

  // Create seller profile
  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      userId: seller.id,
      businessName: 'TechStore Pro',
      businessEmail: 'business@techstore.com',
      businessPhone: '+1-555-0123',
      businessAddress: '123 Business St, Tech City, TC 12345',
      taxId: 'TAX123456789',
      status: SellerStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
  });
  console.log('✅ Created seller profile:', sellerProfile.businessName);

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@marketplace.com' },
    update: {},
    create: {
      email: 'customer@marketplace.com',
      password: customerPassword,
      firstName: 'Jane',
      lastName: 'Customer',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
    },
  });
  console.log('✅ Created customer user:', customer.email);

  // Create categories
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic gadgets and devices',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop',
    },
    {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home and garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports equipment and fitness gear',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Books for all ages and interests',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
    },
    {
      name: 'Beauty',
      slug: 'beauty',
      description: 'Beauty and personal care products',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    },
  ];

  const createdCategories = [];
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: categoryData,
    });
    createdCategories.push(category);
  }
  console.log('✅ Created categories:', createdCategories.length);

  // Create sample products
  const products = [
    {
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'High-quality sound with noise cancellation technology. Perfect for music lovers and professionals.',
      shortDescription: 'Premium wireless headphones with noise cancellation',
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop']),
      basePrice: 299.99,
      categoryId: createdCategories.find(c => c.slug === 'electronics')!.id,
      sellerId: sellerProfile.id,
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
    {
      name: 'Smart Fitness Watch',
      slug: 'smart-fitness-watch',
      description: 'Track your health and fitness goals with advanced sensors and long battery life.',
      shortDescription: 'Advanced fitness tracking watch',
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop']),
      basePrice: 199.99,
      categoryId: createdCategories.find(c => c.slug === 'electronics')!.id,
      sellerId: sellerProfile.id,
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
    {
      name: 'Organic Cotton T-Shirt',
      slug: 'organic-cotton-t-shirt',
      description: 'Comfortable and sustainable fashion for everyday wear. Made from 100% organic cotton.',
      shortDescription: 'Sustainable organic cotton t-shirt',
      images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop']),
      basePrice: 29.99,
      categoryId: createdCategories.find(c => c.slug === 'fashion')!.id,
      sellerId: sellerProfile.id,
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
    {
      name: 'Professional Camera Lens',
      slug: 'professional-camera-lens',
      description: 'Capture stunning photos with crystal clear clarity. Perfect for professional photographers.',
      shortDescription: 'High-quality camera lens for professionals',
      images: JSON.stringify(['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop']),
      basePrice: 599.99,
      categoryId: createdCategories.find(c => c.slug === 'electronics')!.id,
      sellerId: sellerProfile.id,
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Comfortable seating for long work sessions with adjustable height and lumbar support.',
      shortDescription: 'Comfortable ergonomic office chair',
      images: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop']),
      basePrice: 249.99,
      categoryId: createdCategories.find(c => c.slug === 'home-garden')!.id,
      sellerId: sellerProfile.id,
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip yoga mat for all your fitness needs. Made from eco-friendly materials.',
      shortDescription: 'Premium non-slip yoga mat',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop']),
      basePrice: 49.99,
      categoryId: createdCategories.find(c => c.slug === 'sports')!.id,
      sellerId: sellerProfile.id,
      status: ProductStatus.APPROVED,
      approvedAt: new Date(),
      approvedBy: admin.id,
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
    createdProducts.push(product);
  }
  console.log('✅ Created products:', createdProducts.length);

  // Create product variants
  for (const product of createdProducts) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        name: 'Default',
        sku: `${product.slug}-default`,
        price: product.basePrice,
        inventory: Math.floor(Math.random() * 100) + 10, // Random inventory between 10-110
        attributes: JSON.stringify({ color: 'Default', size: 'Standard' }),
      },
    });
  }
  console.log('✅ Created product variants');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('👤 Admin: admin@marketplace.com / admin123');
  console.log('🏪 Seller: seller@marketplace.com / seller123');
  console.log('🛒 Customer: customer@marketplace.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });