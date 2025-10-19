'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Store,
  Plus,
  Bell,
  Menu,
  X,
  User,
  FileText,
  TrendingUp
} from 'lucide-react';
import { getCurrentUser, logout } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';

interface SellerLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard, description: 'Overview & Stats' },
  { name: 'Products', href: '/seller/products', icon: Package, description: 'Manage Catalog' },
  { name: 'Orders', href: '/seller/orders', icon: ShoppingCart, description: 'Order Management' },
  { name: 'Analytics', href: '/seller/analytics', icon: TrendingUp, description: 'Sales Reports' },
  { name: 'Profile', href: '/seller/profile', icon: User, description: 'Business Info' },
  { name: 'Settings', href: '/seller/settings', icon: Settings, description: 'Account Settings' },
];

export default function SellerLayout({ children, currentPage }: SellerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const user = (auth as any).user;
  const isAuthenticated = (auth as any).isAuthenticated;
  const isLoading = (auth as any).isLoading;

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/seller/login');
      return;
    }

    if (!user && isAuthenticated) {
      dispatch(getCurrentUser());
    }

    if (user && user.role !== 'SELLER' && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [dispatch, router, user, isAuthenticated, isLoading]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/seller/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner rounded-full h-32 w-32 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  const sellerStatus = user.sellerProfile?.status;
  const isApproved = sellerStatus === 'APPROVED';

  return (
    <div className="flex min-h-screen bg-gray-50 seller-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl sidebar-transition dashboard-sidebar ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:flex-shrink-0`}>
        <div className="flex flex-col w-64 h-full">
          {/* Logo */}
          <div className="flex flex-col h-16 lg:h-20 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
            <div className="flex items-center justify-between px-4 flex-1">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Store className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">Seller Portal</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 pb-2">
              <Link 
                href="/" 
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                ← Back to Site
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600 mb-2">{user.email}</p>
                {user.sellerProfile && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sellerStatus === 'APPROVED' 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : sellerStatus === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {sellerStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = currentPage === item.name.toLowerCase();
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`nav-link group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      <div className={`text-xs mt-0.5 truncate ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-transparent hover:border-blue-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 dashboard-main">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize">
                  {currentPage || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {isApproved && (
                  <Link
                    href="/seller/products/new"
                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                  </Link>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {!isApproved && (
          <div className={`px-4 sm:px-6 py-4 ${
            sellerStatus === 'PENDING' 
              ? 'bg-yellow-50 border-b border-yellow-200'
              : 'bg-red-50 border-b border-red-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className={`h-5 w-5 ${
                  sellerStatus === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  sellerStatus === 'PENDING' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {sellerStatus === 'PENDING' 
                    ? 'Account Pending Approval'
                    : 'Account Not Approved'
                  }
                </h3>
                <div className={`mt-2 text-sm ${
                  sellerStatus === 'PENDING' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  <p>
                    {sellerStatus === 'PENDING'
                      ? 'Your seller account is under review. You will be notified once approved.'
                      : 'Your seller account application was not approved. Please contact support for more information.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 bg-gray-50 dashboard-content">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}