"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟提交过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // 重置表单
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "邮箱地址",
      content: "support@healthcalculator.com",
      description: "我们会在24小时内回复您的邮件"
    },
    {
      icon: Phone,
      title: "客服热线",
      content: "400-123-4567",
      description: "工作日 9:00-18:00"
    },
    {
      icon: MapPin,
      title: "公司地址",
      content: "北京市朝阳区健康科技园区",
      description: "欢迎预约参观我们的办公室"
    },
    {
      icon: Clock,
      title: "工作时间",
      content: "周一至周五 9:00-18:00",
      description: "节假日我们也会及时回复邮件"
    }
  ];

  const faqItems = [
    {
      question: "如何重置我的密码？",
      answer: "您可以在登录页面点击'忘记密码'，然后按照邮件提示重置密码。"
    },
    {
      question: "计算结果的准确性如何？",
      answer: "我们的所有计算器都基于国际权威医学标准，并经过专业医生验证。"
    },
    {
      question: "如何升级到专业版？",
      answer: "您可以在个人中心的套餐管理页面选择升级到专业版或企业版。"
    },
    {
      question: "数据安全如何保障？",
      answer: "我们采用银行级别的数据加密技术，严格保护您的个人健康信息。"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            联系我们
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            有任何问题或建议？我们很乐意为您提供帮助。
            请选择最适合的联系方式与我们沟通。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* 联系表单 */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Send className="h-8 w-8 text-green-600" />
                  发送消息
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      感谢您的消息！我们已收到您的反馈，会在24小时内回复您。
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">姓名 *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="请输入您的姓名"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">邮箱 *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="请输入您的邮箱"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">问题类型</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择问题类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">技术支持</SelectItem>
                            <SelectItem value="billing">账单问题</SelectItem>
                            <SelectItem value="feature">功能建议</SelectItem>
                            <SelectItem value="partnership">商务合作</SelectItem>
                            <SelectItem value="other">其他问题</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject">主题</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="请简要描述问题"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">详细描述 *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="请详细描述您的问题或建议..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "发送中..." : "发送消息"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 联系信息 */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-gray-900 font-medium mb-1">{info.content}</p>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 常见问题 */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            常见问题
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 其他联系方式 */}
        <div className="mt-16 text-center">
          <Card className="border-0 shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">其他联系方式</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                您也可以通过以下方式关注我们，获取最新的健康资讯和产品更新。
              </p>
              <div className="flex justify-center space-x-6">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  微信公众号
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  微博
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  小红书
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}