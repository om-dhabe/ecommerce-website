'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Star,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { RootState } from '@/store/store';

interface AdminDashboardStats {
  activeSellers: number;
  productStats: Record<string, number>;
  salesStats: {
    totalSales: number;
    totalOrders: number;
    totalReturns: number;
    returnRate: number;
  };
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    pendingModeration: number;
  };
  paymentStats: Record<string, { count: number; amount: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading) {
    return (
      <AdminLayout currentPage="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const mainStats = [
    {
      name: 'Active Sellers',
      value: stats?.activeSellers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Total Products',
      value: Object.values(stats?.productStats || {}).reduce((sum, count) => sum + count, 0),
      icon: Package,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Total Orders',
      value: stats?.salesStats.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'positive',
    },
    {
      name: 'Total Revenue',
      value: `$${(stats?.salesStats.totalSales || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  const productStatusData = [
    { name: 'Approved', value: stats?.productStats.APPROVED || 0, color: 'bg-green-500' },
    { name: 'Pending', value: stats?.productStats.PENDING_APPROVAL || 0, color: 'bg-yellow-500' },
    { name: 'Rejected', value: stats?.productStats.REJECTED || 0, color: 'bg-red-500' },
    { name: 'Draft', value: stats?.productStats.DRAFT || 0, color: 'bg-gray-500' },
  ];

  const paymentStatusData = Object.entries(stats?.paymentStats || {}).map(([status, data]) => ({
    name: status.replace(/_/g, ' '),
    count: data.count,
    amount: data.amount,
  }));

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Monitor and manage your multi-vendor bharat-sanchaya from this central dashboard.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Status Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Product Status Overview</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {productStatusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales & Returns */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Sales & Returns</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Total Sales</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ${(stats?.salesStats.totalSales || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Total Orders</span>
                  </div>
                  <span className="text-sm text-gray-500">{stats?.salesStats.totalOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Total Returns</span>
                  </div>
                  <span className="text-sm text-gray-500">{stats?.salesStats.totalReturns || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-red-500 rounded mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Return Rate</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(stats?.salesStats.returnRate || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Review Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Review Statistics</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Total Reviews</span>
                  </div>
                  <span className="text-sm text-gray-500">{stats?.reviewStats.totalReviews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">Average Rating</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(stats?.reviewStats.averageRating || 0).toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Pending Moderation</span>
                  </div>
                  <span className="text-sm text-gray-500">{stats?.reviewStats.pendingModeration || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Payment Status Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {paymentStatusData.map((payment) => (
                  <div key={payment.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {payment.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{payment.count} orders</div>
                      <div className="text-sm font-medium text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}