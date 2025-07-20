"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface WaterResult {
  baseWater: number;
  exerciseWater: number;
  climateWater: number;
  totalWater: number;
  cups: number;
  bottles: number;
}

export default function WaterCalculator() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [exerciseTime, setExerciseTime] = useState("");
  const [climate, setClimate] = useState("");
  const [pregnancy, setPregnancy] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [illness, setIllness] = useState(false);
  const [result, setResult] = useState<WaterResult | null>(null);

  const calculateWaterIntake = () => {
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age);
    const exerciseTimeNum = parseInt(exerciseTime) || 0;
    
    if (weightNum > 0 && ageNum > 0) {
      // 基础饮水量计算 (体重 × 35ml)
      let baseWater = weightNum * 35;
      
      // 年龄调整
      if (ageNum > 65) {
        baseWater *= 0.9; // 老年人代谢较慢
      } else if (ageNum < 18) {
        baseWater *= 1.1; // 青少年代谢较快
      }
      
      // 性别调整
      if (gender === "male") {
        baseWater *= 1.1; // 男性通常需要更多水分
      }
      
      // 活动水平调整
      let activityMultiplier = 1;
      switch (activityLevel) {
        case "sedentary":
          activityMultiplier = 0.9;
          break;
        case "light":
          activityMultiplier = 1;
          break;
        case "moderate":
          activityMultiplier = 1.1;
          break;
        case "active":
          activityMultiplier = 1.2;
          break;
        case "very_active":
          activityMultiplier = 1.3;
          break;
      }
      baseWater *= activityMultiplier;
      
      // 运动额外水分 (每小时运动增加500-750ml)
      const exerciseWater = exerciseTimeNum * 625;
      
      // 气候调整
      let climateWater = 0;
      switch (climate) {
        case "hot":
          climateWater = baseWater * 0.2; // 炎热天气增加20%
          break;
        case "cold":
          climateWater = baseWater * -0.1; // 寒冷天气减少10%
          break;
        case "humid":
          climateWater = baseWater * 0.15; // 潮湿环境增加15%
          break;
        case "dry":
          climateWater = baseWater * 0.1; // 干燥环境增加10%
          break;
        default:
          climateWater = 0;
      }
      
      // 特殊情况调整
      let specialAdjustment = 0;
      if (pregnancy) {
        specialAdjustment += 300; // 孕期增加300ml
      }
      if (breastfeeding) {
        specialAdjustment += 700; // 哺乳期增加700ml
      }
      if (illness) {
        specialAdjustment += baseWater * 0.15; // 生病时增加15%
      }
      
      const totalWater = Math.round(baseWater + exerciseWater + climateWater + specialAdjustment);
      const cups = Math.round(totalWater / 250); // 250ml一杯
      const bottles = Math.round(totalWater / 500); // 500ml一瓶
      
      setResult({
        baseWater: Math.round(baseWater),
        exerciseWater: Math.round(exerciseWater),
        climateWater: Math.round(climateWater + specialAdjustment),
        totalWater,
        cups,
        bottles
      });
    }
  };

  const reset = () => {
    setWeight("");
    setAge("");
    setGender("");
    setActivityLevel("");
    setExerciseTime("");
    setClimate("");
    setPregnancy(false);
    setBreastfeeding(false);
    setIllness(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            每日饮水量计算器
          </h1>
          <p className="text-xl text-gray-600">
            根据您的个人情况计算每日推荐饮水量，保持身体水分平衡
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">输入个人信息</CardTitle>
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
                <Label htmlFor="activityLevel" className="text-lg font-medium">
                  日常活动水平
                </Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择活动水平" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">久坐不动</SelectItem>
                    <SelectItem value="light">轻度活动</SelectItem>
                    <SelectItem value="moderate">中度活动</SelectItem>
                    <SelectItem value="active">积极活动</SelectItem>
                    <SelectItem value="very_active">高强度活动</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exerciseTime" className="text-lg font-medium">
                  每日运动时间 (小时)
                </Label>
                <Input
                  id="exerciseTime"
                  type="number"
                  placeholder="例如: 1"
                  value={exerciseTime}
                  onChange={(e) => setExerciseTime(e.target.value)}
                  className="text-lg p-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="climate" className="text-lg font-medium">
                  环境气候
                </Label>
                <Select value={climate} onValueChange={setClimate}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择环境气候" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">正常气候</SelectItem>
                    <SelectItem value="hot">炎热天气</SelectItem>
                    <SelectItem value="cold">寒冷天气</SelectItem>
                    <SelectItem value="humid">潮湿环境</SelectItem>
                    <SelectItem value="dry">干燥环境</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-medium">特殊情况 (可选)</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pregnancy" 
                      checked={pregnancy}
                      onCheckedChange={(checked) => setPregnancy(checked as boolean)}
                    />
                    <Label htmlFor="pregnancy">怀孕期间</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="breastfeeding" 
                      checked={breastfeeding}
                      onCheckedChange={(checked) => setBreastfeeding(checked as boolean)}
                    />
                    <Label htmlFor="breastfeeding">哺乳期间</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="illness" 
                      checked={illness}
                      onCheckedChange={(checked) => setIllness(checked as boolean)}
                    />
                    <Label htmlFor="illness">感冒发烧等疾病</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateWaterIntake}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={!weight || !age || !gender}
                >
                  计算饮水量
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
              <CardTitle className="text-2xl text-center">推荐饮水量</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-blue-600">
                      {result.totalWater} ml
                    </div>
                    <div className="text-xl text-gray-600">
                      每日推荐饮水量
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.cups}</div>
                      <div className="text-sm text-gray-600">杯 (250ml/杯)</div>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-600">{result.bottles}</div>
                      <div className="text-sm text-gray-600">瓶 (500ml/瓶)</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold text-center mb-3">饮水量构成：</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>基础需水量:</span>
                        <span className="font-semibold">{result.baseWater} ml</span>
                      </div>
                      {result.exerciseWater > 0 && (
                        <div className="flex justify-between">
                          <span>运动补充:</span>
                          <span className="font-semibold text-orange-600">+{result.exerciseWater} ml</span>
                        </div>
                      )}
                      {result.climateWater !== 0 && (
                        <div className="flex justify-between">
                          <span>环境调整:</span>
                          <span className={`font-semibold ${result.climateWater > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                            {result.climateWater > 0 ? '+' : ''}{result.climateWater} ml
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">💧</div>
                  <p>请输入基本信息来计算每日饮水量</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 饮水时间建议 */}
        {result && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">饮水时间安排</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🌅</div>
                  <h3 className="font-semibold mb-2">早晨 (6-8点)</h3>
                  <p className="text-sm text-gray-600">起床后喝1-2杯温水，补充夜间流失的水分</p>
                  <div className="text-lg font-bold text-yellow-600 mt-2">500ml</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <h3 className="font-semibold mb-2">上午 (8-12点)</h3>
                  <p className="text-sm text-gray-600">工作期间少量多次，保持身体水分</p>
                  <div className="text-lg font-bold text-green-600 mt-2">{Math.round(result.totalWater * 0.3)}ml</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🌤️</div>
                  <h3 className="font-semibold mb-2">下午 (12-18点)</h3>
                  <p className="text-sm text-gray-600">餐后1小时开始，持续补充水分</p>
                  <div className="text-lg font-bold text-blue-600 mt-2">{Math.round(result.totalWater * 0.4)}ml</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🌙</div>
                  <h3 className="font-semibold mb-2">晚上 (18-22点)</h3>
                  <p className="text-sm text-gray-600">适量饮水，睡前2小时减少摄入</p>
                  <div className="text-lg font-bold text-purple-600 mt-2">{Math.round(result.totalWater * 0.3)}ml</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 饮水小贴士 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">健康饮水小贴士</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">💡 饮水技巧</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 少量多次，避免一次性大量饮水</li>
                  <li>• 温水最佳，避免过冷或过热</li>
                  <li>• 运动前、中、后都要补充水分</li>
                  <li>• 感到口渴时已经轻度脱水了</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">🚰 水质选择</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 优选纯净水或矿泉水</li>
                  <li>• 白开水是最经济的选择</li>
                  <li>• 避免含糖饮料代替白水</li>
                  <li>• 茶水、汤类也可计入饮水量</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 脱水症状提醒 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">脱水症状识别</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">😐</div>
                <h3 className="font-semibold text-lg mb-3 text-yellow-600">轻度脱水</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 口渴感明显</li>
                  <li>• 尿液颜色较深</li>
                  <li>• 皮肤弹性下降</li>
                  <li>• 轻微头痛</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">😰</div>
                <h3 className="font-semibold text-lg mb-3 text-orange-600">中度脱水</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 明显疲劳感</li>
                  <li>• 头晕目眩</li>
                  <li>• 心率加快</li>
                  <li>• 注意力不集中</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🚨</div>
                <h3 className="font-semibold text-lg mb-3 text-red-600">重度脱水</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 严重头痛</li>
                  <li>• 恶心呕吐</li>
                  <li>• 肌肉痉挛</li>
                  <li>• 需要立即就医</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}