'use client';

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24">
        
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up">
              <span className="block text-zinc-900">健康计算器</span>
              <span className="block bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                智能健康管理平台
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-zinc-600 max-w-3xl mx-auto mb-6 animate-fade-in-up animation-delay-200">
              专业的健康指标计算与个性化健康建议
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link
                href="/health-calculators"
                className="btn-firecrawl-orange inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
              >
                开始健康计算
              </Link>
              <Link
                href="/plans"
                className="btn-firecrawl-default inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
              >
                查看套餐
              </Link>
            </div>
            <p className="mt-6 text-sm text-zinc-500 animate-fade-in-up animation-delay-600">
              AI驱动 • 实时计算 • 个性化建议 • 健康追踪
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 bg-zinc-900 rounded-[20px] p-12 animate-fade-in-scale animation-delay-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center animate-fade-in-up animation-delay-1000">
                <div className="text-4xl font-bold text-white">BMI</div>
                <div className="text-sm text-zinc-400 mt-1">身体质量指数</div>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-1000" style={{animationDelay: '1100ms'}}>
                <div className="text-4xl font-bold text-white">卡路里</div>
                <div className="text-sm text-zinc-400 mt-1">热量计算</div>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-1000" style={{animationDelay: '1200ms'}}>
                <div className="text-4xl font-bold text-white">体脂率</div>
                <div className="text-sm text-zinc-400 mt-1">身体成分</div>
              </div>
              <div className="text-center animate-fade-in-up animation-delay-1000" style={{animationDelay: '1300ms'}}>
                <div className="text-4xl font-bold text-white">健康建议</div>
                <div className="text-sm text-zinc-400 mt-1">个性化指导</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-[30px] p-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-zinc-900 mb-4">
                选择适合您的健康计划
              </h2>
              <p className="text-xl text-zinc-600">
                专业的健康管理服务，助您达成健康目标
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-8 rounded-[20px] border border-zinc-200 animate-fade-in-up animation-delay-400 hover:scale-105 transition-all duration-200">
              <h3 className="text-2xl font-bold mb-2">基础版</h3>
              <p className="text-zinc-600 mb-6">适合个人健康管理</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">免费</span>
                <span className="text-zinc-600">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  每月10次计算
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  基础健康指标
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  健康报告
                </li>
              </ul>
              <Link
                href="/register"
                className="btn-firecrawl-outline w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
              >
                免费开始
              </Link>
            </div>

            {/* Pro - Featured */}
            <div className="bg-white p-8 rounded-[20px] border-2 border-orange-500 relative animate-fade-in-up animation-delay-600 hover:scale-105 transition-all duration-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                最受欢迎
              </div>
              <h3 className="text-2xl font-bold mb-2">专业版</h3>
              <p className="text-zinc-600 mb-6">适合健身爱好者</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">¥49</span>
                <span className="text-zinc-600">/月</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  无限次健康计算
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  全部健康指标
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  实时健康提醒
                </li>
              </ul>
              <Link
                href="/register"
                className="btn-firecrawl-orange w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
              >
                免费试用
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-[20px] border border-zinc-200 animate-fade-in-up animation-delay-800 hover:scale-105 transition-all duration-200">
              <h3 className="text-2xl font-bold mb-2">企业版</h3>
              <p className="text-zinc-600 mb-6">适合医疗机构和企业</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">定制</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  多用户管理
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API接口
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  私有化部署
                </li>
              </ul>
              <Link
                href="/contact"
                className="btn-firecrawl-outline w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
              >
                联系销售
              </Link>
            </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/plans" className="text-orange-600 hover:text-orange-700 font-medium">
                查看详细套餐 →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-[30px] p-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              开始您的健康管理之旅
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              专业的健康指标计算，个性化的健康建议，助您达成健康目标
            </p>
            <Link
              href="/health-calculator"
              className="btn-firecrawl-default inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
            >
              免费健康分析
            </Link>
          </div>
        </div>
      </section>


      {/* FAQs */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4 animate-fade-in-up">
              常见问题
            </h2>
            <p className="text-xl text-zinc-600 animate-fade-in-up animation-delay-200">
              关于健康计算器您需要了解的一切
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-400">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  健康计算器如何工作？
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 0 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 0 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    健康计算器通过科学的算法分析您的身体数据，包括身高、体重、年龄等基础信息，计算出BMI、体脂率、基础代谢率等关键健康指标。系统会根据您的个人情况提供个性化的健康建议和改善方案。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-400" style={{animationDelay: '500ms'}}>
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  支持哪些健康指标计算？
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 1 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    我们支持多种健康指标计算，包括BMI（身体质量指数）、体脂率、基础代谢率、理想体重、每日热量需求、心率区间等。系统会持续更新算法，确保计算结果的准确性和科学性。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-600">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  数据多久更新一次？
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 2 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    健康数据实时计算更新。每次您输入新的身体数据时，系统会立即重新计算所有相关指标。您可以随时记录新的数据来跟踪健康变化，查看健康改善的进展情况。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-400" style={{animationDelay: '700ms'}}>
              <button
                onClick={() => toggleFaq(3)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  我能获得什么样的健康洞察？
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 3 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    您将获得详细的健康评分、身体成分分析、营养需求建议、运动计划推荐以及具体的健康改善建议。平台还会跟踪您的健康趋势变化，并在发现重要变化时提醒您。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-gray-50 rounded-[15px] overflow-hidden animate-fade-in-up animation-delay-800">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  需要多少计算次数？
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 4 && (
                <div className="px-6 py-6">
                  <p className="text-zinc-600 leading-relaxed">
                    每次健康分析消耗1个计算次数。免费版每月提供10次计算，足够进行基础的健康监测。专业版提供无限次计算，适合需要频繁监测健康状况的用户。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            开始您的健康管理之旅
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            掌控您的健康数据，获得专业的健康指导
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/health-calculator"
              className="btn-firecrawl-orange inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
            >
              开始健康分析
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8 bg-zinc-800 text-white hover:bg-zinc-700"
            >
              查看套餐
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}