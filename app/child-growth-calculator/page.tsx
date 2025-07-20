"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInMonths, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface GrowthResult {
  ageMonths: number;
  ageDays: number;
  heightPercentile: number;
  weightPercentile: number;
  headCircumferencePercentile?: number;
  bmiPercentile: number;
  heightZScore: number;
  weightZScore: number;
  bmiZScore: number;
  growthStatus: {
    height: string;
    weight: string;
    bmi: string;
    overall: string;
  };
  recommendations: string[];
  nextMilestones: {
    age: string;
    milestone: string;
  }[];
  nutritionNeeds: {
    calories: number;
    protein: number;
    calcium: number;
    iron: number;
  };
}

export default function ChildGrowthCalculator() {
  const [birthDate, setBirthDate] = useState<Date>();
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [gestationalAge, setGestationalAge] = useState("40"); // 胎龄（周）
  const [feedingType, setFeedingType] = useState(""); // 喂养方式
  const [activityLevel, setActivityLevel] = useState(""); // 活动水平
  
  const [result, setResult] = useState<GrowthResult | null>(null);

  // WHO儿童生长标准数据（简化版）
  const getGrowthStandards = (ageMonths: number, gender: string) => {
    // 这里使用简化的WHO生长标准数据
    // 实际应用中应该使用完整的WHO生长曲线数据
    const standards = {
      male: {
        height: {
          0: { mean: 49.9, sd: 1.9 },
          6: { mean: 67.6, sd: 2.3 },
          12: { mean: 75.7, sd: 2.5 },
          24: { mean: 87.1, sd: 3.1 },
          36: { mean: 96.1, sd: 3.5 },
          48: { mean: 103.3, sd: 3.8 },
          60: { mean: 110.0, sd: 4.2 }
        },
        weight: {
          0: { mean: 3.3, sd: 0.4 },
          6: { mean: 7.9, sd: 0.8 },
          12: { mean: 9.6, sd: 1.0 },
          24: { mean: 12.2, sd: 1.3 },
          36: { mean: 14.3, sd: 1.5 },
          48: { mean: 16.3, sd: 1.8 },
          60: { mean: 18.3, sd: 2.1 }
        }
      },
      female: {
        height: {
          0: { mean: 49.1, sd: 1.9 },
          6: { mean: 65.7, sd: 2.2 },
          12: { mean: 74.0, sd: 2.5 },
          24: { mean: 85.7, sd: 3.0 },
          36: { mean: 94.1, sd: 3.4 },
          48: { mean: 101.0, sd: 3.7 },
          60: { mean: 107.4, sd: 4.0 }
        },
        weight: {
          0: { mean: 3.2, sd: 0.4 },
          6: { mean: 7.3, sd: 0.8 },
          12: { mean: 8.9, sd: 1.0 },
          24: { mean: 11.5, sd: 1.3 },
          36: { mean: 13.4, sd: 1.5 },
          48: { mean: 15.2, sd: 1.7 },
          60: { mean: 17.0, sd: 2.0 }
        }
      }
    };
    
    // 找到最接近的年龄段
    const ageKeys = Object.keys(standards[gender as keyof typeof standards].height).map(Number);
    let closestAge = ageKeys[0];
    
    for (const age of ageKeys) {
      if (ageMonths >= age) {
        closestAge = age;
      }
    }
    
    return {
      height: standards[gender as keyof typeof standards].height[closestAge as keyof typeof standards.male.height],
      weight: standards[gender as keyof typeof standards].weight[closestAge as keyof typeof standards.male.weight]
    };
  };

  // 计算Z分数
  const calculateZScore = (value: number, mean: number, sd: number) => {
    return (value - mean) / sd;
  };

  // 计算百分位数（简化版）
  const calculatePercentile = (zScore: number) => {
    // 使用正态分布近似计算百分位数
    const percentile = 50 * (1 + Math.sign(zScore) * Math.sqrt(1 - Math.exp(-2 * zScore * zScore / Math.PI)));
    return Math.round(Math.max(0.1, Math.min(99.9, percentile)) * 10) / 10;
  };

  // 获取生长状态描述
  const getGrowthStatus = (percentile: number) => {
    if (percentile < 3) return "明显偏低";
    if (percentile < 10) return "偏低";
    if (percentile < 25) return "中下";
    if (percentile < 75) return "正常";
    if (percentile < 90) return "中上";
    if (percentile < 97) return "偏高";
    return "明显偏高";
  };

  // 获取发育里程碑
  const getMilestones = (ageMonths: number) => {
    const milestones = [
      { age: "2个月", milestone: "能抬头，对声音有反应" },
      { age: "4个月", milestone: "能翻身，会笑出声" },
      { age: "6个月", milestone: "能坐，开始添加辅食" },
      { age: "9个月", milestone: "能爬行，会用拇指和食指捏取小物品" },
      { age: "12个月", milestone: "能站立，会说简单词汇" },
      { age: "18个月", milestone: "能独立行走，词汇量增加" },
      { age: "24个月", milestone: "能跑跳，会说短句" },
      { age: "36个月", milestone: "能骑三轮车，会数数" },
      { age: "48个月", milestone: "能单脚跳，会画简单图形" },
      { age: "60个月", milestone: "能跳绳，准备上学" }
    ];
    
    return milestones.filter((_, index) => (index + 1) * 6 > ageMonths).slice(0, 3);
  };

  // 计算营养需求
  const calculateNutritionNeeds = (ageMonths: number, weight: number, activityLevel: string) => {
    let baseCalories = 0;
    let protein = 0;
    let calcium = 0;
    let iron = 0;
    
    if (ageMonths < 6) {
      baseCalories = 108 * weight; // 每公斤体重108卡路里
      protein = 2.2 * weight; // 每公斤体重2.2克蛋白质
      calcium = 200; // 毫克
      iron = 0.27; // 毫克
    } else if (ageMonths < 12) {
      baseCalories = 98 * weight;
      protein = 1.6 * weight;
      calcium = 260;
      iron = 11;
    } else if (ageMonths < 36) {
      baseCalories = 102 * weight;
      protein = 1.05 * weight;
      calcium = 700;
      iron = 7;
    } else {
      baseCalories = 90 * weight;
      protein = 0.95 * weight;
      calcium = 1000;
      iron = 10;
    }
    
    // 根据活动水平调整热量
    const activityMultiplier = {
      low: 1.0,
      moderate: 1.1,
      high: 1.2
    };
    
    const multiplier = activityMultiplier[activityLevel as keyof typeof activityMultiplier] || 1.0;
    
    return {
      calories: Math.round(baseCalories * multiplier),
      protein: Math.round(protein * 10) / 10,
      calcium: Math.round(calcium),
      iron: Math.round(iron * 10) / 10
    };
  };

  const calculateGrowth = () => {
    if (!birthDate || !gender || !height || !weight) {
      alert("请填写必要信息");
      return;
    }
    
    const today = new Date();
    const ageMonths = differenceInMonths(today, birthDate);
    const ageDays = differenceInDays(today, birthDate);
    
    if (ageMonths < 0 || ageMonths > 60) {
      alert("此计算器适用于0-5岁儿童");
      return;
    }
    
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const bmi = weightValue / Math.pow(heightValue / 100, 2);
    
    // 获取生长标准
    const standards = getGrowthStandards(ageMonths, gender);
    
    // 计算Z分数
    const heightZScore = calculateZScore(heightValue, standards.height.mean, standards.height.sd);
    const weightZScore = calculateZScore(weightValue, standards.weight.mean, standards.weight.sd);
    
    // BMI标准（简化）
    const bmiMean = standards.weight.mean / Math.pow(standards.height.mean / 100, 2);
    const bmiSD = 1.5; // 简化的标准差
    const bmiZScore = calculateZScore(bmi, bmiMean, bmiSD);
    
    // 计算百分位数
    const heightPercentile = calculatePercentile(heightZScore);
    const weightPercentile = calculatePercentile(weightZScore);
    const bmiPercentile = calculatePercentile(bmiZScore);
    
    // 头围百分位数（如果提供）
    let headCircumferencePercentile;
    if (headCircumference && ageMonths <= 24) {
      const headCircValue = parseFloat(headCircumference);
      // 简化的头围标准
      const headMean = 35 + ageMonths * 0.5;
      const headSD = 1.5;
      const headZScore = calculateZScore(headCircValue, headMean, headSD);
      headCircumferencePercentile = calculatePercentile(headZScore);
    }
    
    // 生长状态评估
    const growthStatus = {
      height: getGrowthStatus(heightPercentile),
      weight: getGrowthStatus(weightPercentile),
      bmi: getGrowthStatus(bmiPercentile),
      overall: ""
    };
    
    // 综合评估
    const avgPercentile = (heightPercentile + weightPercentile + bmiPercentile) / 3;
    growthStatus.overall = getGrowthStatus(avgPercentile);
    
    // 生成建议
    const recommendations = [];
    
    if (heightPercentile < 10) {
      recommendations.push("身高偏低，建议咨询儿科医生，检查是否有生长激素缺乏");
    }
    
    if (weightPercentile < 10) {
      recommendations.push("体重偏低，建议增加营养摄入，确保充足的蛋白质和热量");
    }
    
    if (bmiPercentile > 85) {
      recommendations.push("体重偏重，建议控制饮食，增加运动量");
    }
    
    if (bmiPercentile < 15) {
      recommendations.push("体重偏轻，建议增加营养密度高的食物");
    }
    
    recommendations.push("保证充足睡眠，促进生长激素分泌");
    recommendations.push("适量运动，促进骨骼和肌肉发育");
    recommendations.push("定期体检，监测生长发育情况");
    
    // 获取里程碑和营养需求
    const nextMilestones = getMilestones(ageMonths);
    const nutritionNeeds = calculateNutritionNeeds(ageMonths, weightValue, activityLevel);
    
    setResult({
      ageMonths,
      ageDays,
      heightPercentile,
      weightPercentile,
      headCircumferencePercentile,
      bmiPercentile,
      heightZScore,
      weightZScore,
      bmiZScore,
      growthStatus,
      recommendations,
      nextMilestones,
      nutritionNeeds
    });
  };

  const reset = () => {
    setBirthDate(undefined);
    setGender("");
    setHeight("");
    setWeight("");
    setHeadCircumference("");
    setGestationalAge("40");
    setFeedingType("");
    setActivityLevel("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            儿童生长发育计算器
          </h1>
          <p className="text-xl text-gray-600">
            基于WHO标准评估儿童生长发育状况
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">儿童信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-blue-600">基本信息</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">出生日期 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? format(birthDate, "yyyy年MM月dd日") : "选择出生日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={setBirthDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">性别 *</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">身高（cm）*</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="75"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="40"
                      max="150"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">体重（kg）*</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="9.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="2"
                      max="50"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headCircumference" className="text-sm font-medium">头围（cm）（2岁以下）</Label>
                  <Input
                    id="headCircumference"
                    type="number"
                    placeholder="46"
                    value={headCircumference}
                    onChange={(e) => setHeadCircumference(e.target.value)}
                    min="30"
                    max="60"
                    step="0.1"
                  />
                </div>
              </div>

              {/* 出生信息 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-green-600">出生信息</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="gestationalAge" className="text-sm font-medium">胎龄（周）</Label>
                  <Input
                    id="gestationalAge"
                    type="number"
                    placeholder="40"
                    value={gestationalAge}
                    onChange={(e) => setGestationalAge(e.target.value)}
                    min="24"
                    max="44"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">喂养方式</Label>
                  <Select value={feedingType} onValueChange={setFeedingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择喂养方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breastfeeding">纯母乳喂养</SelectItem>
                      <SelectItem value="mixed">混合喂养</SelectItem>
                      <SelectItem value="formula">人工喂养</SelectItem>
                      <SelectItem value="solid">已添加辅食</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">活动水平</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择活动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">较少活动</SelectItem>
                      <SelectItem value="moderate">适度活动</SelectItem>
                      <SelectItem value="high">活跃好动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateGrowth}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                >
                  评估生长发育
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
              <CardTitle className="text-2xl text-center">评估结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600 mb-2">年龄</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {Math.floor(result.ageMonths / 12)}岁{result.ageMonths % 12}个月
                      </div>
                      <div className="text-sm text-gray-600">（{result.ageDays}天）</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-600">{result.heightPercentile}%</div>
                        <div className="text-sm text-gray-600">身高百分位</div>
                        <div className="text-xs text-gray-500">{result.growthStatus.height}</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-orange-600">{result.weightPercentile}%</div>
                        <div className="text-sm text-gray-600">体重百分位</div>
                        <div className="text-xs text-gray-500">{result.growthStatus.weight}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-purple-600">{result.bmiPercentile}%</div>
                        <div className="text-sm text-gray-600">BMI百分位</div>
                        <div className="text-xs text-gray-500">{result.growthStatus.bmi}</div>
                      </div>
                      {result.headCircumferencePercentile && (
                        <div className="bg-pink-50 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-pink-600">{result.headCircumferencePercentile}%</div>
                          <div className="text-sm text-gray-600">头围百分位</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-700">综合评估：</h3>
                    <p className="text-yellow-600 text-lg font-medium">
                      生长发育状况：{result.growthStatus.overall}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-red-700">建议措施：</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-600 mr-2">•</span>
                          <span className="text-gray-700 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-green-700">营养需求：</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">每日热量：</span>
                        <span className="text-green-600">{result.nutritionNeeds.calories} 卡路里</span>
                      </div>
                      <div>
                        <span className="font-medium">蛋白质：</span>
                        <span className="text-green-600">{result.nutritionNeeds.protein} 克</span>
                      </div>
                      <div>
                        <span className="font-medium">钙：</span>
                        <span className="text-green-600">{result.nutritionNeeds.calcium} 毫克</span>
                      </div>
                      <div>
                        <span className="font-medium">铁：</span>
                        <span className="text-green-600">{result.nutritionNeeds.iron} 毫克</span>
                      </div>
                    </div>
                  </div>
                  
                  {result.nextMilestones.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-blue-700">即将到来的发育里程碑：</h3>
                      <div className="space-y-2">
                        {result.nextMilestones.map((milestone, index) => (
                          <div key={index} className="border-l-4 border-blue-400 pl-3">
                            <div className="font-medium text-blue-700">{milestone.age}</div>
                            <div className="text-sm text-gray-600">{milestone.milestone}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">👶</div>
                  <p>请输入儿童信息进行生长发育评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 生长发育知识 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">生长发育知识</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">0-1岁（婴儿期）</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 体重增长最快期</li>
                  <li>• 母乳喂养最佳</li>
                  <li>• 6个月后添加辅食</li>
                  <li>• 定期体检和疫苗接种</li>
                  <li>• 充足睡眠促进生长</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">1-3岁（幼儿期）</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 生长速度放缓</li>
                  <li>• 均衡饮食很重要</li>
                  <li>• 增加户外活动</li>
                  <li>• 语言和认知快速发展</li>
                  <li>• 建立良好作息习惯</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-700">3-5岁（学龄前期）</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 身高稳定增长</li>
                  <li>• 运动能力提高</li>
                  <li>• 社交技能发展</li>
                  <li>• 准备入学</li>
                  <li>• 培养独立性</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-orange-700">促进健康生长的要素：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• 均衡营养：蛋白质、维生素、矿物质</li>
                  <li>• 充足睡眠：促进生长激素分泌</li>
                  <li>• 适量运动：促进骨骼肌肉发育</li>
                  <li>• 定期体检：及时发现问题</li>
                </ul>
                <ul className="space-y-1">
                  <li>• 良好环境：减少疾病感染</li>
                  <li>• 心理健康：情绪稳定有利生长</li>
                  <li>• 避免有害物质：烟酒等</li>
                  <li>• 及时治疗疾病：避免影响生长</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}