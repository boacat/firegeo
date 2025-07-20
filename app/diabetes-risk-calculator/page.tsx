"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface DiabetesResult {
  riskScore: number;
  riskLevel: string;
  riskPercentage: number;
  riskFactors: {
    factor: string;
    present: boolean;
    impact: string;
    score: number;
  }[];
  recommendations: {
    category: string;
    actions: string[];
  }[];
  screeningAdvice: {
    frequency: string;
    nextTest: string;
    tests: string[];
  };
  preventionPlan: {
    diet: string[];
    exercise: string[];
    lifestyle: string[];
    monitoring: string[];
  };
}

export default function DiabetesRiskCalculator() {
  // 基本信息
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waistCircumference, setWaistCircumference] = useState("");
  
  // 生活方式
  const [physicalActivity, setPhysicalActivity] = useState("");
  const [dietQuality, setDietQuality] = useState([3]); // 1-5分
  const [smokingStatus, setSmokingStatus] = useState("");
  const [alcoholConsumption, setAlcoholConsumption] = useState("");
  const [stressLevel, setStressLevel] = useState([3]); // 1-5分
  const [sleepQuality, setSleepQuality] = useState([3]); // 1-5分
  
  // 健康状况
  const [bloodPressure, setBloodPressure] = useState("");
  const [cholesterolLevel, setCholesterolLevel] = useState("");
  const [fastingGlucose, setFastingGlucose] = useState("");
  const [hba1c, setHba1c] = useState("");
  
  // 家族史和病史
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  
  // 女性特有因素
  const [gestationalDiabetes, setGestationalDiabetes] = useState("");
  const [pcos, setPcos] = useState("");
  const [birthWeight, setBirthWeight] = useState("");
  
  // 症状
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  const [result, setResult] = useState<DiabetesResult | null>(null);

  const familyHistoryOptions = [
    "父母有糖尿病", "兄弟姐妹有糖尿病", "祖父母有糖尿病",
    "家族有心血管疾病", "家族有高血压", "家族有肥胖"
  ];

  const medicalHistoryOptions = [
    "高血压", "高胆固醇", "心血管疾病", "中风", "肾脏疾病",
    "甲状腺疾病", "睡眠呼吸暂停", "抑郁症", "多囊卵巢综合征"
  ];

  const medicationOptions = [
    "降压药", "他汀类药物", "利尿剂", "β受体阻滞剂",
    "糖皮质激素", "抗精神病药物", "免疫抑制剂"
  ];

  const symptomOptions = [
    "多饮", "多尿", "多食", "体重下降", "疲劳乏力",
    "视力模糊", "伤口愈合慢", "皮肤瘙痒", "反复感染",
    "手脚麻木", "口干", "恶心呕吐"
  ];

  const calculateDiabetesRisk = () => {
    if (!age || !gender || !height || !weight) {
      alert("请填写基本信息");
      return;
    }
    
    const ageValue = parseInt(age);
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const bmi = weightValue / Math.pow(heightValue / 100, 2);
    const waistValue = parseFloat(waistCircumference) || 0;
    
    let totalScore = 0;
    const riskFactors: any[] = [];
    
    // 年龄评分
    let ageScore = 0;
    if (ageValue >= 65) {
      ageScore = 4;
      riskFactors.push({
        factor: "年龄≥65岁",
        present: true,
        impact: "高风险",
        score: 4
      });
    } else if (ageValue >= 45) {
      ageScore = 3;
      riskFactors.push({
        factor: "年龄45-64岁",
        present: true,
        impact: "中高风险",
        score: 3
      });
    } else if (ageValue >= 35) {
      ageScore = 2;
      riskFactors.push({
        factor: "年龄35-44岁",
        present: true,
        impact: "中等风险",
        score: 2
      });
    } else {
      ageScore = 1;
      riskFactors.push({
        factor: "年龄<35岁",
        present: true,
        impact: "低风险",
        score: 1
      });
    }
    totalScore += ageScore;
    
    // BMI评分
    let bmiScore = 0;
    if (bmi >= 30) {
      bmiScore = 4;
      riskFactors.push({
        factor: "肥胖（BMI≥30）",
        present: true,
        impact: "高风险",
        score: 4
      });
    } else if (bmi >= 25) {
      bmiScore = 3;
      riskFactors.push({
        factor: "超重（BMI 25-29.9）",
        present: true,
        impact: "中高风险",
        score: 3
      });
    } else if (bmi >= 23) {
      bmiScore = 2;
      riskFactors.push({
        factor: "BMI偏高（23-24.9）",
        present: true,
        impact: "中等风险",
        score: 2
      });
    } else {
      bmiScore = 1;
      riskFactors.push({
        factor: "体重正常",
        present: true,
        impact: "低风险",
        score: 1
      });
    }
    totalScore += bmiScore;
    
    // 腰围评分
    if (waistValue > 0) {
      let waistScore = 0;
      const waistThreshold = gender === "male" ? 90 : 85;
      if (waistValue >= waistThreshold + 10) {
        waistScore = 3;
        riskFactors.push({
          factor: "腹型肥胖（严重）",
          present: true,
          impact: "高风险",
          score: 3
        });
      } else if (waistValue >= waistThreshold) {
        waistScore = 2;
        riskFactors.push({
          factor: "腹型肥胖",
          present: true,
          impact: "中等风险",
          score: 2
        });
      }
      totalScore += waistScore;
    }
    
    // 生活方式评分
    if (physicalActivity === "none") {
      totalScore += 3;
      riskFactors.push({
        factor: "缺乏运动",
        present: true,
        impact: "中高风险",
        score: 3
      });
    } else if (physicalActivity === "light") {
      totalScore += 2;
      riskFactors.push({
        factor: "运动不足",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    if (dietQuality[0] <= 2) {
      totalScore += 2;
      riskFactors.push({
        factor: "饮食质量差",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    if (smokingStatus === "current") {
      totalScore += 2;
      riskFactors.push({
        factor: "目前吸烟",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    if (stressLevel[0] >= 4) {
      totalScore += 2;
      riskFactors.push({
        factor: "高压力水平",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    if (sleepQuality[0] <= 2) {
      totalScore += 2;
      riskFactors.push({
        factor: "睡眠质量差",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    // 健康状况评分
    if (bloodPressure === "high") {
      totalScore += 3;
      riskFactors.push({
        factor: "高血压",
        present: true,
        impact: "中高风险",
        score: 3
      });
    }
    
    if (cholesterolLevel === "high") {
      totalScore += 2;
      riskFactors.push({
        factor: "高胆固醇",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    // 血糖相关检查
    const glucoseValue = parseFloat(fastingGlucose);
    const hba1cValue = parseFloat(hba1c);
    
    if (glucoseValue >= 7.0 || hba1cValue >= 6.5) {
      totalScore += 10; // 已经是糖尿病
      riskFactors.push({
        factor: "血糖达到糖尿病标准",
        present: true,
        impact: "确诊糖尿病",
        score: 10
      });
    } else if (glucoseValue >= 6.1 || hba1cValue >= 6.0) {
      totalScore += 5;
      riskFactors.push({
        factor: "糖尿病前期",
        present: true,
        impact: "极高风险",
        score: 5
      });
    } else if (glucoseValue >= 5.6 || hba1cValue >= 5.7) {
      totalScore += 3;
      riskFactors.push({
        factor: "血糖偏高",
        present: true,
        impact: "高风险",
        score: 3
      });
    }
    
    // 家族史评分
    if (familyHistory.includes("父母有糖尿病")) {
      totalScore += 4;
      riskFactors.push({
        factor: "父母有糖尿病",
        present: true,
        impact: "高风险",
        score: 4
      });
    }
    
    if (familyHistory.includes("兄弟姐妹有糖尿病")) {
      totalScore += 3;
      riskFactors.push({
        factor: "兄弟姐妹有糖尿病",
        present: true,
        impact: "中高风险",
        score: 3
      });
    }
    
    // 病史评分
    if (medicalHistory.includes("高血压")) {
      totalScore += 2;
    }
    
    if (medicalHistory.includes("心血管疾病")) {
      totalScore += 3;
      riskFactors.push({
        factor: "心血管疾病史",
        present: true,
        impact: "中高风险",
        score: 3
      });
    }
    
    if (medicalHistory.includes("多囊卵巢综合征")) {
      totalScore += 3;
      riskFactors.push({
        factor: "多囊卵巢综合征",
        present: true,
        impact: "中高风险",
        score: 3
      });
    }
    
    // 女性特有因素
    if (gestationalDiabetes === "yes") {
      totalScore += 4;
      riskFactors.push({
        factor: "妊娠糖尿病史",
        present: true,
        impact: "高风险",
        score: 4
      });
    }
    
    if (birthWeight === "high") {
      totalScore += 2;
      riskFactors.push({
        factor: "曾生育巨大儿",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    // 药物因素
    if (medications.includes("糖皮质激素")) {
      totalScore += 3;
      riskFactors.push({
        factor: "长期使用激素",
        present: true,
        impact: "中高风险",
        score: 3
      });
    }
    
    // 症状评分
    const diabeticSymptoms = ["多饮", "多尿", "多食", "体重下降"];
    const symptomCount = symptoms.filter(s => diabeticSymptoms.includes(s)).length;
    
    if (symptomCount >= 3) {
      totalScore += 5;
      riskFactors.push({
        factor: "典型糖尿病症状",
        present: true,
        impact: "极高风险",
        score: 5
      });
    } else if (symptomCount >= 1) {
      totalScore += 2;
      riskFactors.push({
        factor: "部分糖尿病症状",
        present: true,
        impact: "中等风险",
        score: 2
      });
    }
    
    // 计算风险等级和百分比
    let riskLevel = "";
    let riskPercentage = 0;
    
    if (totalScore >= 20) {
      riskLevel = "极高风险/疑似糖尿病";
      riskPercentage = 80;
    } else if (totalScore >= 15) {
      riskLevel = "高风险";
      riskPercentage = 60;
    } else if (totalScore >= 10) {
      riskLevel = "中等风险";
      riskPercentage = 30;
    } else if (totalScore >= 5) {
      riskLevel = "低中风险";
      riskPercentage = 15;
    } else {
      riskLevel = "低风险";
      riskPercentage = 5;
    }
    
    // 生成建议
    const recommendations = [];
    
    // 饮食建议
    const dietActions = [];
    if (bmi >= 25) dietActions.push("控制总热量摄入");
    if (dietQuality[0] <= 3) {
      dietActions.push("增加蔬菜水果摄入");
      dietActions.push("选择全谷物食品");
      dietActions.push("限制精制糖和加工食品");
    }
    dietActions.push("控制碳水化合物摄入");
    dietActions.push("增加膳食纤维");
    
    recommendations.push({
      category: "饮食管理",
      actions: dietActions
    });
    
    // 运动建议
    const exerciseActions = [];
    if (physicalActivity === "none" || physicalActivity === "light") {
      exerciseActions.push("每周至少150分钟中等强度有氧运动");
      exerciseActions.push("每周2-3次力量训练");
    }
    exerciseActions.push("餐后散步");
    exerciseActions.push("避免久坐");
    
    recommendations.push({
      category: "运动锻炼",
      actions: exerciseActions
    });
    
    // 生活方式建议
    const lifestyleActions = [];
    if (smokingStatus === "current") lifestyleActions.push("戒烟");
    if (stressLevel[0] >= 4) lifestyleActions.push("压力管理");
    if (sleepQuality[0] <= 2) lifestyleActions.push("改善睡眠质量");
    lifestyleActions.push("保持健康体重");
    lifestyleActions.push("定期监测血糖");
    
    recommendations.push({
      category: "生活方式",
      actions: lifestyleActions
    });
    
    // 医疗建议
    const medicalActions = [];
    if (totalScore >= 15) {
      medicalActions.push("立即就医检查");
      medicalActions.push("完善糖尿病相关检查");
    } else if (totalScore >= 10) {
      medicalActions.push("3-6个月内医疗评估");
    } else {
      medicalActions.push("年度健康体检");
    }
    
    if (bloodPressure === "high") medicalActions.push("血压管理");
    if (cholesterolLevel === "high") medicalActions.push("血脂管理");
    
    recommendations.push({
      category: "医疗管理",
      actions: medicalActions
    });
    
    // 筛查建议
    let screeningFrequency = "";
    let nextTest = "";
    
    if (totalScore >= 15) {
      screeningFrequency = "立即检查";
      nextTest = "1周内";
    } else if (totalScore >= 10) {
      screeningFrequency = "每6个月";
      nextTest = "3个月内";
    } else if (totalScore >= 5) {
      screeningFrequency = "每年";
      nextTest = "6个月内";
    } else {
      screeningFrequency = "每2-3年";
      nextTest = "1年内";
    }
    
    const screeningAdvice = {
      frequency: screeningFrequency,
      nextTest: nextTest,
      tests: ["空腹血糖", "糖化血红蛋白", "口服糖耐量试验", "随机血糖"]
    };
    
    // 预防计划
    const preventionPlan = {
      diet: [
        "低升糖指数饮食",
        "控制碳水化合物",
        "增加蛋白质摄入",
        "多吃蔬菜水果",
        "限制甜食饮料"
      ],
      exercise: [
        "有氧运动（快走、游泳）",
        "力量训练",
        "柔韧性训练",
        "平衡训练",
        "日常活动增加"
      ],
      lifestyle: [
        "戒烟限酒",
        "压力管理",
        "充足睡眠",
        "体重控制",
        "定期体检"
      ],
      monitoring: [
        "血糖监测",
        "体重监测",
        "血压监测",
        "腰围测量",
        "症状观察"
      ]
    };
    
    setResult({
      riskScore: totalScore,
      riskLevel,
      riskPercentage,
      riskFactors,
      recommendations,
      screeningAdvice,
      preventionPlan
    });
  };

  const reset = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setWaistCircumference("");
    setPhysicalActivity("");
    setDietQuality([3]);
    setSmokingStatus("");
    setAlcoholConsumption("");
    setStressLevel([3]);
    setSleepQuality([3]);
    setBloodPressure("");
    setCholesterolLevel("");
    setFastingGlucose("");
    setHba1c("");
    setFamilyHistory([]);
    setMedicalHistory([]);
    setMedications([]);
    setGestationalDiabetes("");
    setPcos("");
    setBirthWeight("");
    setSymptoms([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            糖尿病风险评估
          </h1>
          <p className="text-xl text-gray-600">
            评估2型糖尿病发病风险，制定个性化预防方案
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">风险评估</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-blue-600">基本信息</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">年龄 *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="18"
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
                    <Label htmlFor="waist" className="text-sm font-medium">腰围（cm）</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="85"
                      value={waistCircumference}
                      onChange={(e) => setWaistCircumference(e.target.value)}
                      min="50"
                      max="150"
                    />
                  </div>
                </div>
              </div>

              {/* 生活方式 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-green-600">生活方式</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">运动频率</Label>
                    <Select value={physicalActivity} onValueChange={setPhysicalActivity}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">规律运动</SelectItem>
                        <SelectItem value="moderate">偶尔运动</SelectItem>
                        <SelectItem value="light">轻度活动</SelectItem>
                        <SelectItem value="none">很少运动</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">吸烟状况</Label>
                    <Select value={smokingStatus} onValueChange={setSmokingStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">从不吸烟</SelectItem>
                        <SelectItem value="former">已戒烟</SelectItem>
                        <SelectItem value="current">目前吸烟</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">饮食质量：{dietQuality[0]}分</Label>
                    <Slider
                      value={dietQuality}
                      onValueChange={setDietQuality}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>很差</span>
                      <span>一般</span>
                      <span>很好</span>
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
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">睡眠质量：{sleepQuality[0]}分</Label>
                    <Slider
                      value={sleepQuality}
                      onValueChange={setSleepQuality}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>很差</span>
                      <span>一般</span>
                      <span>很好</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 健康状况 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-purple-600">健康状况</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">血压状况</Label>
                    <Select value={bloodPressure} onValueChange={setBloodPressure}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="elevated">偏高</SelectItem>
                        <SelectItem value="high">高血压</SelectItem>
                        <SelectItem value="unknown">不清楚</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">胆固醇水平</Label>
                    <Select value={cholesterolLevel} onValueChange={setCholesterolLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="borderline">边缘高</SelectItem>
                        <SelectItem value="high">偏高</SelectItem>
                        <SelectItem value="unknown">不清楚</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="glucose" className="text-sm font-medium">空腹血糖（mmol/L）</Label>
                    <Input
                      id="glucose"
                      type="number"
                      placeholder="5.5"
                      value={fastingGlucose}
                      onChange={(e) => setFastingGlucose(e.target.value)}
                      min="3"
                      max="15"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hba1c" className="text-sm font-medium">糖化血红蛋白（%）</Label>
                    <Input
                      id="hba1c"
                      type="number"
                      placeholder="5.5"
                      value={hba1c}
                      onChange={(e) => setHba1c(e.target.value)}
                      min="4"
                      max="15"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              {/* 家族史 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-orange-600">家族史和病史</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">家族史（可多选）</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                    {familyHistoryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={familyHistory.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFamilyHistory([...familyHistory, option]);
                            } else {
                              setFamilyHistory(familyHistory.filter(h => h !== option));
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-xs">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">既往病史（可多选）</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                    {medicalHistoryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={medicalHistory.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setMedicalHistory([...medicalHistory, option]);
                            } else {
                              setMedicalHistory(medicalHistory.filter(h => h !== option));
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-xs">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 女性特有因素 */}
              {gender === "female" && (
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-pink-600">女性特有因素</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">妊娠糖尿病史</Label>
                      <Select value={gestationalDiabetes} onValueChange={setGestationalDiabetes}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">无</SelectItem>
                          <SelectItem value="yes">有</SelectItem>
                          <SelectItem value="unknown">不清楚</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">生育史</Label>
                      <Select value={birthWeight} onValueChange={setBirthWeight}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">正常体重儿</SelectItem>
                          <SelectItem value="high">巨大儿（&gt;4kg）</SelectItem>
                          <SelectItem value="none">未生育</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* 症状 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-red-600">相关症状</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">近期症状（可多选）</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {symptomOptions.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={symptoms.includes(symptom)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSymptoms([...symptoms, symptom]);
                            } else {
                              setSymptoms(symptoms.filter(s => s !== symptom));
                            }
                          }}
                        />
                        <Label htmlFor={symptom} className="text-xs">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateDiabetesRisk}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                >
                  评估风险
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
                      <div className="text-lg font-semibold text-blue-600 mb-2">糖尿病风险等级</div>
                      <div className="text-3xl font-bold text-blue-700">
                        {result.riskLevel}
                      </div>
                      <div className="text-sm text-gray-600">风险评分：{result.riskScore}分</div>
                      <div className="text-sm text-gray-600">发病风险：约{result.riskPercentage}%</div>
                    </div>
                  </div>
                  
                  {result.riskFactors.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-orange-700">主要风险因素：</h3>
                      <div className="space-y-2">
                        {result.riskFactors.filter(f => f.score >= 2).map((factor, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{factor.factor}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              factor.impact === "极高风险" || factor.impact === "确诊糖尿病" ? "bg-red-100 text-red-700" :
                              factor.impact === "高风险" ? "bg-orange-100 text-orange-700" :
                              factor.impact === "中高风险" ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {factor.impact}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-green-700">筛查建议：</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>筛查频率：</span>
                        <span className="font-medium">{result.screeningAdvice.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>下次检查：</span>
                        <span className="font-medium">{result.screeningAdvice.nextTest}</span>
                      </div>
                      <div>
                        <span>推荐检查：</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {result.screeningAdvice.tests.map((test, index) => (
                            <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              {test}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-700">个性化建议：</h3>
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-2">{rec.category}：</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rec.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🩺</div>
                  <p>请填写相关信息进行糖尿病风险评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 糖尿病知识 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">糖尿病预防知识</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">饮食预防</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 控制总热量摄入</li>
                  <li>• 选择低升糖指数食物</li>
                  <li>• 增加膳食纤维</li>
                  <li>• 限制精制糖</li>
                  <li>• 规律进餐</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">运动预防</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 有氧运动150分钟/周</li>
                  <li>• 力量训练2-3次/周</li>
                  <li>• 餐后适度活动</li>
                  <li>• 避免久坐</li>
                  <li>• 循序渐进</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-700">生活方式</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 保持健康体重</li>
                  <li>• 戒烟限酒</li>
                  <li>• 充足睡眠</li>
                  <li>• 压力管理</li>
                  <li>• 定期体检</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-yellow-700">早期症状识别：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• 多饮、多尿、多食</li>
                  <li>• 不明原因体重下降</li>
                  <li>• 疲劳乏力</li>
                  <li>• 视力模糊</li>
                </ul>
                <ul className="space-y-1">
                  <li>• 伤口愈合慢</li>
                  <li>• 皮肤瘙痒</li>
                  <li>• 反复感染</li>
                  <li>• 手脚麻木</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}