# Multi-Vendor E-commerce Platform

A comprehensive multi-vendor bharat-sanchaya built with Next.js, Express.js, and PostgreSQL. Features separate authentication for customers, sellers, and admins with role-based access control, product approval workflows, and comprehensive order management.

## 🚀 Features

### Core Functionality
- **Multi-vendor bharat-sanchaya** with separate seller onboarding
- **Role-based access control** (Customer, Seller, Admin)
- **Product lifecycle management** (Draft → Pending → Approved/Rejected → Archived)
- **Order management** with COD and prepaid payment support
- **Email verification** and notifications
- **Comprehensive admin dashboard** with analytics
- **Seller dashboard** with product and order management

### Authentication & Security
- JWT-based authentication with secure token management
- Email verification for all user registrations
- Separate login flows for customers and sellers
- Role-based route protection
- Audit logging for sensitive operations

### Product Management
- Product approval workflow with admin moderation
- Bulk product submission for approval
- Product variants with inventory tracking
- Category management
- Image upload support

### Order & Payment System
- Support for both prepaid and Cash on Delivery (COD)
- Idempotent payment processing
- Order status tracking
- Return management system
- Payment status reconciliation

### Admin Features
- Seller approval/rejection workflow
- Product moderation queue with batch actions
- Comprehensive analytics dashboard
- User management
- System-wide settings

## 🏗️ Project Structure

```
ecommerce-mono/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # Reusable components
│   │   │   │   ├── auth/      # Authentication components
│   │   │   │   ├── admin/     # Admin-specific components
│   │   │   │   ├── seller/    # Seller-specific components
│   │   │   │   └── layout/    # Layout components
│   │   │   └── store/         # Redux store and slices
│   │   └── package.json
│   └── api/                   # Express.js backend
│       ├── src/
│       │   ├── routes/        # API routes
│       │   ├── utils/         # Utility functions
│       │   └── index.ts       # Main server file
│       ├── prisma/            # Database schema and migrations
│       └── package.json
└── package.json               # Root package.json
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Nodemailer** - Email sending
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP server for email (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecommerce-mono
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Backend (`apps/api/.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/multivendor_ecommerce"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@bharat-sanchaya.com"
FRONTEND_URL="http://localhost:3000"
PORT="3001"
NODE_ENV="development"
```

Frontend (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME="Multi-Vendor Bharat-Sanchaya"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

5. **Start development servers**
```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📱 User Flows

### Customer Flow
1. Register/Login as customer
2. Browse products and categories
3. Add products to cart
4. Place orders (prepaid or COD)
5. Track order status
6. Leave product reviews

### Seller Flow
1. Register as seller (requires admin approval)
2. Complete seller profile
3. Create products (saved as drafts)
4. Submit products for approval
5. Manage approved products
6. Process orders
7. Handle returns

### Admin Flow
1. Login with admin credentials
2. Review and approve/reject seller applications
3. Moderate product submissions
4. Monitor bharat-sanchaya analytics
5. Manage users and settings
6. Handle disputes and returns

## 🔐 Authentication & Authorization

### User Roles
- **CUSTOMER**: Can browse, purchase, and review products
- **SELLER**: Can manage products and orders (after approval)
- **ADMIN**: Full bharat-sanchaya control

### Protected Routes
- `/seller/*` - Requires SELLER or ADMIN role
- `/admin/*` - Requires ADMIN role
- API endpoints protected with JWT middleware

## 📊 Database Schema

Key entities:
- **User** - Base user with role (Customer/Seller/Admin)
- **SellerProfile** - Extended seller information
- **Product** - Products with approval status
- **ProductVariant** - Product variations with inventory
- **Order** - Customer orders
- **Payment** - Payment tracking with idempotency
- **AuditEvent** - System audit logs

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Configure API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## 🔄 Development Status

This is a comprehensive multi-vendor platform with:
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Product management with approval workflow
- ✅ Order management system
- ✅ Admin and seller dashboards
- ✅ Email notifications
- ⏳ Payment gateway integration (ready for implementation)
- ⏳ Advanced analytics and reporting
- ⏳ Mobile app support