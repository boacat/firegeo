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

export default function IronCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [dietType, setDietType] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [menstrualFlow, setMenstrualFlow] = useState("");
  const [result, setResult] = useState<any>(null);

  // 铁推荐摄入量 (毫克/天)
  const getRecommendedIntake = (ageNum: number, gender: string, lifeStage: string) => {
    if (lifeStage === "pregnancy") {
      if (ageNum < 19) return 27;
      return 27;
    }
    if (lifeStage === "lactation") {
      if (ageNum < 19) return 10;
      return 9;
    }
    
    // 儿童和青少年
    if (ageNum < 1) return 11;
    if (ageNum < 4) return 7;
    if (ageNum < 9) return 10;
    if (ageNum < 14) return gender === "male" ? 8 : 8;
    if (ageNum < 19) return gender === "male" ? 11 : 15;
    
    // 成人
    if (ageNum < 51) {
      return gender === "male" ? 8 : 18;
    } else {
      return 8; // 绝经后女性
    }
  };

  // 健康状况影响因子
  const healthFactors = {
    "heavy-menstruation": { name: "月经量过多", factor: 1.8, description: "铁流失增加" },
    "pregnancy": { name: "怀孕", factor: 2.0, description: "胎儿发育需求" },
    "blood-donation": { name: "定期献血", factor: 1.3, description: "血液流失" },
    "gastrointestinal-bleeding": { name: "胃肠道出血", factor: 2.5, description: "慢性失血" },
    "peptic-ulcer": { name: "消化性溃疡", factor: 1.5, description: "可能出血" },
    "inflammatory-bowel": { name: "炎症性肠病", factor: 1.8, description: "吸收不良和出血" },
    "celiac-disease": { name: "乳糜泻", factor: 1.6, description: "铁吸收受损" },
    "kidney-disease": { name: "慢性肾病", factor: 1.4, description: "红细胞生成减少" },
    "heart-failure": { name: "心力衰竭", factor: 1.3, description: "铁代谢异常" },
    "cancer": { name: "癌症", factor: 1.5, description: "慢性疾病性贫血" },
    "rheumatoid-arthritis": { name: "类风湿关节炎", factor: 1.3, description: "慢性炎症" }
  };

  // 饮食类型影响
  const dietFactors = {
    "omnivore": { name: "杂食", factor: 1.0, description: "血红素铁吸收好" },
    "pescatarian": { name: "鱼素", factor: 1.2, description: "主要非血红素铁" },
    "vegetarian": { name: "素食", factor: 1.8, description: "仅非血红素铁" },
    "vegan": { name: "纯素食", factor: 1.8, description: "仅非血红素铁" },
    "low-meat": { name: "少肉饮食", factor: 1.4, description: "血红素铁摄入减少" }
  };

  // 活动水平影响
  const activityFactors = {
    "sedentary": { name: "久坐", factor: 1.0, description: "基础需求" },
    "light": { name: "轻度活动", factor: 1.1, description: "轻微增加" },
    "moderate": { name: "中度活动", factor: 1.2, description: "运动性铁流失" },
    "vigorous": { name: "高强度运动", factor: 1.4, description: "大量出汗和红细胞破坏" },
    "athlete": { name: "专业运动员", factor: 1.6, description: "极高铁需求" }
  };

  // 月经量影响
  const menstrualFactors = {
    "light": { name: "量少", factor: 1.0, description: "正常流失" },
    "normal": { name: "正常", factor: 1.0, description: "正常流失" },
    "heavy": { name: "量多", factor: 1.5, description: "铁流失增加" },
    "very-heavy": { name: "量很多", factor: 2.0, description: "大量铁流失" }
  };

  // 缺铁症状
  const deficiencySymptoms = {
    "fatigue": { name: "疲劳乏力", severity: "轻度", description: "最常见症状" },
    "weakness": { name: "肌肉无力", severity: "轻度", description: "体力下降" },
    "pale-skin": { name: "皮肤苍白", severity: "轻度", description: "血红蛋白减少" },
    "pale-nails": { name: "指甲苍白", severity: "轻度", description: "末梢循环差" },
    "shortness-breath": { name: "气短", severity: "中度", description: "携氧能力下降" },
    "dizziness": { name: "头晕", severity: "中度", description: "脑部供氧不足" },
    "cold-hands-feet": { name: "手脚冰凉", severity: "中度", description: "循环不良" },
    "brittle-nails": { name: "指甲易断", severity: "中度", description: "铁缺乏表现" },
    "restless-legs": { name: "不宁腿综合征", severity: "中度", description: "神经系统症状" },
    "ice-craving": { name: "嗜食冰块", severity: "重度", description: "异食癖表现" },
    "spoon-nails": { name: "匙状甲", severity: "重度", description: "严重缺铁" },
    "hair-loss": { name: "脱发", severity: "重度", description: "毛发生长受影响" },
    "heart-palpitations": { name: "心悸", severity: "重度", description: "心脏代偿" }
  };

  const calculateIronNeeds = () => {
    if (!age || !gender || !weight || !lifeStage || !activityLevel || !dietType) {
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
    
    // 月经量因子 (仅适用于育龄女性)
    let menstrualFactor = 1.0;
    if (gender === "female" && ageNum >= 12 && ageNum < 51 && lifeStage === "normal" && menstrualFlow) {
      menstrualFactor = menstrualFactors[menstrualFlow as keyof typeof menstrualFactors]?.factor || 1.0;
      totalFactor *= menstrualFactor;
    }
    
    // 健康状况因子
    let maxHealthFactor = 1.0;
    healthConditions.forEach(condition => {
      const factor = healthFactors[condition as keyof typeof healthFactors]?.factor || 1.0;
      maxHealthFactor = Math.max(maxHealthFactor, factor);
    });
    totalFactor *= maxHealthFactor;
    
    // 体重调整 (对于极端体重)
    let weightFactor = 1.0;
    const bmi = weightNum / Math.pow(1.7, 2); // 假设平均身高1.7m
    if (bmi < 18.5) {
      weightFactor = 0.9; // 体重过轻，需求略减
    } else if (bmi > 30) {
      weightFactor = 1.1; // 肥胖，可能需求增加
    }
    totalFactor *= weightFactor;
    
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
    if (recommendedIntake > 45) {
      supplementAdvice = "建议咨询医生，可能需要静脉补铁";
    } else if (recommendedIntake > 25) {
      supplementAdvice = "建议口服铁剂补充 (100-200mg元素铁/天)";
    } else if (recommendedIntake > 18) {
      supplementAdvice = "建议适量铁剂补充 (30-60mg元素铁/天)";
    } else {
      supplementAdvice = "通过富铁食物即可满足需求";
    }
    
    // 食物来源建议
    const foodSources = {
      heme: ["牛肝 (18mg/100g)", "猪血 (45mg/100g)", "牛肉 (2.6mg/100g)", "羊肉 (2.3mg/100g)"],
      nonHeme: ["黑芝麻 (22mg/100g)", "菠菜 (2.7mg/100g)", "豆腐 (5.4mg/100g)", "红枣 (2.3mg/100g)"],
      enhancers: ["维生素C (柑橘类)", "肉类蛋白", "发酵食品", "有机酸"],
      inhibitors: ["茶和咖啡", "钙补充剂", "全谷物中的植酸", "蛋白和奶制品"]
    };
    
    // 吸收率计算
    const absorptionRates = {
      heme: 15, // 血红素铁吸收率15-35%
      nonHeme: dietType === "vegan" || dietType === "vegetarian" ? 5 : 8 // 非血红素铁2-20%
    };
    
    setResult({
      baseIntake,
      recommendedIntake: Math.round(recommendedIntake * 10) / 10,
      totalFactor: Math.round(totalFactor * 100) / 100,
      factors: {
        diet: { factor: dietFactor, info: dietFactors[dietType as keyof typeof dietFactors] },
        activity: { factor: activityFactor, info: activityFactors[activityLevel as keyof typeof activityFactors] },
        menstrual: { factor: menstrualFactor, info: menstrualFlow ? menstrualFactors[menstrualFlow as keyof typeof menstrualFactors] : null },
        health: { factor: maxHealthFactor, conditions: healthConditions.map(c => healthFactors[c as keyof typeof healthFactors]) },
        weight: { factor: weightFactor, bmi: Math.round(bmi * 10) / 10 }
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
      absorptionRates,
      inputData: { age: ageNum, gender, weight: weightNum, lifeStage, activityLevel, dietType }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setLifeStage("");
    setActivityLevel("");
    setDietType("");
    setHealthConditions([]);
    setSymptoms([]);
    setMenstrualFlow("");
    setResult(null);
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setHealthConditions([...healthConditions, condition]);
    } else {
      setHealthConditions(healthConditions.filter(c => c !== condition));
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🩸 铁需求计算器</h1>
          <p className="text-lg text-gray-600">
            评估个人铁需求量，预防缺铁性贫血和铁缺乏症
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
                    <Label htmlFor="weight">体重 (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="例如：60"
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
                    <Label htmlFor="activityLevel">活动水平 *</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择活动水平" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">久坐 - 很少运动</SelectItem>
                        <SelectItem value="light">轻度 - 偶尔运动</SelectItem>
                        <SelectItem value="moderate">中度 - 规律运动</SelectItem>
                        <SelectItem value="vigorous">高强度 - 频繁运动</SelectItem>
                        <SelectItem value="athlete">专业运动员</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dietType">饮食类型 *</Label>
                    <Select value={dietType} onValueChange={setDietType}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择饮食类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnivore">杂食 - 包含肉类</SelectItem>
                        <SelectItem value="pescatarian">鱼素 - 吃鱼不吃肉</SelectItem>
                        <SelectItem value="low-meat">少肉 - 偶尔吃肉</SelectItem>
                        <SelectItem value="vegetarian">素食 - 不吃肉但吃蛋奶</SelectItem>
                        <SelectItem value="vegan">纯素食 - 完全植物性</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 月经量 (仅女性显示) */}
                {gender === "female" && lifeStage === "normal" && (
                  <div>
                    <Label htmlFor="menstrualFlow">月经量</Label>
                    <Select value={menstrualFlow} onValueChange={setMenstrualFlow}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择月经量" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">量少 - 3天内结束</SelectItem>
                        <SelectItem value="normal">正常 - 4-6天</SelectItem>
                        <SelectItem value="heavy">量多 - 7天以上或量很大</SelectItem>
                        <SelectItem value="very-heavy">量很多 - 需频繁更换卫生用品</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
          </div>

          {/* 症状评估和结果 */}
          <div className="space-y-6">
            {/* 症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle>缺铁症状评估</CardTitle>
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
              <Button onClick={calculateIronNeeds} className="flex-1">
                计算铁需求
              </Button>
              <Button variant="outline" onClick={resetForm}>
                重置
              </Button>
            </div>

            {/* 计算结果 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>铁需求评估结果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{result.recommendedIntake}</div>
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
                        症状评分: {result.symptoms.riskScore}/39
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <div className="font-semibold text-blue-700 mb-1">补充建议</div>
                      <div className="text-sm text-blue-600">{result.supplementAdvice}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-lg font-bold text-orange-600">{result.absorptionRates.heme}%</div>
                        <div className="text-sm text-gray-600">血红素铁吸收率</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{result.absorptionRates.nonHeme}%</div>
                        <div className="text-sm text-gray-600">非血红素铁吸收率</div>
                      </div>
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
                  <Progress value={(result.factors.diet.factor - 1) * 50} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.diet.info.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>活动水平:</span>
                    <span className="font-semibold">{result.factors.activity.factor}x</span>
                  </div>
                  <Progress value={(result.factors.activity.factor - 1) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.activity.info.description}</p>
                </div>

                {result.factors.menstrual.factor > 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>月经量:</span>
                      <span className="font-semibold">{result.factors.menstrual.factor}x</span>
                    </div>
                    <Progress value={(result.factors.menstrual.factor - 1) * 50} className="h-2" />
                    <p className="text-xs text-gray-600">{result.factors.menstrual.info?.description}</p>
                  </div>
                )}

                {result.factors.health.factor > 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>健康状况:</span>
                      <span className="font-semibold">{result.factors.health.factor}x</span>
                    </div>
                    <Progress value={(result.factors.health.factor - 1) * 25} className="h-2" />
                    <div className="text-xs text-gray-600">
                      {result.factors.health.conditions.map((c: any, i: number) => (
                        <div key={i}>• {c.name}: {c.description}</div>
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

            {/* 食物来源建议 */}
            <Card>
              <CardHeader>
                <CardTitle>食物来源建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-700">血红素铁 (吸收率高)</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.heme.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-700">非血红素铁 (植物来源)</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.nonHeme.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">促进吸收</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.enhancers.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">抑制吸收</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.inhibitors.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 铁知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 铁知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">铁的重要作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• 血红蛋白合成，携带氧气</li>
                  <li>• 肌红蛋白合成，肌肉储氧</li>
                  <li>• 酶系统组成，能量代谢</li>
                  <li>• 免疫系统功能</li>
                  <li>• 神经发育和功能</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">缺铁高危人群</h3>
                <ul className="text-sm space-y-1">
                  <li>• 育龄期女性</li>
                  <li>• 孕妇和哺乳期女性</li>
                  <li>• 婴幼儿和青少年</li>
                  <li>• 素食者</li>
                  <li>• 慢性失血患者</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">检测指标</h3>
                <ul className="text-sm space-y-1">
                  <li>• 血红蛋白 (Hb)</li>
                  <li>• 血清铁蛋白 (SF)</li>
                  <li>• 血清铁 (SI)</li>
                  <li>• 总铁结合力 (TIBC)</li>
                  <li>• 转铁蛋白饱和度 (TS)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">补充注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 空腹服用吸收更好</li>
                  <li>• 与维生素C同服</li>
                  <li>• 避免与茶、咖啡同服</li>
                  <li>• 可能有胃肠道副作用</li>
                  <li>• 定期监测血液指标</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}