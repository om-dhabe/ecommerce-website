'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  CreditCard,
  Truck,
  Package,
  Mail,
  User,
  Lock
} from 'lucide-react';
import SellerLayout from '@/components/seller/SellerLayout';
import { RootState } from '@/store/store';

interface SellerSettings {
  notifications: {
    orderNotifications: boolean;
    paymentNotifications: boolean;
    productNotifications: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
  shipping: {
    freeShippingThreshold: number;
    defaultShippingRate: number;
    processingTime: number;
    shippingZones: string[];
    internationalShipping: boolean;
  };
  inventory: {
    lowStockThreshold: number;
    autoReorderEnabled: boolean;
    trackInventory: boolean;
    allowBackorders: boolean;
  };
  payments: {
    paymentMethods: string[];
    taxRate: number;
    currency: string;
    payoutFrequency: 'WEEKLY' | 'MONTHLY';
  };
  privacy: {
    profileVisibility: 'PUBLIC' | 'PRIVATE';
    showContactInfo: boolean;
    allowReviews: boolean;
    dataRetention: number;
  };
}

export default function SellerSettings() {
  const [settings, setSettings] = useState<SellerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/seller/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!token || !settings) return;

    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/seller/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof SellerSettings, field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'privacy', name: 'Privacy', icon: Shield },
  ];

  if (loading) {
    return (
      <SellerLayout currentPage="settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SellerLayout>
    );
  }

  if (!settings) {
    return (
      <SellerLayout currentPage="settings">
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Settings not available</h3>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout currentPage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your seller account preferences</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Order Notifications</h4>
                      <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderNotifications}
                      onChange={(e) => updateSettings('notifications', 'orderNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Payment Notifications</h4>
                      <p className="text-sm text-gray-500">Get notified about payment updates and payouts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.paymentNotifications}
                      onChange={(e) => updateSettings('notifications', 'paymentNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Product Notifications</h4>
                      <p className="text-sm text-gray-500">Get notified about product approval status</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.productNotifications}
                      onChange={(e) => updateSettings('notifications', 'productNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
                      <p className="text-sm text-gray-500">Receive tips, promotions, and marketplace updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.marketingEmails}
                      onChange={(e) => updateSettings('notifications', 'marketingEmails', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => updateSettings('notifications', 'smsNotifications', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Shipping Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Free Shipping Threshold</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => updateSettings('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Default Shipping Rate</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.shipping.defaultShippingRate}
                      onChange={(e) => updateSettings('shipping', 'defaultShippingRate', parseFloat(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Processing Time (days)</label>
                    <input
                      type="number"
                      min="1"
                      value={settings.shipping.processingTime}
                      onChange={(e) => updateSettings('shipping', 'processingTime', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.shipping.internationalShipping}
                      onChange={(e) => updateSettings('shipping', 'internationalShipping', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Enable international shipping
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Inventory Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                    <input
                      type="number"
                      min="0"
                      value={settings.inventory.lowStockThreshold}
                      onChange={(e) => updateSettings('inventory', 'lowStockThreshold', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.inventory.trackInventory}
                        onChange={(e) => updateSettings('inventory', 'trackInventory', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Track inventory levels
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.inventory.autoReorderEnabled}
                        onChange={(e) => updateSettings('inventory', 'autoReorderEnabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Enable auto-reorder alerts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.inventory.allowBackorders}
                        onChange={(e) => updateSettings('inventory', 'allowBackorders', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Allow backorders
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={settings.payments.taxRate}
                      onChange={(e) => updateSettings('payments', 'taxRate', parseFloat(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={settings.payments.currency}
                      onChange={(e) => updateSettings('payments', 'currency', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payout Frequency</label>
                    <select
                      value={settings.payments.payoutFrequency}
                      onChange={(e) => updateSettings('payments', 'payoutFrequency', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => updateSettings('privacy', 'profileVisibility', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="PUBLIC">Public - Visible to all customers</option>
                      <option value="PRIVATE">Private - Only visible to customers who purchase</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Show Contact Information</h4>
                      <p className="text-sm text-gray-500">Display your contact info on your public profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showContactInfo}
                      onChange={(e) => updateSettings('privacy', 'showContactInfo', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Allow Customer Reviews</h4>
                      <p className="text-sm text-gray-500">Let customers leave reviews on your products</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowReviews}
                      onChange={(e) => updateSettings('privacy', 'allowReviews', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data Retention (months)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={settings.privacy.dataRetention}
                      onChange={(e) => updateSettings('privacy', 'dataRetention', parseInt(e.target.value))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">How long to keep customer data after order completion</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}