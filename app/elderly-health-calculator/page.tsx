"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface HealthRisk {
  category: string;
  risk: string;
  score: number;
  recommendations: string[];
}

interface HealthResult {
  overallScore: number;
  riskLevel: string;
  lifeExpectancy: number;
  healthAge: number;
  risks: HealthRisk[];
  strengths: string[];
  priorityActions: string[];
  screeningRecommendations: {
    test: string;
    frequency: string;
    nextDue: string;
  }[];
  medicationReview: {
    needed: boolean;
    reason: string;
  };
}

export default function ElderlyHealthCalculator() {
  // 基本信息
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  // 生活方式
  const [smokingStatus, setSmokingStatus] = useState("");
  const [alcoholConsumption, setAlcoholConsumption] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [dietQuality, setDietQuality] = useState([3]); // 1-5分
  const [sleepQuality, setSleepQuality] = useState([3]); // 1-5分
  
  // 健康状况
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState("");
  const [hospitalizations, setHospitalizations] = useState("");
  const [fallsHistory, setFallsHistory] = useState("");
  
  // 功能状态
  const [mobilityLevel, setMobilityLevel] = useState("");
  const [cognitiveFunction, setCognitiveFunction] = useState([4]); // 1-5分
  const [socialSupport, setSocialSupport] = useState([3]); // 1-5分
  const [independenceLevel, setIndependenceLevel] = useState("");
  
  // 心理健康
  const [moodSymptoms, setMoodSymptoms] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState([3]); // 1-5分
  const [lifeStatisfaction, setLifeStatisfaction] = useState([3]); // 1-5分
  
  // 预防保健
  const [lastPhysicalExam, setLastPhysicalExam] = useState("");
  const [vaccinations, setVaccinations] = useState<string[]>([]);
  const [screeningTests, setScreeningTests] = useState<string[]>([]);
  
  const [result, setResult] = useState<HealthResult | null>(null);

  const chronicConditionsList = [
    "高血压", "糖尿病", "心脏病", "中风", "关节炎", "骨质疏松",
    "慢性阻塞性肺病", "癌症", "肾脏疾病", "肝脏疾病", "甲状腺疾病",
    "抑郁症", "焦虑症", "痴呆", "帕金森病", "白内障", "听力损失"
  ];

  const moodSymptomsList = [
    "情绪低落", "兴趣减退", "疲劳乏力", "睡眠障碍", "食欲改变",
    "注意力不集中", "记忆力下降", "焦虑不安", "易怒", "孤独感"
  ];

  const vaccinationsList = [
    "流感疫苗（年度）", "肺炎疫苗", "带状疱疹疫苗", "破伤风疫苗",
    "新冠疫苗", "百白破疫苗"
  ];

  const screeningTestsList = [
    "血压检查", "血糖检查", "胆固醇检查", "骨密度检查",
    "结肠镜检查", "乳腺癌筛查", "宫颈癌筛查", "前列腺癌筛查",
    "眼科检查", "听力检查", "皮肤癌筛查", "认知功能评估"
  ];

  const calculateHealthRisk = () => {
    if (!age || !gender || !height || !weight) {
      alert("请填写基本信息");
      return;
    }
    
    const ageValue = parseInt(age);
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const bmi = weightValue / Math.pow(heightValue / 100, 2);
    
    let totalScore = 0;
    const risks: HealthRisk[] = [];
    const strengths: string[] = [];
    const priorityActions: string[] = [];
    
    // 年龄风险评估
    let ageScore = 0;
    if (ageValue >= 85) ageScore = 4;
    else if (ageValue >= 75) ageScore = 3;
    else if (ageValue >= 65) ageScore = 2;
    else ageScore = 1;
    
    totalScore += ageScore;
    
    // BMI评估
    let bmiScore = 0;
    let bmiRisk = "正常";
    if (bmi < 18.5) {
      bmiScore = 3;
      bmiRisk = "体重不足";
    } else if (bmi > 30) {
      bmiScore = 3;
      bmiRisk = "肥胖";
    } else if (bmi > 25) {
      bmiScore = 2;
      bmiRisk = "超重";
    } else {
      bmiScore = 1;
      strengths.push("体重正常");
    }
    
    if (bmiScore > 1) {
      risks.push({
        category: "体重管理",
        risk: bmiRisk,
        score: bmiScore,
        recommendations: [
          bmi < 18.5 ? "增加营养摄入，咨询营养师" : "控制饮食，增加运动",
          "定期监测体重变化",
          "咨询医生制定合适的体重管理计划"
        ]
      });
    }
    
    totalScore += bmiScore;
    
    // 生活方式评估
    let lifestyleScore = 0;
    
    // 吸烟
    if (smokingStatus === "current") {
      lifestyleScore += 4;
      risks.push({
        category: "吸烟",
        risk: "高风险",
        score: 4,
        recommendations: [
          "立即戒烟，寻求专业帮助",
          "使用戒烟辅助产品",
          "避免二手烟环境"
        ]
      });
      priorityActions.push("戒烟是最重要的健康改善措施");
    } else if (smokingStatus === "former") {
      lifestyleScore += 1;
      strengths.push("已戒烟");
    } else {
      strengths.push("从不吸烟");
    }
    
    // 饮酒
    if (alcoholConsumption === "heavy") {
      lifestyleScore += 3;
      risks.push({
        category: "饮酒",
        risk: "过量饮酒",
        score: 3,
        recommendations: [
          "减少酒精摄入",
          "寻求专业帮助",
          "注意药物与酒精的相互作用"
        ]
      });
    } else if (alcoholConsumption === "moderate") {
      lifestyleScore += 1;
    }
    
    // 运动
    if (exerciseFrequency === "none") {
      lifestyleScore += 3;
      risks.push({
        category: "运动不足",
        risk: "缺乏运动",
        score: 3,
        recommendations: [
          "开始适度的有氧运动",
          "进行力量训练",
          "改善平衡和柔韧性"
        ]
      });
      priorityActions.push("增加日常身体活动");
    } else if (exerciseFrequency === "regular") {
      strengths.push("规律运动");
    }
    
    // 饮食质量
    if (dietQuality[0] <= 2) {
      lifestyleScore += 2;
      risks.push({
        category: "营养",
        risk: "饮食质量差",
        score: 2,
        recommendations: [
          "增加蔬菜水果摄入",
          "选择全谷物食品",
          "限制加工食品",
          "咨询营养师"
        ]
      });
    } else if (dietQuality[0] >= 4) {
      strengths.push("饮食健康");
    }
    
    // 睡眠质量
    if (sleepQuality[0] <= 2) {
      lifestyleScore += 2;
      risks.push({
        category: "睡眠",
        risk: "睡眠质量差",
        score: 2,
        recommendations: [
          "建立规律作息",
          "改善睡眠环境",
          "避免睡前刺激",
          "必要时咨询医生"
        ]
      });
    } else if (sleepQuality[0] >= 4) {
      strengths.push("睡眠质量好");
    }
    
    totalScore += lifestyleScore;
    
    // 慢性疾病评估
    let diseaseScore = chronicConditions.length;
    if (diseaseScore >= 3) {
      risks.push({
        category: "多重疾病",
        risk: "多种慢性疾病",
        score: diseaseScore,
        recommendations: [
          "定期专科随访",
          "药物管理",
          "疾病自我管理教育",
          "预防并发症"
        ]
      });
      priorityActions.push("加强慢性疾病管理");
    }
    
    totalScore += diseaseScore;
    
    // 功能状态评估
    let functionalScore = 0;
    
    if (mobilityLevel === "limited") {
      functionalScore += 3;
      risks.push({
        category: "活动能力",
        risk: "活动受限",
        score: 3,
        recommendations: [
          "物理治疗",
          "使用辅助器具",
          "家庭环境改造",
          "预防跌倒"
        ]
      });
    } else if (mobilityLevel === "independent") {
      strengths.push("活动能力良好");
    }
    
    if (cognitiveFunction[0] <= 2) {
      functionalScore += 3;
      risks.push({
        category: "认知功能",
        risk: "认知功能下降",
        score: 3,
        recommendations: [
          "认知训练",
          "社交活动",
          "脑力锻炼",
          "专业评估"
        ]
      });
      priorityActions.push("关注认知健康");
    } else if (cognitiveFunction[0] >= 4) {
      strengths.push("认知功能良好");
    }
    
    if (socialSupport[0] <= 2) {
      functionalScore += 2;
      risks.push({
        category: "社会支持",
        risk: "社会支持不足",
        score: 2,
        recommendations: [
          "增加社交活动",
          "寻求家庭支持",
          "参与社区活动",
          "考虑专业护理"
        ]
      });
    } else if (socialSupport[0] >= 4) {
      strengths.push("社会支持良好");
    }
    
    totalScore += functionalScore;
    
    // 心理健康评估
    let mentalScore = 0;
    
    if (moodSymptoms.length >= 3) {
      mentalScore += 3;
      risks.push({
        category: "心理健康",
        risk: "抑郁/焦虑症状",
        score: 3,
        recommendations: [
          "心理健康评估",
          "心理咨询",
          "药物治疗（如需要）",
          "社会支持"
        ]
      });
      priorityActions.push("关注心理健康");
    }
    
    if (stressLevel[0] >= 4) {
      mentalScore += 2;
    }
    
    if (lifeStatisfaction[0] <= 2) {
      mentalScore += 2;
    }
    
    totalScore += mentalScore;
    
    // 跌倒风险
    if (fallsHistory === "multiple") {
      risks.push({
        category: "跌倒风险",
        risk: "高跌倒风险",
        score: 3,
        recommendations: [
          "家庭安全评估",
          "平衡训练",
          "药物审查",
          "视力检查"
        ]
      });
      priorityActions.push("预防跌倒");
    }
    
    // 计算风险等级
    let riskLevel = "";
    if (totalScore <= 5) riskLevel = "低风险";
    else if (totalScore <= 10) riskLevel = "中等风险";
    else if (totalScore <= 15) riskLevel = "高风险";
    else riskLevel = "极高风险";
    
    // 估算健康年龄和预期寿命
    const baseLifeExpectancy = gender === "male" ? 76 : 81;
    const healthAge = ageValue + (totalScore - 5) * 2;
    const lifeExpectancy = Math.max(ageValue + 1, baseLifeExpectancy - totalScore);
    
    // 筛查建议
    const screeningRecommendations = [
      { test: "血压检查", frequency: "每年", nextDue: "立即" },
      { test: "血糖检查", frequency: "每年", nextDue: "3个月内" },
      { test: "胆固醇检查", frequency: "每2年", nextDue: "6个月内" },
      { test: "骨密度检查", frequency: "每2年", nextDue: "1年内" },
      { test: "眼科检查", frequency: "每年", nextDue: "6个月内" },
      { test: "听力检查", frequency: "每2年", nextDue: "1年内" }
    ];
    
    // 药物审查
    const medicationReview = {
      needed: parseInt(medications) >= 5 || chronicConditions.length >= 2,
      reason: parseInt(medications) >= 5 ? "多重用药需要审查" : "多种疾病需要药物协调"
    };
    
    setResult({
      overallScore: totalScore,
      riskLevel,
      lifeExpectancy,
      healthAge,
      risks,
      strengths,
      priorityActions,
      screeningRecommendations,
      medicationReview
    });
  };

  const reset = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setSmokingStatus("");
    setAlcoholConsumption("");
    setExerciseFrequency("");
    setDietQuality([3]);
    setSleepQuality([3]);
    setChronicConditions([]);
    setMedications("");
    setHospitalizations("");
    setFallsHistory("");
    setMobilityLevel("");
    setCognitiveFunction([4]);
    setSocialSupport([3]);
    setIndependenceLevel("");
    setMoodSymptoms([]);
    setStressLevel([3]);
    setLifeStatisfaction([3]);
    setLastPhysicalExam("");
    setVaccinations([]);
    setScreeningTests([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            老年健康风险评估
          </h1>
          <p className="text-xl text-gray-600">
            综合评估老年人健康状况和风险因素
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">健康评估</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-purple-600">基本信息</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">年龄 *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="75"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="60"
                      max="120"
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
                      placeholder="165"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="140"
                      max="200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">体重（kg）*</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="30"
                      max="150"
                    />
                  </div>
                </div>
              </div>

              {/* 生活方式 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-blue-600">生活方式</Label>
                
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">饮酒情况</Label>
                    <Select value={alcoholConsumption} onValueChange={setAlcoholConsumption}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不饮酒</SelectItem>
                        <SelectItem value="light">少量饮酒</SelectItem>
                        <SelectItem value="moderate">适量饮酒</SelectItem>
                        <SelectItem value="heavy">过量饮酒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">运动频率</Label>
                    <Select value={exerciseFrequency} onValueChange={setExerciseFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">很少运动</SelectItem>
                        <SelectItem value="occasional">偶尔运动</SelectItem>
                        <SelectItem value="regular">规律运动</SelectItem>
                        <SelectItem value="daily">每日运动</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">活动能力</Label>
                    <Select value={mobilityLevel} onValueChange={setMobilityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="independent">完全独立</SelectItem>
                        <SelectItem value="assisted">需要辅助</SelectItem>
                        <SelectItem value="limited">活动受限</SelectItem>
                        <SelectItem value="dependent">需要照护</SelectItem>
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
                <Label className="text-lg font-medium text-green-600">健康状况</Label>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">慢性疾病（可多选）</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {chronicConditionsList.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setChronicConditions([...chronicConditions, condition]);
                            } else {
                              setChronicConditions(chronicConditions.filter(c => c !== condition));
                            }
                          }}
                        />
                        <Label htmlFor={condition} className="text-xs">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medications" className="text-sm font-medium">服用药物数量</Label>
                    <Input
                      id="medications"
                      type="number"
                      placeholder="3"
                      value={medications}
                      onChange={(e) => setMedications(e.target.value)}
                      min="0"
                      max="20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">跌倒史</Label>
                    <Select value={fallsHistory} onValueChange={setFallsHistory}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无跌倒</SelectItem>
                        <SelectItem value="once">1次</SelectItem>
                        <SelectItem value="multiple">多次</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 功能和心理状态 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-orange-600">功能和心理状态</Label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">认知功能：{cognitiveFunction[0]}分</Label>
                    <Slider
                      value={cognitiveFunction}
                      onValueChange={setCognitiveFunction}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>明显下降</span>
                      <span>正常</span>
                      <span>优秀</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">社会支持：{socialSupport[0]}分</Label>
                    <Slider
                      value={socialSupport}
                      onValueChange={setSocialSupport}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>很少</span>
                      <span>一般</span>
                      <span>很好</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">生活满意度：{lifeStatisfaction[0]}分</Label>
                    <Slider
                      value={lifeStatisfaction}
                      onValueChange={setLifeStatisfaction}
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
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">情绪症状（可多选）</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                    {moodSymptomsList.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={moodSymptoms.includes(symptom)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setMoodSymptoms([...moodSymptoms, symptom]);
                            } else {
                              setMoodSymptoms(moodSymptoms.filter(s => s !== symptom));
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
                  onClick={calculateHealthRisk}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-lg py-3"
                >
                  评估健康风险
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
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600 mb-2">总体风险等级</div>
                      <div className="text-3xl font-bold text-purple-700">
                        {result.riskLevel}
                      </div>
                      <div className="text-sm text-gray-600">风险评分：{result.overallScore}分</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-blue-600">{result.healthAge}岁</div>
                        <div className="text-sm text-gray-600">健康年龄</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-600">{result.lifeExpectancy}岁</div>
                        <div className="text-sm text-gray-600">预期寿命</div>
                      </div>
                    </div>
                  </div>
                  
                  {result.strengths.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-green-700">健康优势：</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.strengths.map((strength, index) => (
                          <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                            ✓ {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.risks.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-red-700">健康风险：</h3>
                      <div className="space-y-3">
                        {result.risks.map((risk, index) => (
                          <div key={index} className="border-l-4 border-red-400 pl-3">
                            <div className="font-medium text-red-700">{risk.category}：{risk.risk}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              建议：{risk.recommendations.join("、")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.priorityActions.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-orange-700">优先改善措施：</h3>
                      <ul className="space-y-1">
                        {result.priorityActions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-600 mr-2">🔥</span>
                            <span className="text-gray-700 text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-700">推荐筛查：</h3>
                    <div className="space-y-2">
                      {result.screeningRecommendations.slice(0, 4).map((screening, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{screening.test}</span>
                          <span className="text-gray-600">{screening.frequency}</span>
                          <span className="text-blue-600">{screening.nextDue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {result.medicationReview.needed && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 text-yellow-700">药物审查建议：</h3>
                      <p className="text-yellow-600 text-sm">{result.medicationReview.reason}</p>
                      <p className="text-gray-600 text-sm mt-1">建议咨询医生或药师进行药物审查</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">👴</div>
                  <p>请填写相关信息进行健康风险评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 老年健康知识 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">老年健康管理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-purple-700">预防保健</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 定期体检和筛查</li>
                  <li>• 疫苗接种</li>
                  <li>• 慢性病管理</li>
                  <li>• 药物安全使用</li>
                  <li>• 跌倒预防</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">生活方式</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 均衡营养饮食</li>
                  <li>• 适度规律运动</li>
                  <li>• 充足优质睡眠</li>
                  <li>• 戒烟限酒</li>
                  <li>• 压力管理</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">社会支持</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 保持社交活动</li>
                  <li>• 家庭支持网络</li>
                  <li>• 社区参与</li>
                  <li>• 心理健康关注</li>
                  <li>• 终身学习</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-orange-700">健康老龄化要点：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• 早期发现和干预健康问题</li>
                  <li>• 维持功能独立性</li>
                  <li>• 预防认知功能下降</li>
                  <li>• 保持积极的生活态度</li>
                </ul>
                <ul className="space-y-1">
                  <li>• 合理使用医疗资源</li>
                  <li>• 建立应急联系网络</li>
                  <li>• 适应环境变化</li>
                  <li>• 规划未来护理需求</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}