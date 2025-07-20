"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IdealWeightResult {
  robinson: number;
  miller: number;
  devine: number;
  hamwi: number;
  healthy_bmi_range: { min: number; max: number };
}

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [frame, setFrame] = useState("");
  const [result, setResult] = useState<IdealWeightResult | null>(null);

  const calculateIdealWeight = () => {
    const heightCm = parseFloat(height);
    const ageNum = parseInt(age);
    
    if (heightCm > 0 && gender) {
      const heightInches = heightCm / 2.54;
      const heightFeet = Math.floor(heightInches / 12);
      const remainingInches = heightInches % 12;
      
      let robinson, miller, devine, hamwi;
      
      if (gender === "male") {
        // 男性公式
        robinson = 52 + 1.9 * (heightCm - 152.4) / 2.54; // Robinson公式
        miller = 56.2 + 1.41 * (heightCm - 152.4) / 2.54; // Miller公式
        devine = 50 + 2.3 * (heightInches - 60); // Devine公式
        hamwi = 48 + 2.7 * (heightInches - 60); // Hamwi公式
      } else {
        // 女性公式
        robinson = 49 + 1.7 * (heightCm - 152.4) / 2.54; // Robinson公式
        miller = 53.1 + 1.36 * (heightCm - 152.4) / 2.54; // Miller公式
        devine = 45.5 + 2.3 * (heightInches - 60); // Devine公式
        hamwi = 45.5 + 2.2 * (heightInches - 60); // Hamwi公式
      }
      
      // 健康BMI范围对应的体重
      const heightM = heightCm / 100;
      const minHealthyWeight = 18.5 * heightM * heightM;
      const maxHealthyWeight = 24.9 * heightM * heightM;
      
      setResult({
        robinson: Math.round(robinson * 10) / 10,
        miller: Math.round(miller * 10) / 10,
        devine: Math.round(devine * 10) / 10,
        hamwi: Math.round(hamwi * 10) / 10,
        healthy_bmi_range: {
          min: Math.round(minHealthyWeight * 10) / 10,
          max: Math.round(maxHealthyWeight * 10) / 10
        }
      });
    }
  };

  const getAverageIdealWeight = () => {
    if (!result) return 0;
    return Math.round(((result.robinson + result.miller + result.devine + result.hamwi) / 4) * 10) / 10;
  };

  const reset = () => {
    setHeight("");
    setGender("");
    setAge("");
    setFrame("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            理想体重计算器
          </h1>
          <p className="text-xl text-gray-600">
            使用多种科学公式计算您的理想体重范围，帮助您设定健康目标
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">输入基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="age" className="text-lg font-medium">
                  年龄 (可选)
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
                <Label htmlFor="frame" className="text-lg font-medium">
                  体型框架 (可选)
                </Label>
                <Select value={frame} onValueChange={setFrame}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择体型框架" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">小骨架</SelectItem>
                    <SelectItem value="medium">中等骨架</SelectItem>
                    <SelectItem value="large">大骨架</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateIdealWeight}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3"
                  disabled={!height || !gender}
                >
                  计算理想体重
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
                <>
                  <div className="text-center space-y-4">
                    <div className="text-5xl font-bold text-green-600">
                      {getAverageIdealWeight()} kg
                    </div>
                    <div className="text-xl text-gray-600">
                      平均理想体重
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold text-center mb-3">各公式计算结果：</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Robinson公式:</span>
                        <span className="font-semibold">{result.robinson} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miller公式:</span>
                        <span className="font-semibold">{result.miller} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Devine公式:</span>
                        <span className="font-semibold">{result.devine} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hamwi公式:</span>
                        <span className="font-semibold">{result.hamwi} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-center mb-3 text-blue-800">健康BMI体重范围：</h3>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {result.healthy_bmi_range.min} - {result.healthy_bmi_range.max} kg
                      </span>
                      <p className="text-sm text-blue-700 mt-2">
                        基于BMI 18.5-24.9的健康范围
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <p>请输入身高和性别来计算理想体重</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 公式说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">计算公式说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">📊 公式介绍</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Robinson公式：</strong>1983年发布，广泛使用</li>
                  <li>• <strong>Miller公式：</strong>1983年发布，基于大样本数据</li>
                  <li>• <strong>Devine公式：</strong>1974年发布，医学界常用</li>
                  <li>• <strong>Hamwi公式：</strong>1964年发布，糖尿病研究</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">⚠️ 使用说明</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 这些公式适用于成年人（18岁以上）</li>
                  <li>• 结果仅供参考，个体差异较大</li>
                  <li>• 肌肉发达者理想体重可能更高</li>
                  <li>• 建议结合BMI和体脂率综合评估</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 体型框架说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">体型框架参考</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🦴</div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">小骨架</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 手腕较细</li>
                  <li>• 肩膀较窄</li>
                  <li>• 骨骼相对较小</li>
                  <li>• 理想体重偏低</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏃</div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">中等骨架</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 标准体型</li>
                  <li>• 肩膀适中</li>
                  <li>• 骨骼正常大小</li>
                  <li>• 理想体重标准</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💪</div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">大骨架</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 手腕较粗</li>
                  <li>• 肩膀较宽</li>
                  <li>• 骨骼相对较大</li>
                  <li>• 理想体重偏高</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 健康建议 */}
        {result && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">健康建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">🎯 目标设定</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 以健康BMI范围为主要参考</li>
                    <li>• 理想体重公式作为辅助参考</li>
                    <li>• 设定合理的阶段性目标</li>
                    <li>• 关注身体成分而非单纯体重</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">💡 实现方法</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 均衡饮食，控制热量摄入</li>
                    <li>• 规律运动，有氧+力量训练</li>
                    <li>• 保证充足睡眠和水分</li>
                    <li>• 定期监测体重变化</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}