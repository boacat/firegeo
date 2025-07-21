"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Brain, 
  Apple, 
  Calendar, 
  Download, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Clock,
  User
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  target?: number;
  description: string;
}

interface HealthReport {
  id: string;
  title: string;
  type: 'comprehensive' | 'bmi' | 'cardiovascular' | 'mental' | 'nutrition';
  date: string;
  overallScore: number;
  metrics: HealthMetric[];
  recommendations: string[];
  riskFactors: string[];
  achievements: string[];
}

export default function HealthReportsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 模拟健康报告数据
  const healthReports: HealthReport[] = [
    {
      id: "1",
      title: "综合健康评估报告",
      type: "comprehensive",
      date: "2024-12-15",
      overallScore: 78,
      metrics: [
        {
          id: "bmi",
          name: "BMI指数",
          value: 23.5,
          unit: "kg/m²",
          status: "good",
          trend: "stable",
          lastUpdated: "2024-12-15",
          target: 22,
          description: "体重指数正常，建议保持当前体重"
        },
        {
          id: "blood_pressure",
          name: "血压",
          value: 125,
          unit: "mmHg",
          status: "fair",
          trend: "up",
          lastUpdated: "2024-12-14",
          target: 120,
          description: "血压略高，建议减少盐分摄入"
        },
        {
          id: "heart_rate",
          name: "静息心率",
          value: 68,
          unit: "bpm",
          status: "excellent",
          trend: "down",
          lastUpdated: "2024-12-15",
          target: 70,
          description: "心率优秀，心血管健康状况良好"
        },
        {
          id: "sleep_quality",
          name: "睡眠质量",
          value: 7.5,
          unit: "分",
          status: "good",
          trend: "up",
          lastUpdated: "2024-12-15",
          target: 8,
          description: "睡眠质量良好，建议保持规律作息"
        }
      ],
      recommendations: [
        "每天进行30分钟中等强度运动",
        "减少钠盐摄入，每日不超过6克",
        "保持规律作息，每晚7-9小时睡眠",
        "增加蔬菜水果摄入量",
        "定期监测血压变化"
      ],
      riskFactors: [
        "血压偏高",
        "久坐时间过长",
        "压力水平较高"
      ],
      achievements: [
        "BMI指数保持在健康范围",
        "心率指标优秀",
        "睡眠质量持续改善"
      ]
    },
    {
      id: "2",
      title: "心血管健康报告",
      type: "cardiovascular",
      date: "2024-12-10",
      overallScore: 82,
      metrics: [
        {
          id: "cholesterol",
          name: "总胆固醇",
          value: 180,
          unit: "mg/dL",
          status: "good",
          trend: "down",
          lastUpdated: "2024-12-10",
          target: 200,
          description: "胆固醇水平良好"
        },
        {
          id: "hdl",
          name: "高密度脂蛋白",
          value: 55,
          unit: "mg/dL",
          status: "excellent",
          trend: "up",
          lastUpdated: "2024-12-10",
          target: 40,
          description: "好胆固醇水平优秀"
        }
      ],
      recommendations: [
        "继续保持健康饮食",
        "增加有氧运动频率",
        "定期检查血脂水平"
      ],
      riskFactors: [],
      achievements: [
        "胆固醇水平显著改善",
        "HDL水平达到优秀标准"
      ]
    },
    {
      id: "3",
      title: "心理健康评估报告",
      type: "mental",
      date: "2024-12-08",
      overallScore: 75,
      metrics: [
        {
          id: "stress_level",
          name: "压力水平",
          value: 6,
          unit: "分",
          status: "fair",
          trend: "stable",
          lastUpdated: "2024-12-08",
          target: 4,
          description: "压力水平中等，建议采取放松措施"
        },
        {
          id: "mood_score",
          name: "情绪评分",
          value: 7.2,
          unit: "分",
          status: "good",
          trend: "up",
          lastUpdated: "2024-12-08",
          target: 8,
          description: "情绪状态良好"
        }
      ],
      recommendations: [
        "练习冥想或深呼吸",
        "保持社交活动",
        "适当运动释放压力"
      ],
      riskFactors: [
        "工作压力较大"
      ],
      achievements: [
        "情绪管理能力提升"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return '优秀';
      case 'good': return '良好';
      case 'fair': return '一般';
      case 'poor': return '需改善';
      default: return '未知';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'comprehensive': return <BarChart3 className="h-5 w-5" />;
      case 'cardiovascular': return <Heart className="h-5 w-5" />;
      case 'mental': return <Brain className="h-5 w-5" />;
      case 'nutrition': return <Apple className="h-5 w-5" />;
      case 'bmi': return <Activity className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const currentReport = selectedReport ? healthReports.find(r => r.id === selectedReport) : healthReports[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            健康报告中心
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            查看您的个性化健康分析报告，了解健康状况和改善建议。
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 报告列表 */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  我的报告
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedReport === report.id || (!selectedReport && report.id === '1')
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getReportIcon(report.type)}
                        <span className="font-medium text-sm">{report.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{report.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {report.overallScore}分
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  生成新报告
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 报告详情 */}
          <div className="lg:col-span-3">
            {currentReport && (
              <div className="space-y-6">
                {/* 报告头部 */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getReportIcon(currentReport.type)}
                        <div>
                          <CardTitle className="text-2xl">{currentReport.title}</CardTitle>
                          <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            生成日期：{currentReport.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          分享
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          下载
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {currentReport.overallScore}
                        </div>
                        <div className="text-gray-600">综合评分</div>
                        <Progress value={currentReport.overallScore} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {currentReport.metrics.length}
                        </div>
                        <div className="text-gray-600">检测指标</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {currentReport.recommendations.length}
                        </div>
                        <div className="text-gray-600">改善建议</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 详细内容 */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    <TabsTrigger value="metrics">指标详情</TabsTrigger>
                    <TabsTrigger value="recommendations">建议</TabsTrigger>
                    <TabsTrigger value="trends">趋势分析</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* 健康指标概览 */}
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>健康指标概览</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {currentReport.metrics.map((metric) => (
                            <div key={metric.id} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{metric.name}</span>
                                {getTrendIcon(metric.trend)}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold">{metric.value}</span>
                                <span className="text-gray-600">{metric.unit}</span>
                                <Badge className={getStatusColor(metric.status)}>
                                  {getStatusText(metric.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{metric.description}</p>
                              {metric.target && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>目标值: {metric.target}{metric.unit}</span>
                                    <span>当前: {metric.value}{metric.unit}</span>
                                  </div>
                                  <Progress 
                                    value={Math.min((metric.value / metric.target) * 100, 100)} 
                                    className="h-2"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 成就和风险 */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            健康成就
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentReport.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                            风险因素
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {currentReport.riskFactors.length > 0 ? (
                            <ul className="space-y-2">
                              {currentReport.riskFactors.map((risk, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                  <span>{risk}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600">暂无明显风险因素，继续保持！</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle>详细指标分析</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {currentReport.metrics.map((metric) => (
                            <div key={metric.id} className="border-b pb-6 last:border-b-0">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">{metric.name}</h3>
                                <div className="flex items-center gap-2">
                                  {getTrendIcon(metric.trend)}
                                  <Badge className={getStatusColor(metric.status)}>
                                    {getStatusText(metric.status)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">当前值</p>
                                  <p className="text-2xl font-bold">{metric.value} {metric.unit}</p>
                                </div>
                                {metric.target && (
                                  <div>
                                    <p className="text-sm text-gray-600 mb-1">目标值</p>
                                    <p className="text-2xl font-bold text-green-600">{metric.target} {metric.unit}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">最后更新</p>
                                  <p className="text-sm">{metric.lastUpdated}</p>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-4">{metric.description}</p>
                              {metric.target && (
                                <div className="mt-4">
                                  <Progress 
                                    value={Math.min((metric.value / metric.target) * 100, 100)} 
                                    className="h-3"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    达成度: {Math.round((metric.value / metric.target) * 100)}%
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-600" />
                          个性化改善建议
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentReport.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800">{recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          行动计划
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">本周目标</h4>
                            <ul className="space-y-1 text-sm text-blue-700">
                              <li>• 每天步行8000步</li>
                              <li>• 减少盐分摄入至每日5克以下</li>
                              <li>• 保持7-8小时睡眠</li>
                            </ul>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-800 mb-2">本月目标</h4>
                            <ul className="space-y-1 text-sm text-purple-700">
                              <li>• 体重减少1-2公斤</li>
                              <li>• 血压控制在120/80以下</li>
                              <li>• 完成全面体检</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="trends" className="space-y-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-purple-600" />
                          健康趋势分析
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">趋势图表开发中</h3>
                          <p className="text-gray-500">我们正在为您准备详细的健康趋势分析图表</p>
                          <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                            查看简化趋势
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}