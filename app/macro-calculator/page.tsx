"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function MacroCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateMacros = () => {
    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      alert("请填写所有必填项");
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    // 计算基础代谢率 (BMR)
    let bmr;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    // 活动系数
    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * activityFactors[activityLevel];

    // 根据目标调整卡路里
    let targetCalories;
    switch (goal) {
      case "lose":
        targetCalories = tdee - 500; // 减重：每天减少500卡路里
        break;
      case "gain":
        targetCalories = tdee + 500; // 增重：每天增加500卡路里
        break;
      case "maintain":
      default:
        targetCalories = tdee; // 维持体重
        break;
    }

    // 宏量营养素分配
    const proteinCalories = targetCalories * 0.25; // 蛋白质25%
    const fatCalories = targetCalories * 0.30; // 脂肪30%
    const carbCalories = targetCalories * 0.45; // 碳水化合物45%

    const proteinGrams = proteinCalories / 4; // 1g蛋白质 = 4卡路里
    const fatGrams = fatCalories / 9; // 1g脂肪 = 9卡路里
    const carbGrams = carbCalories / 4; // 1g碳水化合物 = 4卡路里

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      fat: Math.round(fatGrams),
      carbs: Math.round(carbGrams),
      proteinCalories: Math.round(proteinCalories),
      fatCalories: Math.round(fatCalories),
      carbCalories: Math.round(carbCalories)
    });
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("");
    setActivityLevel("");
    setGoal("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🍽️ 宏量营养素计算器</h1>
          <p className="text-lg text-gray-600">
            科学计算每日所需的蛋白质、脂肪和碳水化合物摄入量
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">体重 (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="例如：70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="height">身高 (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="例如：175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">年龄 *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="例如：30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">性别 *</Label>
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
              </div>

              <div>
                <Label htmlFor="activity">活动水平 *</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择活动水平" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">久坐不动（办公室工作，很少运动）</SelectItem>
                    <SelectItem value="light">轻度活动（每周1-3次轻度运动）</SelectItem>
                    <SelectItem value="moderate">中度活动（每周3-5次中等运动）</SelectItem>
                    <SelectItem value="active">高度活动（每周6-7次运动）</SelectItem>
                    <SelectItem value="very_active">极高活动（每天2次运动或重体力劳动）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal">健身目标 *</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择健身目标" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">减重减脂</SelectItem>
                    <SelectItem value="maintain">维持体重</SelectItem>
                    <SelectItem value="gain">增重增肌</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateMacros} className="flex-1">
                  计算宏量营养素
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 计算结果 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>计算结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>每日总卡路里需求：{result.targetCalories} 卡路里</strong>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{result.protein}g</div>
                    <div className="text-sm text-gray-600">蛋白质</div>
                    <div className="text-xs text-gray-500">{result.proteinCalories} 卡路里</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{result.fat}g</div>
                    <div className="text-sm text-gray-600">脂肪</div>
                    <div className="text-xs text-gray-500">{result.fatCalories} 卡路里</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{result.carbs}g</div>
                    <div className="text-sm text-gray-600">碳水化合物</div>
                    <div className="text-xs text-gray-500">{result.carbCalories} 卡路里</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>基础代谢率 (BMR):</span>
                    <span>{result.bmr} 卡路里/天</span>
                  </div>
                  <div className="flex justify-between">
                    <span>总能量消耗 (TDEE):</span>
                    <span>{result.tdee} 卡路里/天</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 营养知识 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">🥩 蛋白质 (25%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 肌肉合成和修复</li>
                <li>• 增强饱腹感</li>
                <li>• 提高代谢率</li>
                <li>• 来源：肉类、蛋类、豆类</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">🥑 脂肪 (30%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 激素合成</li>
                <li>• 脂溶性维生素吸收</li>
                <li>• 提供持久能量</li>
                <li>• 来源：坚果、橄榄油、鱼类</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🍞 碳水化合物 (45%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 主要能量来源</li>
                <li>• 大脑功能必需</li>
                <li>• 运动表现支持</li>
                <li>• 来源：全谷物、水果、蔬菜</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">计算原理</h3>
                <ul className="text-sm space-y-1">
                  <li>• 基于Harris-Benedict公式计算BMR</li>
                  <li>• 结合活动系数得出TDEE</li>
                  <li>• 根据目标调整卡路里摄入</li>
                  <li>• 按比例分配三大宏量营养素</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 结果仅供参考，个体差异较大</li>
                  <li>• 建议咨询营养师制定个性化方案</li>
                  <li>• 循序渐进调整饮食结构</li>
                  <li>• 配合适量运动效果更佳</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}