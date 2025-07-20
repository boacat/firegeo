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

export default function ZincCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [dietType, setDietType] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // 锌推荐摄入量 (毫克/天)
  const getRecommendedIntake = (ageNum: number, gender: string, lifeStage: string) => {
    if (lifeStage === "pregnancy") {
      if (ageNum < 19) return 13;
      return 11;
    }
    if (lifeStage === "lactation") {
      if (ageNum < 19) return 14;
      return 12;
    }
    
    // 儿童和青少年
    if (ageNum < 0.5) return 2;
    if (ageNum < 1) return 3;
    if (ageNum < 4) return 3;
    if (ageNum < 9) return 5;
    if (ageNum < 14) return 8;
    if (ageNum < 19) return gender === "male" ? 11 : 9;
    
    // 成人
    return gender === "male" ? 11 : 8;
  };

  // 健康状况影响因子
  const healthFactors = {
    "wound-healing": { name: "伤口愈合期", factor: 2.0, description: "组织修复需要大量锌" },
    "burns": { name: "烧伤", factor: 2.5, description: "皮肤修复和免疫功能" },
    "surgery-recovery": { name: "手术恢复期", factor: 1.8, description: "组织愈合和免疫支持" },
    "immune-deficiency": { name: "免疫缺陷", factor: 1.6, description: "免疫系统功能异常" },
    "frequent-infections": { name: "反复感染", factor: 1.5, description: "免疫力低下" },
    "acne": { name: "痤疮", factor: 1.4, description: "皮肤炎症和修复" },
    "eczema": { name: "湿疹", factor: 1.3, description: "皮肤屏障功能" },
    "psoriasis": { name: "银屑病", factor: 1.5, description: "皮肤细胞增殖异常" },
    "hair-loss": { name: "脱发", factor: 1.3, description: "毛发生长需要锌" },
    "taste-loss": { name: "味觉减退", factor: 1.8, description: "味觉功能依赖锌" },
    "growth-retardation": { name: "生长迟缓", factor: 1.6, description: "生长发育需要锌" },
    "male-infertility": { name: "男性不育", factor: 1.5, description: "精子生成和质量" },
    "prostate-issues": { name: "前列腺问题", factor: 1.4, description: "前列腺健康" },
    "diabetes": { name: "糖尿病", factor: 1.3, description: "胰岛素合成和作用" },
    "gi-disorders": { name: "胃肠道疾病", factor: 1.8, description: "吸收不良" },
    "liver-disease": { name: "肝脏疾病", factor: 1.4, description: "肝脏代谢异常" },
    "kidney-disease": { name: "肾脏疾病", factor: 1.6, description: "锌流失增加" },
    "alcoholism": { name: "酒精依赖", factor: 2.0, description: "严重消耗锌储备" },
    "anorexia": { name: "厌食症", factor: 1.8, description: "营养不良" },
    "depression": { name: "抑郁症", factor: 1.3, description: "神经递质合成" }
  };

  // 药物影响因子
  const medicationFactors = {
    "diuretics": { name: "利尿剂", factor: 1.4, description: "增加锌流失" },
    "ace-inhibitors": { name: "ACE抑制剂", factor: 1.3, description: "影响锌代谢" },
    "antibiotics": { name: "抗生素", factor: 1.5, description: "影响肠道菌群和吸收" },
    "corticosteroids": { name: "糖皮质激素", factor: 1.6, description: "增加锌流失" },
    "immunosuppressants": { name: "免疫抑制剂", factor: 1.4, description: "影响锌利用" },
    "chemotherapy": { name: "化疗药物", factor: 2.0, description: "严重消耗锌" },
    "iron-supplements": { name: "铁补充剂", factor: 1.2, description: "竞争性吸收" },
    "calcium-supplements": { name: "钙补充剂", factor: 1.2, description: "影响锌吸收" },
    "fiber-supplements": { name: "纤维补充剂", factor: 1.3, description: "结合锌影响吸收" },
    "antacids": { name: "抗酸剂", factor: 1.4, description: "影响胃酸和锌吸收" }
  };

  // 饮食类型影响
  const dietFactors = {
    "balanced": { name: "均衡饮食", factor: 1.0, description: "充足的肉类和海鲜" },
    "vegetarian": { name: "素食", factor: 1.5, description: "植物性锌吸收率低" },
    "vegan": { name: "纯素食", factor: 1.8, description: "缺乏动物性锌来源" },
    "high-fiber": { name: "高纤维饮食", factor: 1.4, description: "纤维影响锌吸收" },
    "high-phytate": { name: "高植酸饮食", factor: 1.6, description: "植酸结合锌" },
    "processed": { name: "加工食品为主", factor: 1.3, description: "锌含量低" },
    "low-protein": { name: "低蛋白饮食", factor: 1.4, description: "蛋白质促进锌吸收" },
    "raw-food": { name: "生食饮食", factor: 1.3, description: "可能影响锌利用" },
    "ketogenic": { name: "生酮饮食", factor: 0.9, description: "富含动物性食物" },
    "mediterranean": { name: "地中海饮食", factor: 1.1, description: "海鲜丰富但植物性食物多" }
  };

  // 活动水平影响
  const activityFactors = {
    "sedentary": { name: "久坐", factor: 1.0, description: "基础需求" },
    "light": { name: "轻度活动", factor: 1.1, description: "轻微增加需求" },
    "moderate": { name: "中度运动", factor: 1.3, description: "出汗增加锌流失" },
    "vigorous": { name: "高强度运动", factor: 1.5, description: "大量出汗流失锌" },
    "athlete": { name: "专业运动员", factor: 1.8, description: "极高的锌需求" },
    "endurance": { name: "耐力运动", factor: 1.6, description: "长时间出汗" }
  };

  // 生活方式因素
  const lifestyleFactors = {
    "smoking": { name: "吸烟", factor: 1.4, description: "氧化应激增加锌需求" },
    "alcohol-moderate": { name: "适量饮酒", factor: 1.2, description: "轻度影响锌吸收" },
    "alcohol-heavy": { name: "大量饮酒", factor: 1.8, description: "严重影响锌代谢" },
    "stress-high": { name: "高压力", factor: 1.3, description: "压力激素影响锌" },
    "poor-sleep": { name: "睡眠不足", factor: 1.2, description: "影响锌利用" },
    "frequent-illness": { name: "经常生病", factor: 1.5, description: "免疫系统消耗锌" },
    "sun-exposure": { name: "大量日晒", factor: 1.2, description: "皮肤修复需要锌" }
  };

  // 缺锌症状
  const deficiencySymptoms = {
    "slow-wound-healing": { name: "伤口愈合缓慢", severity: "轻度", description: "组织修复能力下降" },
    "frequent-colds": { name: "经常感冒", severity: "轻度", description: "免疫力下降" },
    "hair-loss": { name: "脱发", severity: "轻度", description: "毛发生长异常" },
    "skin-problems": { name: "皮肤问题", severity: "轻度", description: "皮肤干燥、炎症" },
    "taste-changes": { name: "味觉改变", severity: "中度", description: "味觉减退或异常" },
    "smell-changes": { name: "嗅觉改变", severity: "中度", description: "嗅觉减退" },
    "appetite-loss": { name: "食欲不振", severity: "中度", description: "进食欲望下降" },
    "fatigue": { name: "疲劳乏力", severity: "中度", description: "能量代谢异常" },
    "mood-changes": { name: "情绪变化", severity: "中度", description: "易怒、抑郁" },
    "concentration-problems": { name: "注意力不集中", severity: "中度", description: "认知功能下降" },
    "growth-retardation": { name: "生长迟缓", severity: "重度", description: "儿童生长发育异常" },
    "sexual-dysfunction": { name: "性功能障碍", severity: "重度", description: "生殖功能异常" },
    "severe-infections": { name: "严重感染", severity: "重度", description: "免疫系统严重受损" },
    "night-blindness": { name: "夜盲症", severity: "重度", description: "维生素A代谢异常" },
    "diarrhea": { name: "腹泻", severity: "重度", description: "肠道功能异常" }
  };

  const calculateZincNeeds = () => {
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
    
    // 健康状况因子
    let maxHealthFactor = 1.0;
    healthConditions.forEach(condition => {
      const factor = healthFactors[condition as keyof typeof healthFactors]?.factor || 1.0;
      maxHealthFactor = Math.max(maxHealthFactor, factor);
    });
    totalFactor *= maxHealthFactor;
    
    // 药物因子
    let medicationFactor = 1.0;
    medications.forEach(med => {
      const factor = medicationFactors[med as keyof typeof medicationFactors]?.factor || 1.0;
      medicationFactor = Math.max(medicationFactor, factor);
    });
    totalFactor *= medicationFactor;
    
    // 生活方式因子
    let lifestyleFactor = 1.0;
    lifestyle.forEach(factor => {
      const factorValue = lifestyleFactors[factor as keyof typeof lifestyleFactors]?.factor || 1.0;
      lifestyleFactor = Math.max(lifestyleFactor, factorValue);
    });
    totalFactor *= lifestyleFactor;
    
    // 体重调整 (大体重需要更多锌)
    if (weightNum > 80) {
      totalFactor *= 1.1;
    } else if (weightNum < 50) {
      totalFactor *= 0.9;
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
    if (recommendedIntake > 40) {
      supplementAdvice = "建议咨询医生，可能需要高剂量锌补充剂，注意上限";
    } else if (recommendedIntake > 25) {
      supplementAdvice = "建议锌补充剂 (15-25mg/天)，选择柠檬酸锌或葡萄糖酸锌";
    } else if (recommendedIntake > 15) {
      supplementAdvice = "建议适量锌补充剂 (8-15mg/天)";
    } else {
      supplementAdvice = "通过富锌食物即可满足需求";
    }
    
    // 食物来源建议
    const foodSources = {
      meat: ["牡蛎 (74mg/100g)", "牛肉 (4.8mg/100g)", "猪肉 (2.9mg/100g)", "羊肉 (3.9mg/100g)"],
      seafood: ["螃蟹 (7.6mg/100g)", "龙虾 (7.3mg/100g)", "虾 (1.6mg/100g)", "鱼类 (0.4-1.0mg/100g)"],
      poultry: ["鸡肉 (1.3mg/100g)", "火鸡 (2.5mg/100g)", "鸭肉 (1.9mg/100g)", "鸡蛋 (1.3mg/100g)"],
      dairy: ["奶酪 (3.1mg/100g)", "牛奶 (0.4mg/100g)", "酸奶 (0.6mg/100g)"],
      nuts: ["南瓜子 (7.8mg/100g)", "芝麻 (7.8mg/100g)", "腰果 (5.8mg/100g)", "杏仁 (3.1mg/100g)"],
      grains: ["燕麦 (4.0mg/100g)", "小麦胚芽 (17mg/100g)", "糙米 (1.2mg/100g)", "全麦面包 (1.8mg/100g)"],
      legumes: ["扁豆 (1.3mg/100g)", "鹰嘴豆 (1.5mg/100g)", "黑豆 (1.9mg/100g)", "豆腐 (0.8mg/100g)"]
    };
    
    // 锌的形式和吸收率
    const supplementForms = {
      "zinc-citrate": { name: "柠檬酸锌", absorption: "高", description: "吸收率好，胃肠刺激小" },
      "zinc-gluconate": { name: "葡萄糖酸锌", absorption: "高", description: "温和，适合长期使用" },
      "zinc-picolinate": { name: "吡啶甲酸锌", absorption: "最高", description: "最佳吸收率" },
      "zinc-bisglycinate": { name: "甘氨酸锌", absorption: "高", description: "螯合形式，不刺激胃" },
      "zinc-monomethionine": { name: "蛋氨酸锌", absorption: "高", description: "氨基酸螯合" },
      "zinc-sulfate": { name: "硫酸锌", absorption: "中", description: "便宜但可能刺激胃" },
      "zinc-oxide": { name: "氧化锌", absorption: "低", description: "主要用于外用" }
    };
    
    // 每日锌摄入分配建议
    const dailyDistribution = {
      morning: Math.round(recommendedIntake * 0.4),
      evening: Math.round(recommendedIntake * 0.6) // 晚上更多，空腹吸收更好
    };
    
    // 吸收优化建议
    const absorptionTips = {
      enhance: ["空腹服用 (餐前1小时或餐后2小时)", "与蛋白质一起摄入", "维生素C促进吸收", "适量胃酸环境"],
      inhibit: ["避免与钙、铁同时大量摄入", "避免与高纤维食物同时", "避免与咖啡、茶同时", "避免与抗酸剂同时"]
    };
    
    setResult({
      baseIntake,
      recommendedIntake: Math.round(recommendedIntake * 10) / 10,
      totalFactor: Math.round(totalFactor * 100) / 100,
      factors: {
        diet: { factor: dietFactor, info: dietFactors[dietType as keyof typeof dietFactors] },
        activity: { factor: activityFactor, info: activityFactors[activityLevel as keyof typeof activityFactors] },
        health: { factor: maxHealthFactor, conditions: healthConditions.map(c => healthFactors[c as keyof typeof healthFactors]) },
        medications: { factor: medicationFactor, meds: medications.map(m => medicationFactors[m as keyof typeof medicationFactors]) },
        lifestyle: { factor: lifestyleFactor, factors: lifestyle.map(l => lifestyleFactors[l as keyof typeof lifestyleFactors]) }
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
      supplementForms,
      dailyDistribution,
      absorptionTips,
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
    setMedications([]);
    setSymptoms([]);
    setLifestyle([]);
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

  const handleLifestyleChange = (factor: string, checked: boolean) => {
    if (checked) {
      setLifestyle([...lifestyle, factor]);
    } else {
      setLifestyle(lifestyle.filter(l => l !== factor));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔬 锌需求计算器</h1>
          <p className="text-lg text-gray-600">
            评估个人锌需求量，维护免疫功能，促进伤口愈合和生长发育
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
                    <Label htmlFor="activityLevel">运动水平 *</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择运动水平" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">久坐 - 很少运动</SelectItem>
                        <SelectItem value="light">轻度 - 偶尔运动</SelectItem>
                        <SelectItem value="moderate">中度 - 规律运动</SelectItem>
                        <SelectItem value="vigorous">高强度 - 频繁运动</SelectItem>
                        <SelectItem value="athlete">专业运动员</SelectItem>
                        <SelectItem value="endurance">耐力运动员</SelectItem>
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
                        <SelectItem value="balanced">均衡饮食 - 丰富肉类海鲜</SelectItem>
                        <SelectItem value="vegetarian">素食</SelectItem>
                        <SelectItem value="vegan">纯素食</SelectItem>
                        <SelectItem value="high-fiber">高纤维饮食</SelectItem>
                        <SelectItem value="high-phytate">高植酸饮食</SelectItem>
                        <SelectItem value="processed">加工食品为主</SelectItem>
                        <SelectItem value="low-protein">低蛋白饮食</SelectItem>
                        <SelectItem value="raw-food">生食饮食</SelectItem>
                        <SelectItem value="ketogenic">生酮饮食</SelectItem>
                        <SelectItem value="mediterranean">地中海饮食</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

          {/* 生活方式和症状评估 */}
          <div className="space-y-6">
            {/* 生活方式因素 */}
            <Card>
              <CardHeader>
                <CardTitle>生活方式因素</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(lifestyleFactors).map(([key, factor]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Checkbox
                        id={key}
                        checked={lifestyle.includes(key)}
                        onCheckedChange={(checked) => handleLifestyleChange(key, checked as boolean)}
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

            {/* 症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle>缺锌症状评估</CardTitle>
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
              <Button onClick={calculateZincNeeds} className="flex-1">
                计算锌需求
              </Button>
              <Button variant="outline" onClick={resetForm}>
                重置
              </Button>
            </div>

            {/* 计算结果 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>锌需求评估结果</CardTitle>
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
                        症状评分: {result.symptoms.riskScore}/45
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
                    <span>运动水平:</span>
                    <span className="font-semibold">{result.factors.activity.factor}x</span>
                  </div>
                  <Progress value={(result.factors.activity.factor - 0.5) * 50} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.activity.info.description}</p>
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
                    <Progress value={(result.factors.medications.factor - 0.5) * 50} className="h-2" />
                    <div className="text-xs text-gray-600">
                      {result.factors.medications.meds.map((m: any, i: number) => (
                        <div key={i}>• {m.name}: {m.description}</div>
                      ))}
                    </div>
                  </div>
                )}

                {result.factors.lifestyle.factor !== 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>生活方式:</span>
                      <span className="font-semibold">{result.factors.lifestyle.factor}x</span>
                    </div>
                    <Progress value={(result.factors.lifestyle.factor - 0.5) * 100} className="h-2" />
                    <div className="text-xs text-gray-600">
                      {result.factors.lifestyle.factors.map((f: any, i: number) => (
                        <div key={i}>• {f.name}: {f.description}</div>
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
                    <span className="font-medium">上午 (40%):</span>
                    <span className="font-semibold">{result.dailyDistribution.morning} mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">晚上 (60%):</span>
                    <span className="font-semibold">{result.dailyDistribution.evening} mg</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>提示:</strong> 锌最好空腹服用，但如果胃部不适可随餐服用。
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">促进吸收</h4>
                  <ul className="text-xs space-y-1">
                    {result.absorptionTips.enhance.map((tip: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700">抑制吸收</h4>
                  <ul className="text-xs space-y-1">
                    {result.absorptionTips.inhibit.map((tip: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 食物来源和补充剂建议 */}
        {result && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* 食物来源建议 */}
            <Card>
              <CardHeader>
                <CardTitle>食物来源建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-700">肉类 (含量最高)</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.meat.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">海鲜类</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.seafood.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">禽类和蛋类</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.poultry.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">乳制品</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.dairy.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-700">坚果种子</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.nuts.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-yellow-700">全谷物</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.grains.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">豆类</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.legumes.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 补充剂形式建议 */}
            <Card>
              <CardHeader>
                <CardTitle>补充剂形式建议</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.supplementForms).map(([key, form]: [string, any]) => (
                  <div key={key} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{form.name}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        form.absorption === "最高" ? "bg-green-100 text-green-800" :
                        form.absorption === "高" ? "bg-blue-100 text-blue-800" :
                        form.absorption === "中" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {form.absorption}吸收
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{form.description}</p>
                  </div>
                ))}

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>推荐:</strong> 吡啶甲酸锌吸收率最高，甘氨酸锌温和不刺激胃。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 锌知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 锌知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">锌的重要作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• 免疫系统功能</li>
                  <li>• 伤口愈合和组织修复</li>
                  <li>• 蛋白质和DNA合成</li>
                  <li>• 生长发育</li>
                  <li>• 味觉和嗅觉</li>
                  <li>• 生殖健康</li>
                  <li>• 抗氧化作用</li>
                  <li>• 胰岛素功能</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">缺锌高危人群</h3>
                <ul className="text-sm space-y-1">
                  <li>• 素食者和纯素食者</li>
                  <li>• 孕妇和哺乳期妇女</li>
                  <li>• 儿童和青少年</li>
                  <li>• 老年人</li>
                  <li>• 运动员</li>
                  <li>• 胃肠道疾病患者</li>
                  <li>• 酗酒者</li>
                  <li>• 慢性疾病患者</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">检测方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• 血清锌 (最常用)</li>
                  <li>• 血浆锌</li>
                  <li>• 红细胞锌</li>
                  <li>• 尿锌</li>
                  <li>• 毛发锌 (反映长期状态)</li>
                  <li>• 味觉测试</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">补充注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 成人上限: 40mg/天</li>
                  <li>• 空腹服用吸收更好</li>
                  <li>• 避免与铁、钙同时大量服用</li>
                  <li>• 长期大剂量可能导致铜缺乏</li>
                  <li>• 胃部不适可随餐服用</li>
                  <li>• 定期监测血锌水平</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}