'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '发送重置邮件失败');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Orange gradient */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 via-orange-500/90 to-orange-600/90" />
          <div className="relative z-10 max-w-md text-white">
            <h1 className="text-4xl font-bold mb-4">请查看您的邮箱！</h1>
            <p className="text-lg opacity-90">
              我们已向您发送了重置密码的说明。请查看您的邮箱以继续操作。
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        </div>

        {/* Right side - Success message */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                请查看您的邮箱
              </h2>
              <p className="mt-2 text-gray-600">
                我们已向以下邮箱发送了密码重置链接
              </p>
              <p className="mt-1 text-lg font-medium text-gray-900">{email}</p>
              <p className="mt-4 text-sm text-gray-500">
                没有收到邮件？请检查您的垃圾邮件文件夹或重试。
              </p>
              <Link 
                href="/login" 
                className="mt-6 inline-flex items-center text-sm text-orange-600 hover:text-orange-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Orange gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 via-orange-500/90 to-orange-600/90" />
        <div className="relative z-10 max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">忘记密码了？</h1>
          <p className="text-lg opacity-90">
            别担心！我们将帮助您重置密码，让您重新开始健康管理之旅。
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="lg:hidden mb-8 flex justify-center">
              <Image
                src="/firecrawl-logo-with-fire.webp"
                alt="Firecrawl"
                width={180}
                height={37}
                priority
              />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              重置您的密码
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              输入您的邮箱，我们将向您发送重置链接
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="请输入您的邮箱"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-firecrawl-default w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 h-10 px-4"
              >
                {loading ? '发送中...' : '发送重置链接'}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm text-orange-600 hover:text-orange-500 inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回登录
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}