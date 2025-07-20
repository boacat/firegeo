"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function HeartRateZoneCalculatorPage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [method, setMethod] = useState("karvonen");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateHeartRateZones = () => {
    if (!age) {
      alert("请填写年龄");
      return;
    }

    if (method === "karvonen" && !restingHR) {
      alert("使用Karvonen公式需要填写静息心率");
      return;
    }

    const ageNum = parseInt(age);
    const restingHRNum = restingHR ? parseInt(restingHR) : 60;

    if (ageNum <= 0 || ageNum > 120) {
      alert("请输入有效的年龄");
      return;
    }

    if (restingHRNum < 40 || restingHRNum > 100) {
      alert("静息心率应在40-100之间");
      return;
    }

    // 计算最大心率
    let maxHR;
    if (method === "simple") {
      maxHR = 220 - ageNum;
    } else if (method === "tanaka") {
      maxHR = 208 - (0.7 * ageNum);
    } else {
      maxHR = 220 - ageNum; // Karvonen也使用这个公式计算最大心率
    }

    // 心率储备 (仅Karvonen公式使用)
    const hrReserve = maxHR - restingHRNum;

    // 定义心率区间
    const zones = {
      zone1: {
        name: "恢复区间",
        description: "主动恢复，促进血液循环",
        color: "bg-blue-500",
        benefits: ["促进恢复", "改善血液循环", "燃烧脂肪", "建立有氧基础"],
        activities: ["散步", "轻松骑车", "瑜伽", "太极"]
      },
      zone2: {
        name: "有氧基础区间",
        description: "脂肪燃烧，有氧耐力训练",
        color: "bg-green-500",
        benefits: ["脂肪燃烧", "有氧耐力", "心血管健康", "新陈代谢"],
        activities: ["慢跑", "游泳", "骑车", "椭圆机"]
      },
      zone3: {
        name: "有氧区间",
        description: "有氧能力提升，乳酸阈值训练",
        color: "bg-yellow-500",
        benefits: ["有氧能力", "乳酸清除", "耐力提升", "心肺功能"],
        activities: ["节奏跑", "间歇训练", "爬山", "划船"]
      },
      zone4: {
        name: "乳酸阈值区间",
        description: "无氧阈值训练，速度耐力",
        color: "bg-orange-500",
        benefits: ["无氧阈值", "速度耐力", "乳酸缓冲", "竞技能力"],
        activities: ["间歇跑", "时间试验", "爬坡训练", "高强度骑车"]
      },
      zone5: {
        name: "无氧区间",
        description: "最大摄氧量训练，爆发力",
        color: "bg-red-500",
        benefits: ["最大摄氧量", "爆发力", "神经肌肉", "峰值功率"],
        activities: ["冲刺跑", "HIIT训练", "爬楼梯", "短距离全力"]
      }
    };

    // 计算各区间心率
    let zoneRanges: { [key: string]: { min: number; max: number; percentage: string } } = {};

    if (method === "karvonen") {
      // Karvonen公式: 目标心率 = (最大心率 - 静息心率) × 强度% + 静息心率
      zoneRanges = {
        zone1: {
          min: Math.round(hrReserve * 0.50 + restingHRNum),
          max: Math.round(hrReserve * 0.60 + restingHRNum),
          percentage: "50-60%"
        },
        zone2: {
          min: Math.round(hrReserve * 0.60 + restingHRNum),
          max: Math.round(hrReserve * 0.70 + restingHRNum),
          percentage: "60-70%"
        },
        zone3: {
          min: Math.round(hrReserve * 0.70 + restingHRNum),
          max: Math.round(hrReserve * 0.80 + restingHRNum),
          percentage: "70-80%"
        },
        zone4: {
          min: Math.round(hrReserve * 0.80 + restingHRNum),
          max: Math.round(hrReserve * 0.90 + restingHRNum),
          percentage: "80-90%"
        },
        zone5: {
          min: Math.round(hrReserve * 0.90 + restingHRNum),
          max: Math.round(maxHR),
          percentage: "90-100%"
        }
      };
    } else {
      // 简单百分比法
      zoneRanges = {
        zone1: {
          min: Math.round(maxHR * 0.50),
          max: Math.round(maxHR * 0.60),
          percentage: "50-60%"
        },
        zone2: {
          min: Math.round(maxHR * 0.60),
          max: Math.round(maxHR * 0.70),
          percentage: "60-70%"
        },
        zone3: {
          min: Math.round(maxHR * 0.70),
          max: Math.round(maxHR * 0.80),
          percentage: "70-80%"
        },
        zone4: {
          min: Math.round(maxHR * 0.80),
          max: Math.round(maxHR * 0.90),
          percentage: "80-90%"
        },
        zone5: {
          min: Math.round(maxHR * 0.90),
          max: Math.round(maxHR),
          percentage: "90-100%"
        }
      };
    }

    // 训练建议
    const trainingRecommendations = {
      beginner: {
        zone1: "30-45分钟，每周3-4次",
        zone2: "20-40分钟，每周2-3次",
        zone3: "15-30分钟，每周1-2次",
        zone4: "5-15分钟，每周1次",
        zone5: "2-8分钟，每周1次"
      },
      intermediate: {
        zone1: "45-60分钟，每周2-3次",
        zone2: "30-60分钟，每周3-4次",
        zone3: "20-45分钟，每周2-3次",
        zone4: "10-30分钟，每周1-2次",
        zone5: "5-15分钟，每周1-2次"
      },
      advanced: {
        zone1: "60-90分钟，每周2-3次",
        zone2: "45-90分钟，每周3-5次",
        zone3: "30-60分钟，每周2-4次",
        zone4: "15-45分钟，每周2-3次",
        zone5: "8-20分钟，每周2-3次"
      }
    };

    // 脂肪燃烧区间
    const fatBurnZone = {
      min: Math.round(maxHR * 0.60),
      max: Math.round(maxHR * 0.70),
      optimal: Math.round(maxHR * 0.65)
    };

    setResult({
      maxHR: Math.round(maxHR),
      restingHR: restingHRNum,
      hrReserve: Math.round(hrReserve),
      zones,
      zoneRanges,
      method,
      trainingRecommendations,
      fatBurnZone,
      inputData: { age: ageNum, restingHR: restingHRNum, fitnessLevel }
    });
  };

  const resetForm = () => {
    setAge("");
    setRestingHR("");
    setMethod("karvonen");
    setFitnessLevel("");
    setResult(null);
  };

  const methodNames: { [key: string]: string } = {
    karvonen: "Karvonen公式 (推荐)",
    simple: "简单公式 (220-年龄)",
    tanaka: "Tanaka公式"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">❤️ 心率区间计算器</h1>
          <p className="text-lg text-gray-600">
            计算个人心率训练区间，优化运动效果和训练强度
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="method">计算方法</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择计算方法" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karvonen">Karvonen公式 (最准确)</SelectItem>
                    <SelectItem value="simple">简单公式 (220-年龄)</SelectItem>
                    <SelectItem value="tanaka">Tanaka公式</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {method === "karvonen" && (
                <div>
                  <Label htmlFor="restingHR">静息心率 (bpm) *</Label>
                  <Input
                    id="restingHR"
                    type="number"
                    placeholder="例如：60"
                    value={restingHR}
                    onChange={(e) => setRestingHR(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    早晨醒来时测量，正常范围：50-100 bpm
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="fitness">健身水平</Label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择健身水平 (可选)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">初学者 (很少运动)</SelectItem>
                    <SelectItem value="intermediate">中级 (定期运动)</SelectItem>
                    <SelectItem value="advanced">高级 (专业训练)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateHeartRateZones} className="flex-1">
                  计算心率区间
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 基本结果 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>心率数据</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{result.maxHR}</div>
                        <div className="text-sm text-gray-600">最大心率 (bpm)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{result.restingHR}</div>
                        <div className="text-sm text-gray-600">静息心率 (bpm)</div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {result.method === "karvonen" && (
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-xl font-bold text-green-600">{result.hrReserve}</div>
                    <div className="text-sm text-gray-600">心率储备 (bpm)</div>
                  </div>
                )}

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">脂肪燃烧区间</h4>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-600">
                      {result.fatBurnZone.min} - {result.fatBurnZone.max} bpm
                    </div>
                    <div className="text-sm text-gray-600">
                      最佳脂肪燃烧: {result.fatBurnZone.optimal} bpm
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 心率区间详情 */}
        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">心率训练区间</h2>
            <div className="space-y-4">
              {Object.entries(result.zones).map(([zoneKey, zone]: [string, any]) => {
                const range = result.zoneRanges[zoneKey];
                const recommendation = result.inputData.fitnessLevel ? 
                  result.trainingRecommendations[result.inputData.fitnessLevel][zoneKey] : null;
                
                return (
                  <Card key={zoneKey} className="border-l-4" style={{borderLeftColor: zone.color.replace('bg-', '#')}}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{zone.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                          <div className="text-2xl font-bold text-gray-900">
                            {range.min} - {range.max}
                          </div>
                          <div className="text-sm text-gray-500">bpm ({range.percentage})</div>
                          {recommendation && (
                            <div className="text-xs text-blue-600 mt-1">{recommendation}</div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">训练效果</h4>
                          <ul className="text-sm space-y-1">
                            {zone.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">推荐活动</h4>
                          <ul className="text-sm space-y-1">
                            {zone.activities.map((activity: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-full">
                            <Progress 
                              value={(range.max / result.maxHR) * 100} 
                              className="h-3"
                            />
                            <div className="text-xs text-center mt-1">
                              {Math.round((range.max / result.maxHR) * 100)}% 最大心率
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* 训练建议 */}
        {result && result.inputData.fitnessLevel && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>个性化训练建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">每周训练分配</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(result.trainingRecommendations[result.inputData.fitnessLevel]).map(([zone, rec]: [string, any]) => (
                      <div key={zone} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{result.zones[zone].name}:</span>
                        <span className="font-semibold">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">训练原则</h3>
                  <ul className="text-sm space-y-1">
                    <li>• 80%的训练时间应在区间1-2</li>
                    <li>• 20%的训练时间在区间3-5</li>
                    <li>• 循序渐进，避免过度训练</li>
                    <li>• 定期监测心率变化</li>
                    <li>• 结合主观感受调整强度</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 心率监测指南 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📱 心率监测指南</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">测量方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• 手腕脉搏：桡动脉，15秒×4</li>
                  <li>• 颈部脉搏：颈动脉，轻压测量</li>
                  <li>• 心率监测器：胸带式最准确</li>
                  <li>• 智能手表：方便但可能有误差</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">静息心率测量</h3>
                <ul className="text-sm space-y-1">
                  <li>• 早晨醒来后立即测量</li>
                  <li>• 保持平躺或坐姿</li>
                  <li>• 连续测量3-5天取平均值</li>
                  <li>• 避免咖啡因和压力影响</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">训练中监测</h3>
                <ul className="text-sm space-y-1">
                  <li>• 定期检查心率是否在目标区间</li>
                  <li>• 结合RPE量表(主观感受)</li>
                  <li>• 注意心率异常变化</li>
                  <li>• 记录训练数据</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 药物可能影响心率</li>
                  <li>• 疾病时避免高强度训练</li>
                  <li>• 心率异常请咨询医生</li>
                  <li>• 个体差异较大，灵活调整</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}