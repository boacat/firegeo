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

export default function MagnesiumCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [lifeStage, setLifeStage] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [dietType, setDietType] = useState("");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // 镁推荐摄入量 (毫克/天)
  const getRecommendedIntake = (ageNum: number, gender: string, lifeStage: string) => {
    if (lifeStage === "pregnancy") {
      if (ageNum < 19) return 400;
      return 350;
    }
    if (lifeStage === "lactation") {
      if (ageNum < 19) return 360;
      return 310;
    }
    
    // 儿童和青少年
    if (ageNum < 1) return 30;
    if (ageNum < 4) return 80;
    if (ageNum < 9) return 130;
    if (ageNum < 14) return 240;
    if (ageNum < 19) return gender === "male" ? 410 : 360;
    
    // 成人
    if (ageNum < 31) return gender === "male" ? 400 : 310;
    return gender === "male" ? 420 : 320;
  };

  // 健康状况影响因子
  const healthFactors = {
    "diabetes-type2": { name: "2型糖尿病", factor: 1.4, description: "胰岛素抵抗增加镁需求" },
    "hypertension": { name: "高血压", factor: 1.3, description: "血管健康需要更多镁" },
    "cardiovascular": { name: "心血管疾病", factor: 1.5, description: "心肌功能需要充足镁" },
    "migraine": { name: "偏头痛", factor: 1.6, description: "神经功能异常" },
    "fibromyalgia": { name: "纤维肌痛", factor: 1.7, description: "肌肉疼痛和疲劳" },
    "chronic-fatigue": { name: "慢性疲劳综合征", factor: 1.5, description: "能量代谢异常" },
    "pms": { name: "经前综合征", factor: 1.4, description: "激素波动影响" },
    "osteoporosis": { name: "骨质疏松", factor: 1.3, description: "骨代谢需要镁" },
    "asthma": { name: "哮喘", factor: 1.4, description: "支气管平滑肌功能" },
    "depression": { name: "抑郁症", factor: 1.3, description: "神经递质合成" },
    "anxiety": { name: "焦虑症", factor: 1.4, description: "神经系统稳定" },
    "insomnia": { name: "失眠", factor: 1.3, description: "睡眠质量调节" },
    "kidney-disease": { name: "肾脏疾病", factor: 0.7, description: "需要限制镁摄入" },
    "gi-disorders": { name: "胃肠道疾病", factor: 1.8, description: "吸收不良" },
    "alcoholism": { name: "酒精依赖", factor: 2.0, description: "严重消耗镁储备" }
  };

  // 药物影响因子
  const medicationFactors = {
    "diuretics": { name: "利尿剂", factor: 1.8, description: "增加镁流失" },
    "ppi": { name: "质子泵抑制剂", factor: 1.4, description: "影响镁吸收" },
    "antibiotics": { name: "抗生素", factor: 1.3, description: "影响肠道菌群" },
    "chemotherapy": { name: "化疗药物", factor: 2.0, description: "严重消耗镁" },
    "digitalis": { name: "洋地黄类药物", factor: 1.5, description: "心脏药物相互作用" },
    "insulin": { name: "胰岛素", factor: 1.3, description: "影响细胞镁转运" },
    "bisphosphonates": { name: "双膦酸盐", factor: 1.2, description: "骨代谢影响" },
    "corticosteroids": { name: "糖皮质激素", factor: 1.6, description: "增加镁流失" }
  };

  // 饮食类型影响
  const dietFactors = {
    "balanced": { name: "均衡饮食", factor: 1.0, description: "充足的绿叶蔬菜和坚果" },
    "processed": { name: "加工食品为主", factor: 1.6, description: "镁含量低，需要补充" },
    "low-carb": { name: "低碳水化合物", factor: 1.2, description: "可能缺乏全谷物" },
    "vegetarian": { name: "素食", factor: 0.9, description: "植物性食物镁含量高" },
    "vegan": { name: "纯素食", factor: 0.8, description: "丰富的植物性镁来源" },
    "keto": { name: "生酮饮食", factor: 1.4, description: "限制含镁食物" },
    "western": { name: "西式饮食", factor: 1.5, description: "精制食品多，镁含量低" },
    "mediterranean": { name: "地中海饮食", factor: 0.8, description: "坚果、绿叶菜丰富" }
  };

  // 活动水平影响
  const activityFactors = {
    "sedentary": { name: "久坐", factor: 1.0, description: "基础需求" },
    "light": { name: "轻度活动", factor: 1.1, description: "轻微增加需求" },
    "moderate": { name: "中度运动", factor: 1.3, description: "出汗增加镁流失" },
    "vigorous": { name: "高强度运动", factor: 1.6, description: "大量出汗流失镁" },
    "athlete": { name: "专业运动员", factor: 2.0, description: "极高的镁需求" },
    "endurance": { name: "耐力运动", factor: 1.8, description: "长时间出汗" }
  };

  // 压力水平影响
  const stressFactors = {
    "low": { name: "低压力", factor: 1.0, description: "正常镁需求" },
    "moderate": { name: "中等压力", factor: 1.2, description: "轻度增加需求" },
    "high": { name: "高压力", factor: 1.5, description: "压力激素消耗镁" },
    "chronic": { name: "慢性压力", factor: 1.8, description: "持续消耗镁储备" },
    "acute": { name: "急性压力", factor: 1.6, description: "短期大量消耗" }
  };

  // 生活方式因素
  const lifestyleFactors = {
    "smoking": { name: "吸烟", factor: 1.4, description: "氧化应激增加镁需求" },
    "alcohol-moderate": { name: "适量饮酒", factor: 1.2, description: "轻度影响镁吸收" },
    "alcohol-heavy": { name: "大量饮酒", factor: 1.8, description: "严重影响镁代谢" },
    "caffeine-high": { name: "高咖啡因摄入", factor: 1.3, description: "增加镁流失" },
    "poor-sleep": { name: "睡眠不足", factor: 1.3, description: "影响镁利用" },
    "shift-work": { name: "轮班工作", factor: 1.4, description: "生物钟紊乱" }
  };

  // 缺镁症状
  const deficiencySymptoms = {
    "muscle-cramps": { name: "肌肉痉挛", severity: "轻度", description: "最常见的缺镁症状" },
    "fatigue": { name: "疲劳乏力", severity: "轻度", description: "能量代谢受影响" },
    "weakness": { name: "肌肉无力", severity: "轻度", description: "肌肉功能下降" },
    "irritability": { name: "易怒烦躁", severity: "轻度", description: "神经系统症状" },
    "headaches": { name: "头痛", severity: "中度", description: "血管功能异常" },
    "insomnia": { name: "失眠", severity: "中度", description: "神经递质失衡" },
    "anxiety": { name: "焦虑", severity: "中度", description: "神经系统过度兴奋" },
    "depression": { name: "抑郁情绪", severity: "中度", description: "神经递质合成异常" },
    "irregular-heartbeat": { name: "心律不齐", severity: "重度", description: "心肌电传导异常" },
    "high-blood-pressure": { name: "血压升高", severity: "重度", description: "血管平滑肌功能异常" },
    "seizures": { name: "癫痫发作", severity: "重度", description: "严重神经系统症状" },
    "tetany": { name: "手足抽搐", severity: "重度", description: "严重缺镁表现" },
    "personality-changes": { name: "性格改变", severity: "重度", description: "严重神经精神症状" }
  };

  const calculateMagnesiumNeeds = () => {
    if (!age || !gender || !weight || !lifeStage || !activityLevel || !stressLevel || !dietType) {
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
    
    // 压力水平因子
    const stressFactor = stressFactors[stressLevel as keyof typeof stressFactors]?.factor || 1.0;
    totalFactor *= stressFactor;
    
    // 健康状况因子
    let maxHealthFactor = 1.0;
    healthConditions.forEach(condition => {
      const factor = healthFactors[condition as keyof typeof healthFactors]?.factor || 1.0;
      if (condition === "kidney-disease") {
        maxHealthFactor = Math.min(maxHealthFactor, factor); // 肾病需要限制
      } else {
        maxHealthFactor = Math.max(maxHealthFactor, factor);
      }
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
    
    // 体重调整 (大体重需要更多镁)
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
    if (recommendedIntake > 800) {
      supplementAdvice = "建议咨询医生，可能需要高剂量镁补充剂";
    } else if (recommendedIntake > 600) {
      supplementAdvice = "建议镁补充剂 (200-400mg/天)，选择柠檬酸镁或甘氨酸镁";
    } else if (recommendedIntake > 450) {
      supplementAdvice = "建议适量镁补充剂 (100-200mg/天)";
    } else {
      supplementAdvice = "通过富镁食物即可满足需求";
    }
    
    // 食物来源建议
    const foodSources = {
      nuts: ["杏仁 (268mg/100g)", "腰果 (292mg/100g)", "花生 (168mg/100g)", "核桃 (158mg/100g)"],
      seeds: ["南瓜子 (592mg/100g)", "葵花子 (325mg/100g)", "芝麻 (351mg/100g)", "亚麻籽 (392mg/100g)"],
      grains: ["糙米 (143mg/100g)", "燕麦 (177mg/100g)", "全麦面包 (76mg/100g)", "藜麦 (197mg/100g)"],
      vegetables: ["菠菜 (79mg/100g)", "瑞士甜菜 (81mg/100g)", "羽衣甘蓝 (47mg/100g)", "西兰花 (21mg/100g)"],
      legumes: ["黑豆 (171mg/100g)", "鹰嘴豆 (115mg/100g)", "扁豆 (122mg/100g)", "豆腐 (53mg/100g)"],
      others: ["黑巧克力 (228mg/100g)", "鳄梨 (29mg/100g)", "香蕉 (27mg/100g)", "酸奶 (19mg/100g)"]
    };
    
    // 镁的形式和吸收率
    const supplementForms = {
      "magnesium-citrate": { name: "柠檬酸镁", absorption: "高", description: "吸收率好，轻泻作用" },
      "magnesium-glycinate": { name: "甘氨酸镁", absorption: "高", description: "最佳吸收，不刺激肠胃" },
      "magnesium-malate": { name: "苹果酸镁", absorption: "中高", description: "能量代谢，适合疲劳" },
      "magnesium-taurate": { name: "牛磺酸镁", absorption: "中高", description: "心血管健康" },
      "magnesium-threonate": { name: "苏糖酸镁", absorption: "中", description: "脑部健康" },
      "magnesium-oxide": { name: "氧化镁", absorption: "低", description: "便宜但吸收差" }
    };
    
    // 每日镁摄入分配建议
    const dailyDistribution = {
      morning: Math.round(recommendedIntake * 0.3),
      afternoon: Math.round(recommendedIntake * 0.3),
      evening: Math.round(recommendedIntake * 0.4) // 晚上更多，有助睡眠
    };
    
    setResult({
      baseIntake,
      recommendedIntake: Math.round(recommendedIntake),
      totalFactor: Math.round(totalFactor * 100) / 100,
      factors: {
        diet: { factor: dietFactor, info: dietFactors[dietType as keyof typeof dietFactors] },
        activity: { factor: activityFactor, info: activityFactors[activityLevel as keyof typeof activityFactors] },
        stress: { factor: stressFactor, info: stressFactors[stressLevel as keyof typeof stressFactors] },
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
      inputData: { age: ageNum, gender, weight: weightNum, lifeStage, activityLevel, stressLevel, dietType }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setLifeStage("");
    setActivityLevel("");
    setStressLevel("");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧲 镁需求计算器</h1>
          <p className="text-lg text-gray-600">
            评估个人镁需求量，维护神经肌肉健康，改善睡眠和心血管功能
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
                    <Label htmlFor="stressLevel">压力水平 *</Label>
                    <Select value={stressLevel} onValueChange={setStressLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择压力水平" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低压力 - 生活轻松</SelectItem>
                        <SelectItem value="moderate">中等压力 - 偶有压力</SelectItem>
                        <SelectItem value="high">高压力 - 工作繁忙</SelectItem>
                        <SelectItem value="chronic">慢性压力 - 持续紧张</SelectItem>
                        <SelectItem value="acute">急性压力 - 重大事件</SelectItem>
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
                      <SelectItem value="balanced">均衡饮食 - 丰富蔬菜坚果</SelectItem>
                      <SelectItem value="processed">加工食品为主</SelectItem>
                      <SelectItem value="low-carb">低碳水化合物</SelectItem>
                      <SelectItem value="vegetarian">素食</SelectItem>
                      <SelectItem value="vegan">纯素食</SelectItem>
                      <SelectItem value="keto">生酮饮食</SelectItem>
                      <SelectItem value="western">西式饮食</SelectItem>
                      <SelectItem value="mediterranean">地中海饮食</SelectItem>
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
                <CardTitle>缺镁症状评估</CardTitle>
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
              <Button onClick={calculateMagnesiumNeeds} className="flex-1">
                计算镁需求
              </Button>
              <Button variant="outline" onClick={resetForm}>
                重置
              </Button>
            </div>

            {/* 计算结果 */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>镁需求评估结果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{result.recommendedIntake}</div>
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

                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-semibold text-green-700 mb-1">补充建议</div>
                      <div className="text-sm text-green-600">{result.supplementAdvice}</div>
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

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>压力水平:</span>
                    <span className="font-semibold">{result.factors.stress.factor}x</span>
                  </div>
                  <Progress value={(result.factors.stress.factor - 0.5) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{result.factors.stress.info.description}</p>
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
                    <span className="font-medium">上午 (30%):</span>
                    <span className="font-semibold">{result.dailyDistribution.morning} mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="font-medium">下午 (30%):</span>
                    <span className="font-semibold">{result.dailyDistribution.afternoon} mg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium">晚上 (40%):</span>
                    <span className="font-semibold">{result.dailyDistribution.evening} mg</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>提示:</strong> 晚上服用镁有助于放松肌肉和改善睡眠质量。
                  </AlertDescription>
                </Alert>
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
                  <h4 className="font-semibold mb-2 text-orange-700">坚果类 (含量丰富)</h4>
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
                  <h4 className="font-semibold mb-2 text-green-700">种子类</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.seeds.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-700">全谷物</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.grains.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">绿叶蔬菜</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.vegetables.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-red-700">豆类</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.legumes.map((food: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">其他</h4>
                  <ul className="text-sm space-y-1">
                    {result.foodSources.others.map((food: string, i: number) => (
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
                        form.absorption === "高" ? "bg-green-100 text-green-800" :
                        form.absorption === "中高" ? "bg-blue-100 text-blue-800" :
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
                    <strong>推荐:</strong> 甘氨酸镁是最佳选择，吸收率高且不刺激肠胃。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 镁知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 镁知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">镁的重要作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• 参与300多种酶反应</li>
                  <li>• 肌肉收缩和放松</li>
                  <li>• 神经传导和情绪调节</li>
                  <li>• 能量代谢 (ATP合成)</li>
                  <li>• 蛋白质合成</li>
                  <li>• 血糖控制</li>
                  <li>• 血压调节</li>
                  <li>• 骨骼健康</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">缺镁高危人群</h3>
                <ul className="text-sm space-y-1">
                  <li>• 糖尿病患者</li>
                  <li>• 高血压患者</li>
                  <li>• 运动员</li>
                  <li>• 慢性压力人群</li>
                  <li>• 老年人</li>
                  <li>• 酗酒者</li>
                  <li>• 胃肠道疾病患者</li>
                  <li>• 长期服用利尿剂者</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">检测方法</h3>
                <ul className="text-sm space-y-1">
                  <li>• 血清镁 (不够准确)</li>
                  <li>• 红细胞镁 (更准确)</li>
                  <li>• 24小时尿镁</li>
                  <li>• 镁负荷试验</li>
                  <li>• 离子化镁</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">补充注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 从小剂量开始 (100mg)</li>
                  <li>• 分次服用，避免腹泻</li>
                  <li>• 餐后服用减少胃肠刺激</li>
                  <li>• 避免与钙同时大量服用</li>
                  <li>• 肾功能不全者慎用</li>
                  <li>• 监测血镁水平</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}