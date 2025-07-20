"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BPResult {
  systolic: number;
  diastolic: number;
  category: string;
  risk: string;
  color: string;
  pulse_pressure: number;
  mean_arterial_pressure: number;
  recommendations: string[];
}

interface BPRecord {
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  notes?: string;
}

export default function BloodPressureCalculator() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [measurementTime, setMeasurementTime] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<BPResult | null>(null);
  const [records, setRecords] = useState<BPRecord[]>([]);

  const analyzeBP = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (sys > 0 && dia > 0) {
      let category = "";
      let risk = "";
      let color = "";
      let recommendations: string[] = [];
      
      // 根据美国心脏协会标准分类
      if (sys < 120 && dia < 80) {
        category = "正常血压";
        risk = "低风险";
        color = "text-green-600";
        recommendations = [
          "保持健康的生活方式",
          "定期监测血压",
          "继续均衡饮食和规律运动"
        ];
      } else if (sys >= 120 && sys <= 129 && dia < 80) {
        category = "血压升高";
        risk = "轻度风险";
        color = "text-yellow-600";
        recommendations = [
          "采用健康的生活方式改变",
          "减少钠盐摄入",
          "增加体育活动",
          "控制体重",
          "定期监测血压"
        ];
      } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
        category = "1级高血压";
        risk = "中度风险";
        color = "text-orange-600";
        recommendations = [
          "咨询医生制定治疗计划",
          "生活方式干预",
          "可能需要药物治疗",
          "每周监测血压",
          "限制钠盐和酒精摄入"
        ];
      } else if ((sys >= 140 && sys <= 179) || (dia >= 90 && dia <= 119)) {
        category = "2级高血压";
        risk = "高风险";
        color = "text-red-600";
        recommendations = [
          "立即咨询医生",
          "可能需要联合药物治疗",
          "严格生活方式管理",
          "每日监测血压",
          "定期医学随访"
        ];
      } else if (sys >= 180 || dia >= 120) {
        category = "高血压危象";
        risk = "极高风险";
        color = "text-red-800";
        recommendations = [
          "立即就医！",
          "可能需要紧急治疗",
          "严密医学监护",
          "遵医嘱用药"
        ];
      }
      
      // 计算脉压和平均动脉压
      const pulse_pressure = sys - dia;
      const mean_arterial_pressure = Math.round(dia + (pulse_pressure / 3));
      
      // 年龄相关调整
      if (age && parseInt(age) > 65) {
        if (sys < 130 && dia < 80) {
          recommendations.push("老年人血压控制良好，继续保持");
        } else {
          recommendations.push("老年人需要更加谨慎的血压管理");
        }
      }
      
      setResult({
        systolic: sys,
        diastolic: dia,
        category,
        risk,
        color,
        pulse_pressure,
        mean_arterial_pressure,
        recommendations
      });
      
      // 保存记录
      const newRecord: BPRecord = {
        date: new Date().toLocaleDateString('zh-CN'),
        time: measurementTime || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        systolic: sys,
        diastolic: dia,
        pulse: pulse ? parseInt(pulse) : undefined,
        notes: notes || undefined
      };
      
      setRecords(prev => [newRecord, ...prev.slice(0, 9)]); // 保留最近10条记录
    }
  };

  const reset = () => {
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setNotes("");
    setResult(null);
  };

  const clearRecords = () => {
    setRecords([]);
  };

  const getBPTrend = () => {
    if (records.length < 2) return null;
    
    const recent = records.slice(0, 3);
    const avgSys = recent.reduce((sum, r) => sum + r.systolic, 0) / recent.length;
    const avgDia = recent.reduce((sum, r) => sum + r.diastolic, 0) / recent.length;
    
    const older = records.slice(3, 6);
    if (older.length === 0) return null;
    
    const oldAvgSys = older.reduce((sum, r) => sum + r.systolic, 0) / older.length;
    const oldAvgDia = older.reduce((sum, r) => sum + r.diastolic, 0) / older.length;
    
    const sysTrend = avgSys - oldAvgSys;
    const diaTrend = avgDia - oldAvgDia;
    
    if (sysTrend > 5 || diaTrend > 3) {
      return { trend: "上升", color: "text-red-600", icon: "📈" };
    } else if (sysTrend < -5 || diaTrend < -3) {
      return { trend: "下降", color: "text-green-600", icon: "📉" };
    } else {
      return { trend: "稳定", color: "text-blue-600", icon: "➡️" };
    }
  };

  const trendInfo = getBPTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            血压分析计算器
          </h1>
          <p className="text-xl text-gray-600">
            监测和分析您的血压数据，评估心血管健康风险
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 血压输入 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">血压测量</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic" className="text-lg font-medium">
                    收缩压 (mmHg)
                  </Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="例如: 120"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diastolic" className="text-lg font-medium">
                    舒张压 (mmHg)
                  </Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="例如: 80"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pulse" className="text-lg font-medium">
                    心率 (次/分) - 可选
                  </Label>
                  <Input
                    id="pulse"
                    type="number"
                    placeholder="例如: 72"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lg font-medium">
                    年龄 - 可选
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="例如: 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-lg font-medium">
                    性别 - 可选
                  </Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="measurementTime" className="text-lg font-medium">
                    测量时间 - 可选
                  </Label>
                  <Input
                    id="measurementTime"
                    type="time"
                    value={measurementTime}
                    onChange={(e) => setMeasurementTime(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-medium">
                  备注 - 可选
                </Label>
                <Input
                  id="notes"
                  placeholder="例如: 运动后测量、服药前等"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-lg p-3"
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={analyzeBP}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-lg py-3"
                  disabled={!systolic || !diastolic}
                >
                  分析血压
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  className="flex-1 text-lg py-3"
                >
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 分析结果 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">血压分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="text-5xl font-bold">
                      <span className={result.color}>{result.systolic}</span>
                      <span className="text-gray-400 mx-2">/</span>
                      <span className={result.color}>{result.diastolic}</span>
                    </div>
                    <div className="text-xl text-gray-600">
                      mmHg
                    </div>
                    <div className={`text-2xl font-semibold ${result.color}`}>
                      {result.category}
                    </div>
                    <div className={`text-lg ${result.color}`}>
                      {result.risk}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.pulse_pressure}</div>
                      <div className="text-sm text-gray-600">脉压 (mmHg)</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.mean_arterial_pressure}</div>
                      <div className="text-sm text-gray-600">平均动脉压</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">建议措施：</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">❤️</div>
                  <p>请输入血压数据进行分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 血压记录和趋势 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">血压记录</CardTitle>
              <div className="flex gap-2">
                {trendInfo && (
                  <div className={`flex items-center ${trendInfo.color} font-semibold`}>
                    <span className="mr-1">{trendInfo.icon}</span>
                    <span>趋势: {trendInfo.trend}</span>
                  </div>
                )}
                <Button 
                  onClick={clearRecords}
                  variant="outline"
                  size="sm"
                  disabled={records.length === 0}
                >
                  清空记录
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {records.length > 0 ? (
              <div className="space-y-3">
                {records.map((record, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {record.date} {record.time}
                      </div>
                      <div className="text-lg font-semibold">
                        {record.systolic}/{record.diastolic} mmHg
                      </div>
                      {record.pulse && (
                        <div className="text-sm text-blue-600">
                          心率: {record.pulse}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {record.notes && (
                        <div className="text-sm text-gray-600">{record.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 py-8 text-center">
                <p>暂无血压记录</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 血压分类标准 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">血压分类标准</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">分类</th>
                    <th className="text-left p-3">收缩压 (mmHg)</th>
                    <th className="text-left p-3">舒张压 (mmHg)</th>
                    <th className="text-left p-3">风险等级</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-green-50">
                    <td className="p-3 font-semibold text-green-600">正常血压</td>
                    <td className="p-3">&lt; 120</td>
                    <td className="p-3">&lt; 80</td>
                    <td className="p-3 text-green-600">低风险</td>
                  </tr>
                  <tr className="border-b bg-yellow-50">
                    <td className="p-3 font-semibold text-yellow-600">血压升高</td>
                    <td className="p-3">120-129</td>
                    <td className="p-3">&lt; 80</td>
                    <td className="p-3 text-yellow-600">轻度风险</td>
                  </tr>
                  <tr className="border-b bg-orange-50">
                    <td className="p-3 font-semibold text-orange-600">1级高血压</td>
                    <td className="p-3">130-139</td>
                    <td className="p-3">80-89</td>
                    <td className="p-3 text-orange-600">中度风险</td>
                  </tr>
                  <tr className="border-b bg-red-50">
                    <td className="p-3 font-semibold text-red-600">2级高血压</td>
                    <td className="p-3">140-179</td>
                    <td className="p-3">90-119</td>
                    <td className="p-3 text-red-600">高风险</td>
                  </tr>
                  <tr className="border-b bg-red-100">
                    <td className="p-3 font-semibold text-red-800">高血压危象</td>
                    <td className="p-3">≥ 180</td>
                    <td className="p-3">≥ 120</td>
                    <td className="p-3 text-red-800">极高风险</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 血压管理建议 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">血压管理建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🥗</div>
                <h3 className="font-semibold mb-2">饮食控制</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 减少钠盐摄入</li>
                  <li>• 增加钾的摄入</li>
                  <li>• 多吃蔬菜水果</li>
                  <li>• 限制饱和脂肪</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏃</div>
                <h3 className="font-semibold mb-2">规律运动</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 每周150分钟中等强度</li>
                  <li>• 有氧运动为主</li>
                  <li>• 适量力量训练</li>
                  <li>• 避免过度激烈</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">😌</div>
                <h3 className="font-semibold mb-2">压力管理</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 充足睡眠</li>
                  <li>• 放松技巧</li>
                  <li>• 冥想练习</li>
                  <li>• 避免过度压力</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🚭</div>
                <h3 className="font-semibold mb-2">生活习惯</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 戒烟限酒</li>
                  <li>• 控制体重</li>
                  <li>• 定期监测</li>
                  <li>• 遵医嘱用药</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}