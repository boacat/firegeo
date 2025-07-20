"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function HydrationCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [climate, setClimate] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [exerciseDuration, setExerciseDuration] = useState("");
  const [exerciseIntensity, setExerciseIntensity] = useState("");
  const [currentIntake, setCurrentIntake] = useState("");
  const [result, setResult] = useState<any>(null);

  // 基础水分需求 (ml/kg体重/天)
  const getBaseWaterNeeds = (ageNum: number, gender: string) => {
    if (ageNum < 1) return 150; // 婴儿
    if (ageNum < 3) return 100; // 幼儿
    if (ageNum < 9) return 70;  // 儿童
    if (ageNum < 14) return 50; // 青少年
    if (ageNum < 19) return 40; // 青年
    if (ageNum < 51) return 35; // 成年
    if (ageNum < 71) return 30; // 中年
    return 30; // 老年
  };

  // 活动水平系数
  const activityFactors = {
    "sedentary": { name: "久坐", factor: 1.0, description: "很少运动，主要是办公室工作" },
    "light": { name: "轻度活动", factor: 1.2, description: "偶尔散步，轻度家务" },
    "moderate": { name: "中度运动", factor: 1.5, description: "每周3-5次中等强度运动" },
    "vigorous": { name: "高强度运动", factor: 1.8, description: "每天高强度运动" },
    "athlete": { name: "专业运动员", factor: 2.2, description: "每天多次高强度训练" }
  };

  // 气候环境系数
  const climateFactors = {
    "temperate": { name: "温带", factor: 1.0, description: "温度适中，湿度正常" },
    "hot-humid": { name: "炎热潮湿", factor: 1.5, description: "高温高湿环境" },
    "hot-dry": { name: "炎热干燥", factor: 1.8, description: "高温低湿环境" },
    "cold": { name: "寒冷", factor: 0.9, description: "低温环境" },
    "high-altitude": { name: "高海拔", factor: 1.3, description: "海拔3000米以上" },
    "air-conditioned": { name: "空调环境", factor: 1.1, description: "长期空调环境" },
    "heated-indoor": { name: "暖气环境", factor: 1.2, description: "干燥的室内暖气" }
  };

  // 运动强度系数
  const intensityFactors = {
    "light": { name: "轻度", factor: 1.2, sweatRate: 0.3, description: "轻微出汗" },
    "moderate": { name: "中度", factor: 1.5, sweatRate: 0.8, description: "明显出汗" },
    "vigorous": { name: "高强度", factor: 2.0, sweatRate: 1.5, description: "大量出汗" },
    "extreme": { name: "极高强度", factor: 2.5, sweatRate: 2.5, description: "持续大量出汗" }
  };

  // 健康状况影响
  const healthFactors = {
    "fever": { name: "发热", factor: 1.5, description: "每升高1°C增加13%" },
    "diarrhea": { name: "腹泻", factor: 1.8, description: "大量水分流失" },
    "vomiting": { name: "呕吐", factor: 1.6, description: "水分和电解质流失" },
    "diabetes": { name: "糖尿病", factor: 1.3, description: "多尿导致水分流失" },
    "kidney-disease": { name: "肾脏疾病", factor: 0.8, description: "可能需要限制水分" },
    "heart-failure": { name: "心力衰竭", factor: 0.7, description: "需要限制水分摄入" },
    "hypertension": { name: "高血压", factor: 1.1, description: "适当增加水分" },
    "urinary-infection": { name: "泌尿系感染", factor: 1.4, description: "需要冲洗泌尿系统" },
    "constipation": { name: "便秘", factor: 1.3, description: "增加肠道水分" },
    "skin-problems": { name: "皮肤问题", factor: 1.2, description: "改善皮肤水分" },
    "hangover": { name: "宿醉", factor: 1.5, description: "酒精导致脱水" },
    "medication-diuretic": { name: "利尿剂", factor: 1.4, description: "药物增加水分流失" }
  };

  // 生理状态影响
  const lifeStageFactors = {
    "normal": { name: "正常", factor: 1.0, description: "正常生理状态" },
    "pregnancy-1": { name: "孕早期", factor: 1.1, description: "轻微增加需求" },
    "pregnancy-2": { name: "孕中期", factor: 1.3, description: "血容量增加" },
    "pregnancy-3": { name: "孕晚期", factor: 1.4, description: "羊水和血容量增加" },
    "lactation": { name: "哺乳期", factor: 1.6, description: "乳汁分泌需要大量水分" },
    "menstruation": { name: "月经期", factor: 1.2, description: "补充流失的水分" }
  };

  const calculateHydration = () => {
    if (!age || !gender || !weight || !height || !activityLevel || !climate || !lifeStage) {
      alert("请填写所有必填信息");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const exerciseDur = parseFloat(exerciseDuration) || 0;
    const currentIntakeNum = parseFloat(currentIntake) || 0;
    
    if (ageNum <= 0 || ageNum > 120 || weightNum <= 0 || heightNum <= 0) {
      alert("请输入有效的年龄、体重和身高");
      return;
    }

    // 计算BMI
    const bmi = weightNum / Math.pow(heightNum / 100, 2);
    
    // 基础水分需求
    const baseWater = getBaseWaterNeeds(ageNum, gender) * weightNum;
    
    // 各种系数
    const activityFactor = activityFactors[activityLevel as keyof typeof activityFactors]?.factor || 1.0;
    const climateFactor = climateFactors[climate as keyof typeof climateFactors]?.factor || 1.0;
    const lifeStageFactor = lifeStageFactors[lifeStage as keyof typeof lifeStageFactors]?.factor || 1.0;
    
    // 健康状况影响
    let healthFactor = 1.0;
    healthConditions.forEach(condition => {
      const factor = healthFactors[condition as keyof typeof healthFactors]?.factor || 1.0;
      if (condition === "kidney-disease" || condition === "heart-failure") {
        healthFactor = Math.min(healthFactor, factor); // 这些疾病需要限制水分
      } else {
        healthFactor = Math.max(healthFactor, factor);
      }
    });
    
    // 运动额外需求
    let exerciseWater = 0;
    if (exerciseDur > 0 && exerciseIntensity) {
      const intensityInfo = intensityFactors[exerciseIntensity as keyof typeof intensityFactors];
      if (intensityInfo) {
        // 运动中出汗量 (L/小时) * 运动时间 * 1000 (转换为ml)
        exerciseWater = intensityInfo.sweatRate * exerciseDur * 1000;
        // 运动前后额外补充
        exerciseWater += exerciseDur * 200; // 每小时运动额外200ml
      }
    }
    
    // 年龄调整
    let ageFactor = 1.0;
    if (ageNum > 65) {
      ageFactor = 1.2; // 老年人肾脏浓缩功能下降
    } else if (ageNum < 18) {
      ageFactor = 1.1; // 青少年新陈代谢旺盛
    }
    
    // 性别调整
    let genderFactor = 1.0;
    if (gender === "male") {
      genderFactor = 1.1; // 男性肌肉量较高，代谢率较高
    }
    
    // 计算总需求
    const totalFactor = activityFactor * climateFactor * lifeStageFactor * healthFactor * ageFactor * genderFactor;
    const dailyWater = Math.round(baseWater * totalFactor + exerciseWater);
    
    // 每小时分配
    const hourlyWater = Math.round(dailyWater / 16); // 假设16小时清醒时间
    
    // 不同时段分配
    const timeDistribution = {
      morning: Math.round(dailyWater * 0.25), // 早晨
      afternoon: Math.round(dailyWater * 0.35), // 下午
      evening: Math.round(dailyWater * 0.25), // 傍晚
      night: Math.round(dailyWater * 0.15) // 夜间
    };
    
    // 水分来源分配
    const sources = {
      water: Math.round(dailyWater * 0.6), // 纯水
      beverages: Math.round(dailyWater * 0.25), // 其他饮料
      food: Math.round(dailyWater * 0.15) // 食物中的水分
    };
    
    // 脱水风险评估
    let dehydrationRisk = "低";
    let riskColor = "green";
    let riskScore = 0;
    
    // 风险因子评估
    if (ageNum > 65 || ageNum < 5) riskScore += 2;
    if (climateFactor > 1.3) riskScore += 2;
    if (exerciseDur > 2) riskScore += 2;
    if (healthConditions.some(c => ["fever", "diarrhea", "vomiting", "diabetes"].includes(c))) riskScore += 3;
    if (currentIntakeNum > 0 && currentIntakeNum < dailyWater * 0.7) riskScore += 2;
    
    if (riskScore >= 6) {
      dehydrationRisk = "高";
      riskColor = "red";
    } else if (riskScore >= 3) {
      dehydrationRisk = "中";
      riskColor = "orange";
    }
    
    // 水质建议
    const waterQuality = {
      temperature: "室温或微凉 (15-25°C)",
      minerals: "含适量电解质",
      ph: "弱碱性 (pH 7.0-8.5)",
      additives: exerciseDur > 1 ? "运动饮料补充电解质" : "纯净水即可"
    };
    
    // 补水时机建议
    const timing = {
      wakeup: Math.round(dailyWater * 0.1), // 起床后
      beforeMeals: Math.round(dailyWater * 0.05), // 餐前
      afterMeals: Math.round(dailyWater * 0.03), // 餐后
      beforeExercise: Math.round(dailyWater * 0.08), // 运动前
      duringExercise: Math.round(exerciseWater * 0.6), // 运动中
      afterExercise: Math.round(exerciseWater * 0.4), // 运动后
      beforeBed: Math.round(dailyWater * 0.05) // 睡前
    };
    
    // 脱水症状检查
    const dehydrationSymptoms = {
      mild: ["口渴", "尿液颜色加深", "轻微头痛", "疲劳"],
      moderate: ["明显口干", "尿量减少", "头晕", "皮肤弹性差", "心率加快"],
      severe: ["极度口渴", "少尿或无尿", "严重头晕", "意识模糊", "血压下降"]
    };
    
    setResult({
      dailyWater,
      waterPerKg: Math.round((dailyWater / weightNum) * 10) / 10,
      hourlyWater,
      bmi: Math.round(bmi * 10) / 10,
      exerciseWater: Math.round(exerciseWater),
      factors: {
        base: Math.round(baseWater),
        activity: { factor: activityFactor, info: activityFactors[activityLevel as keyof typeof activityFactors] },
        climate: { factor: climateFactor, info: climateFactors[climate as keyof typeof climateFactors] },
        lifeStage: { factor: lifeStageFactor, info: lifeStageFactors[lifeStage as keyof typeof lifeStageFactors] },
        health: { factor: healthFactor, conditions: healthConditions.map(c => healthFactors[c as keyof typeof healthFactors]) },
        age: ageFactor,
        gender: genderFactor,
        total: Math.round(totalFactor * 100) / 100
      },
      timeDistribution,
      sources,
      timing,
      waterQuality,
      dehydrationRisk: {
        level: dehydrationRisk,
        color: riskColor,
        score: riskScore
      },
      dehydrationSymptoms,
      currentIntake: currentIntakeNum,
      deficit: currentIntakeNum > 0 ? Math.max(0, dailyWater - currentIntakeNum) : 0,
      inputData: { age: ageNum, gender, weight: weightNum, height: heightNum, bmi }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setActivityLevel("");
    setClimate("");
    setLifeStage("");
    setHealthConditions([]);
    setExerciseDuration("");
    setExerciseIntensity("");
    setCurrentIntake("");
    setResult(null);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setHealthConditions([...healthConditions, condition]);
    } else {
      setHealthConditions(healthConditions.filter(c => c !== condition));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💧 水分需求计算器</h1>
          <p className="text-lg text-gray-600">
            科学计算个人每日水分需求，维持身体水盐平衡，促进健康
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

                <div>
                  <Label htmlFor="lifeStage">生理状态 *</Label>
                  <Select value={lifeStage} onValueChange={setLifeStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择生理状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">正常</SelectItem>
                      <SelectItem value="pregnancy-1">孕早期</SelectItem>
                      <SelectItem value="pregnancy-2">孕中期</SelectItem>
                      <SelectItem value="pregnancy-3">孕晚期</SelectItem>
                      <SelectItem value="lactation">哺乳期</SelectItem>
                      <SelectItem value="menstruation">月经期</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="activityLevel">活动水平 *</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择活动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">久坐 - 很少运动</SelectItem>
                      <SelectItem value="light">轻度 - 偶尔活动</SelectItem>
                      <SelectItem value="moderate">中度 - 规律运动</SelectItem>
                      <SelectItem value="vigorous">高强度 - 每天运动</SelectItem>
                      <SelectItem value="athlete">专业运动员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="climate">环境气候 *</Label>
                  <Select value={climate} onValueChange={setClimate}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择环境气候" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperate">温带 - 温度适中</SelectItem>
                      <SelectItem value="hot-humid">炎热潮湿</SelectItem>
                      <SelectItem value="hot-dry">炎热干燥</SelectItem>
                      <SelectItem value="cold">寒冷</SelectItem>
                      <SelectItem value="high-altitude">高海拔</SelectItem>
                      <SelectItem value="air-conditioned">空调环境</SelectItem>
                      <SelectItem value="heated-indoor">暖气环境</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseDuration">运动时长 (小时)</Label>
                    <Input
                      id="exerciseDuration"
                      type="number"
                      step="0.5"
                      placeholder="例如：1.5"
                      value={exerciseDuration}
                      onChange={(e) => setExerciseDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseIntensity">运动强度</Label>
                    <Select value={exerciseIntensity} onValueChange={setExerciseIntensity}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择强度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">轻度 - 轻微出汗</SelectItem>
                        <SelectItem value="moderate">中度 - 明显出汗</SelectItem>
                        <SelectItem value="vigorous">高强度 - 大量出汗</SelectItem>
                        <SelectItem value="extreme">极高强度 - 持续大汗</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentIntake">当前每日水分摄入 (ml)</Label>
                  <Input
                    id="currentIntake"
                    type="number"
                    placeholder="例如：2000"
                    value={currentIntake}
                    onChange={(e) => setCurrentIntake(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 健康状况 */}
            <Card>
              <CardHeader>
                <CardTitle>健康状况</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(healthFactors).map(([key, factor]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Checkbox
                        id={key}
                        checked={healthConditions.includes(key)}
                        onCheckedChange={(checked) => handleConditionChange(key, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {factor.name}
                        </Label>
                        <p className="text-xs text-gray-500">{factor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateHydration} className="flex-1">
                计算水分需求
              </Button>
              <Button variant="outline" onClick={resetForm}>
                重置
              </Button>
            </div>
          </div>

          {/* 计算结果 */}
          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>水分需求结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{result.dailyWater}</div>
                          <div className="text-sm text-gray-600">毫升/天</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {result.waterPerKg} ml/kg体重 • 每小时约 {result.hourlyWater}ml
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <Separator />

                    <div className={`p-3 rounded text-center ${
                      result.dehydrationRisk.color === "green" ? "bg-green-50 border border-green-200" :
                      result.dehydrationRisk.color === "orange" ? "bg-orange-50 border border-orange-200" :
                      "bg-red-50 border border-red-200"
                    }`}>
                      <div className={`font-semibold ${
                        result.dehydrationRisk.color === "green" ? "text-green-700" :
                        result.dehydrationRisk.color === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        脱水风险: {result.dehydrationRisk.level}
                      </div>
                      <div className="text-sm text-gray-600">
                        BMI: {result.bmi} • 风险评分: {result.dehydrationRisk.score}
                      </div>
                    </div>

                    {result.currentIntake > 0 && (
                      <div className="p-3 bg-blue-50 rounded">
                        <div className="flex justify-between items-center">
                          <span>当前摄入:</span>
                          <span className="font-semibold">{result.currentIntake}ml</span>
                        </div>
                        {result.deficit > 0 && (
                          <div className="flex justify-between items-center text-red-600">
                            <span>不足:</span>
                            <span className="font-semibold">{result.deficit}ml</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 时段分配 */}
                <Card>
                  <CardHeader>
                    <CardTitle>时段分配建议</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span className="font-medium">早晨 (25%):</span>
                      <span className="font-semibold">{result.timeDistribution.morning}ml</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">下午 (35%):</span>
                      <span className="font-semibold">{result.timeDistribution.afternoon}ml</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">傍晚 (25%):</span>
                      <span className="font-semibold">{result.timeDistribution.evening}ml</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span className="font-medium">夜间 (15%):</span>
                      <span className="font-semibold">{result.timeDistribution.night}ml</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 水分来源 */}
                <Card>
                  <CardHeader>
                    <CardTitle>水分来源分配</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="font-medium">纯水 (60%):</span>
                      <span className="font-semibold">{result.sources.water}ml</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium">其他饮料 (25%):</span>
                      <span className="font-semibold">{result.sources.beverages}ml</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                      <span className="font-medium">食物水分 (15%):</span>
                      <span className="font-semibold">{result.sources.food}ml</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 补水时机 */}
                <Card>
                  <CardHeader>
                    <CardTitle>补水时机建议</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>起床后:</span>
                        <span className="font-semibold">{result.timing.wakeup}ml</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>餐前:</span>
                        <span className="font-semibold">{result.timing.beforeMeals}ml</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>餐后:</span>
                        <span className="font-semibold">{result.timing.afterMeals}ml</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>睡前:</span>
                        <span className="font-semibold">{result.timing.beforeBed}ml</span>
                      </div>
                    </div>
                    
                    {result.exerciseWater > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="font-medium">运动补水:</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex justify-between p-2 bg-red-50 rounded">
                            <span>运动前:</span>
                            <span className="font-semibold">{result.timing.beforeExercise}ml</span>
                          </div>
                          <div className="flex justify-between p-2 bg-orange-50 rounded">
                            <span>运动中:</span>
                            <span className="font-semibold">{result.timing.duringExercise}ml</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 rounded">
                            <span>运动后:</span>
                            <span className="font-semibold">{result.timing.afterExercise}ml</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* 影响因子分析 */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>影响因子分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>基础需求:</span>
                    <span className="font-semibold">{result.factors.base}ml</span>
                  </div>
                  <Progress value={(result.factors.base / result.dailyWater) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>活动水平:</span>
                    <span className="font-semibold">{result.factors.activity.factor}x</span>
                  </div>
                  <Progress value={(result.factors.activity.factor - 0.5) * 50} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.activity.info.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>环境气候:</span>
                    <span className="font-semibold">{result.factors.climate.factor}x</span>
                  </div>
                  <Progress value={(result.factors.climate.factor - 0.5) * 50} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.climate.info.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>生理状态:</span>
                    <span className="font-semibold">{result.factors.lifeStage.factor}x</span>
                  </div>
                  <Progress value={(result.factors.lifeStage.factor - 0.5) * 50} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.lifeStage.info.description}</p>
                </div>

                {result.factors.health.factor !== 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>健康状况:</span>
                      <span className="font-semibold">{result.factors.health.factor}x</span>
                    </div>
                    <Progress value={(result.factors.health.factor - 0.5) * 50} className="h-2" />
                    <div className="text-xs text-gray-600">
                      {result.factors.health.conditions.map((c: any, i: number) => (
                        <div key={i}>• {c.name}</div>
                      ))}
                    </div>
                  </div>
                )}

                {result.exerciseWater > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>运动额外:</span>
                      <span className="font-semibold">{result.exerciseWater}ml</span>
                    </div>
                    <Progress value={(result.exerciseWater / result.dailyWater) * 100} className="h-2" />
                  </div>
                )}
              </div>

              <Separator className="my-4" />
              <div className="flex justify-between items-center font-semibold">
                <span>总影响因子:</span>
                <span>{result.factors.total}x</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 水质建议 */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>水质建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">温度:</span>
                    <span>{result.waterQuality.temperature}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">矿物质:</span>
                    <span>{result.waterQuality.minerals}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">pH值:</span>
                    <span>{result.waterQuality.ph}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span className="font-medium">添加剂:</span>
                    <span>{result.waterQuality.additives}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 脱水症状检查 */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>脱水症状自检</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-yellow-700">轻度脱水</h3>
                  <ul className="text-sm space-y-1">
                    {result.dehydrationSymptoms.mild.map((symptom: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-orange-700">中度脱水</h3>
                  <ul className="text-sm space-y-1">
                    {result.dehydrationSymptoms.moderate.map((symptom: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-red-700">重度脱水</h3>
                  <ul className="text-sm space-y-1">
                    {result.dehydrationSymptoms.severe.map((symptom: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>注意:</strong> 如出现中度或重度脱水症状，请立即补充水分并寻求医疗帮助。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* 水分知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 水分知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">水分的重要作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• 维持体温调节</li>
                  <li>• 运输营养物质</li>
                  <li>• 排除代谢废物</li>
                  <li>• 润滑关节</li>
                  <li>• 保护器官组织</li>
                  <li>• 维持血压</li>
                  <li>• 促进消化</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">最佳补水时机</h3>
                <ul className="text-sm space-y-1">
                  <li>• 起床后立即补水</li>
                  <li>• 餐前30分钟</li>
                  <li>• 运动前、中、后</li>
                  <li>• 感到口渴前</li>
                  <li>• 空调环境下</li>
                  <li>• 飞行旅行时</li>
                  <li>• 生病发热时</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">补水注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 少量多次，避免一次大量</li>
                  <li>• 温水比冰水更好</li>
                  <li>• 运动时补充电解质</li>
                  <li>• 避免过量饮水中毒</li>
                  <li>• 肾病患者需限制水分</li>
                  <li>• 观察尿液颜色判断</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">水分来源</h3>
                <ul className="text-sm space-y-1">
                  <li>• 白开水 (最佳选择)</li>
                  <li>• 淡茶水</li>
                  <li>• 新鲜果汁 (稀释)</li>
                  <li>• 汤类</li>
                  <li>• 水果 (西瓜、橙子)</li>
                  <li>• 蔬菜 (黄瓜、生菜)</li>
                  <li>• 牛奶、酸奶</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}