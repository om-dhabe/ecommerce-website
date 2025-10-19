# Multi-Vendor E-commerce Platform - Setup Guide

## 🚀 Quick Start (Current Status)

The platform is currently running with:
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:4000

## ✅ What's Working Now

1. **Frontend Application**: Fully functional with authentication UI, dashboards, and components
2. **Backend API**: Running with mock data endpoints
3. **Authentication System**: Complete UI components (requires database for full functionality)
4. **Role-Based Dashboards**: Customer, Seller, and Admin interfaces ready

## 🔧 Current Limitations

The following features require database setup to be fully functional:
- User registration and login
- Product management
- Order processing
- Admin moderation
- Email notifications

## 📋 Complete Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SMTP server (Gmail, SendGrid, etc.)

### Step 1: Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```sql
   CREATE DATABASE multivendor_ecommerce;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE multivendor_ecommerce TO your_username;
   ```

3. **Update Environment Variables**
   
   Edit `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/multivendor_ecommerce"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   FROM_EMAIL="noreply@bharat-sanchaya.com"
   FRONTEND_URL="http://localhost:3002"
   PORT="4000"
   NODE_ENV="development"
   ```

### Step 2: Database Migration

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

### Step 3: Enable Full API Routes

Replace the content of `apps/api/src/index.ts` with the full implementation:

```bash
# This will restore all API routes with database functionality
git checkout apps/api/src/index.ts
```

Or manually restore the routes by uncommenting the import statements and route handlers.

### Step 4: Create Admin User

After database setup, you can create an admin user directly in the database:

```sql
INSERT INTO users (id, email, password, "firstName", "lastName", role, "isEmailVerified") 
VALUES (
  'admin-001', 
  'admin@bharat-sanchaya.com', 
  '$2b$12$hash_your_password_here', 
  'Admin', 
  'User', 
  'ADMIN', 
  true
);
```

### Step 5: Test the Application

1. **Frontend**: http://localhost:3002
   - Customer registration/login
   - Seller registration (requires admin approval)
   - Admin login

2. **Backend API**: http://localhost:4000
   - API documentation and health check

## 🎯 User Flows to Test

### Customer Flow
1. Register as customer → Verify email → Login
2. Browse products → Add to cart → Checkout
3. View orders → Leave reviews

### Seller Flow
1. Register as seller → Wait for admin approval
2. Complete seller profile → Create products
3. Submit products for approval → Manage orders

### Admin Flow
1. Login with admin credentials
2. Approve seller applications
3. Moderate product submissions
4. Monitor analytics dashboard

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Frontend automatically uses next available port (3002)
   - API configured to use port 4000

2. **Database Connection**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL format
   - Verify user permissions

3. **Email Configuration**
   - Gmail requires app-specific passwords
   - Test SMTP settings separately

4. **Missing Dependencies**
   ```bash
   npm install
   cd apps/api && npm install
   cd ../web && npm install
   ```

### Development Commands

```bash
# Start both servers
npm run dev

# API only
cd apps/api && npm run dev

# Frontend only  
cd apps/web && npm run dev

# Database operations
cd apps/api
npx prisma studio          # Database GUI
npx prisma migrate reset   # Reset database
npx prisma db seed         # Seed data (if configured)
```

## 📊 Current Architecture

```
Frontend (Next.js) → API (Express.js) → Database (PostgreSQL)
     ↓                    ↓                    ↓
- Authentication UI    - JWT Auth         - User Management
- Role Dashboards     - RBAC Middleware   - Product Catalog  
- Product Catalog     - Email Service     - Order System
- Shopping Cart       - Payment Logic     - Audit Logs
```

## 🚀 Production Deployment

1. **Database**: Set up managed PostgreSQL (AWS RDS, Railway, etc.)
2. **Backend**: Deploy to Railway, Heroku, or similar
3. **Frontend**: Deploy to Vercel, Netlify, or similar
4. **Environment**: Update all URLs and secrets

## 📞 Support

- Check the main README.md for detailed feature documentation
- Review code comments for implementation details
- Create issues for bugs or feature requests

---

**Status**: Development ready with database setup required for full functionality.