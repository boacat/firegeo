"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Code, 
  Copy, 
  ExternalLink, 
  Key, 
  Shield, 
  Zap, 
  Database, 
  Globe, 
  CheckCircle,
  AlertTriangle,
  Book,
  Terminal,
  Settings,
  Users,
  BarChart3
} from "lucide-react";

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  requiresAuth: boolean;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  example: {
    request?: string;
    response: string;
  };
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface RequestBody {
  type: string;
  properties: Record<string, {
    type: string;
    required: boolean;
    description: string;
    example?: any;
  }>;
}

interface Response {
  status: number;
  description: string;
  example: string;
}

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [apiKey, setApiKey] = useState("your-api-key-here");

  const categories = ["全部", "认证", "用户管理", "健康计算", "数据分析", "支付"];

  const apiEndpoints: ApiEndpoint[] = [
    {
      id: "auth-login",
      method: "POST",
      path: "/api/auth/sign-in",
      title: "用户登录",
      description: "使用邮箱和密码进行用户登录",
      category: "认证",
      requiresAuth: false,
      requestBody: {
        type: "application/json",
        properties: {
          email: {
            type: "string",
            required: true,
            description: "用户邮箱地址",
            example: "user@example.com"
          },
          password: {
            type: "string",
            required: true,
            description: "用户密码",
            example: "password123"
          }
        }
      },
      responses: [
        {
          status: 200,
          description: "登录成功",
          example: `{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "张三"
  },
  "session": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-12-16T10:00:00Z"
  }
}`
        },
        {
          status: 401,
          description: "认证失败",
          example: `{
  "error": {
    "message": "Invalid credentials",
    "code": "UNAUTHORIZED"
  }
}`
        }
      ],
      example: {
        request: `curl -X POST "https://api.firegeo.com/api/auth/sign-in" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'`,
        response: `{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "张三"
  },
  "session": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-12-16T10:00:00Z"
  }
}`
      }
    },
    {
      id: "user-profile",
      method: "GET",
      path: "/api/user/profile",
      title: "获取用户资料",
      description: "获取当前登录用户的详细资料信息",
      category: "用户管理",
      requiresAuth: true,
      responses: [
        {
          status: 200,
          description: "成功获取用户资料",
          example: `{
  "profile": {
    "userId": "user_123",
    "displayName": "张三",
    "bio": "健康生活爱好者",
    "phone": "+86 138****8888",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-12-15T10:00:00Z"
  },
  "settings": {
    "theme": "light",
    "emailNotifications": true,
    "marketingEmails": false
  }
}`
        }
      ],
      example: {
        request: `curl -X GET "https://api.firegeo.com/api/user/profile" \\
  -H "Authorization: Bearer ${apiKey}"`,
        response: `{
  "profile": {
    "userId": "user_123",
    "displayName": "张三",
    "bio": "健康生活爱好者",
    "phone": "+86 138****8888"
  }
}`
      }
    },
    {
      id: "health-calculate-bmi",
      method: "POST",
      path: "/api/health/calculate/bmi",
      title: "BMI计算",
      description: "根据身高体重计算BMI指数和健康评估",
      category: "健康计算",
      requiresAuth: true,
      requestBody: {
        type: "application/json",
        properties: {
          height: {
            type: "number",
            required: true,
            description: "身高（厘米）",
            example: 170
          },
          weight: {
            type: "number",
            required: true,
            description: "体重（公斤）",
            example: 65
          },
          age: {
            type: "number",
            required: false,
            description: "年龄",
            example: 25
          },
          gender: {
            type: "string",
            required: false,
            description: "性别（male/female）",
            example: "male"
          }
        }
      },
      responses: [
        {
          status: 200,
          description: "计算成功",
          example: `{
  "bmi": 22.49,
  "category": "正常体重",
  "healthStatus": "健康",
  "recommendations": [
    "保持当前体重",
    "继续均衡饮食",
    "保持规律运动"
  ],
  "idealWeightRange": {
    "min": 53.5,
    "max": 72.3
  }
}`
        }
      ],
      example: {
        request: `curl -X POST "https://api.firegeo.com/api/health/calculate/bmi" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "height": 170,
    "weight": 65,
    "age": 25,
    "gender": "male"
  }'`,
        response: `{
  "bmi": 22.49,
  "category": "正常体重",
  "healthStatus": "健康",
  "recommendations": [
    "保持当前体重",
    "继续均衡饮食"
  ]
}`
      }
    },
    {
      id: "health-reports",
      method: "GET",
      path: "/api/health/reports",
      title: "获取健康报告",
      description: "获取用户的健康分析报告列表",
      category: "数据分析",
      requiresAuth: true,
      parameters: [
        {
          name: "page",
          type: "number",
          required: false,
          description: "页码（默认为1）",
          example: "1"
        },
        {
          name: "limit",
          type: "number",
          required: false,
          description: "每页数量（默认为10）",
          example: "10"
        },
        {
          name: "type",
          type: "string",
          required: false,
          description: "报告类型（comprehensive/bmi/cardiovascular等）",
          example: "comprehensive"
        }
      ],
      responses: [
        {
          status: 200,
          description: "成功获取报告列表",
          example: `{
  "reports": [
    {
      "id": "report_123",
      "title": "综合健康评估报告",
      "type": "comprehensive",
      "date": "2024-12-15",
      "overallScore": 78,
      "status": "completed"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}`
        }
      ],
      example: {
        request: `curl -X GET "https://api.firegeo.com/api/health/reports?page=1&limit=10" \\
  -H "Authorization: Bearer ${apiKey}"`,
        response: `{
  "reports": [
    {
      "id": "report_123",
      "title": "综合健康评估报告",
      "overallScore": 78
    }
  ]
}`
      }
    },
    {
      id: "credits-balance",
      method: "GET",
      path: "/api/credits/balance",
      title: "查询积分余额",
      description: "获取用户当前的积分余额和使用情况",
      category: "支付",
      requiresAuth: true,
      responses: [
        {
          status: 200,
          description: "成功获取积分信息",
          example: `{
  "balance": 150,
  "used": 50,
  "total": 200,
  "plan": "professional",
  "resetDate": "2025-01-01T00:00:00Z",
  "usage": {
    "calculations": 45,
    "reports": 5
  }
}`
        }
      ],
      example: {
        request: `curl -X GET "https://api.firegeo.com/api/credits/balance" \\
  -H "Authorization: Bearer ${apiKey}"`,
        response: `{
  "balance": 150,
  "used": 50,
  "plan": "professional"
}`
      }
    }
  ];

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesSearch = endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "全部" || endpoint.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentEndpoint = selectedEndpoint ? apiEndpoints.find(e => e.id === selectedEndpoint) : null;

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            API 开发文档
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            FireGEO 健康平台提供完整的 RESTful API，支持健康计算、用户管理、数据分析等功能。
          </p>
        </div>

        {/* 快速开始 */}
        <div className="mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-6 w-6 text-blue-600" />
                快速开始
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Key className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">1. 获取 API 密钥</h3>
                  <p className="text-sm text-gray-600">在用户仪表板中生成您的 API 密钥</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">2. 发起请求</h3>
                  <p className="text-sm text-gray-600">使用 HTTP 客户端调用我们的 API</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">3. 处理响应</h3>
                  <p className="text-sm text-gray-600">解析 JSON 响应并集成到您的应用</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">基础 URL</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard('https://api.firegeo.com')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">https://api.firegeo.com</code>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* API 端点列表 */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-green-600" />
                  API 端点
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 搜索和筛选 */}
                <div className="space-y-4 mb-6">
                  <Input
                    placeholder="搜索 API..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={`text-xs ${
                          selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 端点列表 */}
                <div className="space-y-2">
                  {filteredEndpoints.map((endpoint) => (
                    <div
                      key={endpoint.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedEndpoint === endpoint.id
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        {endpoint.requiresAuth && (
                          <Shield className="h-3 w-3 text-orange-500" title="需要认证" />
                        )}
                      </div>
                      <div className="text-sm font-medium mb-1">{endpoint.title}</div>
                      <div className="text-xs text-gray-500 font-mono">{endpoint.path}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API 详情 */}
          <div className="lg:col-span-3">
            {currentEndpoint ? (
              <div className="space-y-6">
                {/* 端点头部 */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getMethodColor(currentEndpoint.method)}>
                            {currentEndpoint.method}
                          </Badge>
                          <code className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                            {currentEndpoint.path}
                          </code>
                          {currentEndpoint.requiresAuth && (
                            <Badge variant="outline" className="text-orange-600">
                              <Shield className="h-3 w-3 mr-1" />
                              需要认证
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl">{currentEndpoint.title}</CardTitle>
                        <p className="text-gray-600 mt-2">{currentEndpoint.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* 详细信息 */}
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="parameters">参数</TabsTrigger>
                    <TabsTrigger value="examples">示例</TabsTrigger>
                    <TabsTrigger value="responses">响应</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* 请求参数 */}
                    {currentEndpoint.parameters && (
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle>查询参数</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {currentEndpoint.parameters.map((param) => (
                              <div key={param.name} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <code className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                                    {param.name}
                                  </code>
                                  <Badge variant={param.required ? "default" : "outline"}>
                                    {param.required ? "必需" : "可选"}
                                  </Badge>
                                  <Badge variant="outline">{param.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{param.description}</p>
                                {param.example && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    示例: <code>{param.example}</code>
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 请求体 */}
                    {currentEndpoint.requestBody && (
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle>请求体</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(currentEndpoint.requestBody.properties).map(([key, prop]) => (
                              <div key={key} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <code className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                                    {key}
                                  </code>
                                  <Badge variant={prop.required ? "default" : "outline"}>
                                    {prop.required ? "必需" : "可选"}
                                  </Badge>
                                  <Badge variant="outline">{prop.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{prop.description}</p>
                                {prop.example && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    示例: <code>{JSON.stringify(prop.example)}</code>
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="parameters">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>参数详情</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {currentEndpoint.parameters || currentEndpoint.requestBody ? (
                          <div className="space-y-6">
                            {currentEndpoint.parameters && (
                              <div>
                                <h3 className="font-semibold mb-4">URL 参数</h3>
                                <div className="space-y-3">
                                  {currentEndpoint.parameters.map((param) => (
                                    <div key={param.name} className="p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                        <code className="font-mono text-sm">{param.name}</code>
                                        <Badge variant={param.required ? "default" : "outline"}>
                                          {param.required ? "必需" : "可选"}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">{param.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {currentEndpoint.requestBody && (
                              <div>
                                <h3 className="font-semibold mb-4">请求体参数</h3>
                                <div className="space-y-3">
                                  {Object.entries(currentEndpoint.requestBody.properties).map(([key, prop]) => (
                                    <div key={key} className="p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                        <code className="font-mono text-sm">{key}</code>
                                        <Badge variant={prop.required ? "default" : "outline"}>
                                          {prop.required ? "必需" : "可选"}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">{prop.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-600">此端点不需要参数</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="examples">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>代码示例</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* cURL 示例 */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">cURL</h3>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => copyToClipboard(currentEndpoint.example.request || '')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{currentEndpoint.example.request}</code>
                            </pre>
                          </div>

                          {/* 响应示例 */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">响应示例</h3>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => copyToClipboard(currentEndpoint.example.response)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{currentEndpoint.example.response}</code>
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="responses">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>响应格式</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentEndpoint.responses.map((response) => (
                            <div key={response.status} className="border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge 
                                  className={response.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                >
                                  {response.status}
                                </Badge>
                                <span className="font-medium">{response.description}</span>
                              </div>
                              <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                                <code>{response.example}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* 默认内容 */
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Terminal className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">选择一个 API 端点</h3>
                  <p className="text-gray-500">从左侧列表中选择一个 API 端点查看详细信息</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 认证说明 */}
        <div className="mt-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                认证说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">API 密钥认证</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    大部分 API 端点需要在请求头中包含有效的 API 密钥。
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm">
                      Authorization: Bearer your-api-key-here
                    </code>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">错误处理</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    API 使用标准 HTTP 状态码，错误响应包含详细的错误信息。
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">200</Badge>
                      <span>请求成功</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">401</Badge>
                      <span>认证失败</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">429</Badge>
                      <span>请求频率限制</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 联系支持 */}
        <div className="mt-12 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-4">需要帮助？</h3>
              <p className="text-gray-600 mb-6">
                如果您在使用 API 过程中遇到问题，请随时联系我们的技术支持团队。
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  联系支持
                </Button>
                <Button variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  查看更多文档
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}