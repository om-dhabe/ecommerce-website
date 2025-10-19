'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const user = (auth as any).user;
  const isAuthenticated = (auth as any).isAuthenticated;
  const isLoading = (auth as any).isLoading;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/seller/login');
        return;
      }
      
      if (user && user.role !== 'SELLER' && user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner rounded-full h-32 w-32 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return null;
  }

  // Return children without header/footer for seller routes
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}