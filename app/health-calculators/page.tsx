"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  popular?: boolean;
}

const calculators: Calculator[] = [
  // 基础健康指标
  { id: "bmi", name: "BMI计算器", description: "计算身体质量指数，评估体重状况", category: "基础指标", icon: "⚖️", path: "/bmi-calculator", popular: true },
  { id: "calorie", name: "卡路里计算器", description: "计算每日所需卡路里和基础代谢率", category: "基础指标", icon: "🔥", path: "/calorie-calculator", popular: true },
  { id: "body-fat", name: "体脂率计算器", description: "估算身体脂肪百分比", category: "基础指标", icon: "📊", path: "/body-fat-calculator" },
  { id: "ideal-weight", name: "理想体重计算器", description: "根据身高计算理想体重范围", category: "基础指标", icon: "🎯", path: "/ideal-weight-calculator" },
  { id: "waist-hip", name: "腰臀比计算器", description: "评估腹部肥胖风险", category: "基础指标", icon: "📏", path: "/waist-hip-calculator" },
  
  // 心血管健康
  { id: "heart-rate", name: "心率区间计算器", description: "计算运动时的目标心率区间", category: "心血管", icon: "❤️", path: "/heart-rate-calculator", popular: true },
  { id: "blood-pressure", name: "血压评估器", description: "评估血压水平和健康风险", category: "心血管", icon: "🩺", path: "/blood-pressure-calculator" },
  { id: "cholesterol", name: "胆固醇风险评估", description: "评估心血管疾病风险", category: "心血管", icon: "🫀", path: "/cholesterol-calculator" },
  
  // 营养与饮食
  { id: "water", name: "每日饮水量计算器", description: "计算每日推荐饮水量", category: "营养饮食", icon: "💧", path: "/water-calculator" },
  { id: "protein", name: "蛋白质需求计算器", description: "计算每日蛋白质需求量", category: "营养饮食", icon: "🥩", path: "/protein-calculator" },
  { id: "macro", name: "宏量营养素计算器", description: "计算碳水、蛋白质、脂肪比例", category: "营养饮食", icon: "🍽️", path: "/macro-calculator" },
  { id: "vitamin-d", name: "维生素D需求计算器", description: "评估维生素D需求量", category: "营养饮食", icon: "☀️", path: "/vitamin-d-calculator" },
  
  // 运动健身
  { id: "exercise-calorie", name: "运动消耗计算器", description: "计算各种运动的卡路里消耗", category: "运动健身", icon: "🏃", path: "/exercise-calorie-calculator" },
  { id: "one-rep-max", name: "最大重量计算器", description: "计算单次最大举重重量", category: "运动健身", icon: "🏋️", path: "/one-rep-max-calculator" },
  { id: "pace", name: "跑步配速计算器", description: "计算跑步配速和完赛时间", category: "运动健身", icon: "🏃‍♂️", path: "/pace-calculator" },
  { id: "vo2-max", name: "最大摄氧量计算器", description: "评估心肺功能水平", category: "运动健身", icon: "🫁", path: "/vo2-max-calculator" },
  
  // 女性健康
  { id: "pregnancy-weight", name: "孕期体重计算器", description: "计算孕期合理体重增长", category: "女性健康", icon: "🤱", path: "/pregnancy-weight-calculator" },
  { id: "ovulation", name: "排卵期计算器", description: "预测排卵期和受孕窗口", category: "女性健康", icon: "🌸", path: "/ovulation-calculator" },
  { id: "menstrual", name: "月经周期计算器", description: "追踪和预测月经周期", category: "女性健康", icon: "📅", path: "/menstrual-calculator" },
  
  // 儿童健康
  { id: "child-growth", name: "儿童生长曲线", description: "评估儿童身高体重发育情况", category: "儿童健康", icon: "👶", path: "/child-growth-calculator" },
  { id: "child-bmi", name: "儿童BMI计算器", description: "计算儿童和青少年BMI百分位", category: "儿童健康", icon: "🧒", path: "/child-bmi-calculator" },
  
  // 老年健康
  { id: "bone-density", name: "骨密度风险评估", description: "评估骨质疏松风险", category: "老年健康", icon: "🦴", path: "/bone-density-calculator" },
  { id: "fall-risk", name: "跌倒风险评估", description: "评估老年人跌倒风险", category: "老年健康", icon: "🚶‍♂️", path: "/fall-risk-calculator" },
  
  // 睡眠与压力
  { id: "sleep", name: "睡眠需求计算器", description: "计算最佳睡眠时间和周期", category: "睡眠压力", icon: "😴", path: "/sleep-calculator" },
  { id: "stress", name: "压力水平评估", description: "评估心理压力和健康影响", category: "睡眠压力", icon: "🧠", path: "/stress-calculator" },
  
  // 特殊计算
  { id: "diabetes-risk", name: "糖尿病风险评估", description: "评估2型糖尿病患病风险", category: "疾病风险", icon: "🩸", path: "/diabetes-risk-calculator" },
  { id: "kidney", name: "肾功能计算器", description: "计算肾小球滤过率", category: "疾病风险", icon: "🫘", path: "/kidney-calculator" },
  { id: "body-age", name: "身体年龄计算器", description: "评估身体的生理年龄", category: "综合评估", icon: "🎂", path: "/body-age-calculator" },
  { id: "health-score", name: "健康评分计算器", description: "综合评估整体健康状况", category: "综合评估", icon: "🏆", path: "/health-score-calculator" },
  { id: "life-expectancy", name: "预期寿命计算器", description: "基于生活方式预测预期寿命", category: "综合评估", icon: "⏳", path: "/life-expectancy-calculator" }
];

const categories = Array.from(new Set(calculators.map(calc => calc.category)));

export default function HealthCalculatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredCalculators = calculators.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "全部" || calc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularCalculators = calculators.filter(calc => calc.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            健康计算器大全
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            30种专业健康计算器，全方位守护您的健康。从基础指标到专业评估，科学管理您的健康数据。
          </p>
        </div>

        {/* 热门计算器 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            🔥 热门计算器
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
                placeholder="搜索计算器..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-lg p-3"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("全部")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === "全部"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                全部
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到相关计算器</h3>
            <p className="text-gray-600">请尝试其他搜索词或选择不同的分类</p>
          </div>
        )}

        {/* 健康提示 */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 健康管理小贴士
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-2">定期监测</h3>
              <p className="text-sm text-gray-600">定期使用健康计算器监测身体指标变化</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">设定目标</h3>
              <p className="text-sm text-gray-600">根据计算结果设定合理的健康目标</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold mb-2">记录进展</h3>
              <p className="text-sm text-gray-600">记录健康数据变化，追踪改善进展</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👨‍⚕️</div>
              <h3 className="font-semibold mb-2">专业咨询</h3>
              <p className="text-sm text-gray-600">如有异常请及时咨询专业医生</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}