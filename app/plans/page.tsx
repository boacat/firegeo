'use client';

import PricingTable from '@/components/autumn/pricing-table';
import StaticPricingTable from '@/components/static-pricing-table';
import { useSession } from '@/lib/auth-client';

// Static product details for unauthenticated users
const staticProducts = [
  {
    id: "free",
    name: "基础版",
    description: "适合初次体验健康管理服务",
    price: {
      primaryText: "免费",
      secondaryText: "无需信用卡"
    },
    items: [
      { 
        primaryText: "每月10次健康咨询",
        secondaryText: "AI智能健康顾问"
      },
      {
        primaryText: "社区支持",
        secondaryText: "获得社区用户帮助"
      },
      {
        primaryText: "基础功能",
        secondaryText: "BMI和卡路里计算器"
      }
    ]
  },
  {
    id: "pro",
    name: "专业版",
    description: "满足您的全面健康管理需求",
    recommendText: "最受欢迎",
    price: {
      primaryText: "¥68/月",
      secondaryText: "按月计费"
    },
    items: [
      { 
        primaryText: "每月100次健康咨询",
        secondaryText: "AI智能健康顾问"
      },
      {
        primaryText: "专业支持",
        secondaryText: "获得专业团队帮助"
      },
      {
        primaryText: "优先体验",
        secondaryText: "优先体验新功能"
      }
    ]
  }
];

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-[3rem] lg:text-[4.5rem] font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-tr from-orange-600 to-orange-400 bg-clip-text text-transparent">
              简单透明的健康套餐
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            选择最适合您的健康管理套餐，随时灵活升级或降级。
          </p>
          {session && (
            <p className="text-sm text-zinc-500 mt-4">
              当前登录用户: {session.user?.email}
            </p>
          )}
        </div>

        <div className="bg-white rounded-[20px] shadow-xl p-8 border border-zinc-200">
          {/* Use static component for unauthenticated users to avoid API calls */}
          {session ? (
            <PricingTable />
          ) : (
            <StaticPricingTable products={staticProducts} />
          )}
        </div>
      </div>
    </div>
  );
}