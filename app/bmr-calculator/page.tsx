"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BMRResult {
  mifflinStJeor: number;
  harrisBenedict: number;
  katchMcArdle: number;
  average: number;
  tdee: {
    sedentary: number;
    light: number;
    moderate: number;
    active: number;
    veryActive: number;
  };
}

export default function BMRCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [result, setResult] = useState<BMRResult | null>(null);

  const calculateBMR = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);
    const bodyFatNum = parseFloat(bodyFat) || 0;
    
    if (weightNum > 0 && heightNum > 0 && ageNum > 0 && gender) {
      // Mifflin-St Jeor 方程 (最准确)
      let mifflinStJeor;
      if (gender === "male") {
        mifflinStJeor = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
      } else {
        mifflinStJeor = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
      }
      
      // Harris-Benedict 方程 (修订版)
      let harrisBenedict;
      if (gender === "male") {
        harrisBenedict = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
      } else {
        harrisBenedict = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
      }
      
      // Katch-McArdle 方程 (基于瘦体重)
      let katchMcArdle = 0;
      if (bodyFatNum > 0 && bodyFatNum < 50) {
        const leanBodyMass = weightNum * (1 - bodyFatNum / 100);
        katchMcArdle = 370 + (21.6 * leanBodyMass);
      }
      
      // 平均值
      const validResults = [mifflinStJeor, harrisBenedict];
      if (katchMcArdle > 0) validResults.push(katchMcArdle);
      const average = validResults.reduce((sum, val) => sum + val, 0) / validResults.length;
      
      // TDEE 计算 (总日消耗量)
      const tdee = {
        sedentary: Math.round(average * 1.2),      // 久坐不动
        light: Math.round(average * 1.375),       // 轻度活动
        moderate: Math.round(average * 1.55),     // 中度活动
        active: Math.round(average * 1.725),      // 积极活动
        veryActive: Math.round(average * 1.9)     // 高强度活动
      };
      
      setResult({
        mifflinStJeor: Math.round(mifflinStJeor),
        harrisBenedict: Math.round(harrisBenedict),
        katchMcArdle: Math.round(katchMcArdle),
        average: Math.round(average),
        tdee
      });
    }
  };

  const reset = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("");
    setBodyFat("");
    setResult(null);
  };

  const getMetabolismLevel = (bmr: number, weight: number) => {
    const bmrPerKg = bmr / weight;
    if (bmrPerKg > 25) return { level: "高", color: "text-green-600", description: "代谢率较高，容易消耗热量" };
    if (bmrPerKg > 20) return { level: "正常", color: "text-blue-600", description: "代谢率正常" };
    return { level: "偏低", color: "text-orange-600", description: "代谢率偏低，需要注意饮食和运动" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            基础代谢率计算器
          </h1>
          <p className="text-xl text-gray-600">
            计算您的基础代谢率(BMR)和每日总消耗量(TDEE)，制定科学的饮食计划
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">输入身体数据</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-lg font-medium">
                    体重 (公斤)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="例如: 65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-lg font-medium">
                    身高 (厘米)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="例如: 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lg font-medium">
                    年龄
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="例如: 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-lg font-medium">
                    性别
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyFat" className="text-lg font-medium">
                  体脂率 (%) - 可选
                </Label>
                <Input
                  id="bodyFat"
                  type="number"
                  placeholder="例如: 15 (可选，用于更精确计算)"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="text-lg p-3"
                />
                <p className="text-sm text-gray-500">
                  如果知道体脂率，可以获得更精确的Katch-McArdle计算结果
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateBMR}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-3"
                  disabled={!weight || !height || !age || !gender}
                >
                  计算BMR
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

          {/* 结果显示 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">计算结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <Tabs defaultValue="bmr" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bmr">基础代谢率</TabsTrigger>
                    <TabsTrigger value="tdee">每日消耗</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bmr" className="space-y-4">
                    <div className="text-center space-y-4">
                      <div className="text-5xl font-bold text-orange-600">
                        {result.average}
                      </div>
                      <div className="text-xl text-gray-600">
                        千卡/天 (平均BMR)
                      </div>
                      {parseFloat(weight) > 0 && (
                        <div className="text-center">
                          {(() => {
                            const metabolismInfo = getMetabolismLevel(result.average, parseFloat(weight));
                            return (
                              <div className={`text-lg font-semibold ${metabolismInfo.color}`}>
                                代谢水平: {metabolismInfo.level}
                                <p className="text-sm text-gray-600 mt-1">{metabolismInfo.description}</p>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h3 className="font-semibold text-center mb-3">不同公式计算结果：</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>Mifflin-St Jeor (推荐):</span>
                          <span className="font-semibold text-orange-600">{result.mifflinStJeor} 千卡</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Harris-Benedict:</span>
                          <span className="font-semibold text-blue-600">{result.harrisBenedict} 千卡</span>
                        </div>
                        {result.katchMcArdle > 0 && (
                          <div className="flex justify-between items-center">
                            <span>Katch-McArdle:</span>
                            <span className="font-semibold text-green-600">{result.katchMcArdle} 千卡</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tdee" className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">久坐不动</h3>
                            <p className="text-sm text-gray-600">办公室工作，很少运动</p>
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {result.tdee.sedentary} 千卡
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">轻度活动</h3>
                            <p className="text-sm text-gray-600">每周1-3次轻度运动</p>
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {result.tdee.light} 千卡
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">中度活动</h3>
                            <p className="text-sm text-gray-600">每周3-5次中等强度运动</p>
                          </div>
                          <div className="text-xl font-bold text-yellow-600">
                            {result.tdee.moderate} 千卡
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">积极活动</h3>
                            <p className="text-sm text-gray-600">每周6-7次高强度运动</p>
                          </div>
                          <div className="text-xl font-bold text-orange-600">
                            {result.tdee.active} 千卡
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">高强度活动</h3>
                            <p className="text-sm text-gray-600">每天高强度运动或体力劳动</p>
                          </div>
                          <div className="text-xl font-bold text-red-600">
                            {result.tdee.veryActive} 千卡
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">请输入身体数据并点击计算按钮</p>
                  <p className="text-sm mt-2">我们将为您计算基础代谢率和每日总消耗量</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 说明信息 */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">什么是基础代谢率(BMR)?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">
                基础代谢率是指人体在安静状态下维持基本生理功能所需的最低能量消耗。
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-semibold">•</span>
                  <span>Mifflin-St Jeor: 目前最准确的公式，适用于大多数人</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">•</span>
                  <span>Harris-Benedict: 经典公式，历史悠久但略有偏差</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-semibold">•</span>
                  <span>Katch-McArdle: 基于瘦体重，适合知道体脂率的人</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">如何使用TDEE?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">
                总日消耗量(TDEE)是您每天实际消耗的总热量，包括运动和日常活动。
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-semibold">减重:</span>
                  <span>每日摄入比TDEE少300-500千卡</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">维持:</span>
                  <span>每日摄入接近TDEE</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 font-semibold">增重:</span>
                  <span>每日摄入比TDEE多300-500千卡</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}