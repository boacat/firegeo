"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProteinResult {
  baseProtein: number;
  adjustedProtein: number;
  minProtein: number;
  maxProtein: number;
  proteinPerMeal: number;
  proteinSources: {
    chicken: number;
    fish: number;
    beef: number;
    eggs: number;
    milk: number;
    tofu: number;
    beans: number;
  };
}

export default function ProteinCalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [pregnancy, setPregnancy] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [illness, setIllness] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [result, setResult] = useState<ProteinResult | null>(null);

  const calculateProtein = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);
    
    if (weightNum > 0 && heightNum > 0 && ageNum > 0 && gender && activityLevel && goal) {
      // 基础蛋白质需求 (g/kg体重)
      let baseProteinPerKg = 0.8; // RDA推荐值
      
      // 根据活动水平调整
      switch (activityLevel) {
        case "sedentary":
          baseProteinPerKg = 0.8;
          break;
        case "light":
          baseProteinPerKg = 1.0;
          break;
        case "moderate":
          baseProteinPerKg = 1.2;
          break;
        case "active":
          baseProteinPerKg = 1.4;
          break;
        case "very_active":
          baseProteinPerKg = 1.6;
          break;
        case "athlete":
          baseProteinPerKg = 1.8;
          break;
      }
      
      // 根据目标调整
      switch (goal) {
        case "maintain":
          // 保持当前值
          break;
        case "lose_weight":
          baseProteinPerKg *= 1.2; // 减重时增加蛋白质保护肌肉
          break;
        case "gain_muscle":
          baseProteinPerKg *= 1.4; // 增肌时大幅增加蛋白质
          break;
        case "gain_weight":
          baseProteinPerKg *= 1.1; // 增重时适度增加
          break;
      }
      
      // 年龄调整
      if (ageNum > 65) {
        baseProteinPerKg *= 1.2; // 老年人需要更多蛋白质
      } else if (ageNum < 18) {
        baseProteinPerKg *= 1.1; // 青少年生长发育需要
      }
      
      // 性别调整
      if (gender === "male") {
        baseProteinPerKg *= 1.05; // 男性肌肉量通常更高
      }
      
      const baseProtein = weightNum * baseProteinPerKg;
      
      // 特殊情况调整
      let adjustmentFactor = 1;
      if (pregnancy) {
        adjustmentFactor += 0.25; // 孕期增加25g
      }
      if (breastfeeding) {
        adjustmentFactor += 0.3; // 哺乳期增加更多
      }
      if (illness) {
        adjustmentFactor += 0.2; // 疾病恢复期增加
      }
      
      const adjustedProtein = baseProtein * adjustmentFactor;
      
      // 安全范围 (10-35% 总热量)
      const estimatedCalories = gender === "male" 
        ? 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum)
        : 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
      
      const minProtein = (estimatedCalories * 0.1) / 4; // 10% 热量来自蛋白质
      const maxProtein = (estimatedCalories * 0.35) / 4; // 35% 热量来自蛋白质
      
      // 每餐蛋白质分配 (假设3餐)
      const proteinPerMeal = adjustedProtein / 3;
      
      // 蛋白质食物来源计算 (达到每日需求所需的量)
      const proteinSources = {
        chicken: Math.round((adjustedProtein / 23) * 100), // 鸡胸肉23g蛋白质/100g
        fish: Math.round((adjustedProtein / 20) * 100),    // 鱼肉20g蛋白质/100g
        beef: Math.round((adjustedProtein / 26) * 100),    // 牛肉26g蛋白质/100g
        eggs: Math.round(adjustedProtein / 6),             // 鸡蛋6g蛋白质/个
        milk: Math.round((adjustedProtein / 3.4) * 100),   // 牛奶3.4g蛋白质/100ml
        tofu: Math.round((adjustedProtein / 8) * 100),     // 豆腐8g蛋白质/100g
        beans: Math.round((adjustedProtein / 9) * 100)     // 豆类9g蛋白质/100g
      };
      
      setResult({
        baseProtein: Math.round(baseProtein),
        adjustedProtein: Math.round(adjustedProtein),
        minProtein: Math.round(minProtein),
        maxProtein: Math.round(maxProtein),
        proteinPerMeal: Math.round(proteinPerMeal),
        proteinSources
      });
    }
  };

  const reset = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("");
    setActivityLevel("");
    setGoal("");
    setPregnancy(false);
    setBreastfeeding(false);
    setIllness(false);
    setVegetarian(false);
    setResult(null);
  };

  const getProteinLevel = (protein: number, weight: number) => {
    const proteinPerKg = protein / weight;
    if (proteinPerKg > 2.0) return { level: "很高", color: "text-red-600", description: "蛋白质摄入量很高，注意肾脏负担" };
    if (proteinPerKg > 1.5) return { level: "高", color: "text-orange-600", description: "适合运动员和增肌人群" };
    if (proteinPerKg > 1.0) return { level: "中等", color: "text-green-600", description: "适合活跃人群" };
    if (proteinPerKg > 0.8) return { level: "正常", color: "text-blue-600", description: "满足基本需求" };
    return { level: "偏低", color: "text-gray-600", description: "可能不足，建议增加" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            蛋白质需求计算器
          </h1>
          <p className="text-xl text-gray-600">
            根据您的个人情况和健身目标，计算每日蛋白质需求量
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
                <Label htmlFor="activityLevel" className="text-lg font-medium">
                  运动水平
                </Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择运动水平" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">久坐不动</SelectItem>
                    <SelectItem value="light">轻度运动 (每周1-3次)</SelectItem>
                    <SelectItem value="moderate">中度运动 (每周3-5次)</SelectItem>
                    <SelectItem value="active">积极运动 (每周6-7次)</SelectItem>
                    <SelectItem value="very_active">高强度运动 (每天)</SelectItem>
                    <SelectItem value="athlete">专业运动员</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-lg font-medium">
                  健身目标
                </Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择健身目标" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintain">维持体重</SelectItem>
                    <SelectItem value="lose_weight">减脂减重</SelectItem>
                    <SelectItem value="gain_muscle">增肌塑形</SelectItem>
                    <SelectItem value="gain_weight">增重增肌</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-medium">特殊情况 (可选)</Label>
                <div className="grid grid-cols-2 gap-2">
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
                    <Label htmlFor="illness">疾病恢复期</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vegetarian" 
                      checked={vegetarian}
                      onCheckedChange={(checked) => setVegetarian(checked as boolean)}
                    />
                    <Label htmlFor="vegetarian">素食主义者</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateProtein}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3"
                  disabled={!weight || !height || !age || !gender || !activityLevel || !goal}
                >
                  计算蛋白质需求
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
              <CardTitle className="text-2xl text-center">蛋白质需求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-green-600">
                      {result.adjustedProtein} g
                    </div>
                    <div className="text-xl text-gray-600">
                      每日推荐蛋白质摄入量
                    </div>
                    {parseFloat(weight) > 0 && (
                      <div className="text-center">
                        {(() => {
                          const proteinInfo = getProteinLevel(result.adjustedProtein, parseFloat(weight));
                          return (
                            <div className={`text-lg font-semibold ${proteinInfo.color}`}>
                              蛋白质水平: {proteinInfo.level}
                              <p className="text-sm text-gray-600 mt-1">{proteinInfo.description}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{result.proteinPerMeal} g</div>
                      <div className="text-sm text-gray-600">每餐蛋白质</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(result.adjustedProtein / parseFloat(weight) * 10) / 10} g</div>
                      <div className="text-sm text-gray-600">每公斤体重</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold text-center mb-3">安全摄入范围：</h3>
                    <div className="flex justify-between items-center">
                      <span>最低需求:</span>
                      <span className="font-semibold text-blue-600">{result.minProtein} g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>推荐摄入:</span>
                      <span className="font-semibold text-green-600">{result.adjustedProtein} g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>安全上限:</span>
                      <span className="font-semibold text-orange-600">{result.maxProtein} g</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🥩</div>
                  <p>请输入个人信息来计算蛋白质需求</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 蛋白质食物来源 */}
        {result && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">蛋白质食物来源</CardTitle>
              <p className="text-center text-gray-600">达到每日{result.adjustedProtein}g蛋白质所需的食物量</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {!vegetarian && (
                  <>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🍗</div>
                      <h3 className="font-semibold mb-2">鸡胸肉</h3>
                      <div className="text-xl font-bold text-red-600">{result.proteinSources.chicken}g</div>
                      <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.chicken/100)}块</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🐟</div>
                      <h3 className="font-semibold mb-2">鱼肉</h3>
                      <div className="text-xl font-bold text-blue-600">{result.proteinSources.fish}g</div>
                      <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.fish/150)}条</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🥩</div>
                      <h3 className="font-semibold mb-2">牛肉</h3>
                      <div className="text-xl font-bold text-orange-600">{result.proteinSources.beef}g</div>
                      <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.beef/100)}份</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🥚</div>
                      <h3 className="font-semibold mb-2">鸡蛋</h3>
                      <div className="text-xl font-bold text-yellow-600">{result.proteinSources.eggs}个</div>
                      <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.eggs/6)}打</p>
                    </div>
                  </>
                )}
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🥛</div>
                  <h3 className="font-semibold mb-2">牛奶</h3>
                  <div className="text-xl font-bold text-purple-600">{result.proteinSources.milk}ml</div>
                  <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.milk/250)}杯</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🧈</div>
                  <h3 className="font-semibold mb-2">豆腐</h3>
                  <div className="text-xl font-bold text-green-600">{result.proteinSources.tofu}g</div>
                  <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.tofu/300)}块</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🫘</div>
                  <h3 className="font-semibold mb-2">豆类</h3>
                  <div className="text-xl font-bold text-amber-600">{result.proteinSources.beans}g</div>
                  <p className="text-sm text-gray-600">约{Math.round(result.proteinSources.beans/50)}份</p>
                </div>
                {vegetarian && (
                  <div className="bg-lime-50 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">🌱</div>
                    <h3 className="font-semibold mb-2">素食提醒</h3>
                    <p className="text-sm text-gray-600">建议多样化植物蛋白来源，确保氨基酸完整性</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 蛋白质摄入时间 */}
        {result && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">蛋白质摄入时间安排</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🌅</div>
                  <h3 className="font-semibold mb-2">早餐</h3>
                  <div className="text-xl font-bold text-yellow-600">{Math.round(result.adjustedProtein * 0.25)}g</div>
                  <p className="text-sm text-gray-600">启动一天的代谢</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🥗</div>
                  <h3 className="font-semibold mb-2">午餐</h3>
                  <div className="text-xl font-bold text-green-600">{Math.round(result.adjustedProtein * 0.35)}g</div>
                  <p className="text-sm text-gray-600">维持下午精力</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🍽️</div>
                  <h3 className="font-semibold mb-2">晚餐</h3>
                  <div className="text-xl font-bold text-blue-600">{Math.round(result.adjustedProtein * 0.3)}g</div>
                  <p className="text-sm text-gray-600">夜间肌肉修复</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🥤</div>
                  <h3 className="font-semibold mb-2">加餐</h3>
                  <div className="text-xl font-bold text-purple-600">{Math.round(result.adjustedProtein * 0.1)}g</div>
                  <p className="text-sm text-gray-600">运动前后补充</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 蛋白质知识科普 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">蛋白质知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">🧬 蛋白质的作用</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 构建和修复肌肉组织</li>
                  <li>• 合成酶类和激素</li>
                  <li>• 维持免疫系统功能</li>
                  <li>• 提供饱腹感，控制食欲</li>
                  <li>• 维持血糖稳定</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">⚡ 蛋白质摄入技巧</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 每餐均匀分配蛋白质</li>
                  <li>• 运动后30分钟内补充</li>
                  <li>• 选择完全蛋白质食物</li>
                  <li>• 植物蛋白需要搭配互补</li>
                  <li>• 避免一次性大量摄入</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}