"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeartRateZones {
  maxHR: number;
  restingHR: number;
  zones: {
    zone1: { min: number; max: number; name: string; description: string; color: string };
    zone2: { min: number; max: number; name: string; description: string; color: string };
    zone3: { min: number; max: number; name: string; description: string; color: string };
    zone4: { min: number; max: number; name: string; description: string; color: string };
    zone5: { min: number; max: number; name: string; description: string; color: string };
  };
}

export default function HeartRateCalculator() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<HeartRateZones | null>(null);

  const calculateHeartRateZones = () => {
    const ageNum = parseInt(age);
    const restingHRNum = parseInt(restingHR);
    
    if (ageNum > 0 && restingHRNum > 0) {
      // 计算最大心率 (220 - 年龄)
      let maxHR = 220 - ageNum;
      
      // 根据性别调整（女性可能略高）
      if (gender === "female") {
        maxHR = 226 - ageNum;
      }
      
      // 根据健身水平调整
      if (fitnessLevel === "high") {
        maxHR += 5;
      } else if (fitnessLevel === "low") {
        maxHR -= 5;
      }
      
      // 使用Karvonen公式计算心率储备
      const hrReserve = maxHR - restingHRNum;
      
      // 计算各个心率区间
      const zones = {
        zone1: {
          min: Math.round(restingHRNum + hrReserve * 0.5),
          max: Math.round(restingHRNum + hrReserve * 0.6),
          name: "恢复区间",
          description: "轻松恢复，促进血液循环",
          color: "bg-blue-100 text-blue-800"
        },
        zone2: {
          min: Math.round(restingHRNum + hrReserve * 0.6),
          max: Math.round(restingHRNum + hrReserve * 0.7),
          name: "有氧基础区间",
          description: "燃烧脂肪，提高有氧能力",
          color: "bg-green-100 text-green-800"
        },
        zone3: {
          min: Math.round(restingHRNum + hrReserve * 0.7),
          max: Math.round(restingHRNum + hrReserve * 0.8),
          name: "有氧区间",
          description: "提高心肺功能和耐力",
          color: "bg-yellow-100 text-yellow-800"
        },
        zone4: {
          min: Math.round(restingHRNum + hrReserve * 0.8),
          max: Math.round(restingHRNum + hrReserve * 0.9),
          name: "乳酸阈值区间",
          description: "提高速度和力量耐力",
          color: "bg-orange-100 text-orange-800"
        },
        zone5: {
          min: Math.round(restingHRNum + hrReserve * 0.9),
          max: maxHR,
          name: "无氧区间",
          description: "最大强度训练，提高爆发力",
          color: "bg-red-100 text-red-800"
        }
      };
      
      setResult({
        maxHR,
        restingHR: restingHRNum,
        zones
      });
    }
  };

  const reset = () => {
    setAge("");
    setRestingHR("");
    setFitnessLevel("");
    setGender("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            心率区间计算器
          </h1>
          <p className="text-xl text-gray-600">
            计算您的运动心率区间，科学指导训练强度，提高运动效果
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">输入基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <Label htmlFor="restingHR" className="text-lg font-medium">
                    静息心率 (次/分)
                  </Label>
                  <Input
                    id="restingHR"
                    type="number"
                    placeholder="例如: 60"
                    value={restingHR}
                    onChange={(e) => setRestingHR(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
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
                <Label htmlFor="fitnessLevel" className="text-lg font-medium">
                  健身水平
                </Label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择健身水平" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">初学者</SelectItem>
                    <SelectItem value="medium">中等水平</SelectItem>
                    <SelectItem value="high">高级水平</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateHeartRateZones}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-lg py-3"
                  disabled={!age || !restingHR}
                >
                  计算心率区间
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
              <CardTitle className="text-2xl text-center">心率区间</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="text-center space-y-2 mb-6">
                    <div className="text-sm text-gray-600">最大心率</div>
                    <div className="text-3xl font-bold text-red-600">
                      {result.maxHR} bpm
                    </div>
                    <div className="text-sm text-gray-600">静息心率: {result.restingHR} bpm</div>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(result.zones).map(([key, zone]) => (
                      <div key={key} className={`p-4 rounded-lg ${zone.color}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">{zone.name}</h3>
                          <span className="font-bold text-xl">
                            {zone.min}-{zone.max} bpm
                          </span>
                        </div>
                        <p className="text-sm">{zone.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">❤️</div>
                  <p>请输入年龄和静息心率来计算心率区间</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 静息心率测量指南 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">如何测量静息心率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-600">📏 测量方法</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>最佳时间：</strong>早晨刚醒来时，还未起床</li>
                  <li>• <strong>测量位置：</strong>手腕桡动脉或颈部颈动脉</li>
                  <li>• <strong>测量时长：</strong>连续测量15秒，然后乘以4</li>
                  <li>• <strong>连续测量：</strong>连续3天取平均值更准确</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">📊 正常范围</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>成年人：</strong>60-100次/分钟</li>
                  <li>• <strong>运动员：</strong>40-60次/分钟</li>
                  <li>• <strong>老年人：</strong>可能略高于平均值</li>
                  <li>• <strong>注意：</strong>个体差异较大，以个人基线为准</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 训练建议 */}
        {result && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">训练建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">🏃‍♂️ 有氧训练</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>区间2-3：</strong>主要有氧训练区间</li>
                    <li>• <strong>持续时间：</strong>30-60分钟</li>
                    <li>• <strong>频率：</strong>每周3-5次</li>
                    <li>• <strong>活动：</strong>慢跑、游泳、骑行</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">💪 间歇训练</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>区间4-5：</strong>高强度间歇训练</li>
                    <li>• <strong>持续时间：</strong>20-30分钟</li>
                    <li>• <strong>频率：</strong>每周1-2次</li>
                    <li>• <strong>活动：</strong>冲刺、HIIT训练</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue-600">😌 恢复训练</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>区间1：</strong>主动恢复</li>
                    <li>• <strong>持续时间：</strong>20-45分钟</li>
                    <li>• <strong>频率：</strong>训练后或休息日</li>
                    <li>• <strong>活动：</strong>散步、瑜伽、拉伸</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 注意事项 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">重要提醒</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-yellow-600">⚠️ 安全提醒</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 运动前进行充分热身</li>
                  <li>• 循序渐进，避免过度训练</li>
                  <li>• 感觉不适时立即停止运动</li>
                  <li>• 有心脏疾病史请咨询医生</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-purple-600">📱 监测工具</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 心率监测器或智能手表</li>
                  <li>• 手机健康应用</li>
                  <li>• 定期记录训练数据</li>
                  <li>• 关注身体反应和感受</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}