"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Search, TrendingUp, Heart, Brain, Dumbbell, Apple } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  featured: boolean;
  tags: string[];
  image: string;
}

export default function HealthNewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = ["全部", "营养饮食", "运动健身", "心理健康", "疾病预防", "健康生活", "医学前沿"];

  const articles: Article[] = [
    {
      id: "1",
      title: "科学饮水：每天需要喝多少水才健康？",
      excerpt: "水是生命之源，但你知道每天应该喝多少水吗？本文将为您详细解析科学的饮水标准和方法。",
      content: "详细内容...",
      category: "营养饮食",
      author: "李营养师",
      publishDate: "2024-12-15",
      readTime: 5,
      featured: true,
      tags: ["饮水", "健康", "营养"],
      image: "💧"
    },
    {
      id: "2",
      title: "高强度间歇训练(HIIT)：最高效的燃脂运动",
      excerpt: "HIIT训练能在短时间内达到最佳燃脂效果。了解如何正确进行HIIT训练，让您的健身更高效。",
      content: "详细内容...",
      category: "运动健身",
      author: "王教练",
      publishDate: "2024-12-14",
      readTime: 8,
      featured: true,
      tags: ["HIIT", "燃脂", "运动"],
      image: "🏃‍♂️"
    },
    {
      id: "3",
      title: "睡眠质量与心理健康的密切关系",
      excerpt: "良好的睡眠是心理健康的基础。本文探讨睡眠如何影响我们的情绪和认知功能。",
      content: "详细内容...",
      category: "心理健康",
      author: "张心理师",
      publishDate: "2024-12-13",
      readTime: 6,
      featured: false,
      tags: ["睡眠", "心理健康", "情绪"],
      image: "😴"
    },
    {
      id: "4",
      title: "地中海饮食：长寿的秘密武器",
      excerpt: "地中海饮食被誉为世界上最健康的饮食模式之一。了解这种饮食方式如何促进长寿和健康。",
      content: "详细内容...",
      category: "营养饮食",
      author: "陈营养师",
      publishDate: "2024-12-12",
      readTime: 7,
      featured: false,
      tags: ["地中海饮食", "长寿", "营养"],
      image: "🥗"
    },
    {
      id: "5",
      title: "冬季如何预防感冒和流感",
      excerpt: "冬季是感冒和流感的高发季节。掌握正确的预防方法，让您健康度过寒冬。",
      content: "详细内容...",
      category: "疾病预防",
      author: "刘医生",
      publishDate: "2024-12-11",
      readTime: 4,
      featured: false,
      tags: ["感冒", "流感", "预防"],
      image: "🤧"
    },
    {
      id: "6",
      title: "办公室久坐族的健康指南",
      excerpt: "长时间久坐对健康有害。本文提供实用的建议，帮助办公室工作者保持健康。",
      content: "详细内容...",
      category: "健康生活",
      author: "赵医生",
      publishDate: "2024-12-10",
      readTime: 6,
      featured: false,
      tags: ["久坐", "办公室", "健康"],
      image: "💺"
    },
    {
      id: "7",
      title: "AI在医疗诊断中的最新突破",
      excerpt: "人工智能正在革命性地改变医疗诊断。了解AI技术如何提高诊断准确性和效率。",
      content: "详细内容...",
      category: "医学前沿",
      author: "周博士",
      publishDate: "2024-12-09",
      readTime: 10,
      featured: false,
      tags: ["AI", "医疗", "诊断"],
      image: "🤖"
    },
    {
      id: "8",
      title: "压力管理：现代人的必修课",
      excerpt: "现代生活节奏快，压力大。学会有效的压力管理技巧，让生活更轻松愉快。",
      content: "详细内容...",
      category: "心理健康",
      author: "吴心理师",
      publishDate: "2024-12-08",
      readTime: 5,
      featured: false,
      tags: ["压力", "管理", "心理"],
      image: "😌"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "全部" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  const categoryIcons = {
    "营养饮食": Apple,
    "运动健身": Dumbbell,
    "心理健康": Brain,
    "疾病预防": Heart,
    "健康生活": TrendingUp,
    "医学前沿": Search
  };

  const healthTips = [
    {
      title: "每日健康小贴士",
      tips: [
        "每天至少喝8杯水，保持身体水分充足",
        "每小时起身活动5分钟，预防久坐危害",
        "保证7-9小时优质睡眠，提升免疫力",
        "多吃蔬菜水果，补充维生素和纤维"
      ]
    },
    {
      title: "本周健康焦点",
      tips: [
        "冬季养生：注意保暖，预防感冒",
        "年末体检：关注血压、血糖指标",
        "节日饮食：适量进食，避免暴饮暴食",
        "运动计划：制定新年健身目标"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            健康资讯
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            获取最新的健康知识和医学资讯，让科学指导您的健康生活。
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="搜索健康资讯..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 精选文章 */}
            {selectedCategory === "全部" && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">精选文章</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">{article.image}</span>
                          <Badge variant="secondary">{article.category}</Badge>
                          <Badge variant="outline">精选</Badge>
                        </div>
                        <CardTitle className="text-xl hover:text-green-600 transition-colors">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{article.readTime}分钟阅读</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{article.publishDate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 所有文章 */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {selectedCategory === "全部" ? "最新资讯" : selectedCategory}
                <span className="text-lg font-normal text-gray-500 ml-2">
                  ({filteredArticles.length}篇文章)
                </span>
              </h2>
              <div className="space-y-6">
                {filteredArticles.map((article) => {
                  const CategoryIcon = categoryIcons[article.category as keyof typeof categoryIcons] || TrendingUp;
                  return (
                    <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-2xl">
                              {article.image}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <CategoryIcon className="h-4 w-4 text-green-600" />
                              <Badge variant="secondary">{article.category}</Badge>
                              {article.featured && <Badge variant="outline">精选</Badge>}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{article.readTime}分钟阅读</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{article.publishDate}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {article.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 健康小贴士 */}
            {healthTips.map((tipSection, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    {tipSection.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tipSection.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* 热门标签 */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-green-600" />
                  热门标签
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["营养", "运动", "睡眠", "心理健康", "预防", "饮食", "健身", "减肥", "养生", "体检"].map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-green-50 hover:border-green-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 订阅通知 */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">订阅健康资讯</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  订阅我们的健康资讯，第一时间获取最新的健康知识和医学资讯。
                </p>
                <div className="space-y-3">
                  <Input placeholder="请输入您的邮箱" type="email" />
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    立即订阅
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}