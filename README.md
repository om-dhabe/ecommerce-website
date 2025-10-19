# Bharat-Sanchaya - Professional E-commerce Marketplace

A modern, AI-powered multi-vendor e-commerce marketplace built with Next.js, Express.js, and MySQL. This project implements a complete e-commerce solution with secure payments, smart recommendations, and a professional user interface.

## 🚀 Features

### Frontend (Next.js 15)
- **Modern UI/UX**: Professional design with Tailwind CSS
- **Responsive Design**: Mobile-first approach for all devices
- **Product Catalog**: Advanced filtering and search functionality
- **Shopping Cart**: Real-time cart management with Redux
- **User Authentication**: Secure login/register system
- **Product Details**: Comprehensive product pages with reviews
- **Category Navigation**: Organized product browsing
- **Search Functionality**: Smart product search with filters

### Backend (Express.js)
- **RESTful API**: Clean API architecture with proper error handling
- **Product Management**: CRUD operations for products
- **User Management**: Authentication and authorization
- **Database Integration**: MySQL with Prisma ORM
- **Security**: CORS, Helmet, and input validation
- **Mock Data**: Rich product dataset for development

### Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL 8.0 with Prisma ORM
- **Development**: Docker Compose for local development
- **Icons**: Lucide React for consistent iconography

## 📁 Project Structure

```
ecommerce-mono/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # Next.js 13+ app directory
│   │   │   ├── components/  # Reusable React components
│   │   │   ├── store/       # Redux store and slices
│   │   │   └── lib/         # Utility functions and API calls
│   │   └── package.json
│   └── api/                 # Express.js backend API
│       ├── src/
│       │   └── index.ts     # Main API server
│       ├── prisma/          # Database schema and migrations
│       └── package.json
├── docker-compose.yml       # MySQL and Adminer services
├── package.json            # Root package.json with workspaces
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for database)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/om-dhabe/ecommerce-website.git
cd ecommerce-website
```

### 2. Install Dependencies
```bash
# Install all dependencies for both frontend and backend
npm install
```

### 3. Start Database Services
```bash
# Start MySQL and Adminer with Docker
docker compose up -d
```

### 4. Set up Database
```bash
# Navigate to API directory and run Prisma migrations
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start Development Servers
```bash
# From the root directory, start both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database Admin (Adminer)**: http://localhost:8080

## 🌐 Available Pages

- **Homepage** (`/`) - Hero section, featured categories, trending products
- **Product Categories** (`/categories/[category]`) - Filtered product listings
- **Product Details** (`/products/[id]`) - Individual product information
- **Shopping Cart** (`/cart`) - Cart management and checkout
- **Search** (`/search`) - Product search with filters
- **User Authentication** (`/login`) - Login and registration
- **About Us** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form and information

## 🔧 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /health` - Health check endpoint

### Future Endpoints (Planned)
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /cart` - Cart management
- `POST /orders` - Order processing

## 🎨 Design System

The application uses a consistent design system with:
- **Color Palette**: Blue primary, with gray and accent colors
- **Typography**: Inter font family for modern readability
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant components

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd apps/web
npm run build
```

### Backend (Railway/Render/AWS)
```bash
cd apps/api
npm run build
npm start
```

### Database
- Use managed MySQL service (PlanetScale, AWS RDS, etc.)
- Update `DATABASE_URL` in environment variables

## 🔮 Future Enhancements

Based on the project plan, upcoming features include:

### Phase 1: Core Features ✅
- [x] User authentication and authorization
- [x] Product catalog with search and filters
- [x] Shopping cart functionality
- [x] Responsive design

### Phase 2: Advanced Features (Planned)
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Order management system
- [ ] Email notifications
- [ ] Vendor dashboard
- [ ] Admin panel

### Phase 3: AI Integration (Planned)
- [ ] AI-powered product recommendations
- [ ] Chatbot for customer support
- [ ] Natural language search
- [ ] Dynamic personalization

### Phase 4: Scaling (Planned)
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Om Dhabe**
- GitHub: [@om-dhabe](https://github.com/om-dhabe)
- Project: [Bharat-Sanchaya](https://github.com/om-dhabe/ecommerce-website)

## 🙏 Acknowledgments

- Built following modern e-commerce best practices
- Inspired by leading marketplaces like Amazon and Flipkart
- Uses cutting-edge web technologies for optimal performance