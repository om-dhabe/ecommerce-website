# MySQL Database Design

## Overview

This design document outlines the migration from PostgreSQL to MySQL for the multi-vendor e-commerce platform. The design focuses on simplicity, compatibility, and maintaining all core functionality while using MySQL-native features and data types.

## Architecture

### Database Technology Stack
- **Database**: MySQL 8.0+ (with support for JSON data type)
- **ORM**: Prisma with MySQL connector
- **Connection**: Standard MySQL connection with connection pooling
- **Migrations**: Prisma migrate for schema management

### Design Principles
1. **Simplicity**: Use standard MySQL data types and features
2. **Compatibility**: Ensure cross-platform compatibility
3. **Performance**: Optimize for common query patterns
4. **Maintainability**: Clear schema structure with proper naming conventions

## Components and Interfaces

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('CUSTOMER', 'SELLER', 'ADMIN') DEFAULT 'CUSTOMER',
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. Seller Profiles Table
```sql
CREATE TABLE seller_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  business_phone VARCHAR(50) NOT NULL,
  business_address TEXT NOT NULL,
  tax_id VARCHAR(100),
  status ENUM('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED') DEFAULT 'PENDING',
  approved_at DATETIME,
  approved_by VARCHAR(36),
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### 3. Categories Table
```sql
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4. Products Table
```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  images JSON, -- MySQL 8.0+ supports JSON
  status ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ARCHIVED') DEFAULT 'DRAFT',
  seller_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  rejection_reason TEXT,
  approved_at DATETIME,
  approved_by VARCHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES seller_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_products_status (status),
  INDEX idx_products_seller (seller_id),
  INDEX idx_products_category (category_id)
);
```

#### 5. Product Variants Table
```sql
CREATE TABLE product_variants (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  inventory INT DEFAULT 0,
  attributes JSON, -- Store variant attributes
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### 6. Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  status ENUM('CREATED', 'PAID', 'COD', 'PACKED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'RETURNED') DEFAULT 'CREATED',
  payment_status ENUM('INITIATED', 'AUTHORIZED', 'CAPTURED', 'PAID', 'CASH_ON_DELIVERY', 'COLLECTED', 'REMITTED', 'REFUNDED', 'FAILED') DEFAULT 'INITIATED',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Shipping Address
  shipping_first_name VARCHAR(100) NOT NULL,
  shipping_last_name VARCHAR(100) NOT NULL,
  shipping_address1 VARCHAR(255) NOT NULL,
  shipping_address2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_zip VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(50),
  
  -- Billing Address
  billing_first_name VARCHAR(100) NOT NULL,
  billing_last_name VARCHAR(100) NOT NULL,
  billing_address1 VARCHAR(255) NOT NULL,
  billing_address2 VARCHAR(255),
  billing_city VARCHAR(100) NOT NULL,
  billing_state VARCHAR(100) NOT NULL,
  billing_zip VARCHAR(20) NOT NULL,
  billing_country VARCHAR(100) NOT NULL,
  
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES seller_profiles(id),
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_seller (seller_id),
  INDEX idx_orders_status (status)
);
```

#### 7. Order Items Table
```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  variant_id VARCHAR(36),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);
```

#### 8. Payments Table
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('INITIATED', 'AUTHORIZED', 'CAPTURED', 'PAID', 'CASH_ON_DELIVERY', 'COLLECTED', 'REMITTED', 'REFUNDED', 'FAILED') DEFAULT 'INITIATED',
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  idempotency_key VARCHAR(255) UNIQUE NOT NULL,
  external_reference VARCHAR(255),
  metadata JSON,
  processed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### 9. Reviews Table
```sql
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  customer_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product_customer (product_id, customer_id)
);
```

#### 10. Audit Events Table
```sql
CREATE TABLE audit_events (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  action VARCHAR(100) NOT NULL,
  old_values JSON,
  new_values JSON,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_created (created_at)
);
```

## Data Models

### Prisma Schema for MySQL
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CUSTOMER
  SELLER
  ADMIN
}

enum SellerStatus {
  PENDING
  APPROVED
  SUSPENDED
  REJECTED
}

enum ProductStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  ARCHIVED
}

enum OrderStatus {
  CREATED
  PAID
  COD
  PACKED
  SHIPPED
  DELIVERED
  COMPLETED
  RETURNED
}

enum PaymentStatus {
  INITIATED
  AUTHORIZED
  CAPTURED
  PAID
  CASH_ON_DELIVERY
  COLLECTED
  REMITTED
  REFUNDED
  FAILED
}

model User {
  id                     String    @id @default(cuid())
  email                  String    @unique @db.VarChar(255)
  password               String    @db.VarChar(255)
  firstName              String    @map("first_name") @db.VarChar(100)
  lastName               String    @map("last_name") @db.VarChar(100)
  role                   UserRole  @default(CUSTOMER)
  isEmailVerified        Boolean   @default(false) @map("is_email_verified")
  emailVerificationToken String?   @map("email_verification_token") @db.VarChar(255)
  passwordResetToken     String?   @map("password_reset_token") @db.VarChar(255)
  passwordResetExpires   DateTime? @map("password_reset_expires")
  createdAt              DateTime  @default(now()) @map("created_at")
  updatedAt              DateTime  @updatedAt @map("updated_at")

  // Relations
  sellerProfile SellerProfile?
  orders        Order[]
  reviews       Review[]
  auditEvents   AuditEvent[]

  @@map("users")
}

model SellerProfile {
  id              String       @id @default(cuid())
  userId          String       @unique @map("user_id")
  businessName    String       @map("business_name") @db.VarChar(255)
  businessEmail   String       @map("business_email") @db.VarChar(255)
  businessPhone   String       @map("business_phone") @db.VarChar(50)
  businessAddress String       @map("business_address") @db.Text
  taxId           String?      @map("tax_id") @db.VarChar(100)
  status          SellerStatus @default(PENDING)
  approvedAt      DateTime?    @map("approved_at")
  approvedBy      String?      @map("approved_by")
  rejectionReason String?      @map("rejection_reason") @db.Text
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  // Relations
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  products Product[]
  orders   Order[]

  @@map("seller_profiles")
}

// Additional models follow similar pattern...
```

## Error Handling

### Database Connection Errors
- Implement connection retry logic
- Provide clear error messages for common MySQL setup issues
- Handle connection pool exhaustion gracefully

### Migration Errors
- Validate schema before applying migrations
- Provide rollback capabilities
- Handle data type conversion issues

## Testing Strategy

### Unit Tests
- Test database connection and configuration
- Test model validations and constraints
- Test query performance with sample data

### Integration Tests
- Test complete user workflows with database
- Test multi-vendor scenarios
- Test payment and order processing

### Performance Tests
- Test with realistic data volumes
- Optimize slow queries
- Monitor connection pool usage

## Migration Plan

### Phase 1: Schema Migration
1. Update Prisma schema to use MySQL
2. Create migration scripts
3. Test with sample data

### Phase 2: Application Updates
1. Update environment configuration
2. Test all API endpoints
3. Verify authentication flows

### Phase 3: Data Migration (if needed)
1. Export existing data
2. Transform data for MySQL compatibility
3. Import and verify data integrity