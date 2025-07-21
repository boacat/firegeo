"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  popular?: boolean;
}

const calculatorData = [
  // 基础健康指标
  { id: "bmi", icon: "⚖️", path: "/bmi-calculator", popular: true },
  { id: "calorie", icon: "🔥", path: "/calorie-calculator", popular: true },
  { id: "body-fat", icon: "📊", path: "/body-fat-calculator" },
  { id: "ideal-weight", icon: "🎯", path: "/ideal-weight-calculator" },
  { id: "waist-hip", icon: "📏", path: "/waist-hip-calculator" },
  
  // 心血管健康
  { id: "heart-rate", icon: "❤️", path: "/heart-rate-calculator", popular: true },
  { id: "blood-pressure", icon: "🩺", path: "/blood-pressure-calculator" },
  { id: "cholesterol", icon: "🫀", path: "/cholesterol-calculator" },
  
  // 营养与饮食
  { id: "water", icon: "💧", path: "/water-calculator" },
  { id: "protein", icon: "🥩", path: "/protein-calculator" },
  { id: "macro", icon: "🍽️", path: "/macro-calculator" },
  { id: "vitamin-d", icon: "☀️", path: "/vitamin-d-calculator" },
  
  // 运动健身
  { id: "exercise-calorie", icon: "🏃", path: "/exercise-calorie-calculator" },
  { id: "one-rep-max", icon: "🏋️", path: "/one-rep-max-calculator" },
  { id: "pace", icon: "🏃‍♂️", path: "/pace-calculator" },
  { id: "vo2-max", icon: "🫁", path: "/vo2-max-calculator" },
  
  // 女性健康
  { id: "pregnancy-weight", icon: "🤱", path: "/pregnancy-weight-calculator" },
  { id: "ovulation", icon: "🌸", path: "/ovulation-calculator" },
  { id: "menstrual", icon: "📅", path: "/menstrual-calculator" },
  
  // 儿童健康
  { id: "child-growth", icon: "👶", path: "/child-growth-calculator" },
  { id: "child-bmi", icon: "🧒", path: "/child-bmi-calculator" },
  
  // 老年健康
  { id: "bone-density", icon: "🦴", path: "/bone-density-calculator" },
  { id: "fall-risk", icon: "🚶‍♂️", path: "/fall-risk-calculator" },
  
  // 睡眠与压力
  { id: "sleep", icon: "😴", path: "/sleep-calculator" },
  { id: "stress", icon: "🧠", path: "/stress-calculator" },
  
  // 特殊计算
  { id: "diabetes-risk", icon: "🩸", path: "/diabetes-risk-calculator" },
  { id: "kidney", icon: "🫘", path: "/kidney-calculator" },
  { id: "body-age", icon: "🎂", path: "/body-age-calculator" },
  { id: "health-score", icon: "🏆", path: "/health-score-calculator" },
  { id: "life-expectancy", icon: "⏳", path: "/life-expectancy-calculator" }
];

export default function HealthCalculatorsPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t('calculators.categories.all'));

  // 使用翻译键创建计算器数组
  const calculators: Calculator[] = calculatorData.map(calc => ({
    ...calc,
    name: t(`calculators.items.${calc.id}.name`),
    description: t(`calculators.items.${calc.id}.description`),
    category: t(`calculators.items.${calc.id}.category`)
  }));

  const categories = [t('calculators.categories.all'), ...Array.from(new Set(calculators.map(calc => calc.category)))];

  const filteredCalculators = calculators.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === t('calculators.categories.all') || calc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularCalculators = calculators.filter(calc => calc.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('calculators.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('calculators.subtitle')}
          </p>
        </div>

        {/* 热门计算器 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {t('calculators.popular')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {popularCalculators.map((calc) => (
              <Link key={calc.id} href={calc.path}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{calc.icon}</div>
                    <CardTitle className="text-xl text-gray-900">{calc.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{calc.description}</p>
                    <Badge className="mt-3 mx-auto block w-fit bg-orange-100 text-orange-800">
                      {calc.category}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder={t('calculators.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg p-3"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(t('calculators.categories.all'))}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === t('calculators.categories.all')
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t('calculators.categories.all')}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 计算器网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCalculators.map((calc) => (
            <Link key={calc.id} href={calc.path}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="text-3xl mb-2">{calc.icon}</div>
                  <CardTitle className="text-lg text-gray-900">{calc.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm text-center mb-3">{calc.description}</p>
                  <Badge className="mx-auto block w-fit">
                    {calc.category}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 无结果提示 */}
        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('calculators.noResults.title')}</h3>
            <p className="text-gray-600">{t('calculators.noResults.description')}</p>
          </div>
        )}

        {/* 健康提示 */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('calculators.healthTips.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">{t('calculators.healthTips.tip1.title')}</h3>
              <p className="text-sm text-gray-600">{t('calculators.healthTips.tip1.description')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">{t('calculators.healthTips.tip2.title')}</h3>
              <p className="text-sm text-gray-600">{t('calculators.healthTips.tip2.description')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold mb-2">{t('calculators.healthTips.tip3.title')}</h3>
              <p className="text-sm text-gray-600">{t('calculators.healthTips.tip3.description')}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👨‍⚕️</div>
              <h3 className="font-semibold mb-2">{t('calculators.healthTips.tip4.title')}</h3>
              <p className="text-sm text-gray-600">{t('calculators.healthTips.tip4.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}