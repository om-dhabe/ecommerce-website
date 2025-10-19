'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  Bell,
  UserCheck,
  PackageCheck,
  Menu,
  X
} from 'lucide-react';
import { getCurrentUser, logout } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Sellers', href: '/admin/sellers', icon: Users },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const user = (auth as any).user;
  const isAuthenticated = (auth as any).isAuthenticated;
  const isLoading = (auth as any).isLoading;

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
      return;
    }

    if (!user && isAuthenticated) {
      dispatch(getCurrentUser());
    }

    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [dispatch, router, user, isAuthenticated, isLoading]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner rounded-full h-32 w-32 border-4 border-gray-200 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 admin-layout">
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
          <div className="flex flex-col h-16 lg:h-20 bg-red-600">
            <div className="flex items-center justify-between px-4 flex-1">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <Shield className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-red-200 hover:text-white hover:bg-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 pb-2">
              <Link 
                href="/" 
                className="text-xs text-red-200 hover:text-white transition-colors"
              >
                ← Back to Site
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                  ADMIN
                </span>
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
                        ? 'bg-red-100 text-red-700 shadow-sm border-l-4 border-red-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-transparent hover:border-red-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 flex-shrink-0" />
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
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 mr-2"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 capitalize">
                  {currentPage || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/admin/sellers"
                  className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Pending Sellers</span>
                  <span className="md:hidden">Sellers</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <PackageCheck className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Pending Products</span>
                  <span className="md:hidden">Products</span>
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

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