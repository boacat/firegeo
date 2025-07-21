"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WaterIntakeCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [climate, setClimate] = useState("");
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateWaterIntake = () => {
    if (!age || !gender || !weight || !height) {
      alert("请填写必要信息（年龄、性别、体重、身高）");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const exerciseNum = exerciseDuration ? parseInt(exerciseDuration) : 0;

    if (ageNum <= 0 || ageNum > 120 || weightNum <= 0 || heightNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // 基础水分需求计算 (35ml/kg)
    let baseWater = weightNum * 35;

    // 性别调整
    if (gender === "female") {
      baseWater *= 0.9;
    }

    // 年龄调整
    if (ageNum > 65) {
      baseWater *= 0.9;
    } else if (ageNum < 18) {
      baseWater *= 1.1;
    }

    // 活动水平调整
    let activityMultiplier = 1.0;
    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1.0;
        break;
      case "light":
        activityMultiplier = 1.1;
        break;
      case "moderate":
        activityMultiplier = 1.3;
        break;
      case "active":
        activityMultiplier = 1.5;
        break;
      case "very_active":
        activityMultiplier = 1.7;
        break;
    }

    const withActivity = baseWater * activityMultiplier;

    // 运动额外需求
    const exerciseWater = exerciseNum * 12; // 12ml/分钟

    // 气候调整
    let climateAdjustment = 0;
    switch (climate) {
      case "hot_humid":
        climateAdjustment = 500;
        break;
      case "hot_dry":
        climateAdjustment = 700;
        break;
      case "cold_dry":
        climateAdjustment = 300;
        break;
      case "temperate":
        climateAdjustment = 0;
        break;
    }

    const totalWater = Math.round(withActivity + exerciseWater + climateAdjustment);
    const hourlyIntake = Math.round(totalWater / 16); // 假设16小时清醒时间

    // 水分状态评估
    const getHydrationStatus = (intake: number, weight: number) => {
      const ratio = intake / weight;
      
      if (ratio >= 40) {
        return {
          level: "充足",
          color: "green",
          description: "水分摄入充足"
        };
      } else if (ratio >= 30) {
        return {
          level: "适中",
          color: "blue",
          description: "水分摄入基本满足需求"
        };
      } else if (ratio >= 25) {
        return {
          level: "偏低",
          color: "yellow",
          description: "水分摄入略显不足"
        };
      } else {
        return {
          level: "不足",
          color: "red",
          description: "水分摄入严重不足"
        };
      }
    };

    const hydrationStatus = getHydrationStatus(totalWater, weightNum);

    // 饮水建议
    const getRecommendations = () => {
      const recommendations = [];
      
      if (totalWater > 3000) {
        recommendations.push("分次饮用，避免一次性大量饮水");
      }
      
      if (exerciseNum > 60) {
        recommendations.push("运动前、中、后都要补充水分");
      }
      
      if (climate === "hot_humid" || climate === "hot_dry") {
        recommendations.push("高温环境下需要增加电解质补充");
      }
      
      if (ageNum > 65) {
        recommendations.push("老年人要主动饮水，不要等到口渴");
      }
      
      recommendations.push("起床后先喝一杯温水");
      recommendations.push("餐前30分钟适量饮水");
      recommendations.push("睡前2小时减少饮水量");
      
      return recommendations;
    };

    const recommendations = getRecommendations();

    setResult({
      totalWater,
      hourlyIntake,
      hydrationStatus,
      recommendations,
      breakdown: {
        base: Math.round(baseWater),
        activity: Math.round(withActivity - baseWater),
        exercise: exerciseWater,
        climate: climateAdjustment
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💧 每日饮水量计算器</h1>
          <p className="text-lg text-gray-600">
            科学计算个人每日水分需求
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">体重 (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
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
              </CardContent>
            </Card>

            {/* 活动和环境 */}
            <Card>
              <CardHeader>
                <CardTitle>活动和环境</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="activityLevel">日常活动水平</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择活动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">久坐（办公室工作）</SelectItem>
                      <SelectItem value="light">轻度活动（轻松步行）</SelectItem>
                      <SelectItem value="moderate">中度活动（规律运动）</SelectItem>
                      <SelectItem value="active">活跃（每天运动）</SelectItem>
                      <SelectItem value="very_active">非常活跃（高强度训练）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="climate">气候环境</Label>
                  <Select value={climate} onValueChange={setClimate}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择气候环境" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperate">温带（舒适）</SelectItem>
                      <SelectItem value="hot_humid">炎热潮湿</SelectItem>
                      <SelectItem value="hot_dry">炎热干燥</SelectItem>
                      <SelectItem value="cold_dry">寒冷干燥</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exerciseDuration">运动时长（分钟/天）</Label>
                  <Input
                    id="exerciseDuration"
                    type="number"
                    placeholder="例如：60"
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateWaterIntake} className="w-full">
              计算饮水量
            </Button>
          </div>

          {/* 结果显示 */}
          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>每日饮水需求</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {result.totalWater} ml
                      </div>
                      <div className="text-lg text-gray-600">
                        约 {Math.round(result.totalWater / 250)} 杯水
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg bg-${result.hydrationStatus.color}-50 border border-${result.hydrationStatus.color}-200 mb-4`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">水分状态</span>
                        <span className={`text-${result.hydrationStatus.color}-700 font-medium`}>
                          {result.hydrationStatus.level}
                        </span>
                      </div>
                      <div className={`text-sm text-${result.hydrationStatus.color}-600 mt-1`}>
                        {result.hydrationStatus.description}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">每小时建议</div>
                        <div>{result.hourlyIntake} ml</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">每次饮水</div>
                        <div>200-250 ml</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>需求分解</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>基础需求</span>
                        <span>{result.breakdown.base} ml</span>
                      </div>
                      <div className="flex justify-between">
                        <span>活动调整</span>
                        <span>+{result.breakdown.activity} ml</span>
                      </div>
                      {result.breakdown.exercise > 0 && (
                        <div className="flex justify-between">
                          <span>运动补充</span>
                          <span>+{result.breakdown.exercise} ml</span>
                        </div>
                      )}
                      {result.breakdown.climate > 0 && (
                        <div className="flex justify-between">
                          <span>环境调整</span>
                          <span>+{result.breakdown.climate} ml</span>
                        </div>
                      )}
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>总计</span>
                        <span>{result.totalWater} ml</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>饮水建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="text-sm text-gray-700">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}