"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Heart, Shield, Award, Lightbulb } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "张医生",
      role: "首席医疗顾问",
      description: "拥有15年临床经验的内科专家，专注于预防医学和健康管理。",
      avatar: "👨‍⚕️"
    },
    {
      name: "李营养师",
      role: "营养学专家",
      description: "注册营养师，专业从事营养咨询和健康饮食指导10年。",
      avatar: "👩‍⚕️"
    },
    {
      name: "王工程师",
      role: "技术总监",
      description: "资深全栈开发工程师，专注于健康科技产品开发。",
      avatar: "👨‍💻"
    },
    {
      name: "陈数据师",
      role: "数据科学家",
      description: "AI和机器学习专家，致力于健康数据分析和预测模型开发。",
      avatar: "👩‍🔬"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "以人为本",
      description: "我们始终将用户的健康需求放在首位，提供个性化的健康解决方案。"
    },
    {
      icon: Shield,
      title: "数据安全",
      description: "严格保护用户隐私，采用最高级别的数据加密和安全措施。"
    },
    {
      icon: Lightbulb,
      title: "持续创新",
      description: "不断研发新的健康计算工具，融入最新的医学研究成果。"
    },
    {
      icon: Award,
      title: "专业品质",
      description: "所有计算器都经过医学专家验证，确保结果的准确性和可靠性。"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "项目启动",
      description: "健康计算器平台正式立项，开始产品设计和开发。"
    },
    {
      year: "2024",
      title: "平台上线",
      description: "发布首批20个健康计算器，获得用户积极反馈。"
    },
    {
      year: "2024",
      title: "功能扩展",
      description: "新增AI健康咨询、个性化建议等智能功能。"
    },
    {
      year: "2024",
      title: "用户突破",
      description: "注册用户突破10万，月活跃用户超过5万。"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            关于我们
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我们致力于通过科技的力量，让每个人都能轻松管理自己的健康，
            享受更美好的生活。
          </p>
        </div>

        {/* 使命愿景 */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl">我们的使命</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed">
                通过提供准确、易用的健康计算工具和个性化健康建议，
                帮助用户更好地了解和管理自己的健康状况，预防疾病，
                提升生活质量。
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl">我们的愿景</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed">
                成为全球领先的智能健康管理平台，让健康管理变得简单、
                科学、有趣，让每个人都能享受到个性化的健康服务。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 核心价值观 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            核心价值观
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 团队介绍 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            专业团队
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 发展历程 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            发展历程
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-400 to-blue-400 rounded-full"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {milestone.year}
                          </Badge>
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-white border-4 border-green-400 rounded-full"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 联系我们 */}
        <div className="text-center">
          <Card className="border-0 shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                加入我们的健康之旅
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                如果您对我们的产品有任何建议，或者希望加入我们的团队，
                欢迎随时与我们联系。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  联系我们
                </a>
                <a
                  href="mailto:careers@healthcalculator.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  加入团队
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}