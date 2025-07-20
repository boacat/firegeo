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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MuscleMassCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [measurements, setMeasurements] = useState({
    neck: "",
    chest: "",
    waist: "",
    hip: "",
    bicep: "",
    forearm: "",
    thigh: "",
    calf: ""
  });
  const [result, setResult] = useState<any>(null);

  const calculateMuscleMass = () => {
    if (!age || !gender || !height || !weight) {
      alert("请填写基本信息");
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const bodyFatNum = bodyFat ? parseFloat(bodyFat) : null;

    if (ageNum <= 0 || ageNum > 120 || heightNum <= 0 || weightNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // 计算BMI
    const bmi = weightNum / Math.pow(heightNum / 100, 2);

    // 估算体脂率（如果未提供）
    let estimatedBodyFat = bodyFatNum;
    if (!estimatedBodyFat) {
      // 使用BMI和年龄估算体脂率
      if (gender === "male") {
        estimatedBodyFat = (1.20 * bmi) + (0.23 * ageNum) - 16.2;
      } else {
        estimatedBodyFat = (1.20 * bmi) + (0.23 * ageNum) - 5.4;
      }
      estimatedBodyFat = Math.max(3, Math.min(50, estimatedBodyFat));
    }

    // 计算瘦体重（肌肉量 + 骨骼 + 器官等）
    const leanBodyMass = weightNum * (1 - estimatedBodyFat / 100);

    // 估算肌肉量（瘦体重的约80-85%）
    const muscleMassPercentage = gender === "male" ? 0.83 : 0.80;
    const estimatedMuscleMass = leanBodyMass * muscleMassPercentage;

    // 使用Boer公式计算肌肉量
    let boerMuscleMass;
    if (gender === "male") {
      boerMuscleMass = (0.407 * weightNum) + (0.267 * heightNum) - 19.2;
    } else {
      boerMuscleMass = (0.252 * weightNum) + (0.473 * heightNum) - 48.3;
    }

    // 使用Hume公式计算瘦体重
    let humeMuscleMass;
    if (gender === "male") {
      humeMuscleMass = (0.32810 * weightNum) + (0.33929 * heightNum) - 29.5336;
    } else {
      humeMuscleMass = (0.29569 * weightNum) + (0.41813 * heightNum) - 43.2933;
    }
    humeMuscleMass *= 0.82; // 转换为肌肉量

    // 平均肌肉量
    const averageMuscleMass = (estimatedMuscleMass + boerMuscleMass + humeMuscleMass) / 3;

    // 肌肉量百分比
    const muscleMassPercentageOfBody = (averageMuscleMass / weightNum) * 100;

    // 年龄相关的肌肉量标准
    const getAgeAdjustedStandards = (age: number, gender: string) => {
      const baseStandards = gender === "male" 
        ? { low: 35, normal: 42, good: 48, excellent: 52 }
        : { low: 28, normal: 34, good: 38, excellent: 42 };
      
      // 年龄调整因子
      let ageFactor = 1;
      if (age >= 30) ageFactor -= (age - 30) * 0.005; // 30岁后每年减少0.5%
      if (age >= 50) ageFactor -= (age - 50) * 0.005; // 50岁后额外减少
      
      return {
        low: baseStandards.low * ageFactor,
        normal: baseStandards.normal * ageFactor,
        good: baseStandards.good * ageFactor,
        excellent: baseStandards.excellent * ageFactor
      };
    };

    const standards = getAgeAdjustedStandards(ageNum, gender);

    // 评估肌肉量水平
    let muscleLevel = "";
    let levelColor = "";
    let recommendations = [];

    if (muscleMassPercentageOfBody < standards.low) {
      muscleLevel = "偏低";
      levelColor = "red";
      recommendations = [
        "增加蛋白质摄入",
        "开始力量训练",
        "考虑咨询营养师"
      ];
    } else if (muscleMassPercentageOfBody < standards.normal) {
      muscleLevel = "正常偏低";
      levelColor = "orange";
      recommendations = [
        "适量增加蛋白质",
        "规律进行阻力训练",
        "保持活跃生活方式"
      ];
    } else if (muscleMassPercentageOfBody < standards.good) {
      muscleLevel = "正常";
      levelColor = "blue";
      recommendations = [
        "维持当前训练强度",
        "保持均衡饮食",
        "定期评估进展"
      ];
    } else if (muscleMassPercentageOfBody < standards.excellent) {
      muscleLevel = "良好";
      levelColor = "green";
      recommendations = [
        "继续保持训练",
        "可考虑增加训练强度",
        "注意恢复和营养"
      ];
    } else {
      muscleLevel = "优秀";
      levelColor = "green";
      recommendations = [
        "肌肉量优秀",
        "保持当前状态",
        "可专注于力量提升"
      ];
    }

    // 计算理想肌肉量范围
    const idealMuscleMassMin = (standards.normal / 100) * weightNum;
    const idealMuscleMassMax = (standards.good / 100) * weightNum;

    // 肌肉增长潜力评估
    const getGrowthPotential = () => {
      const experienceFactor = {
        "beginner": 1.0,
        "intermediate": 0.7,
        "advanced": 0.4,
        "expert": 0.2
      };
      
      const ageFactor = ageNum < 25 ? 1.0 : 
                       ageNum < 35 ? 0.9 : 
                       ageNum < 45 ? 0.7 : 
                       ageNum < 55 ? 0.5 : 0.3;
      
      const genderFactor = gender === "male" ? 1.0 : 0.7;
      
      const basePotential = 10; // 基础增长潜力（公斤）
      const totalFactor = (experienceFactor[experienceLevel as keyof typeof experienceFactor] || 0.7) * ageFactor * genderFactor;
      
      return basePotential * totalFactor;
    };

    const growthPotential = getGrowthPotential();

    // 训练建议
    const getTrainingRecommendations = () => {
      const recommendations = {
        frequency: "",
        intensity: "",
        volume: "",
        focus: "",
        progression: ""
      };

      if (experienceLevel === "beginner") {
        recommendations.frequency = "每周3-4次全身训练";
        recommendations.intensity = "中等强度，注重动作学习";
        recommendations.volume = "每个肌群8-12组/周";
        recommendations.focus = "复合动作为主";
        recommendations.progression = "每周增加2.5-5kg负重";
      } else if (experienceLevel === "intermediate") {
        recommendations.frequency = "每周4-5次，上下肢分化";
        recommendations.intensity = "中高强度训练";
        recommendations.volume = "每个肌群12-16组/周";
        recommendations.focus = "复合+孤立动作结合";
        recommendations.progression = "每2周增加负重或次数";
      } else if (experienceLevel === "advanced") {
        recommendations.frequency = "每周5-6次，精细分化";
        recommendations.intensity = "高强度，多样化训练";
        recommendations.volume = "每个肌群16-20组/周";
        recommendations.focus = "专项弱点训练";
        recommendations.progression = "周期化训练计划";
      } else {
        recommendations.frequency = "每周6次，专业分化";
        recommendations.intensity = "极高强度，精准控制";
        recommendations.volume = "每个肌群20+组/周";
        recommendations.focus = "竞技水平训练";
        recommendations.progression = "高级周期化";
      }

      return recommendations;
    };

    const trainingRec = getTrainingRecommendations();

    // 营养建议
    const getNutritionRecommendations = () => {
      const bmr = gender === "male" 
        ? 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum)
        : 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
      
      const activityMultiplier = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very-active": 1.9
      };
      
      const tdee = bmr * (activityMultiplier[activityLevel as keyof typeof activityMultiplier] || 1.55);
      
      let calorieAdjustment = 0;
      if (fitnessGoal === "bulk") {
        calorieAdjustment = 300;
      } else if (fitnessGoal === "cut") {
        calorieAdjustment = -500;
      }
      
      const targetCalories = tdee + calorieAdjustment;
      const proteinGrams = weightNum * (fitnessGoal === "bulk" ? 2.2 : 2.0);
      const fatGrams = weightNum * 1.0;
      const carbGrams = (targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4;
      
      return {
        calories: Math.round(targetCalories),
        protein: Math.round(proteinGrams),
        carbs: Math.round(Math.max(0, carbGrams)),
        fat: Math.round(fatGrams)
      };
    };

    const nutrition = getNutritionRecommendations();

    // 身体成分分析
    const bodyComposition = {
      muscleMass: Math.round(averageMuscleMass * 10) / 10,
      fatMass: Math.round(weightNum * estimatedBodyFat / 100 * 10) / 10,
      boneMass: Math.round(weightNum * 0.15 * 10) / 10, // 估算骨量
      organMass: Math.round((leanBodyMass - averageMuscleMass) * 10) / 10
    };

    // 肌肉分布估算（基于测量数据）
    const getMuscleDistribution = () => {
      if (!measurements.chest && !measurements.bicep && !measurements.thigh) {
        return null;
      }
      
      const distribution = {
        upperBody: 0,
        lowerBody: 0,
        core: 0
      };
      
      // 简化的肌肉分布估算
      const totalMuscle = averageMuscleMass;
      distribution.upperBody = totalMuscle * 0.45; // 上肢约45%
      distribution.lowerBody = totalMuscle * 0.45; // 下肢约45%
      distribution.core = totalMuscle * 0.10; // 核心约10%
      
      return distribution;
    };

    const muscleDistribution = getMuscleDistribution();

    setResult({
      muscleMass: {
        estimated: Math.round(estimatedMuscleMass * 10) / 10,
        boer: Math.round(boerMuscleMass * 10) / 10,
        hume: Math.round(humeMuscleMass * 10) / 10,
        average: Math.round(averageMuscleMass * 10) / 10,
        percentage: Math.round(muscleMassPercentageOfBody * 10) / 10
      },
      assessment: {
        level: muscleLevel,
        color: levelColor,
        recommendations
      },
      standards,
      idealRange: {
        min: Math.round(idealMuscleMassMin * 10) / 10,
        max: Math.round(idealMuscleMassMax * 10) / 10
      },
      bodyComposition,
      growthPotential: Math.round(growthPotential * 10) / 10,
      training: trainingRec,
      nutrition,
      muscleDistribution,
      bmi: Math.round(bmi * 10) / 10,
      bodyFat: Math.round(estimatedBodyFat * 10) / 10,
      leanBodyMass: Math.round(leanBodyMass * 10) / 10
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setBodyFat("");
    setActivityLevel("");
    setFitnessGoal("");
    setExperienceLevel("");
    setMeasurements({
      neck: "",
      chest: "",
      waist: "",
      hip: "",
      bicep: "",
      forearm: "",
      thigh: "",
      calf: ""
    });
    setResult(null);
  };

  const handleMeasurementChange = (part: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [part]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💪 肌肉量计算器</h1>
          <p className="text-lg text-gray-600">
            科学评估您的肌肉量水平，制定个性化的训练和营养计划
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
                      placeholder="例如：25"
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
                    <Label htmlFor="height">身高 (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="例如：175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
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
                </div>

                <div>
                  <Label htmlFor="bodyFat">体脂率 (%) - 可选</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="例如：15（如不知道可留空）"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 活动和目标 */}
            <Card>
              <CardHeader>
                <CardTitle>活动水平和目标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="activityLevel">活动水平</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择活动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">久坐（很少运动）</SelectItem>
                      <SelectItem value="light">轻度活动（每周1-3次轻度运动）</SelectItem>
                      <SelectItem value="moderate">中度活动（每周3-5次中度运动）</SelectItem>
                      <SelectItem value="active">高度活动（每周6-7次运动）</SelectItem>
                      <SelectItem value="very-active">极高活动（每天2次运动或重体力劳动）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fitnessGoal">健身目标</Label>
                  <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择健身目标" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintain">维持现状</SelectItem>
                      <SelectItem value="bulk">增肌</SelectItem>
                      <SelectItem value="cut">减脂</SelectItem>
                      <SelectItem value="recomp">身体重组（同时增肌减脂）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experienceLevel">训练经验</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择训练经验" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">初学者（0-1年）</SelectItem>
                      <SelectItem value="intermediate">中级（1-3年）</SelectItem>
                      <SelectItem value="advanced">高级（3-5年）</SelectItem>
                      <SelectItem value="expert">专家（5年以上）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 身体测量（可选） */}
            <Card>
              <CardHeader>
                <CardTitle>身体测量 - 可选</CardTitle>
                <p className="text-sm text-gray-600">提供更准确的肌肉分布分析</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neck">颈围 (cm)</Label>
                    <Input
                      id="neck"
                      type="number"
                      step="0.1"
                      placeholder="例如：38"
                      value={measurements.neck}
                      onChange={(e) => handleMeasurementChange('neck', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="chest">胸围 (cm)</Label>
                    <Input
                      id="chest"
                      type="number"
                      step="0.1"
                      placeholder="例如：100"
                      value={measurements.chest}
                      onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="waist">腰围 (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      step="0.1"
                      placeholder="例如：80"
                      value={measurements.waist}
                      onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hip">臀围 (cm)</Label>
                    <Input
                      id="hip"
                      type="number"
                      step="0.1"
                      placeholder="例如：95"
                      value={measurements.hip}
                      onChange={(e) => handleMeasurementChange('hip', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bicep">上臂围 (cm)</Label>
                    <Input
                      id="bicep"
                      type="number"
                      step="0.1"
                      placeholder="例如：35"
                      value={measurements.bicep}
                      onChange={(e) => handleMeasurementChange('bicep', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="forearm">前臂围 (cm)</Label>
                    <Input
                      id="forearm"
                      type="number"
                      step="0.1"
                      placeholder="例如：28"
                      value={measurements.forearm}
                      onChange={(e) => handleMeasurementChange('forearm', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="thigh">大腿围 (cm)</Label>
                    <Input
                      id="thigh"
                      type="number"
                      step="0.1"
                      placeholder="例如：55"
                      value={measurements.thigh}
                      onChange={(e) => handleMeasurementChange('thigh', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calf">小腿围 (cm)</Label>
                    <Input
                      id="calf"
                      type="number"
                      step="0.1"
                      placeholder="例如：38"
                      value={measurements.calf}
                      onChange={(e) => handleMeasurementChange('calf', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateMuscleMass} className="flex-1">
                计算肌肉量
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
                    <CardTitle>肌肉量评估</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border text-center ${
                      result.assessment.color === "green" ? "bg-green-50 border-green-200" :
                      result.assessment.color === "blue" ? "bg-blue-50 border-blue-200" :
                      result.assessment.color === "orange" ? "bg-orange-50 border-orange-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        result.assessment.color === "green" ? "text-green-700" :
                        result.assessment.color === "blue" ? "text-blue-700" :
                        result.assessment.color === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        {result.assessment.level}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        肌肉量: {result.muscleMass.average} kg ({result.muscleMass.percentage}%)
                      </div>
                      <Progress 
                        value={Math.min(100, (result.muscleMass.percentage / result.standards.excellent) * 100)} 
                        className="mb-3"
                      />
                      <div className="space-y-1">
                        {result.assessment.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="text-sm">{rec}</div>
                        ))}
                      </div>
                    </div>

                    {/* 基础指标 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded text-center">
                        <div className="text-sm font-medium">BMI</div>
                        <div className="text-lg">{result.bmi}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded text-center">
                        <div className="text-sm font-medium">体脂率</div>
                        <div className="text-lg">{result.bodyFat}%</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded text-center">
                        <div className="text-sm font-medium">瘦体重</div>
                        <div className="text-lg">{result.leanBodyMass} kg</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 详细分析 */}
                <Tabs defaultValue="composition" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="composition">身体成分</TabsTrigger>
                    <TabsTrigger value="standards">参考标准</TabsTrigger>
                    <TabsTrigger value="training">训练建议</TabsTrigger>
                    <TabsTrigger value="nutrition">营养建议</TabsTrigger>
                  </TabsList>

                  <TabsContent value="composition">
                    <Card>
                      <CardHeader>
                        <CardTitle>身体成分分析</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">肌肉量</span>
                            <span className="text-sm">{result.bodyComposition.muscleMass} kg</span>
                          </div>
                          <Progress value={(result.bodyComposition.muscleMass / parseFloat(weight)) * 100} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">脂肪量</span>
                            <span className="text-sm">{result.bodyComposition.fatMass} kg</span>
                          </div>
                          <Progress value={(result.bodyComposition.fatMass / parseFloat(weight)) * 100} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">骨量</span>
                            <span className="text-sm">{result.bodyComposition.boneMass} kg</span>
                          </div>
                          <Progress value={(result.bodyComposition.boneMass / parseFloat(weight)) * 100} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">器官等</span>
                            <span className="text-sm">{result.bodyComposition.organMass} kg</span>
                          </div>
                          <Progress value={(result.bodyComposition.organMass / parseFloat(weight)) * 100} className="h-2" />
                        </div>

                        {result.muscleDistribution && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-3">肌肉分布估算</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">上肢肌肉</span>
                                <span className="text-sm">{result.muscleDistribution.upperBody.toFixed(1)} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">下肢肌肉</span>
                                <span className="text-sm">{result.muscleDistribution.lowerBody.toFixed(1)} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">核心肌肉</span>
                                <span className="text-sm">{result.muscleDistribution.core.toFixed(1)} kg</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="standards">
                    <Card>
                      <CardHeader>
                        <CardTitle>年龄调整参考标准</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-red-50 rounded">
                              <div className="text-sm font-medium text-red-700">偏低</div>
                              <div className="text-lg">< {result.standards.low.toFixed(1)}%</div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded">
                              <div className="text-sm font-medium text-orange-700">正常偏低</div>
                              <div className="text-lg">{result.standards.low.toFixed(1)}-{result.standards.normal.toFixed(1)}%</div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded">
                              <div className="text-sm font-medium text-blue-700">正常</div>
                              <div className="text-lg">{result.standards.normal.toFixed(1)}-{result.standards.good.toFixed(1)}%</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded">
                              <div className="text-sm font-medium text-green-700">优秀</div>
                              <div className="text-lg">≥ {result.standards.excellent.toFixed(1)}%</div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium mb-2">理想肌肉量范围</h4>
                            <div className="p-3 bg-gray-50 rounded">
                              <div className="text-center">
                                <span className="text-lg font-semibold">
                                  {result.idealRange.min} - {result.idealRange.max} kg
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="font-medium mb-2">增长潜力评估</h4>
                            <div className="p-3 bg-blue-50 rounded text-center">
                              <div className="text-lg font-semibold text-blue-700">
                                预计可增长 {result.growthPotential} kg
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                基于年龄、性别和训练经验
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="training">
                    <Card>
                      <CardHeader>
                        <CardTitle>个性化训练建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">训练频率</h4>
                            <p className="text-sm">{result.training.frequency}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">训练强度</h4>
                            <p className="text-sm">{result.training.intensity}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-orange-700 mb-2">训练量</h4>
                            <p className="text-sm">{result.training.volume}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-purple-700 mb-2">训练重点</h4>
                            <p className="text-sm">{result.training.focus}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">进阶方式</h4>
                            <p className="text-sm">{result.training.progression}</p>
                          </div>
                        </div>

                        <Alert>
                          <AlertDescription>
                            建议在专业教练指导下进行训练，确保动作正确性和安全性。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="nutrition">
                    <Card>
                      <CardHeader>
                        <CardTitle>营养摄入建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded text-center">
                            <div className="text-sm font-medium text-blue-700">每日热量</div>
                            <div className="text-lg font-semibold">{result.nutrition.calories} kcal</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded text-center">
                            <div className="text-sm font-medium text-green-700">蛋白质</div>
                            <div className="text-lg font-semibold">{result.nutrition.protein} g</div>
                          </div>
                          <div className="p-3 bg-orange-50 rounded text-center">
                            <div className="text-sm font-medium text-orange-700">碳水化合物</div>
                            <div className="text-lg font-semibold">{result.nutrition.carbs} g</div>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded text-center">
                            <div className="text-sm font-medium text-yellow-700">脂肪</div>
                            <div className="text-lg font-semibold">{result.nutrition.fat} g</div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-3">营养时机建议</h4>
                          <div className="space-y-2 text-sm">
                            <div>• 训练前1-2小时：适量碳水化合物</div>
                            <div>• 训练后30分钟内：蛋白质 + 碳水化合物</div>
                            <div>• 睡前：缓释蛋白质（如酪蛋白）</div>
                            <div>• 全天：均匀分配蛋白质摄入</div>
                          </div>
                        </div>

                        <Alert>
                          <AlertDescription>
                            营养需求因人而异，建议咨询专业营养师制定个性化方案。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>

        {/* 肌肉量知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💪 肌肉量知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">肌肉量的重要性</h3>
                <ul className="text-sm space-y-1">
                  <li>• 提高基础代谢率，有助于体重管理</li>
                  <li>• 增强力量和运动表现</li>
                  <li>• 改善骨密度，预防骨质疏松</li>
                  <li>• 提高胰岛素敏感性</li>
                  <li>• 延缓衰老过程</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">影响肌肉量的因素</h3>
                <ul className="text-sm space-y-1">
                  <li>• 年龄：30岁后每年流失0.5-1%</li>
                  <li>• 性别：男性天然肌肉量更高</li>
                  <li>• 遗传：基因决定肌肉类型分布</li>
                  <li>• 训练：阻力训练是关键</li>
                  <li>• 营养：充足蛋白质摄入</li>
                  <li>• 睡眠：肌肉恢复和生长的关键</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">测量方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• DEXA扫描：最准确的方法</li>
                  <li>• 生物电阻抗：便捷但精度有限</li>
                  <li>• 水下称重：传统金标准</li>
                  <li>• 公式估算：基于身高体重</li>
                  <li>• 围度测量：间接评估方法</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">增肌要点</h3>
                <ul className="text-sm space-y-1">
                  <li>• 渐进性超负荷训练</li>
                  <li>• 充足的蛋白质摄入（1.6-2.2g/kg）</li>
                  <li>• 适当的热量盈余（增肌期）</li>
                  <li>• 充足的睡眠（7-9小时）</li>
                  <li>• 合理的训练频率和恢复</li>
                  <li>• 坚持和耐心</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">计算原理</h3>
                <ul className="text-sm space-y-1">
                  <li>• 使用多种公式综合评估</li>
                  <li>• Boer公式：基于身高体重</li>
                  <li>• Hume公式：计算瘦体重</li>
                  <li>• 体脂率法：总重量减去脂肪量</li>
                  <li>• 年龄性别调整：考虑生理差异</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">准确性说明</h3>
                <ul className="text-sm space-y-1">
                  <li>• 估算结果仅供参考</li>
                  <li>• 个体差异较大</li>
                  <li>• 建议结合专业测量</li>
                  <li>• 定期重新评估</li>
                  <li>• 关注趋势变化</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}