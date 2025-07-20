"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function ExerciseCalorieCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [result, setResult] = useState<any>(null);

  // 运动MET值数据库
  const exerciseDatabase: { [key: string]: { [key: string]: number } } = {
    running: {
      light: 6.0,    // 慢跑 6-8 km/h
      moderate: 8.3, // 中速跑 8-10 km/h
      vigorous: 11.0 // 快跑 >10 km/h
    },
    cycling: {
      light: 4.0,    // 休闲骑行 <16 km/h
      moderate: 6.8, // 中速骑行 16-19 km/h
      vigorous: 10.0 // 快速骑行 >19 km/h
    },
    swimming: {
      light: 6.0,    // 慢游
      moderate: 8.3, // 中速游泳
      vigorous: 11.0 // 快速游泳
    },
    walking: {
      light: 2.5,    // 慢走 <4 km/h
      moderate: 3.8, // 中速走 4-5 km/h
      vigorous: 5.0  // 快走 >5 km/h
    },
    basketball: {
      light: 4.5,    // 投篮练习
      moderate: 6.5, // 半场比赛
      vigorous: 8.0  // 全场比赛
    },
    football: {
      light: 5.0,    // 传球练习
      moderate: 7.0, // 训练
      vigorous: 10.0 // 比赛
    },
    tennis: {
      light: 5.0,    // 双打
      moderate: 7.3, // 单打
      vigorous: 8.0  // 竞技单打
    },
    badminton: {
      light: 4.5,    // 休闲
      moderate: 5.5, // 一般
      vigorous: 7.0  // 竞技
    },
    yoga: {
      light: 2.5,    // 哈他瑜伽
      moderate: 3.0, // 流瑜伽
      vigorous: 4.0  // 热瑜伽
    },
    weightlifting: {
      light: 3.0,    // 轻重量
      moderate: 5.0, // 中等重量
      vigorous: 6.0  // 大重量
    },
    dancing: {
      light: 3.0,    // 慢舞
      moderate: 4.8, // 一般舞蹈
      vigorous: 7.8  // 激烈舞蹈
    },
    hiking: {
      light: 4.0,    // 平地徒步
      moderate: 6.0, // 山地徒步
      vigorous: 8.0  // 负重登山
    }
  };

  const exerciseNames: { [key: string]: string } = {
    running: "跑步",
    cycling: "骑行",
    swimming: "游泳",
    walking: "步行",
    basketball: "篮球",
    football: "足球",
    tennis: "网球",
    badminton: "羽毛球",
    yoga: "瑜伽",
    weightlifting: "举重",
    dancing: "舞蹈",
    hiking: "徒步"
  };

  const intensityNames: { [key: string]: string } = {
    light: "轻度",
    moderate: "中度",
    vigorous: "高强度"
  };

  const calculateCalories = () => {
    if (!weight || !exercise || !duration || !intensity) {
      alert("请填写所有必填项");
      return;
    }

    const w = parseFloat(weight);
    const d = parseFloat(duration);
    const met = exerciseDatabase[exercise][intensity];

    // 卡路里消耗公式: MET × 体重(kg) × 时间(小时)
    const caloriesBurned = met * w * (d / 60);
    
    // 脂肪燃烧量 (1g脂肪 ≈ 9卡路里)
    const fatBurned = caloriesBurned / 9;
    
    // 相当于食物
    const foodEquivalents = {
      rice: Math.round(caloriesBurned / 116), // 100g米饭
      apple: Math.round(caloriesBurned / 52), // 1个苹果
      chocolate: Math.round(caloriesBurned / 546), // 100g巧克力
      coke: Math.round(caloriesBurned / 43) // 100ml可乐
    };

    // 不同体重的消耗对比
    const weightComparison = {
      lighter: Math.round(met * (w - 10) * (d / 60)),
      heavier: Math.round(met * (w + 10) * (d / 60))
    };

    setResult({
      caloriesBurned: Math.round(caloriesBurned),
      fatBurned: fatBurned.toFixed(1),
      met,
      exerciseName: exerciseNames[exercise],
      intensityName: intensityNames[intensity],
      foodEquivalents,
      weightComparison
    });
  };

  const resetForm = () => {
    setWeight("");
    setExercise("");
    setDuration("");
    setIntensity("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏃 运动消耗计算器</h1>
          <p className="text-lg text-gray-600">
            精确计算各种运动的卡路里消耗，科学指导您的健身计划
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
                <Label htmlFor="exercise">运动类型 *</Label>
                <Select value={exercise} onValueChange={setExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择运动类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(exerciseNames).map(([key, name]) => (
                      <SelectItem key={key} value={key}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="intensity">运动强度 *</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择运动强度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">轻度 - 轻松，可以正常对话</SelectItem>
                    <SelectItem value="moderate">中度 - 稍微费力，对话略困难</SelectItem>
                    <SelectItem value="vigorous">高强度 - 很费力，难以对话</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">运动时间 (分钟) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="例如：30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateCalories} className="flex-1">
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
                      <div className="text-3xl font-bold text-green-600">{result.caloriesBurned}</div>
                      <div className="text-sm text-gray-600">卡路里消耗</div>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-semibold text-blue-600">{result.fatBurned}g</div>
                    <div className="text-xs text-gray-600">脂肪燃烧</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-semibold text-purple-600">{result.met}</div>
                    <div className="text-xs text-gray-600">MET值</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">相当于消耗</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>🍚 米饭:</span>
                      <span>{result.foodEquivalents.rice} 碗</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🍎 苹果:</span>
                      <span>{result.foodEquivalents.apple} 个</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🍫 巧克力:</span>
                      <span>{result.foodEquivalents.chocolate} 块</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🥤 可乐:</span>
                      <span>{result.foodEquivalents.coke} 杯</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">体重对比</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>体重-10kg:</span>
                      <span>{result.weightComparison.lighter} 卡路里</span>
                    </div>
                    <div className="flex justify-between">
                      <span>体重+10kg:</span>
                      <span>{result.weightComparison.heavier} 卡路里</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 运动指南 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🔥 高消耗运动</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 跑步 (8-12 MET)</li>
                <li>• 游泳 (6-11 MET)</li>
                <li>• 骑行 (4-10 MET)</li>
                <li>• 足球 (5-10 MET)</li>
                <li>• 篮球 (4.5-8 MET)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">⚖️ 中等消耗运动</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 网球 (5-8 MET)</li>
                <li>• 羽毛球 (4.5-7 MET)</li>
                <li>• 举重 (3-6 MET)</li>
                <li>• 舞蹈 (3-7.8 MET)</li>
                <li>• 徒步 (4-8 MET)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">🧘 低消耗运动</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• 瑜伽 (2.5-4 MET)</li>
                <li>• 步行 (2.5-5 MET)</li>
                <li>• 太极 (3-4 MET)</li>
                <li>• 拉伸 (2.3 MET)</li>
                <li>• 慢舞 (3 MET)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 运动建议 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 运动建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">减重建议</h3>
                <ul className="text-sm space-y-1">
                  <li>• 每周至少150分钟中等强度运动</li>
                  <li>• 或75分钟高强度运动</li>
                  <li>• 结合有氧和力量训练</li>
                  <li>• 创造每日300-500卡路里缺口</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 运动前充分热身</li>
                  <li>• 根据体能循序渐进</li>
                  <li>• 注意补充水分</li>
                  <li>• 运动后适当拉伸</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <li>• 基于MET (代谢当量) 值计算</li>
                  <li>• 公式：MET × 体重 × 时间</li>
                  <li>• 考虑运动强度差异</li>
                  <li>• 数据来源于运动生理学研究</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">准确性说明</h3>
                <ul className="text-sm space-y-1">
                  <li>• 结果为估算值，个体差异较大</li>
                  <li>• 实际消耗受体能、技术等影响</li>
                  <li>• 建议结合心率监测设备</li>
                  <li>• 仅供健身参考，不替代专业指导</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}