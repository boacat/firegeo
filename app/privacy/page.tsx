"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      id: "information-collection",
      title: "信息收集",
      icon: Database,
      content: [
        {
          subtitle: "个人信息",
          text: "我们收集您主动提供的信息，包括但不限于：姓名、邮箱地址、电话号码、出生日期等基本信息。"
        },
        {
          subtitle: "健康数据",
          text: "为了提供准确的健康计算服务，我们会收集您输入的健康相关数据，如身高、体重、血压、心率等指标。"
        },
        {
          subtitle: "使用数据",
          text: "我们会自动收集您使用我们服务时的技术信息，包括IP地址、浏览器类型、设备信息、访问时间等。"
        }
      ]
    },
    {
      id: "information-use",
      title: "信息使用",
      icon: UserCheck,
      content: [
        {
          subtitle: "服务提供",
          text: "使用您的信息来提供、维护和改进我们的健康计算服务，包括个性化健康建议和报告生成。"
        },
        {
          subtitle: "沟通交流",
          text: "向您发送服务相关通知、健康提醒、产品更新和营销信息（您可以随时取消订阅）。"
        },
        {
          subtitle: "安全保障",
          text: "监测和防止欺诈行为，保护我们的服务安全，确保用户账户和数据的安全性。"
        }
      ]
    },
    {
      id: "information-sharing",
      title: "信息共享",
      icon: Globe,
      content: [
        {
          subtitle: "第三方服务",
          text: "我们可能与可信的第三方服务提供商共享必要信息，以支持我们的服务运营，如云存储、数据分析等。"
        },
        {
          subtitle: "法律要求",
          text: "在法律要求或政府机关要求的情况下，我们可能会披露您的信息以配合调查或法律程序。"
        },
        {
          subtitle: "业务转让",
          text: "在公司合并、收购或资产转让的情况下，您的信息可能会作为业务资产的一部分被转让。"
        }
      ]
    },
    {
      id: "data-security",
      title: "数据安全",
      icon: Shield,
      content: [
        {
          subtitle: "加密保护",
          text: "我们使用行业标准的SSL/TLS加密技术保护数据传输，采用AES-256加密算法保护存储数据。"
        },
        {
          subtitle: "访问控制",
          text: "实施严格的访问控制措施，只有经过授权的员工才能访问用户数据，且仅限于工作需要。"
        },
        {
          subtitle: "安全监控",
          text: "24/7安全监控系统，实时检测和防范潜在的安全威胁，定期进行安全审计和漏洞扫描。"
        }
      ]
    },
    {
      id: "user-rights",
      title: "用户权利",
      icon: Eye,
      content: [
        {
          subtitle: "访问权",
          text: "您有权随时访问、查看和下载我们持有的关于您的个人信息。"
        },
        {
          subtitle: "更正权",
          text: "如果您发现我们持有的信息不准确或不完整，您有权要求我们更正或补充。"
        },
        {
          subtitle: "删除权",
          text: "在特定情况下，您有权要求我们删除您的个人信息，我们会在法律允许的范围内满足您的要求。"
        },
        {
          subtitle: "数据可携权",
          text: "您有权以结构化、常用和机器可读的格式获取您的个人数据，并有权将这些数据传输给其他服务提供商。"
        }
      ]
    },
    {
      id: "cookies",
      title: "Cookie政策",
      icon: Lock,
      content: [
        {
          subtitle: "必要Cookie",
          text: "这些Cookie对于网站的基本功能是必需的，包括用户认证、安全保护和基本的网站操作。"
        },
        {
          subtitle: "功能Cookie",
          text: "用于记住您的偏好设置，如语言选择、主题设置等，以提供更个性化的用户体验。"
        },
        {
          subtitle: "分析Cookie",
          text: "帮助我们了解用户如何使用我们的网站，以便我们改进网站性能和用户体验。"
        },
        {
          subtitle: "Cookie管理",
          text: "您可以通过浏览器设置管理Cookie偏好，但请注意，禁用某些Cookie可能会影响网站功能。"
        }
      ]
    }
  ];

  const principles = [
    {
      icon: Shield,
      title: "透明度",
      description: "我们承诺以清晰、易懂的方式告知您我们如何收集、使用和保护您的信息。"
    },
    {
      icon: Lock,
      title: "最小化",
      description: "我们只收集为提供服务所必需的最少信息，不会过度收集或使用您的数据。"
    },
    {
      icon: UserCheck,
      title: "控制权",
      description: "您对自己的数据拥有完全的控制权，可以随时查看、修改或删除您的信息。"
    },
    {
      icon: Eye,
      title: "安全性",
      description: "我们采用最高级别的安全措施保护您的数据，防止未经授权的访问或泄露。"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            隐私政策
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="text-sm">
              最后更新：2024年12月
            </Badge>
            <Badge variant="outline" className="text-sm">
              版本：2.0
            </Badge>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我们深知您对隐私的关注，本政策详细说明了我们如何收集、使用、
            存储和保护您的个人信息。
          </p>
        </div>

        {/* 核心原则 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            隐私保护原则
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{principle.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 详细条款 */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-green-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.subtitle}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 联系信息 */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">隐私问题咨询</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                如果您对本隐私政策有任何疑问或需要行使您的权利，
                请通过以下方式联系我们：
              </p>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>隐私保护专员：</strong> privacy@healthcalculator.com
                </p>
                <p className="text-gray-900">
                  <strong>客服热线：</strong> 400-123-4567
                </p>
                <p className="text-gray-900">
                  <strong>邮寄地址：</strong> 北京市朝阳区健康科技园区
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  联系我们
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 政策更新 */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">政策更新通知</h3>
              <p className="text-gray-600 text-sm">
                我们可能会不时更新本隐私政策。重大变更时，我们会通过邮件、
                网站通知或其他适当方式提前通知您。继续使用我们的服务即表示
                您同意更新后的隐私政策。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}