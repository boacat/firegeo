"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function CalorieBurnCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [result, setResult] = useState<any>(null);

  // 运动MET值数据库
  const activities = {
    // 有氧运动
    walking: {
      name: "步行",
      category: "有氧运动",
      mets: { light: 2.5, moderate: 3.5, vigorous: 4.5 },
      description: "日常步行、散步"
    },
    running: {
      name: "跑步",
      category: "有氧运动",
      mets: { light: 6.0, moderate: 8.0, vigorous: 11.0 },
      description: "慢跑到快跑"
    },
    cycling: {
      name: "骑自行车",
      category: "有氧运动",
      mets: { light: 4.0, moderate: 6.8, vigorous: 10.0 },
      description: "休闲到竞技骑行"
    },
    swimming: {
      name: "游泳",
      category: "有氧运动",
      mets: { light: 4.0, moderate: 6.0, vigorous: 8.0 },
      description: "自由泳、蛙泳等"
    },
    dancing: {
      name: "跳舞",
      category: "有氧运动",
      mets: { light: 3.0, moderate: 4.8, vigorous: 6.5 },
      description: "社交舞到有氧舞蹈"
    },
    hiking: {
      name: "徒步登山",
      category: "有氧运动",
      mets: { light: 4.0, moderate: 6.0, vigorous: 8.0 },
      description: "平地到山地徒步"
    },
    
    // 力量训练
    weightlifting: {
      name: "举重训练",
      category: "力量训练",
      mets: { light: 3.0, moderate: 5.0, vigorous: 6.0 },
      description: "自由重量和器械训练"
    },
    bodyweight: {
      name: "自重训练",
      category: "力量训练",
      mets: { light: 3.5, moderate: 5.0, vigorous: 7.0 },
      description: "俯卧撑、引体向上等"
    },
    
    // 球类运动
    basketball: {
      name: "篮球",
      category: "球类运动",
      mets: { light: 4.5, moderate: 6.5, vigorous: 8.0 },
      description: "休闲到竞技篮球"
    },
    football: {
      name: "足球",
      category: "球类运动",
      mets: { light: 5.0, moderate: 7.0, vigorous: 9.0 },
      description: "休闲到竞技足球"
    },
    tennis: {
      name: "网球",
      category: "球类运动",
      mets: { light: 4.0, moderate: 6.0, vigorous: 8.0 },
      description: "单打双打网球"
    },
    badminton: {
      name: "羽毛球",
      category: "球类运动",
      mets: { light: 4.0, moderate: 5.5, vigorous: 7.0 },
      description: "休闲到竞技羽毛球"
    },
    
    // 其他运动
    yoga: {
      name: "瑜伽",
      category: "其他运动",
      mets: { light: 2.5, moderate: 3.0, vigorous: 4.0 },
      description: "哈他到热瑜伽"
    },
    pilates: {
      name: "普拉提",
      category: "其他运动",
      mets: { light: 3.0, moderate: 4.0, vigorous: 5.0 },
      description: "垫上到器械普拉提"
    },
    rowing: {
      name: "划船",
      category: "其他运动",
      mets: { light: 4.0, moderate: 7.0, vigorous: 10.0 },
      description: "划船机或真实划船"
    },
    boxing: {
      name: "拳击",
      category: "其他运动",
      mets: { light: 5.0, moderate: 7.8, vigorous: 10.0 },
      description: "拳击训练和比赛"
    },
    
    // 日常活动
    housework: {
      name: "家务劳动",
      category: "日常活动",
      mets: { light: 2.0, moderate: 3.0, vigorous: 4.0 },
      description: "清洁、整理等家务"
    },
    gardening: {
      name: "园艺工作",
      category: "日常活动",
      mets: { light: 2.5, moderate: 4.0, vigorous: 5.0 },
      description: "种植、除草等园艺"
    },
    stairs: {
      name: "爬楼梯",
      category: "日常活动",
      mets: { light: 4.0, moderate: 6.0, vigorous: 8.0 },
      description: "上下楼梯"
    }
  };

  const calculateCalorieBurn = () => {
    if (!weight || !activity || !duration) {
      alert("请填写所有必填信息");
      return;
    }

    const w = parseFloat(weight);
    const d = parseFloat(duration);

    if (w <= 0 || d <= 0) {
      alert("请输入有效的数值");
      return;
    }

    const selectedActivity = activities[activity as keyof typeof activities];
    const met = selectedActivity.mets[intensity as keyof typeof selectedActivity.mets];

    // 卡路里计算公式: 卡路里 = MET × 体重(kg) × 时间(小时)
    const caloriesBurned = met * w * (d / 60);

    // 脂肪燃烧量 (1克脂肪 ≈ 9卡路里)
    const fatBurned = caloriesBurned / 9;

    // 不同体重的消耗对比
    const weightComparison = {
      "50kg": Math.round(met * 50 * (d / 60)),
      "60kg": Math.round(met * 60 * (d / 60)),
      "70kg": Math.round(met * 70 * (d / 60)),
      "80kg": Math.round(met * 80 * (d / 60)),
      "90kg": Math.round(met * 90 * (d / 60))
    };

    // 不同时长的消耗
    const durationComparison = {
      "15分钟": Math.round(met * w * 0.25),
      "30分钟": Math.round(met * w * 0.5),
      "45分钟": Math.round(met * w * 0.75),
      "60分钟": Math.round(met * w * 1),
      "90分钟": Math.round(met * w * 1.5)
    };

    // 食物等效物
    const foodEquivalents = {
      "苹果 (80卡)": Math.round(caloriesBurned / 80 * 10) / 10,
      "香蕉 (105卡)": Math.round(caloriesBurned / 105 * 10) / 10,
      "米饭 (150卡/碗)": Math.round(caloriesBurned / 150 * 10) / 10,
      "巧克力 (50卡/块)": Math.round(caloriesBurned / 50 * 10) / 10,
      "可乐 (140卡/罐)": Math.round(caloriesBurned / 140 * 10) / 10
    };

    // 减重效果估算
    const weightLossEstimate = {
      daily: caloriesBurned / 7700, // 1kg脂肪 ≈ 7700卡路里
      weekly: (caloriesBurned * 7) / 7700,
      monthly: (caloriesBurned * 30) / 7700
    };

    // 强度分类
    const intensityInfo = {
      light: { name: "轻度", description: "轻松对话，微微出汗", heartRate: "50-60%最大心率" },
      moderate: { name: "中度", description: "可以对话，明显出汗", heartRate: "60-70%最大心率" },
      vigorous: { name: "高强度", description: "难以对话，大量出汗", heartRate: "70-85%最大心率" }
    };

    setResult({
      caloriesBurned: Math.round(caloriesBurned),
      fatBurned: Math.round(fatBurned * 10) / 10,
      met,
      activity: selectedActivity,
      intensity: intensityInfo[intensity as keyof typeof intensityInfo],
      weightComparison,
      durationComparison,
      foodEquivalents,
      weightLossEstimate,
      inputData: { weight: w, duration: d, activity, intensity }
    });
  };

  const resetForm = () => {
    setWeight("");
    setActivity("");
    setDuration("");
    setIntensity("moderate");
    setResult(null);
  };

  // 按分类组织活动
  const categorizedActivities = Object.entries(activities).reduce((acc, [key, activity]) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push({ key, ...activity });
    return acc;
  }, {} as any);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔥 卡路里燃烧计算器</h1>
          <p className="text-lg text-gray-600">
            计算各种运动和活动的卡路里消耗，制定科学的减重计划
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle>运动信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="activity">运动类型 *</Label>
                <Select value={activity} onValueChange={setActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择运动类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categorizedActivities).map(([category, activities]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-semibold text-gray-500">{category}</div>
                        {(activities as any[]).map((act) => (
                          <SelectItem key={act.key} value={act.key}>
                            {act.name} - {act.description}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">运动时长 (分钟) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="例如：30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="intensity">运动强度</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择运动强度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">轻度 - 轻松对话，微微出汗</SelectItem>
                    <SelectItem value="moderate">中度 - 可以对话，明显出汗</SelectItem>
                    <SelectItem value="vigorous">高强度 - 难以对话，大量出汗</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateCalorieBurn} className="flex-1">
                  计算消耗
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
                <CardTitle>消耗结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600">{result.caloriesBurned}</div>
                      <div className="text-sm text-gray-600">卡路里消耗</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.activity.name} - {result.intensity.name}强度
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-xl font-bold text-red-600">{result.fatBurned}g</div>
                    <div className="text-sm text-gray-600">脂肪燃烧</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-xl font-bold text-blue-600">{result.met}</div>
                    <div className="text-sm text-gray-600">MET值</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">运动强度信息</h4>
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    <div className="font-medium">{result.intensity.name}强度</div>
                    <div className="text-gray-600">{result.intensity.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{result.intensity.heartRate}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 详细分析 */}
        {result && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* 体重对比 */}
            <Card>
              <CardHeader>
                <CardTitle>不同体重消耗对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(result.weightComparison).map(([weight, calories]) => (
                    <div key={weight} className={`flex justify-between p-2 rounded ${
                      weight === `${result.inputData.weight}kg` ? 'bg-orange-100 border-2 border-orange-300' : 'bg-gray-50'
                    }`}>
                      <span>{weight}:</span>
                      <span className="font-semibold">{calories} 卡</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 时长对比 */}
            <Card>
              <CardHeader>
                <CardTitle>不同时长消耗对比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(result.durationComparison).map(([duration, calories]) => (
                    <div key={duration} className={`flex justify-between p-2 rounded ${
                      duration === `${result.inputData.duration}分钟` ? 'bg-orange-100 border-2 border-orange-300' : 'bg-gray-50'
                    }`}>
                      <span>{duration}:</span>
                      <span className="font-semibold">{calories} 卡</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 食物等效物和减重效果 */}
        {result && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* 食物等效物 */}
            <Card>
              <CardHeader>
                <CardTitle>食物等效物</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">您消耗的卡路里相当于:</p>
                <div className="space-y-2">
                  {Object.entries(result.foodEquivalents).map(([food, amount]) => (
                    <div key={food} className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span>{food}:</span>
                      <span className="font-semibold">{amount} 个/碗/块/罐</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 减重效果 */}
            <Card>
              <CardHeader>
                <CardTitle>减重效果估算</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(result.weightLossEstimate.daily * 1000)} g
                    </div>
                    <div className="text-sm text-gray-600">单次运动减重</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round(result.weightLossEstimate.weekly * 100) / 100} kg
                    </div>
                    <div className="text-sm text-gray-600">每周坚持减重</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.round(result.weightLossEstimate.monthly * 100) / 100} kg
                    </div>
                    <div className="text-sm text-gray-600">每月坚持减重</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * 减重效果基于理论计算，实际效果因人而异
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 运动建议 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 运动建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">高效燃脂运动</h3>
                <ul className="text-sm space-y-1">
                  <li>• 跑步：全身有氧，消耗量大</li>
                  <li>• 游泳：低冲击，全身运动</li>
                  <li>• 骑车：下肢主导，持续性强</li>
                  <li>• HIIT：高强度间歇，后燃效应</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">运动频率建议</h3>
                <ul className="text-sm space-y-1">
                  <li>• 有氧运动：每周150-300分钟</li>
                  <li>• 力量训练：每周2-3次</li>
                  <li>• 高强度运动：每周75-150分钟</li>
                  <li>• 日常活动：每天至少30分钟</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">提高消耗的方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• 增加运动强度和时长</li>
                  <li>• 结合力量训练增加肌肉量</li>
                  <li>• 选择全身性运动</li>
                  <li>• 保持运动的多样性</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 循序渐进，避免运动伤害</li>
                  <li>• 运动前后充分热身和拉伸</li>
                  <li>• 保持充足的水分补充</li>
                  <li>• 结合合理饮食控制</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}