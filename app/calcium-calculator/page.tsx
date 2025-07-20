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

export default function CalciumCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [sunExposure, setSunExposure] = useState("");
  const [dietType, setDietType] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // 钙推荐摄入量 (毫克/天)
  const getRecommendedIntake = (ageNum: number, gender: string, lifeStage: string) => {
    if (lifeStage === "pregnancy" || lifeStage === "lactation") {
      if (ageNum < 19) return 1300;
      return 1000;
    }
    
    // 儿童和青少年
    if (ageNum < 1) return 200;
    if (ageNum < 4) return 700;
    if (ageNum < 9) return 1000;
    if (ageNum < 19) return 1300;
    
    // 成人
    if (ageNum < 51) return 1000;
    if (ageNum < 71) return gender === "female" ? 1200 : 1000;
    return 1200; // 71岁以上
  };

  // 健康状况影响因子
  const healthFactors = {
    "osteoporosis": { name: "骨质疏松症", factor: 1.5, description: "骨密度降低，需要更多钙" },
    "osteopenia": { name: "骨量减少", factor: 1.3, description: "骨密度轻度降低" },
    "fracture-history": { name: "骨折病史", factor: 1.4, description: "骨骼愈合需要更多钙" },
    "kidney-stones": { name: "肾结石病史", factor: 0.8, description: "需要限制钙摄入" },
    "hyperparathyroidism": { name: "甲状旁腺功能亢进", factor: 1.6, description: "钙代谢异常" },
    "malabsorption": { name: "吸收不良综合征", factor: 1.8, description: "钙吸收能力下降" },
    "celiac-disease": { name: "乳糜泻", factor: 1.5, description: "肠道吸收受损" },
    "crohns-disease": { name: "克罗恩病", factor: 1.6, description: "炎症影响吸收" },
    "lactose-intolerance": { name: "乳糖不耐受", factor: 1.2, description: "乳制品摄入受限" },
    "hyperthyroidism": { name: "甲状腺功能亢进", factor: 1.3, description: "骨代谢加快" },
    "diabetes": { name: "糖尿病", factor: 1.2, description: "可能影响骨健康" },
    "rheumatoid-arthritis": { name: "类风湿关节炎", factor: 1.4, description: "炎症和药物影响" }
  };

  // 药物影响因子
  const medicationFactors = {
    "corticosteroids": { name: "糖皮质激素", factor: 1.8, description: "抑制钙吸收，促进骨流失" },
    "ppi": { name: "质子泵抑制剂", factor: 1.3, description: "抑制胃酸，影响钙吸收" },
    "anticonvulsants": { name: "抗癫痫药", factor: 1.4, description: "影响维生素D代谢" },
    "diuretics": { name: "利尿剂", factor: 1.2, description: "增加钙流失" },
    "antacids": { name: "抗酸剂", factor: 1.1, description: "可能影响钙吸收" },
    "bisphosphonates": { name: "双膦酸盐", factor: 0.9, description: "抑制骨吸收" },
    "hrt": { name: "激素替代疗法", factor: 0.9, description: "改善钙利用" }
  };

  // 饮食类型影响
  const dietFactors = {
    "omnivore": { name: "杂食", factor: 1.0, description: "乳制品摄入充足" },
    "pescatarian": { name: "鱼素", factor: 1.1, description: "主要从植物和鱼类获取" },
    "vegetarian": { name: "素食", factor: 1.2, description: "主要从植物和乳制品获取" },
    "vegan": { name: "纯素食", factor: 1.8, description: "完全依赖植物来源" },
    "low-dairy": { name: "少乳制品", factor: 1.4, description: "乳制品摄入不足" },
    "high-protein": { name: "高蛋白饮食", factor: 1.2, description: "蛋白质增加钙流失" },
    "high-sodium": { name: "高钠饮食", factor: 1.3, description: "钠增加钙流失" }
  };

  // 活动水平影响
  const activityFactors = {
    "sedentary": { name: "久坐", factor: 1.2, description: "缺乏运动影响骨健康" },
    "light": { name: "轻度活动", factor: 1.0, description: "基础需求" },
    "moderate": { name: "中度活动", factor: 0.9, description: "运动促进钙利用" },
    "vigorous": { name: "高强度运动", factor: 1.1, description: "大量出汗增加流失" },
    "weight-bearing": { name: "负重运动", factor: 0.8, description: "最有利于骨健康" }
  };

  // 日照影响 (维生素D合成)
  const sunExposureFactors = {
    "minimal": { name: "很少", factor: 1.4, description: "维生素D不足影响钙吸收" },
    "limited": { name: "有限", factor: 1.2, description: "维生素D可能不足" },
    "moderate": { name: "适中", factor: 1.0, description: "维生素D合成正常" },
    "abundant": { name: "充足", factor: 0.9, description: "维生素D充足" }
  };

  // 缺钙症状
  const deficiencySymptoms = {
    "muscle-cramps": { name: "肌肉痉挛", severity: "轻度", description: "钙离子不足" },
    "numbness-tingling": { name: "手脚麻木", severity: "轻度", description: "神经兴奋性增高" },
    "brittle-nails": { name: "指甲易断", severity: "轻度", description: "钙缺乏表现" },
    "dental-problems": { name: "牙齿问题", severity: "中度", description: "牙齿松动或蛀牙" },
    "bone-pain": { name: "骨痛", severity: "中度", description: "骨密度降低" },
    "height-loss": { name: "身高降低", severity: "中度", description: "脊椎压缩性骨折" },
    "frequent-fractures": { name: "易骨折", severity: "重度", description: "骨质疏松" },
    "severe-cramps": { name: "严重痉挛", severity: "重度", description: "低钙血症" },
    "tetany": { name: "手足抽搐", severity: "重度", description: "严重低钙" },
    "seizures": { name: "癫痫发作", severity: "重度", description: "极度缺钙" }
  };

  const calculateCalciumNeeds = () => {
    if (!age || !gender || !weight || !lifeStage || !activityLevel || !sunExposure || !dietType) {
      alert("请填写所有必填信息");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    
    if (ageNum <= 0 || ageNum > 120 || weightNum <= 0) {
      alert("请输入有效的年龄和体重");
      return;
    }

    // 基础推荐量
    const baseIntake = getRecommendedIntake(ageNum, gender, lifeStage);
    
    // 计算各种影响因子
    let totalFactor = 1.0;
    
    // 饮食因子
    const dietFactor = dietFactors[dietType as keyof typeof dietFactors]?.factor || 1.0;
    totalFactor *= dietFactor;
    
    // 活动水平因子
    const activityFactor = activityFactors[activityLevel as keyof typeof activityFactors]?.factor || 1.0;
    totalFactor *= activityFactor;
    
    // 日照因子
    const sunFactor = sunExposureFactors[sunExposure as keyof typeof sunExposureFactors]?.factor || 1.0;
    totalFactor *= sunFactor;
    
    // 健康状况因子
    let maxHealthFactor = 1.0;
    healthConditions.forEach(condition => {
      const factor = healthFactors[condition as keyof typeof healthFactors]?.factor || 1.0;
      if (condition === "kidney-stones") {
        maxHealthFactor = Math.min(maxHealthFactor, factor); // 肾结石需要限制
      } else {
        maxHealthFactor = Math.max(maxHealthFactor, factor);
      }
    });
    totalFactor *= maxHealthFactor;
    
    // 药物因子
    let medicationFactor = 1.0;
    medications.forEach(med => {
      const factor = medicationFactors[med as keyof typeof medicationFactors]?.factor || 1.0;
      if (med === "bisphosphonates" || med === "hrt") {
        medicationFactor = Math.min(medicationFactor, factor); // 这些药物减少需求
      } else {
        medicationFactor = Math.max(medicationFactor, factor);
      }
    });
    totalFactor *= medicationFactor;
    
    // 年龄和性别特殊调整
    if (gender === "female" && ageNum >= 51) {
      totalFactor *= 1.1; // 绝经后女性
    }
    
    const recommendedIntake = baseIntake * totalFactor;
    
    // 症状评估
    const symptomSeverity = {
      mild: symptoms.filter(s => deficiencySymptoms[s as keyof typeof deficiencySymptoms]?.severity === "轻度").length,
      moderate: symptoms.filter(s => deficiencySymptoms[s as keyof typeof deficiencySymptoms]?.severity === "中度").length,
      severe: symptoms.filter(s => deficiencySymptoms[s as keyof typeof deficiencySymptoms]?.severity === "重度").length
    };
    
    const totalSymptoms = symptomSeverity.mild + symptomSeverity.moderate + symptomSeverity.severe;
    const riskScore = symptomSeverity.mild * 1 + symptomSeverity.moderate * 2 + symptomSeverity.severe * 3;
    
    // 风险等级
    let riskLevel = "低风险";
    let riskColor = "green";
    if (riskScore >= 8 || symptomSeverity.severe >= 2) {
      riskLevel = "高风险";
      riskColor = "red";
    } else if (riskScore >= 4 || symptomSeverity.moderate >= 2) {
      riskLevel = "中风险";
      riskColor = "orange";
    }
    
    // 补充建议
    let supplementAdvice = "";
    if (recommendedIntake > 2000) {
      supplementAdvice = "建议咨询医生，分次补充钙剂 (每次不超过500mg)";
    } else if (recommendedIntake > 1500) {
      supplementAdvice = "建议钙剂补充 (500-1000mg/天)，分次服用";
    } else if (recommendedIntake > 1200) {
      supplementAdvice = "建议适量钙剂补充 (300-600mg/天)";
    } else {
      supplementAdvice = "通过富钙食物即可满足需求";
    }
    
    // 食物来源建议
    const foodSources = {
      dairy: ["牛奶 (104mg/100ml)", "酸奶 (121mg/100g)", "奶酪 (721mg/100g)", "奶粉 (890mg/100g)"],
      vegetables: ["芝麻酱 (1170mg/100g)", "虾皮 (991mg/100g)", "海带 (348mg/100g)", "豆腐 (164mg/100g)"],
      nuts: ["杏仁 (264mg/100g)", "芝麻 (975mg/100g)", "榛子 (114mg/100g)", "花生 (39mg/100g)"],
      fortified: ["强化豆浆", "强化橙汁", "强化谷物", "钙片"]
    };
    
    // 吸收率和建议
    const absorptionTips = {
      enhancers: ["维生素D", "适量蛋白质", "乳糖", "柠檬酸"],
      inhibitors: ["草酸 (菠菜)", "植酸 (全谷物)", "过量纤维", "咖啡因"],
      timing: ["分次服用 (每次≤500mg)", "餐后服用", "避免与铁剂同服", "睡前服用利于吸收"]
    };
    
    // 每日钙摄入分配建议
    const dailyDistribution = {
      breakfast: Math.round(recommendedIntake * 0.3),
      lunch: Math.round(recommendedIntake * 0.3),
      dinner: Math.round(recommendedIntake * 0.25),
      snack: Math.round(recommendedIntake * 0.15)
    };
    
    setResult({
      baseIntake,
      recommendedIntake: Math.round(recommendedIntake),
      totalFactor: Math.round(totalFactor * 100) / 100,
      factors: {
        diet: { factor: dietFactor, info: dietFactors[dietType as keyof typeof dietFactors] },
        activity: { factor: activityFactor, info: activityFactors[activityLevel as keyof typeof activityFactors] },
        sun: { factor: sunFactor, info: sunExposureFactors[sunExposure as keyof typeof sunExposureFactors] },
        health: { factor: maxHealthFactor, conditions: healthConditions.map(c => healthFactors[c as keyof typeof healthFactors]) },
        medications: { factor: medicationFactor, meds: medications.map(m => medicationFactors[m as keyof typeof medicationFactors]) }
      },
      symptoms: {
        total: totalSymptoms,
        severity: symptomSeverity,
        riskScore,
        riskLevel,
        riskColor
      },
      supplementAdvice,
      foodSources,
      absorptionTips,
      dailyDistribution,
      inputData: { age: ageNum, gender, weight: weightNum, lifeStage, activityLevel, sunExposure, dietType }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setLifeStage("");
    setActivityLevel("");
    setSunExposure("");
    setDietType("");
    setHealthConditions([]);
    setMedications([]);
    setSymptoms([]);
    setResult(null);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setHealthConditions([...healthConditions, condition]);
    } else {
      setHealthConditions(healthConditions.filter(c => c !== condition));
    }
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    if (checked) {
      setMedications([...medications, medication]);
    } else {
      setMedications(medications.filter(m => m !== medication));
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms([...symptoms, symptom]);
    } else {
      setSymptoms(symptoms.filter(s => s !== symptom));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🦴 钙需求计算器</h1>
          <p className="text-lg text-gray-600">
            评估个人钙需求量，维护骨骼健康，预防骨质疏松
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
                      placeholder="例如：35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">体重 (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="例如：65"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <Label htmlFor="lifeStage">生理状态 *</Label>
                    <Select value={lifeStage} onValueChange={setLifeStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择生理状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="pregnancy">怀孕期</SelectItem>
                        <SelectItem value="lactation">哺乳期</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activityLevel">运动类型 *</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择运动类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">久坐 - 很少运动</SelectItem>
                        <SelectItem value="light">轻度 - 偶尔散步</SelectItem>
                        <SelectItem value="moderate">中度 - 规律有氧运动</SelectItem>
                        <SelectItem value="vigorous">高强度 - 频繁运动</SelectItem>
                        <SelectItem value="weight-bearing">负重运动 - 举重、跑步</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sunExposure">日照时间 *</Label>
                    <Select value={sunExposure} onValueChange={setSunExposure}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择日照时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">很少 - 几乎不晒太阳</SelectItem>
                        <SelectItem value="limited">有限 - 偶尔晒太阳</SelectItem>
                        <SelectItem value="moderate">适中 - 每天15-30分钟</SelectItem>
                        <SelectItem value="abundant">充足 - 每天30分钟以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dietType">饮食类型 *</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择饮食类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">杂食 - 包含乳制品</SelectItem>
                      <SelectItem value="pescatarian">鱼素 - 鱼类+乳制品</SelectItem>
                      <SelectItem value="vegetarian">素食 - 蛋奶素</SelectItem>
                      <SelectItem value="vegan">纯素食 - 完全植物性</SelectItem>
                      <SelectItem value="low-dairy">少乳制品</SelectItem>
                      <SelectItem value="high-protein">高蛋白饮食</SelectItem>
                      <SelectItem value="high-sodium">高钠饮食</SelectItem>
                    </SelectContent>
                  </Select>
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

            {/* 药物使用 */}
            <Card>
              <CardHeader>
                <CardTitle>药物使用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(medicationFactors).map(([key, factor]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Checkbox
                        id={key}
                        checked={medications.includes(key)}
                        onCheckedChange={(checked) => handleMedicationChange(key, checked as boolean)}
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
          </div>

          {/* 症状评估和结果 */}
          <div className="space-y-6">
            {/* 症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle>缺钙症状评估</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(deficiencySymptoms).map(([key, symptom]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Checkbox
                        id={key}
                        checked={symptoms.includes(key)}
                        onCheckedChange={(checked) => handleSymptomChange(key, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {symptom.name}
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            symptom.severity === "轻度" ? "bg-green-100 text-green-800" :
                            symptom.severity === "中度" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {symptom.severity}
                          </span>
                        </Label>
                        <p className="text-xs text-gray-500">{symptom.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateCalciumNeeds} className="flex-1">
                计算钙需求
              </Button>
              <Button variant="outline" onClick={resetForm}>
                重置
              </Button>
            </div>

            {/* 计算结果 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>钙需求评估结果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{result.recommendedIntake}</div>
                        <div className="text-sm text-gray-600">毫克/天</div>
                        <div className="text-xs text-gray-500 mt-1">
                          基础需求: {result.baseIntake} 毫克/天
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Separator />

                  <div className="space-y-3">
                    <div className={`p-3 rounded text-center ${
                      result.symptoms.riskColor === "green" ? "bg-green-50 border border-green-200" :
                      result.symptoms.riskColor === "orange" ? "bg-orange-50 border border-orange-200" :
                      "bg-red-50 border border-red-200"
                    }`}>
                      <div className={`font-semibold ${
                        result.symptoms.riskColor === "green" ? "text-green-700" :
                        result.symptoms.riskColor === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        {result.symptoms.riskLevel}
                      </div>
                      <div className="text-sm text-gray-600">
                        症状评分: {result.symptoms.riskScore}/30
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <div className="font-semibold text-blue-700 mb-1">补充建议</div>
                      <div className="text-sm text-blue-600">{result.supplementAdvice}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 详细分析 */}
        {result && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* 影响因子分析 */}
            <Card>
              <CardHeader>
                <CardTitle>影响因子分析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>饮食类型:</span>
                    <span className="font-semibold">{result.factors.diet.factor}x</span>
                  </div>
                  <Progress value={(result.factors.diet.factor - 0.5) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.diet.info.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>运动类型:</span>
                    <span className="font-semibold">{result.factors.activity.factor}x</span>
                  </div>
                  <Progress value={(1.5 - result.factors.activity.factor) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.activity.info.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>日照时间:</span>
                    <span className="font-semibold">{result.factors.sun.factor}x</span>
                  </div>
                  <Progress value={(1.5 - result.factors.sun.factor) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.sun.info.description}</p>
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
                        <div key={i}>• {c.name}: {c.description}</div>
                      ))}
                    </div>
                  </div>
                )}

                {result.factors.medications.factor !== 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>药物影响:</span>
                      <span className="font-semibold">{result.factors.medications.factor}x</span>
                    </div>
                    <Progress value={(result.factors.medications.factor - 0.5) * 100} className="h-2" />
                    <div className="text-xs text-gray-600">
                      {result.factors.medications.meds.map((m: any, i: number) => (
                        <div key={i}>• {m.name}: {m.description}</div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>总影响因子:</span>
                  <span>{result.totalFactor}x</span>
                </div>
              </CardContent>
            </Card>

            {/* 每日摄入分配 */}
            <Card>
              <CardHeader>
                <CardTitle>每日摄入分配建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="font-medium">早餐 (30%):</span>
                    <span className="font-semibold">{result.dailyDistribution.breakfast} mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="font-medium">午餐 (30%):</span>
                    <span className="font-semibold">{result.dailyDistribution.lunch} mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">晚餐 (25%):</span>
                    <span className="font-semibold">{result.dailyDistribution.dinner} mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="font-medium">加餐 (15%):</span>
                    <span className="font-semibold">{result.dailyDistribution.snack} mg</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>提示:</strong> 单次摄入不超过500mg，分次服用吸收更好。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 食物来源和吸收建议 */}
        {result && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* 食物来源建议 */}
            <Card>
              <CardHeader>
                <CardTitle>食物来源建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">乳制品 (吸收率高)</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.dairy.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-700">蔬菜海产品</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.vegetables.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">坚果种子</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.nuts.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">强化食品</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.fortified.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 吸收优化建议 */}
            <Card>
              <CardHeader>
                <CardTitle>吸收优化建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700">促进吸收</h4>
                  <ul className="text-sm space-y-1">
                    {result.absorptionTips.enhancers.map((tip: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-red-700">抑制吸收</h4>
                  <ul className="text-sm space-y-1">
                    {result.absorptionTips.inhibitors.map((tip: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">服用时机</h4>
                  <ul className="text-sm space-y-1">
                    {result.absorptionTips.timing.map((tip: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 钙知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 钙知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">钙的重要作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• 骨骼和牙齿的主要成分</li>
                  <li>• 肌肉收缩和神经传导</li>
                  <li>• 血液凝固过程</li>
                  <li>• 酶活性调节</li>
                  <li>• 细胞膜稳定性</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">缺钙高危人群</h3>
                <ul className="text-sm space-y-1">
                  <li>• 绝经后女性</li>
                  <li>• 老年人 (>65岁)</li>
                  <li>• 青少年 (快速生长期)</li>
                  <li>• 孕妇和哺乳期女性</li>
                  <li>• 素食者和乳糖不耐受者</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">检测方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• 骨密度检测 (DEXA)</li>
                  <li>• 血清钙水平</li>
                  <li>• 25-羟维生素D</li>
                  <li>• 甲状旁腺激素 (PTH)</li>
                  <li>• 24小时尿钙</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">补充注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 单次不超过500mg</li>
                  <li>• 与维生素D同补</li>
                  <li>• 避免过量 (>2500mg/天)</li>
                  <li>• 注意药物相互作用</li>
                  <li>• 定期监测血钙水平</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}