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

export default function VitaminB12CalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [dietType, setDietType] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // 维生素B12推荐摄入量 (微克/天)
  const getRecommendedIntake = (ageNum: number, gender: string, lifeStage: string) => {
    if (lifeStage === "pregnancy") return 2.6;
    if (lifeStage === "lactation") return 2.8;
    
    if (ageNum < 1) return 0.4;
    if (ageNum < 4) return 0.9;
    if (ageNum < 9) return 1.2;
    if (ageNum < 14) return 1.8;
    return 2.4; // 成人
  };

  // 健康状况影响因子
  const healthFactors = {
    "pernicious-anemia": { name: "恶性贫血", factor: 3.0, description: "需要注射或高剂量补充" },
    "gastric-surgery": { name: "胃部手术史", factor: 2.5, description: "吸收能力显著下降" },
    "crohns-disease": { name: "克罗恩病", factor: 2.0, description: "肠道吸收受损" },
    "celiac-disease": { name: "乳糜泻", factor: 1.8, description: "小肠绒毛受损" },
    "h-pylori": { name: "幽门螺杆菌感染", factor: 1.5, description: "影响胃酸分泌" },
    "atrophic-gastritis": { name: "萎缩性胃炎", factor: 2.0, description: "内因子分泌不足" },
    "diabetes": { name: "糖尿病", factor: 1.3, description: "可能影响吸收" },
    "kidney-disease": { name: "肾脏疾病", factor: 1.4, description: "代谢异常" },
    "hyperthyroidism": { name: "甲状腺功能亢进", factor: 1.2, description: "代谢加快" }
  };

  // 药物影响因子
  const medicationFactors = {
    "metformin": { name: "二甲双胍", factor: 1.5, description: "长期使用影响吸收" },
    "ppi": { name: "质子泵抑制剂", factor: 1.8, description: "抑制胃酸分泌" },
    "h2-blockers": { name: "H2受体阻滞剂", factor: 1.4, description: "减少胃酸" },
    "colchicine": { name: "秋水仙碱", factor: 1.3, description: "影响肠道吸收" },
    "antibiotics": { name: "长期抗生素", factor: 1.2, description: "影响肠道菌群" },
    "antacids": { name: "抗酸剂", factor: 1.3, description: "中和胃酸" }
  };

  // 饮食类型影响
  const dietFactors = {
    "omnivore": { name: "杂食", factor: 1.0, description: "正常摄入" },
    "vegetarian": { name: "素食", factor: 1.5, description: "动物性食物减少" },
    "vegan": { name: "纯素食", factor: 3.0, description: "完全无动物性食物" },
    "pescatarian": { name: "鱼素", factor: 1.2, description: "主要从鱼类获取" },
    "low-animal": { name: "少量动物性食物", factor: 1.8, description: "摄入不足" }
  };

  // 缺乏症状
  const deficiencySymptoms = {
    "fatigue": { name: "疲劳乏力", severity: "轻度", description: "最常见的早期症状" },
    "weakness": { name: "肌肉无力", severity: "轻度", description: "体力下降" },
    "pale-skin": { name: "皮肤苍白", severity: "轻度", description: "贫血表现" },
    "shortness-breath": { name: "气短", severity: "中度", description: "活动后明显" },
    "dizziness": { name: "头晕", severity: "中度", description: "贫血相关" },
    "heart-palpitations": { name: "心悸", severity: "中度", description: "心率加快" },
    "numbness-tingling": { name: "手脚麻木刺痛", severity: "重度", description: "神经系统受损" },
    "balance-problems": { name: "平衡问题", severity: "重度", description: "周围神经病变" },
    "memory-issues": { name: "记忆力问题", severity: "重度", description: "认知功能受损" },
    "depression": { name: "抑郁情绪", severity: "重度", description: "神经精神症状" },
    "confusion": { name: "思维混乱", severity: "重度", description: "严重缺乏表现" }
  };

  const calculateB12Needs = () => {
    if (!age || !gender || !lifeStage || !dietType) {
      alert("请填写所有必填信息");
      return;
    }

    const ageNum = parseInt(age);
    if (ageNum <= 0 || ageNum > 120) {
      alert("请输入有效的年龄");
      return;
    }

    // 基础推荐量
    const baseIntake = getRecommendedIntake(ageNum, gender, lifeStage);
    
    // 计算各种影响因子
    let totalFactor = 1.0;
    
    // 饮食因子
    const dietFactor = dietFactors[dietType as keyof typeof dietFactors]?.factor || 1.0;
    totalFactor *= dietFactor;
    
    // 健康状况因子
    let maxHealthFactor = 1.0;
    healthConditions.forEach(condition => {
      const factor = healthFactors[condition as keyof typeof healthFactors]?.factor || 1.0;
      maxHealthFactor = Math.max(maxHealthFactor, factor);
    });
    totalFactor *= maxHealthFactor;
    
    // 药物因子
    let maxMedFactor = 1.0;
    medications.forEach(med => {
      const factor = medicationFactors[med as keyof typeof medicationFactors]?.factor || 1.0;
      maxMedFactor = Math.max(maxMedFactor, factor);
    });
    totalFactor *= maxMedFactor;
    
    // 年龄因子 (老年人吸收能力下降)
    if (ageNum >= 65) {
      totalFactor *= 1.5;
    } else if (ageNum >= 50) {
      totalFactor *= 1.2;
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
    if (recommendedIntake > 10) {
      supplementAdvice = "建议咨询医生，可能需要注射或高剂量口服补充";
    } else if (recommendedIntake > 5) {
      supplementAdvice = "建议高剂量口服补充 (500-1000微克/天)";
    } else if (recommendedIntake > 3) {
      supplementAdvice = "建议中等剂量补充 (100-500微克/天)";
    } else {
      supplementAdvice = "可通过食物或低剂量补充 (10-100微克/天)";
    }
    
    // 食物来源建议
    const foodSources = {
      high: ["牛肝 (70微克/100g)", "蛤蜊 (84微克/100g)", "沙丁鱼 (8.9微克/100g)"],
      medium: ["牛肉 (2.6微克/100g)", "鸡蛋 (1.1微克/个)", "牛奶 (0.4微克/100ml)"],
      fortified: ["强化营养酵母 (变化很大)", "强化植物奶", "强化早餐谷物"]
    };
    
    setResult({
      baseIntake,
      recommendedIntake: Math.round(recommendedIntake * 10) / 10,
      totalFactor: Math.round(totalFactor * 100) / 100,
      factors: {
        diet: { factor: dietFactor, info: dietFactors[dietType as keyof typeof dietFactors] },
        health: { factor: maxHealthFactor, conditions: healthConditions.map(c => healthFactors[c as keyof typeof healthFactors]) },
        medications: { factor: maxMedFactor, meds: medications.map(m => medicationFactors[m as keyof typeof medicationFactors]) },
        age: ageNum >= 65 ? 1.5 : ageNum >= 50 ? 1.2 : 1.0
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
      inputData: { age: ageNum, gender, lifeStage, dietType }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setLifeStage("");
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧬 维生素B12需求计算器</h1>
          <p className="text-lg text-gray-600">
            评估个人维生素B12需求量，预防缺乏症和神经系统损伤
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

                <div>
                  <Label htmlFor="dietType">饮食类型 *</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择饮食类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">杂食 - 正常摄入动物性食物</SelectItem>
                      <SelectItem value="pescatarian">鱼素 - 吃鱼但不吃其他肉类</SelectItem>
                      <SelectItem value="low-animal">少量动物性食物</SelectItem>
                      <SelectItem value="vegetarian">素食 - 不吃肉但吃蛋奶</SelectItem>
                      <SelectItem value="vegan">纯素食 - 完全不吃动物性食物</SelectItem>
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
                <CardTitle>缺乏症状评估</CardTitle>
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
              <Button onClick={calculateB12Needs} className="flex-1">
                计算需求量
              </Button>
              <Button variant="outline" onClick={resetForm}>
                重置
              </Button>
            </div>

            {/* 计算结果 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>需求评估结果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{result.recommendedIntake}</div>
                        <div className="text-sm text-gray-600">微克/天</div>
                        <div className="text-xs text-gray-500 mt-1">
                          基础需求: {result.baseIntake} 微克/天
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
                        症状评分: {result.symptoms.riskScore}/33
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
                  <Progress value={(result.factors.diet.factor - 1) * 50} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.diet.info.description}</p>
                </div>

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

                {result.factors.medications.factor > 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>药物影响:</span>
                      <span className="font-semibold">{result.factors.medications.factor}x</span>
                    </div>
                    <Progress value={(result.factors.medications.factor - 1) * 40} className="h-2" />
                    <div className="text-xs text-gray-600">
                      {result.factors.medications.meds.map((m: any, i: number) => (
                        <div key={i}>• {m.name}: {m.description}</div>
                      ))}
                    </div>
                  </div>
                )}

                {result.factors.age > 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>年龄因子:</span>
                      <span className="font-semibold">{result.factors.age}x</span>
                    </div>
                    <Progress value={(result.factors.age - 1) * 100} className="h-2" />
                    <p className="text-xs text-gray-600">年龄增长导致吸收能力下降</p>
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
                  <h4 className="font-semibold mb-2 text-green-700">高含量食物</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.high.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">中等含量食物</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.medium.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
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

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>注意:</strong> 植物性食物几乎不含维生素B12，素食者需要特别关注补充。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 维生素B12知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 维生素B12知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">重要作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• DNA合成和细胞分裂</li>
                  <li>• 神经系统正常功能</li>
                  <li>• 红细胞形成</li>
                  <li>• 蛋白质和脂肪代谢</li>
                  <li>• 同型半胱氨酸代谢</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">缺乏风险人群</h3>
                <ul className="text-sm space-y-1">
                  <li>• 素食者和纯素食者</li>
                  <li>• 50岁以上人群</li>
                  <li>• 胃肠道疾病患者</li>
                  <li>• 长期服用某些药物</li>
                  <li>• 恶性贫血患者</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">检测方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• 血清维生素B12水平</li>
                  <li>• 甲基丙二酸 (MMA) 检测</li>
                  <li>• 同型半胱氨酸水平</li>
                  <li>• 全血细胞计数</li>
                  <li>• 内因子抗体检测</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">补充注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 口服吸收有限 (1-2微克/次)</li>
                  <li>• 严重缺乏需要注射治疗</li>
                  <li>• 叶酸可能掩盖B12缺乏</li>
                  <li>• 定期监测血液指标</li>
                  <li>• 神经损伤可能不可逆</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}