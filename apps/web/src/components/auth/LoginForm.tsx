'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { login, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  userType?: 'customer' | 'seller';
  redirectTo?: string;
}

export default function LoginForm({ userType = 'customer', redirectTo }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError());
    
    try {
      const result = await dispatch(login(data)).unwrap();
      
      // Redirect based on user role and type
      if (result.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (result.user.role === 'SELLER') {
        router.push('/seller/dashboard');
      } else {
        router.push(redirectTo || '/');
      }
    } catch (error) {
      // Error is handled by the slice
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {userType === 'seller' ? 'Seller Sign In' : 'Sign In'}
          </h2>
          <p className="text-gray-600 mt-2">
            {userType === 'seller' 
              ? 'Access your seller dashboard' 
              : 'Welcome back! Please sign in to your account'
            }
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              href={userType === 'seller' ? '/seller/register' : '/register'}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {userType === 'seller' ? 'Apply as Seller' : 'Sign Up'}
            </Link>
          </p>
        </div>

        {userType === 'customer' && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Are you a seller?{' '}
              <Link
                href="/seller/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Seller Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}