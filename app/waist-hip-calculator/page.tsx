"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function WaistHipCalculator() {
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState(null);

  const calculateWaistHipRatio = () => {
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);

    if (waistNum > 0 && hipNum > 0 && gender) {
      const ratio = waistNum / hipNum;
      let risk = "";
      let category = "";
      let recommendations = [];

      if (gender === "male") {
        if (ratio < 0.85) {
          risk = "低风险";
          category = "健康";
          recommendations = [
            "保持当前的健康生活方式",
            "继续规律运动和均衡饮食",
            "定期监测体重变化"
          ];
        } else if (ratio <= 0.95) {
          risk = "中等风险";
          category = "注意";
          recommendations = [
            "增加有氧运动，每周至少150分钟",
            "减少腹部脂肪堆积",
            "控制饮食中的糖分和饱和脂肪"
          ];
        } else {
          risk = "高风险";
          category = "警告";
          recommendations = [
            "立即咨询医生制定减重计划",
            "严格控制饮食热量摄入",
            "增加运动强度和频率"
          ];
        }
      } else {
        if (ratio < 0.75) {
          risk = "低风险";
          category = "健康";
          recommendations = [
            "保持当前的健康生活方式",
            "继续规律运动和均衡饮食",
            "定期监测体重变化"
          ];
        } else if (ratio <= 0.85) {
          risk = "中等风险";
          category = "注意";
          recommendations = [
            "增加有氧运动，每周至少150分钟",
            "减少腹部脂肪堆积",
            "控制饮食中的糖分和饱和脂肪"
          ];
        } else {
          risk = "高风险";
          category = "警告";
          recommendations = [
            "立即咨询医生制定减重计划",
            "严格控制饮食热量摄入",
            "增加运动强度和频率"
          ];
        }
      }

      setResult({ ratio, risk, category, recommendations });
    }
  };

  const resetForm = () => {
    setWaist("");
    setHip("");
    setGender("");
    setResult(null);
  };

  const getRiskColor = (category) => {
    switch (category) {
      case "健康": return "text-green-600";
      case "注意": return "text-yellow-600";
      case "警告": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">腰臀比计算器</h1>
          <p className="text-xl text-gray-600">评估腹部肥胖风险，预防心血管疾病</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📏 身体数据输入
              </CardTitle>
              <CardDescription>
                请准确测量并输入您的腰围和臀围数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waist" className="text-lg font-medium">
                    腰围 (cm)
                  </Label>
                  <Input
                    id="waist"
                    type="number"
                    placeholder="请输入腰围"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="hip" className="text-lg font-medium">
                    臀围 (cm)
                  </Label>
                  <Input
                    id="hip"
                    type="number"
                    placeholder="请输入臀围"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-lg font-medium">性别</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男性</SelectItem>
                    <SelectItem value="female">女性</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={calculateWaistHipRatio}
                  className="flex-1"
                  disabled={!waist || !hip || !gender}
                >
                  计算腰臀比
                </Button>
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 腰臀比评估结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {result.ratio.toFixed(2)}
                    </div>
                    <div className={`text-xl font-semibold ${getRiskColor(result.category)}`}>
                      {result.risk}
                    </div>
                  </div>

                  <Alert className={`border-l-4 ${
                    result.category === "健康" ? "border-green-500 bg-green-50" :
                    result.category === "注意" ? "border-yellow-500 bg-yellow-50" :
                    "border-red-500 bg-red-50"
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>健康建议：</strong>
                      <ul className="mt-2 space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm">• {rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-6xl mb-4">📏</div>
                  <p>请输入身体数据进行腰臀比评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📐 正确测量方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">腰围测量</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 站立，双脚分开与肩同宽</li>
                  <li>• 找到肋骨下缘和髂骨上缘的中点</li>
                  <li>• 用软尺水平环绕腰部</li>
                  <li>• 正常呼吸后测量</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">臀围测量</h3>
                <ul className="space-y-2 text-sm">
                  <li>• 站立，双脚并拢</li>
                  <li>• 找到臀部最突出的部位</li>
                  <li>• 用软尺水平环绕臀部</li>
                  <li>• 确保软尺水平且贴身</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🧠 腰臀比健康知识</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  ⚠️ 健康风险
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• 心血管疾病风险</li>
                  <li>• 2型糖尿病风险</li>
                  <li>• 高血压风险</li>
                  <li>• 代谢综合征</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  📊 正常范围
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• 男性：&lt; 0.85 (健康)</li>
                  <li>• 女性：&lt; 0.75 (健康)</li>
                  <li>• 男性：0.85-0.95 (注意)</li>
                  <li>• 女性：0.75-0.85 (注意)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  💡 改善方法
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• 有氧运动减脂</li>
                  <li>• 力量训练塑形</li>
                  <li>• 控制饮食热量</li>
                  <li>• 减少精制糖摄入</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}