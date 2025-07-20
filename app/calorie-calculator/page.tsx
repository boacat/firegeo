"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface CalorieResult {
  bmr: number;
  tdee: number;
  goalCalories: {
    maintain: number;
    mildLoss: number;
    moderateLoss: number;
    extremeLoss: number;
    mildGain: number;
    moderateGain: number;
  };
  macronutrients: {
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  };
  mealPlan: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  weightTimeline: {
    goal: string;
    timeToGoal: string;
    weeklyChange: number;
    monthlyChange: number;
  };
  recommendations: {
    category: string;
    suggestions: string[];
  }[];
}

export default function CalorieCalculator() {
  // 基本信息
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  
  // 活动水平
  const [activityLevel, setActivityLevel] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [jobType, setJobType] = useState("");
  
  // 目标设置
  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [timeframe, setTimeframe] = useState("");
  
  // 饮食偏好
  const [dietType, setDietType] = useState("");
  const [proteinRatio, setProteinRatio] = useState([25]); // 蛋白质比例
  const [carbRatio, setCarbRatio] = useState([45]); // 碳水化合物比例
  const [fatRatio, setFatRatio] = useState([30]); // 脂肪比例
  
  // 健康状况
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [diabetes, setDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [highCholesterol, setHighCholesterol] = useState(false);
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  
  // 生活习惯
  const [sleepHours, setSleepHours] = useState("");
  const [stressLevel, setStressLevel] = useState([3]); // 1-5分
  const [waterIntake, setWaterIntake] = useState("");
  
  const [result, setResult] = useState<CalorieResult | null>(null);

  const healthConditionsList = [
    "糖尿病", "高血压", "高胆固醇", "心脏病", "甲状腺疾病",
    "肾脏疾病", "肝脏疾病", "消化系统疾病", "代谢综合征"
  ];

  const calculateCalories = () => {
    if (!age || !gender || !height || !weight || !activityLevel || !goal) {
      alert("请填写必要信息");
      return;
    }
    
    const ageValue = parseInt(age);
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const bodyFatValue = parseFloat(bodyFat) || 0;
    
    // 计算BMR（基础代谢率）
    let bmr = 0;
    
    if (bodyFatValue > 0) {
      // 使用Katch-McArdle公式（考虑体脂率）
      const leanBodyMass = weightValue * (1 - bodyFatValue / 100);
      bmr = 370 + (21.6 * leanBodyMass);
    } else {
      // 使用Mifflin-St Jeor公式
      if (gender === "male") {
        bmr = 88.362 + (13.397 * weightValue) + (4.799 * heightValue) - (5.677 * ageValue);
      } else {
        bmr = 447.593 + (9.247 * weightValue) + (3.098 * heightValue) - (4.330 * ageValue);
      }
    }
    
    // 活动系数
    let activityMultiplier = 1.2;
    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2;
        break;
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "very_active":
        activityMultiplier = 1.9;
        break;
    }
    
    // 根据工作类型调整
    if (jobType === "physical") {
      activityMultiplier += 0.1;
    } else if (jobType === "desk") {
      activityMultiplier -= 0.05;
    }
    
    // 计算TDEE（总日消耗量）
    const tdee = Math.round(bmr * activityMultiplier);
    
    // 根据目标计算卡路里需求
    const goalCalories = {
      maintain: tdee,
      mildLoss: tdee - 250,    // 0.25kg/周
      moderateLoss: tdee - 500, // 0.5kg/周
      extremeLoss: tdee - 750,  // 0.75kg/周
      mildGain: tdee + 250,     // 0.25kg/周
      moderateGain: tdee + 500  // 0.5kg/周
    };
    
    // 确保最低卡路里摄入
    const minCalories = gender === "male" ? 1500 : 1200;
    Object.keys(goalCalories).forEach(key => {
      if (goalCalories[key as keyof typeof goalCalories] < minCalories) {
        goalCalories[key as keyof typeof goalCalories] = minCalories;
      }
    });
    
    // 根据目标选择卡路里
    let targetCalories = tdee;
    switch (goal) {
      case "lose_fast":
        targetCalories = goalCalories.moderateLoss;
        break;
      case "lose_slow":
        targetCalories = goalCalories.mildLoss;
        break;
      case "maintain":
        targetCalories = goalCalories.maintain;
        break;
      case "gain_slow":
        targetCalories = goalCalories.mildGain;
        break;
      case "gain_fast":
        targetCalories = goalCalories.moderateGain;
        break;
    }
    
    // 根据饮食类型调整宏量营养素比例
    let proteinPercent = proteinRatio[0];
    let carbPercent = carbRatio[0];
    let fatPercent = fatRatio[0];
    
    // 确保比例总和为100%
    const totalPercent = proteinPercent + carbPercent + fatPercent;
    if (totalPercent !== 100) {
      const adjustment = 100 / totalPercent;
      proteinPercent *= adjustment;
      carbPercent *= adjustment;
      fatPercent *= adjustment;
    }
    
    // 根据饮食类型预设比例
    if (dietType === "high_protein") {
      proteinPercent = 30;
      carbPercent = 40;
      fatPercent = 30;
    } else if (dietType === "low_carb") {
      proteinPercent = 25;
      carbPercent = 20;
      fatPercent = 55;
    } else if (dietType === "balanced") {
      proteinPercent = 20;
      carbPercent = 50;
      fatPercent = 30;
    } else if (dietType === "mediterranean") {
      proteinPercent = 18;
      carbPercent = 45;
      fatPercent = 37;
    }
    
    // 计算宏量营养素
    const macronutrients = {
      protein: {
        calories: Math.round(targetCalories * proteinPercent / 100),
        grams: Math.round(targetCalories * proteinPercent / 100 / 4),
        percentage: proteinPercent
      },
      carbs: {
        calories: Math.round(targetCalories * carbPercent / 100),
        grams: Math.round(targetCalories * carbPercent / 100 / 4),
        percentage: carbPercent
      },
      fat: {
        calories: Math.round(targetCalories * fatPercent / 100),
        grams: Math.round(targetCalories * fatPercent / 100 / 9),
        percentage: fatPercent
      }
    };
    
    // 餐食分配
    const mealPlan = {
      breakfast: Math.round(targetCalories * 0.25),
      lunch: Math.round(targetCalories * 0.35),
      dinner: Math.round(targetCalories * 0.30),
      snacks: Math.round(targetCalories * 0.10)
    };
    
    // 体重变化时间线
    const currentWeight = weightValue;
    const targetWeightValue = parseFloat(targetWeight) || currentWeight;
    const weightDifference = Math.abs(targetWeightValue - currentWeight);
    
    let weeklyChange = 0;
    let timeToGoal = "";
    
    if (goal.includes("lose")) {
      weeklyChange = goal === "lose_fast" ? -0.5 : -0.25;
      const weeksToGoal = Math.ceil(weightDifference / Math.abs(weeklyChange));
      timeToGoal = `${weeksToGoal}周`;
    } else if (goal.includes("gain")) {
      weeklyChange = goal === "gain_fast" ? 0.5 : 0.25;
      const weeksToGoal = Math.ceil(weightDifference / weeklyChange);
      timeToGoal = `${weeksToGoal}周`;
    } else {
      weeklyChange = 0;
      timeToGoal = "维持当前体重";
    }
    
    const weightTimeline = {
      goal: goal === "maintain" ? "维持体重" : 
            goal.includes("lose") ? `减重至${targetWeight}kg` : 
            `增重至${targetWeight}kg`,
      timeToGoal,
      weeklyChange,
      monthlyChange: weeklyChange * 4.33
    };
    
    // 生成建议
    const recommendations = [];
    
    // 饮食建议
    const dietSuggestions = [];
    if (goal.includes("lose")) {
      dietSuggestions.push("创造适度的热量缺口");
      dietSuggestions.push("增加蛋白质摄入以保持肌肉");
      dietSuggestions.push("选择高纤维、低热量密度食物");
      dietSuggestions.push("控制精制糖和加工食品");
    } else if (goal.includes("gain")) {
      dietSuggestions.push("增加健康的高热量食物");
      dietSuggestions.push("频繁进餐，增加餐次");
      dietSuggestions.push("选择营养密度高的食物");
      dietSuggestions.push("适量增加健康脂肪");
    } else {
      dietSuggestions.push("保持均衡的营养摄入");
      dietSuggestions.push("定时定量进餐");
      dietSuggestions.push("多样化食物选择");
    }
    
    recommendations.push({
      category: "饮食建议",
      suggestions: dietSuggestions
    });
    
    // 运动建议
    const exerciseSuggestions = [];
    if (goal.includes("lose")) {
      exerciseSuggestions.push("结合有氧运动和力量训练");
      exerciseSuggestions.push("每周至少150分钟中等强度运动");
      exerciseSuggestions.push("增加日常活动量");
    } else if (goal.includes("gain")) {
      exerciseSuggestions.push("重点进行力量训练");
      exerciseSuggestions.push("适度有氧运动");
      exerciseSuggestions.push("确保充分休息恢复");
    } else {
      exerciseSuggestions.push("保持规律运动习惯");
      exerciseSuggestions.push("有氧和力量训练并重");
    }
    
    recommendations.push({
      category: "运动建议",
      suggestions: exerciseSuggestions
    });
    
    // 生活方式建议
    const lifestyleSuggestions = [];
    if (parseInt(sleepHours) < 7) {
      lifestyleSuggestions.push("确保每晚7-9小时充足睡眠");
    }
    if (stressLevel[0] >= 4) {
      lifestyleSuggestions.push("学习压力管理技巧");
    }
    if (parseFloat(waterIntake) < 2) {
      lifestyleSuggestions.push("增加水分摄入至每日2-3升");
    }
    lifestyleSuggestions.push("定期监测体重和身体成分");
    lifestyleSuggestions.push("保持饮食记录");
    
    recommendations.push({
      category: "生活方式",
      suggestions: lifestyleSuggestions
    });
    
    // 健康提醒
    const healthSuggestions = [];
    if (healthConditions.length > 0) {
      healthSuggestions.push("咨询医生制定个性化方案");
      healthSuggestions.push("定期监测相关健康指标");
    }
    if (ageValue >= 50) {
      healthSuggestions.push("注意营养素密度");
      healthSuggestions.push("预防肌肉流失");
    }
    healthSuggestions.push("循序渐进调整饮食");
    healthSuggestions.push("关注身体反应和感受");
    
    recommendations.push({
      category: "健康提醒",
      suggestions: healthSuggestions
    });
    
    setResult({
      bmr: Math.round(bmr),
      tdee,
      goalCalories,
      macronutrients,
      mealPlan,
      weightTimeline,
      recommendations
    });
  };

  const reset = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setBodyFat("");
    setActivityLevel("");
    setExerciseFrequency("");
    setJobType("");
    setGoal("");
    setTargetWeight("");
    setTimeframe("");
    setDietType("");
    setProteinRatio([25]);
    setCarbRatio([45]);
    setFatRatio([30]);
    setHealthConditions([]);
    setMedications("");
    setAllergies("");
    setSleepHours("");
    setStressLevel([3]);
    setWaterIntake("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            卡路里需求计算器
          </h1>
          <p className="text-xl text-gray-600">
            精确计算每日卡路里需求，制定个性化营养方案
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">信息输入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-orange-600">基本信息</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">年龄 *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="10"
                      max="100"
                    />
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">身高（cm）*</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="140"
                      max="220"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">体重（kg）*</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="30"
                      max="200"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bodyFat" className="text-sm font-medium">体脂率（%）- 可选</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      placeholder="15"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      min="5"
                      max="50"
                    />
                  </div>
                </div>
              </div>

              {/* 活动水平 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-blue-600">活动水平</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">日常活动水平 *</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择活动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">久坐（很少运动）</SelectItem>
                      <SelectItem value="light">轻度活动（每周1-3次轻度运动）</SelectItem>
                      <SelectItem value="moderate">中度活动（每周3-5次中等运动）</SelectItem>
                      <SelectItem value="active">高度活动（每周6-7次运动）</SelectItem>
                      <SelectItem value="very_active">极高活动（每日高强度运动）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">运动频率</Label>
                    <Select value={exerciseFrequency} onValueChange={setExerciseFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不运动</SelectItem>
                        <SelectItem value="1-2">每周1-2次</SelectItem>
                        <SelectItem value="3-4">每周3-4次</SelectItem>
                        <SelectItem value="5-6">每周5-6次</SelectItem>
                        <SelectItem value="daily">每日运动</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">工作类型</Label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desk">办公室工作</SelectItem>
                        <SelectItem value="standing">站立工作</SelectItem>
                        <SelectItem value="physical">体力工作</SelectItem>
                        <SelectItem value="mixed">混合工作</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 目标设置 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-green-600">目标设置</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">健身目标 *</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择目标" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose_fast">快速减重（0.5kg/周）</SelectItem>
                      <SelectItem value="lose_slow">缓慢减重（0.25kg/周）</SelectItem>
                      <SelectItem value="maintain">维持体重</SelectItem>
                      <SelectItem value="gain_slow">缓慢增重（0.25kg/周）</SelectItem>
                      <SelectItem value="gain_fast">快速增重（0.5kg/周）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetWeight" className="text-sm font-medium">目标体重（kg）</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      placeholder="65"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      min="30"
                      max="200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">期望时间</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1个月</SelectItem>
                        <SelectItem value="3months">3个月</SelectItem>
                        <SelectItem value="6months">6个月</SelectItem>
                        <SelectItem value="1year">1年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 饮食偏好 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-purple-600">饮食偏好</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">饮食类型</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择饮食类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">均衡饮食</SelectItem>
                      <SelectItem value="high_protein">高蛋白饮食</SelectItem>
                      <SelectItem value="low_carb">低碳水饮食</SelectItem>
                      <SelectItem value="mediterranean">地中海饮食</SelectItem>
                      <SelectItem value="custom">自定义比例</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dietType === "custom" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">蛋白质：{proteinRatio[0]}%</Label>
                      <Slider
                        value={proteinRatio}
                        onValueChange={setProteinRatio}
                        max={40}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">碳水化合物：{carbRatio[0]}%</Label>
                      <Slider
                        value={carbRatio}
                        onValueChange={setCarbRatio}
                        max={65}
                        min={15}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">脂肪：{fatRatio[0]}%</Label>
                      <Slider
                        value={fatRatio}
                        onValueChange={setFatRatio}
                        max={50}
                        min={15}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 生活习惯 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-pink-600">生活习惯</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sleep" className="text-sm font-medium">睡眠时间（小时）</Label>
                    <Input
                      id="sleep"
                      type="number"
                      placeholder="8"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      min="4"
                      max="12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="water" className="text-sm font-medium">日饮水量（升）</Label>
                    <Input
                      id="water"
                      type="number"
                      placeholder="2.5"
                      value={waterIntake}
                      onChange={(e) => setWaterIntake(e.target.value)}
                      min="0.5"
                      max="5"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">压力水平：{stressLevel[0]}分</Label>
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>很低</span>
                    <span>一般</span>
                    <span>很高</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateCalories}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-3"
                >
                  计算卡路里
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{result.bmr}</div>
                      <div className="text-sm text-gray-600">基础代谢率（BMR）</div>
                      <div className="text-xs text-gray-500">kcal/天</div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.tdee}</div>
                      <div className="text-sm text-gray-600">总消耗量（TDEE）</div>
                      <div className="text-xs text-gray-500">kcal/天</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-green-700">目标卡路里：</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>快速减重：</span>
                        <span className="font-medium">{result.goalCalories.moderateLoss} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>缓慢减重：</span>
                        <span className="font-medium">{result.goalCalories.mildLoss} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>维持体重：</span>
                        <span className="font-medium">{result.goalCalories.maintain} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>缓慢增重：</span>
                        <span className="font-medium">{result.goalCalories.mildGain} kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-purple-700">宏量营养素分配：</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">蛋白质：</span>
                        <div className="text-right">
                          <span className="font-medium">{result.macronutrients.protein.grams}g</span>
                          <span className="text-xs text-gray-500 ml-2">({result.macronutrients.protein.calories} kcal)</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">碳水化合物：</span>
                        <div className="text-right">
                          <span className="font-medium">{result.macronutrients.carbs.grams}g</span>
                          <span className="text-xs text-gray-500 ml-2">({result.macronutrients.carbs.calories} kcal)</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">脂肪：</span>
                        <div className="text-right">
                          <span className="font-medium">{result.macronutrients.fat.grams}g</span>
                          <span className="text-xs text-gray-500 ml-2">({result.macronutrients.fat.calories} kcal)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-700">餐食分配建议：</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>早餐：</span>
                        <span className="font-medium">{result.mealPlan.breakfast} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>午餐：</span>
                        <span className="font-medium">{result.mealPlan.lunch} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>晚餐：</span>
                        <span className="font-medium">{result.mealPlan.dinner} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>加餐：</span>
                        <span className="font-medium">{result.mealPlan.snacks} kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-indigo-700">体重变化预测：</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>目标：</span>
                        <span className="font-medium">{result.weightTimeline.goal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>预计时间：</span>
                        <span className="font-medium">{result.weightTimeline.timeToGoal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>每周变化：</span>
                        <span className="font-medium">{result.weightTimeline.weeklyChange > 0 ? '+' : ''}{result.weightTimeline.weeklyChange}kg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-700">个性化建议：</h3>
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">{rec.category}：</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.suggestions.map((suggestion, suggestionIndex) => (
                            <li key={suggestionIndex} className="flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🍎</div>
                  <p>请填写相关信息计算卡路里需求</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 营养知识 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">营养管理知识</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-orange-700">卡路里基础</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• BMR：维持基本生理功能所需</li>
                  <li>• TDEE：包含所有活动的总消耗</li>
                  <li>• 热量缺口：减重需要消耗{'>'}摄入</li>
                  <li>• 热量盈余：增重需要摄入{'>'}消耗</li>
                  <li>• 1kg脂肪≈7700kcal</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">宏量营养素</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 蛋白质：4kcal/g，肌肉合成</li>
                  <li>• 碳水化合物：4kcal/g，能量来源</li>
                  <li>• 脂肪：9kcal/g，激素合成</li>
                  <li>• 纤维：促进消化，增加饱腹感</li>
                  <li>• 水分：参与所有代谢过程</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">实用技巧</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 记录饮食，提高意识</li>
                  <li>• 定时进餐，稳定代谢</li>
                  <li>• 多喝水，促进代谢</li>
                  <li>• 充足睡眠，调节激素</li>
                  <li>• 循序渐进，避免极端</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-purple-700">注意事项：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• 计算结果仅供参考，个体差异较大</li>
                  <li>• 有健康问题请咨询专业人士</li>
                  <li>• 避免过度限制卡路里摄入</li>
                  <li>• 关注营养质量，不只是数量</li>
                </ul>
                <ul className="space-y-1">
                  <li>• 定期调整计划，适应身体变化</li>
                  <li>• 结合运动，提高代谢效率</li>
                  <li>• 保持耐心，健康减重需要时间</li>
                  <li>• 建立长期可持续的饮食习惯</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}