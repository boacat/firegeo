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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function HemoglobinCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [hematocrit, setHematocrit] = useState("");
  const [rbc, setRbc] = useState("");
  const [mcv, setMcv] = useState("");
  const [mch, setMch] = useState("");
  const [mchc, setMchc] = useState("");
  const [rdw, setRdw] = useState("");
  const [reticulocytes, setReticulocytes] = useState("");
  const [ferritin, setFerritin] = useState("");
  const [ironSaturation, setIronSaturation] = useState("");
  const [b12, setB12] = useState("");
  const [folate, setFolate] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [dietaryHabits, setDietaryHabits] = useState<string[]>([]);
  const [menstrualStatus, setMenstrualStatus] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateHemoglobin = () => {
    if (!age || !gender || !hemoglobin) {
      alert("请填写必要信息（年龄、性别、血红蛋白值）");
      return;
    }

    const ageNum = parseInt(age);
    const hemoglobinNum = parseFloat(hemoglobin);
    const hematocritNum = hematocrit ? parseFloat(hematocrit) : null;
    const rbcNum = rbc ? parseFloat(rbc) : null;
    const mcvNum = mcv ? parseFloat(mcv) : null;
    const mchNum = mch ? parseFloat(mch) : null;
    const mchcNum = mchc ? parseFloat(mchc) : null;
    const rdwNum = rdw ? parseFloat(rdw) : null;
    const reticulocytesNum = reticulocytes ? parseFloat(reticulocytes) : null;
    const ferritinNum = ferritin ? parseFloat(ferritin) : null;
    const ironSaturationNum = ironSaturation ? parseFloat(ironSaturation) : null;
    const b12Num = b12 ? parseFloat(b12) : null;
    const folateNum = folate ? parseFloat(folate) : null;
    const weightNum = weight ? parseFloat(weight) : null;
    const heightNum = height ? parseFloat(height) : null;

    if (ageNum <= 0 || ageNum > 120 || hemoglobinNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // 血红蛋白正常值范围（g/dL）
    const getNormalRange = () => {
      if (gender === "male") {
        if (ageNum < 18) {
          if (ageNum < 2) return { min: 10.5, max: 13.5 };
          if (ageNum < 6) return { min: 11.5, max: 13.5 };
          if (ageNum < 12) return { min: 11.5, max: 15.5 };
          return { min: 12.0, max: 16.0 }; // 12-18岁
        }
        return { min: 13.8, max: 17.2 }; // 成年男性
      } else {
        if (ageNum < 18) {
          if (ageNum < 2) return { min: 10.5, max: 13.5 };
          if (ageNum < 6) return { min: 11.5, max: 13.5 };
          if (ageNum < 12) return { min: 11.5, max: 15.5 };
          return { min: 12.0, max: 16.0 }; // 12-18岁
        }
        
        // 成年女性特殊情况
        if (pregnancyStatus === "pregnant") {
          return { min: 11.0, max: 14.0 }; // 孕期
        }
        if (pregnancyStatus === "postpartum") {
          return { min: 10.0, max: 14.0 }; // 产后
        }
        
        return { min: 12.1, max: 15.1 }; // 成年女性
      }
    };

    const normalRange = getNormalRange();

    // 血红蛋白状态评估
    const assessHemoglobinStatus = () => {
      if (hemoglobinNum < normalRange.min * 0.7) {
        return {
          status: "重度贫血",
          severity: "severe",
          color: "red",
          description: `血红蛋白 ${hemoglobinNum} g/dL，严重低于正常值`,
          urgency: "紧急",
          recommendation: "立即就医，需要紧急处理"
        };
      } else if (hemoglobinNum < normalRange.min * 0.85) {
        return {
          status: "中度贫血",
          severity: "moderate",
          color: "orange",
          description: `血红蛋白 ${hemoglobinNum} g/dL，中度偏低`,
          urgency: "较急",
          recommendation: "尽快就医，需要治疗"
        };
      } else if (hemoglobinNum < normalRange.min) {
        return {
          status: "轻度贫血",
          severity: "mild",
          color: "yellow",
          description: `血红蛋白 ${hemoglobinNum} g/dL，轻度偏低`,
          urgency: "一般",
          recommendation: "建议就医检查原因"
        };
      } else if (hemoglobinNum <= normalRange.max) {
        return {
          status: "正常",
          severity: "normal",
          color: "green",
          description: `血红蛋白 ${hemoglobinNum} g/dL，在正常范围内`,
          urgency: "无",
          recommendation: "保持健康生活方式"
        };
      } else if (hemoglobinNum <= normalRange.max * 1.15) {
        return {
          status: "轻度偏高",
          severity: "mild-high",
          color: "blue",
          description: `血红蛋白 ${hemoglobinNum} g/dL，轻度偏高`,
          urgency: "注意",
          recommendation: "建议进一步检查"
        };
      } else {
        return {
          status: "明显偏高",
          severity: "high",
          color: "purple",
          description: `血红蛋白 ${hemoglobinNum} g/dL，明显偏高`,
          urgency: "较急",
          recommendation: "需要医学评估"
        };
      }
    };

    const hemoglobinStatus = assessHemoglobinStatus();

    // 贫血类型分析
    const analyzeAnemiaType = () => {
      if (hemoglobinStatus.severity === "normal" || hemoglobinStatus.severity.includes("high")) {
        return null;
      }

      const types = [];

      // 基于MCV的分类
      if (mcvNum) {
        if (mcvNum < 80) {
          types.push({
            type: "小细胞性贫血",
            description: "MCV < 80 fL",
            possibleCauses: ["缺铁性贫血", "地中海贫血", "慢性病贫血"],
            color: "red"
          });
        } else if (mcvNum > 100) {
          types.push({
            type: "大细胞性贫血",
            description: "MCV > 100 fL",
            possibleCauses: ["维生素B12缺乏", "叶酸缺乏", "甲状腺功能减退"],
            color: "blue"
          });
        } else {
          types.push({
            type: "正细胞性贫血",
            description: "MCV 80-100 fL",
            possibleCauses: ["急性失血", "慢性病贫血", "肾性贫血"],
            color: "orange"
          });
        }
      }

      // 基于铁代谢的分析
      if (ferritinNum && ironSaturationNum) {
        if (ferritinNum < 15 || ironSaturationNum < 16) {
          types.push({
            type: "缺铁性贫血",
            description: "铁储存不足",
            possibleCauses: ["饮食缺铁", "失血", "吸收不良"],
            color: "red"
          });
        } else if (ferritinNum > 200) {
          types.push({
            type: "慢性病贫血",
            description: "铁储存充足但利用障碍",
            possibleCauses: ["慢性炎症", "感染", "肿瘤"],
            color: "purple"
          });
        }
      }

      // 基于维生素的分析
      if (b12Num && b12Num < 200) {
        types.push({
          type: "维生素B12缺乏性贫血",
          description: "B12水平偏低",
          possibleCauses: ["饮食缺乏", "吸收不良", "胃酸缺乏"],
          color: "green"
        });
      }

      if (folateNum && folateNum < 3) {
        types.push({
          type: "叶酸缺乏性贫血",
          description: "叶酸水平偏低",
          possibleCauses: ["饮食缺乏", "妊娠需求增加", "酒精影响"],
          color: "yellow"
        });
      }

      return types.length > 0 ? types : [{
        type: "待进一步检查",
        description: "需要更多检查确定类型",
        possibleCauses: ["建议完善相关检查"],
        color: "gray"
      }];
    };

    const anemiaTypes = analyzeAnemiaType();

    // 症状分析
    const analyzeSymptoms = () => {
      const anemiaSymptoms = [
        "fatigue", "weakness", "pale-skin", "shortness-of-breath",
        "dizziness", "cold-hands-feet", "brittle-nails", "headache",
        "irregular-heartbeat", "restless-legs", "strange-cravings"
      ];
      
      const presentSymptoms = symptoms.filter(s => anemiaSymptoms.includes(s));
      
      return {
        count: presentSymptoms.length,
        severity: presentSymptoms.length >= 6 ? "重度" : 
                 presentSymptoms.length >= 3 ? "中度" : "轻度",
        symptoms: presentSymptoms,
        score: presentSymptoms.length * 10
      };
    };

    const symptomAnalysis = analyzeSymptoms();

    // 风险因子评估
    const assessRiskFactors = () => {
      let riskScore = 0;
      const activeFactors = [];

      const riskMap = {
        "heavy-menstruation": { score: 15, description: "月经过多" },
        "pregnancy": { score: 10, description: "妊娠期" },
        "vegetarian-diet": { score: 8, description: "素食饮食" },
        "gi-bleeding": { score: 20, description: "消化道出血" },
        "chronic-kidney-disease": { score: 15, description: "慢性肾病" },
        "inflammatory-disease": { score: 12, description: "炎症性疾病" },
        "cancer": { score: 18, description: "恶性肿瘤" },
        "frequent-blood-donation": { score: 8, description: "频繁献血" },
        "malabsorption": { score: 12, description: "吸收不良" },
        "elderly": { score: 5, description: "高龄" }
      };

      riskFactors.forEach(factor => {
        if (riskMap[factor as keyof typeof riskMap]) {
          const risk = riskMap[factor as keyof typeof riskMap];
          riskScore += risk.score;
          activeFactors.push(risk.description);
        }
      });

      // 月经状态评估
      if (gender === "female" && menstrualStatus === "heavy") {
        riskScore += 15;
        activeFactors.push("月经量大");
      }

      return {
        score: riskScore,
        level: riskScore >= 30 ? "高风险" : riskScore >= 15 ? "中风险" : "低风险",
        factors: activeFactors
      };
    };

    const riskAssessment = assessRiskFactors();

    // 药物影响分析
    const analyzeMedicationEffects = () => {
      const effects = [];

      const medicationMap = {
        "aspirin": "可能增加出血风险",
        "nsaids": "可能导致胃肠道出血",
        "anticoagulants": "增加出血风险",
        "ppi": "可能影响铁和B12吸收",
        "metformin": "可能影响B12吸收",
        "chemotherapy": "可能抑制骨髓造血",
        "ace-inhibitors": "可能轻微降低血红蛋白"
      };

      medications.forEach(med => {
        if (medicationMap[med as keyof typeof medicationMap]) {
          effects.push({
            medication: med,
            effect: medicationMap[med as keyof typeof medicationMap]
          });
        }
      });

      return effects;
    };

    const medicationEffects = analyzeMedicationEffects();

    // 饮食评估
    const assessDietaryFactors = () => {
      const factors = [];

      if (dietaryHabits.includes("vegetarian")) {
        factors.push({
          factor: "素食饮食",
          impact: "可能缺乏血红素铁和维生素B12",
          recommendation: "注意补充铁剂和B12"
        });
      }

      if (dietaryHabits.includes("low-iron-foods")) {
        factors.push({
          factor: "铁含量低的饮食",
          impact: "铁摄入不足",
          recommendation: "增加富含铁的食物"
        });
      }

      if (dietaryHabits.includes("tea-coffee-with-meals")) {
        factors.push({
          factor: "餐时饮茶咖啡",
          impact: "影响铁吸收",
          recommendation: "餐后1-2小时再饮用"
        });
      }

      if (dietaryHabits.includes("calcium-supplements")) {
        factors.push({
          factor: "钙补充剂",
          impact: "可能影响铁吸收",
          recommendation: "与铁剂分开服用"
        });
      }

      return factors;
    };

    const dietaryFactors = assessDietaryFactors();

    // 治疗建议
    const getTreatmentRecommendations = () => {
      const recommendations = {
        immediate: [],
        dietary: [],
        lifestyle: [],
        monitoring: [],
        medical: []
      };

      // 紧急处理
      if (hemoglobinStatus.severity === "severe") {
        recommendations.immediate.push("立即就医，可能需要输血");
        recommendations.immediate.push("避免剧烈活动");
        recommendations.immediate.push("监测生命体征");
      } else if (hemoglobinStatus.severity === "moderate") {
        recommendations.immediate.push("尽快就医评估");
        recommendations.immediate.push("限制剧烈运动");
      }

      // 饮食建议
      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("缺铁"))) {
        recommendations.dietary.push("增加富含血红素铁的食物（红肉、肝脏）");
        recommendations.dietary.push("搭配维生素C促进铁吸收");
        recommendations.dietary.push("避免餐时饮茶咖啡");
      }

      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("B12"))) {
        recommendations.dietary.push("增加富含B12的食物（肉类、鱼类、蛋类）");
        recommendations.dietary.push("考虑B12补充剂");
      }

      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("叶酸"))) {
        recommendations.dietary.push("增加绿叶蔬菜摄入");
        recommendations.dietary.push("考虑叶酸补充剂");
      }

      // 生活方式
      recommendations.lifestyle.push("保证充足睡眠");
      recommendations.lifestyle.push("适度运动，避免过度疲劳");
      recommendations.lifestyle.push("戒烟限酒");
      recommendations.lifestyle.push("管理压力");

      if (gender === "female" && menstrualStatus === "heavy") {
        recommendations.lifestyle.push("评估月经过多原因");
      }

      // 监测建议
      recommendations.monitoring.push("定期复查血常规");
      recommendations.monitoring.push("监测铁代谢指标");
      
      if (hemoglobinStatus.severity !== "normal") {
        recommendations.monitoring.push("2-4周后复查");
      } else {
        recommendations.monitoring.push("年度体检监测");
      }

      // 医学处理
      if (hemoglobinStatus.severity === "severe" || hemoglobinStatus.severity === "moderate") {
        recommendations.medical.push("血液科专科会诊");
        recommendations.medical.push("查找贫血原因");
        recommendations.medical.push("考虑铁剂治疗");
      }

      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("慢性病"))) {
        recommendations.medical.push("治疗原发疾病");
      }

      return recommendations;
    };

    const treatmentRecommendations = getTreatmentRecommendations();

    // 营养补充建议
    const getNutritionalSupplements = () => {
      const supplements = [];

      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("缺铁"))) {
        supplements.push({
          supplement: "铁剂",
          dosage: "元素铁 60-120mg/天",
          timing: "空腹服用，配维生素C",
          duration: "3-6个月",
          notes: "可能有胃肠道副作用"
        });
      }

      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("B12"))) {
        supplements.push({
          supplement: "维生素B12",
          dosage: "1000-2000μg/天",
          timing: "随餐服用",
          duration: "持续补充",
          notes: "严重缺乏可能需要注射"
        });
      }

      if (anemiaTypes && anemiaTypes.some(type => type.type.includes("叶酸"))) {
        supplements.push({
          supplement: "叶酸",
          dosage: "5-10mg/天",
          timing: "随餐服用",
          duration: "2-3个月",
          notes: "孕期需求增加"
        });
      }

      return supplements;
    };

    const nutritionalSupplements = getNutritionalSupplements();

    // 食物推荐
    const getFoodRecommendations = () => {
      return {
        ironRich: [
          { name: "牛肉", content: "2.6mg/100g", type: "血红素铁" },
          { name: "猪肝", content: "18mg/100g", type: "血红素铁" },
          { name: "菠菜", content: "2.7mg/100g", type: "非血红素铁" },
          { name: "豆腐", content: "5.4mg/100g", type: "非血红素铁" },
          { name: "黑芝麻", content: "14.8mg/100g", type: "非血红素铁" }
        ],
        b12Rich: [
          { name: "牛肝", content: "60μg/100g", absorption: "高" },
          { name: "沙丁鱼", content: "8.9μg/100g", absorption: "高" },
          { name: "鸡蛋", content: "1.1μg/100g", absorption: "中" },
          { name: "牛奶", content: "0.4μg/100ml", absorption: "中" }
        ],
        folateRich: [
          { name: "菠菜", content: "194μg/100g", bioavailability: "高" },
          { name: "芦笋", content: "149μg/100g", bioavailability: "高" },
          { name: "豆类", content: "180μg/100g", bioavailability: "中" },
          { name: "橙子", content: "40μg/100g", bioavailability: "高" }
        ],
        enhancers: [
          { name: "维生素C", effect: "促进铁吸收", sources: "柑橘、草莓、西红柿" },
          { name: "肉类蛋白", effect: "促进非血红素铁吸收", sources: "瘦肉、鱼类" }
        ],
        inhibitors: [
          { name: "茶和咖啡", effect: "抑制铁吸收", advice: "餐后1-2小时饮用" },
          { name: "钙", effect: "竞争性抑制铁吸收", advice: "分开服用" },
          { name: "全谷物", effect: "植酸抑制铁吸收", advice: "适量摄入" }
        ]
      };
    };

    const foodRecommendations = getFoodRecommendations();

    // BMI计算
    const calculateBMI = () => {
      if (!weightNum || !heightNum) return null;
      
      const bmi = weightNum / Math.pow(heightNum / 100, 2);
      let category = "";
      
      if (bmi < 18.5) category = "体重过轻";
      else if (bmi < 24) category = "正常体重";
      else if (bmi < 28) category = "超重";
      else category = "肥胖";
      
      return {
        value: Math.round(bmi * 10) / 10,
        category
      };
    };

    const bmiResult = calculateBMI();

    setResult({
      basicInfo: {
        age: ageNum,
        gender,
        hemoglobin: hemoglobinNum,
        normalRange,
        bmi: bmiResult
      },
      status: hemoglobinStatus,
      anemiaTypes,
      symptoms: symptomAnalysis,
      riskFactors: riskAssessment,
      medicationEffects,
      dietaryFactors,
      treatmentRecommendations,
      nutritionalSupplements,
      foodRecommendations,
      labValues: {
        hemoglobin: hemoglobinNum,
        hematocrit: hematocritNum,
        rbc: rbcNum,
        mcv: mcvNum,
        mch: mchNum,
        mchc: mchcNum,
        rdw: rdwNum,
        reticulocytes: reticulocytesNum,
        ferritin: ferritinNum,
        ironSaturation: ironSaturationNum,
        b12: b12Num,
        folate: folateNum
      }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setHemoglobin("");
    setHematocrit("");
    setRbc("");
    setMcv("");
    setMch("");
    setMchc("");
    setRdw("");
    setReticulocytes("");
    setFerritin("");
    setIronSaturation("");
    setB12("");
    setFolate("");
    setSymptoms([]);
    setRiskFactors([]);
    setMedications([]);
    setDietaryHabits([]);
    setMenstrualStatus("");
    setPregnancyStatus("");
    setResult(null);
  };

  const handleArrayChange = (item: string, checked: boolean, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (checked) {
      setter(prev => [...prev, item]);
    } else {
      setter(prev => prev.filter(i => i !== item));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🩸 血红蛋白分析计算器</h1>
          <p className="text-lg text-gray-600">
            专业的血红蛋白水平评估和贫血风险分析
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
                    <Label htmlFor="weight">体重 (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="例如：70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">身高 (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="例如：170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                {gender === "female" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="menstrualStatus">月经状态</Label>
                      <Select value={menstrualStatus} onValueChange={setMenstrualStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">正常</SelectItem>
                          <SelectItem value="heavy">月经过多</SelectItem>
                          <SelectItem value="irregular">不规律</SelectItem>
                          <SelectItem value="amenorrhea">闭经</SelectItem>
                          <SelectItem value="menopause">绝经</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pregnancyStatus">妊娠状态</Label>
                      <Select value={pregnancyStatus} onValueChange={setPregnancyStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-pregnant">未怀孕</SelectItem>
                          <SelectItem value="pregnant">怀孕中</SelectItem>
                          <SelectItem value="postpartum">产后</SelectItem>
                          <SelectItem value="breastfeeding">哺乳期</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 血液检查结果 */}
            <Card>
              <CardHeader>
                <CardTitle>血液检查结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hemoglobin">血红蛋白 (g/dL) *</Label>
                    <Input
                      id="hemoglobin"
                      type="number"
                      step="0.1"
                      placeholder="例如：12.5"
                      value={hemoglobin}
                      onChange={(e) => setHemoglobin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hematocrit">红细胞压积 (%)</Label>
                    <Input
                      id="hematocrit"
                      type="number"
                      step="0.1"
                      placeholder="例如：37.5"
                      value={hematocrit}
                      onChange={(e) => setHematocrit(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rbc">红细胞计数 (×10¹²/L)</Label>
                    <Input
                      id="rbc"
                      type="number"
                      step="0.01"
                      placeholder="例如：4.5"
                      value={rbc}
                      onChange={(e) => setRbc(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mcv">平均红细胞体积 (fL)</Label>
                    <Input
                      id="mcv"
                      type="number"
                      step="0.1"
                      placeholder="例如：85"
                      value={mcv}
                      onChange={(e) => setMcv(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mch">平均红细胞血红蛋白 (pg)</Label>
                    <Input
                      id="mch"
                      type="number"
                      step="0.1"
                      placeholder="例如：29"
                      value={mch}
                      onChange={(e) => setMch(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mchc">平均红细胞血红蛋白浓度 (g/dL)</Label>
                    <Input
                      id="mchc"
                      type="number"
                      step="0.1"
                      placeholder="例如：34"
                      value={mchc}
                      onChange={(e) => setMchc(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rdw">红细胞分布宽度 (%)</Label>
                    <Input
                      id="rdw"
                      type="number"
                      step="0.1"
                      placeholder="例如：13.5"
                      value={rdw}
                      onChange={(e) => setRdw(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reticulocytes">网织红细胞 (%)</Label>
                    <Input
                      id="reticulocytes"
                      type="number"
                      step="0.1"
                      placeholder="例如：1.2"
                      value={reticulocytes}
                      onChange={(e) => setReticulocytes(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 铁代谢和维生素 */}
            <Card>
              <CardHeader>
                <CardTitle>铁代谢和维生素检查</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ferritin">血清铁蛋白 (ng/mL)</Label>
                    <Input
                      id="ferritin"
                      type="number"
                      step="0.1"
                      placeholder="例如：50"
                      value={ferritin}
                      onChange={(e) => setFerritin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ironSaturation">转铁蛋白饱和度 (%)</Label>
                    <Input
                      id="ironSaturation"
                      type="number"
                      step="0.1"
                      placeholder="例如：25"
                      value={ironSaturation}
                      onChange={(e) => setIronSaturation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="b12">维生素B12 (pg/mL)</Label>
                    <Input
                      id="b12"
                      type="number"
                      step="1"
                      placeholder="例如：300"
                      value={b12}
                      onChange={(e) => setB12(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="folate">叶酸 (ng/mL)</Label>
                    <Input
                      id="folate"
                      type="number"
                      step="0.1"
                      placeholder="例如：8"
                      value={folate}
                      onChange={(e) => setFolate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle>相关症状</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "fatigue", label: "疲劳乏力" },
                    { id: "weakness", label: "虚弱无力" },
                    { id: "pale-skin", label: "皮肤苍白" },
                    { id: "shortness-of-breath", label: "气短" },
                    { id: "dizziness", label: "头晕" },
                    { id: "cold-hands-feet", label: "手脚冰凉" },
                    { id: "brittle-nails", label: "指甲脆弱" },
                    { id: "headache", label: "头痛" },
                    { id: "irregular-heartbeat", label: "心律不齐" },
                    { id: "restless-legs", label: "不宁腿综合征" },
                    { id: "strange-cravings", label: "异食癖（如吃冰块）" },
                    { id: "hair-loss", label: "脱发" }
                  ].map((symptom) => (
                    <div key={symptom.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom.id}
                        checked={symptoms.includes(symptom.id)}
                        onCheckedChange={(checked) => handleArrayChange(symptom.id, checked as boolean, setSymptoms)}
                      />
                      <Label htmlFor={symptom.id}>{symptom.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 风险因子 */}
            <Card>
              <CardHeader>
                <CardTitle>风险因子</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "heavy-menstruation", label: "月经过多" },
                    { id: "pregnancy", label: "妊娠期" },
                    { id: "vegetarian-diet", label: "素食饮食" },
                    { id: "gi-bleeding", label: "消化道出血" },
                    { id: "chronic-kidney-disease", label: "慢性肾病" },
                    { id: "inflammatory-disease", label: "炎症性疾病" },
                    { id: "cancer", label: "恶性肿瘤" },
                    { id: "frequent-blood-donation", label: "频繁献血" },
                    { id: "malabsorption", label: "吸收不良" },
                    { id: "elderly", label: "高龄（>65岁）" }
                  ].map((factor) => (
                    <div key={factor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={factor.id}
                        checked={riskFactors.includes(factor.id)}
                        onCheckedChange={(checked) => handleArrayChange(factor.id, checked as boolean, setRiskFactors)}
                      />
                      <Label htmlFor={factor.id}>{factor.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 药物使用 */}
            <Card>
              <CardHeader>
                <CardTitle>相关药物使用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "aspirin", label: "阿司匹林" },
                    { id: "nsaids", label: "非甾体抗炎药" },
                    { id: "anticoagulants", label: "抗凝药物" },
                    { id: "ppi", label: "质子泵抑制剂" },
                    { id: "metformin", label: "二甲双胍" },
                    { id: "chemotherapy", label: "化疗药物" },
                    { id: "ace-inhibitors", label: "ACE抑制剂" }
                  ].map((medication) => (
                    <div key={medication.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={medication.id}
                        checked={medications.includes(medication.id)}
                        onCheckedChange={(checked) => handleArrayChange(medication.id, checked as boolean, setMedications)}
                      />
                      <Label htmlFor={medication.id}>{medication.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 饮食习惯 */}
            <Card>
              <CardHeader>
                <CardTitle>饮食习惯</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "vegetarian", label: "素食主义者" },
                    { id: "low-iron-foods", label: "很少吃富含铁的食物" },
                    { id: "tea-coffee-with-meals", label: "餐时饮茶或咖啡" },
                    { id: "calcium-supplements", label: "服用钙补充剂" },
                    { id: "dairy-heavy", label: "大量摄入乳制品" },
                    { id: "processed-foods", label: "主要吃加工食品" }
                  ].map((habit) => (
                    <div key={habit.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={habit.id}
                        checked={dietaryHabits.includes(habit.id)}
                        onCheckedChange={(checked) => handleArrayChange(habit.id, checked as boolean, setDietaryHabits)}
                      />
                      <Label htmlFor={habit.id}>{habit.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateHemoglobin} className="flex-1">
                分析血红蛋白水平
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
                    <CardTitle>血红蛋白分析结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                      <div className="text-sm">
                        <span className="font-medium">正常范围:</span> {result.basicInfo.normalRange.min}-{result.basicInfo.normalRange.max} g/dL
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">当前值:</span> {result.basicInfo.hemoglobin} g/dL
                      </div>
                      {result.basicInfo.bmi && (
                        <div className="text-sm col-span-2">
                          <span className="font-medium">BMI:</span> {result.basicInfo.bmi.value} ({result.basicInfo.bmi.category})
                        </div>
                      )}
                    </div>

                    {/* 血红蛋白状态 */}
                    <div className={`p-4 rounded-lg border text-center ${
                      result.status.color === "green" ? "bg-green-50 border-green-200" :
                      result.status.color === "blue" ? "bg-blue-50 border-blue-200" :
                      result.status.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                      result.status.color === "orange" ? "bg-orange-50 border-orange-200" :
                      result.status.color === "red" ? "bg-red-50 border-red-200" :
                      result.status.color === "purple" ? "bg-purple-50 border-purple-200" :
                      "bg-gray-50 border-gray-200"
                    }`}>
                      <div className={`text-3xl font-bold mb-2 ${
                        result.status.color === "green" ? "text-green-700" :
                        result.status.color === "blue" ? "text-blue-700" :
                        result.status.color === "yellow" ? "text-yellow-700" :
                        result.status.color === "orange" ? "text-orange-700" :
                        result.status.color === "red" ? "text-red-700" :
                        result.status.color === "purple" ? "text-purple-700" :
                        "text-gray-700"
                      }`}>
                        {result.basicInfo.hemoglobin} g/dL
                      </div>
                      <div className="text-xl font-semibold mb-2">
                        {result.status.status}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {result.status.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        紧急程度: {result.status.urgency}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.status.recommendation}
                      </div>
                    </div>

                    {/* 贫血类型分析 */}
                    {result.anemiaTypes && result.anemiaTypes.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">可能的贫血类型</h4>
                        {result.anemiaTypes.map((type: any, i: number) => (
                          <div key={i} className={`p-3 border rounded ${
                            type.color === "red" ? "bg-red-50 border-red-200" :
                            type.color === "blue" ? "bg-blue-50 border-blue-200" :
                            type.color === "orange" ? "bg-orange-50 border-orange-200" :
                            type.color === "green" ? "bg-green-50 border-green-200" :
                            type.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                            type.color === "purple" ? "bg-purple-50 border-purple-200" :
                            "bg-gray-50 border-gray-200"
                          }`}>
                            <div className="font-medium mb-1">{type.type}</div>
                            <div className="text-sm text-gray-600 mb-2">{type.description}</div>
                            <div className="text-xs text-gray-500">
                              可能原因: {type.possibleCauses.join("、")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 症状和风险评估 */}
                    <div className="grid grid-cols-2 gap-4">
                      {result.symptoms.count > 0 && (
                        <div className={`p-3 border rounded text-center ${
                          result.symptoms.severity === "重度" ? "bg-red-50 border-red-200" :
                          result.symptoms.severity === "中度" ? "bg-orange-50 border-orange-200" :
                          "bg-yellow-50 border-yellow-200"
                        }`}>
                          <div className="font-medium">症状评估</div>
                          <div className="text-2xl font-bold">{result.symptoms.count}</div>
                          <div className="text-sm">{result.symptoms.severity}症状</div>
                        </div>
                      )}
                      
                      <div className={`p-3 border rounded text-center ${
                        result.riskFactors.level === "高风险" ? "bg-red-50 border-red-200" :
                        result.riskFactors.level === "中风险" ? "bg-orange-50 border-orange-200" :
                        "bg-green-50 border-green-200"
                      }`}>
                        <div className="font-medium">风险评估</div>
                        <div className="text-2xl font-bold">{result.riskFactors.score}</div>
                        <div className="text-sm">{result.riskFactors.level}</div>
                      </div>
                    </div>

                    {/* 药物影响 */}
                    {result.medicationEffects.length > 0 && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="font-medium mb-2">药物影响分析</div>
                        <div className="space-y-1">
                          {result.medicationEffects.map((effect: any, i: number) => (
                            <div key={i} className="text-sm text-yellow-700">
                              • {effect.effect}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 详细建议 */}
                <Tabs defaultValue="treatment" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="treatment">治疗建议</TabsTrigger>
                    <TabsTrigger value="nutrition">营养补充</TabsTrigger>
                    <TabsTrigger value="food">食物推荐</TabsTrigger>
                    <TabsTrigger value="monitoring">监测管理</TabsTrigger>
                  </TabsList>

                  <TabsContent value="treatment">
                    <Card>
                      <CardHeader>
                        <CardTitle>治疗建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.treatmentRecommendations.immediate.length > 0 && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <h4 className="font-medium text-red-800 mb-2">紧急处理</h4>
                            <ul className="text-sm space-y-1">
                              {result.treatmentRecommendations.immediate.map((rec: string, i: number) => (
                                <li key={i} className="text-red-700">• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.treatmentRecommendations.medical.length > 0 && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                            <h4 className="font-medium text-blue-800 mb-2">医学处理</h4>
                            <ul className="text-sm space-y-1">
                              {result.treatmentRecommendations.medical.map((rec: string, i: number) => (
                                <li key={i} className="text-blue-700">• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                          <h4 className="font-medium text-green-800 mb-2">生活方式</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatmentRecommendations.lifestyle.map((rec: string, i: number) => (
                              <li key={i} className="text-green-700">• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="nutrition">
                    <Card>
                      <CardHeader>
                        <CardTitle>营养补充建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.nutritionalSupplements.length > 0 ? (
                          <div className="space-y-4">
                            {result.nutritionalSupplements.map((supplement: any, i: number) => (
                              <div key={i} className="p-4 bg-purple-50 border border-purple-200 rounded">
                                <h4 className="font-medium text-purple-800 mb-3">{supplement.supplement}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="text-sm">
                                    <span className="font-medium">推荐剂量:</span> {supplement.dosage}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">服用时间:</span> {supplement.timing}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">补充周期:</span> {supplement.duration}
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium">注意事项:</span> {supplement.notes}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            根据当前血红蛋白水平，暂无特殊营养补充建议
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="food">
                    <Card>
                      <CardHeader>
                        <CardTitle>食物推荐</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* 富含铁的食物 */}
                        <div>
                          <h4 className="font-medium mb-3 text-red-700">富含铁的食物</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {result.foodRecommendations.ironRich.map((food: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-red-50 rounded">
                                <span className="font-medium">{food.name}</span>
                                <div className="text-sm text-gray-600">
                                  <span className="mr-2">{food.content}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    food.type === "血红素铁" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                  }`}>
                                    {food.type}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 富含维生素B12的食物 */}
                        <div>
                          <h4 className="font-medium mb-3 text-blue-700">富含维生素B12的食物</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {result.foodRecommendations.b12Rich.map((food: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                <span className="font-medium">{food.name}</span>
                                <div className="text-sm text-gray-600">
                                  <span className="mr-2">{food.content}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    food.absorption === "高" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                  }`}>
                                    {food.absorption}吸收
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 富含叶酸的食物 */}
                        <div>
                          <h4 className="font-medium mb-3 text-green-700">富含叶酸的食物</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {result.foodRecommendations.folateRich.map((food: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span className="font-medium">{food.name}</span>
                                <div className="text-sm text-gray-600">
                                  <span className="mr-2">{food.content}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    food.bioavailability === "高" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                  }`}>
                                    {food.bioavailability}利用
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 促进和抑制因子 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-3 text-green-700">促进吸收</h4>
                            <div className="space-y-2">
                              {result.foodRecommendations.enhancers.map((enhancer: any, i: number) => (
                                <div key={i} className="p-2 bg-green-50 rounded">
                                  <div className="font-medium text-sm">{enhancer.name}</div>
                                  <div className="text-xs text-gray-600">{enhancer.effect}</div>
                                  <div className="text-xs text-green-600">{enhancer.sources}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3 text-red-700">抑制吸收</h4>
                            <div className="space-y-2">
                              {result.foodRecommendations.inhibitors.map((inhibitor: any, i: number) => (
                                <div key={i} className="p-2 bg-red-50 rounded">
                                  <div className="font-medium text-sm">{inhibitor.name}</div>
                                  <div className="text-xs text-gray-600">{inhibitor.effect}</div>
                                  <div className="text-xs text-red-600">{inhibitor.advice}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="monitoring">
                    <Card>
                      <CardHeader>
                        <CardTitle>监测管理</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-medium text-blue-800 mb-2">监测建议</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatmentRecommendations.monitoring.map((rec: string, i: number) => (
                              <li key={i} className="text-blue-700">• {rec}</li>
                            ))}
                          </ul>
                        </div>

                        {/* 检查指标详情 */}
                        <div className="space-y-3">
                          <h4 className="font-medium">当前检查指标</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(result.labValues).map(([key, value]) => {
                              if (value === null || value === undefined) return null;
                              
                              const labels: { [key: string]: string } = {
                                hemoglobin: "血红蛋白",
                                hematocrit: "红细胞压积",
                                rbc: "红细胞计数",
                                mcv: "平均红细胞体积",
                                mch: "平均红细胞血红蛋白",
                                mchc: "平均红细胞血红蛋白浓度",
                                rdw: "红细胞分布宽度",
                                reticulocytes: "网织红细胞",
                                ferritin: "血清铁蛋白",
                                ironSaturation: "转铁蛋白饱和度",
                                b12: "维生素B12",
                                folate: "叶酸"
                              };
                              
                              return (
                                <div key={key} className="p-2 bg-gray-50 rounded">
                                  <div className="text-sm font-medium">{labels[key]}</div>
                                  <div className="text-lg">{value}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 风险因子详情 */}
                        {result.riskFactors.factors.length > 0 && (
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                            <h4 className="font-medium text-orange-800 mb-2">当前风险因子</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.riskFactors.factors.map((factor: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 饮食因子详情 */}
                        {result.dietaryFactors.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium">饮食影响因子</h4>
                            {result.dietaryFactors.map((factor: any, i: number) => (
                              <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <div className="font-medium text-yellow-800">{factor.factor}</div>
                                <div className="text-sm text-yellow-700 mt-1">{factor.impact}</div>
                                <div className="text-sm text-yellow-600 mt-1">建议: {factor.recommendation}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {/* 血红蛋白知识科普 */}
            <Card>
              <CardHeader>
                <CardTitle>🧬 血红蛋白健康知识</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="basics" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basics">基础知识</TabsTrigger>
                    <TabsTrigger value="anemia-types">贫血类型</TabsTrigger>
                    <TabsTrigger value="lab-tests">检查指标</TabsTrigger>
                    <TabsTrigger value="prevention">预防措施</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basics">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">什么是血红蛋白？</h4>
                        <p className="text-sm text-gray-600">
                          血红蛋白是红细胞中的一种蛋白质，负责携带氧气从肺部运输到全身各个组织，并将二氧化碳从组织运回肺部。血红蛋白含有铁元素，这使得血液呈现红色。
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">血红蛋白的作用</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 氧气运输：将氧气从肺部运送到全身组织</li>
                          <li>• 二氧化碳运输：将代谢产生的二氧化碳运回肺部</li>
                          <li>• 维持血液pH平衡：作为缓冲系统的一部分</li>
                          <li>• 维持血液粘稠度：影响血液流动性</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">正常值范围</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="font-medium text-blue-800">成年男性</div>
                            <div className="text-sm text-blue-600">13.8-17.2 g/dL</div>
                          </div>
                          <div className="p-3 bg-pink-50 rounded">
                            <div className="font-medium text-pink-800">成年女性</div>
                            <div className="text-sm text-pink-600">12.1-15.1 g/dL</div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded">
                            <div className="font-medium text-purple-800">孕妇</div>
                            <div className="text-sm text-purple-600">11.0-14.0 g/dL</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded">
                            <div className="font-medium text-green-800">儿童</div>
                            <div className="text-sm text-green-600">根据年龄变化</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="anemia-types">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded">
                          <h4 className="font-medium text-red-800 mb-2">缺铁性贫血</h4>
                          <p className="text-sm text-red-700 mb-2">最常见的贫血类型，由铁缺乏导致</p>
                          <div className="text-xs text-red-600">
                            <div>• 特征：小细胞低色素性贫血</div>
                            <div>• 原因：饮食缺铁、失血、吸收不良</div>
                            <div>• 治疗：铁剂补充、改善饮食</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-medium text-blue-800 mb-2">巨幼细胞性贫血</h4>
                          <p className="text-sm text-blue-700 mb-2">由维生素B12或叶酸缺乏引起</p>
                          <div className="text-xs text-blue-600">
                            <div>• 特征：大细胞性贫血</div>
                            <div>• 原因：B12/叶酸缺乏、吸收障碍</div>
                            <div>• 治疗：补充相应维生素</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                          <h4 className="font-medium text-orange-800 mb-2">慢性病贫血</h4>
                          <p className="text-sm text-orange-700 mb-2">继发于慢性疾病的贫血</p>
                          <div className="text-xs text-orange-600">
                            <div>• 特征：正细胞性或小细胞性</div>
                            <div>• 原因：慢性炎症、感染、肿瘤</div>
                            <div>• 治疗：治疗原发疾病</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                          <h4 className="font-medium text-purple-800 mb-2">溶血性贫血</h4>
                          <p className="text-sm text-purple-700 mb-2">红细胞破坏过多导致</p>
                          <div className="text-xs text-purple-600">
                            <div>• 特征：网织红细胞增高</div>
                            <div>• 原因：遗传性、获得性因素</div>
                            <div>• 治疗：根据病因治疗</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="lab-tests">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">血红蛋白 (Hb)</h4>
                          <p className="text-sm text-gray-600">反映血液携氧能力的主要指标</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">红细胞压积 (Hct)</h4>
                          <p className="text-sm text-gray-600">红细胞在血液中所占的体积百分比</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">平均红细胞体积 (MCV)</h4>
                          <p className="text-sm text-gray-600">帮助分类贫血类型：<80fL小细胞，>100fL大细胞</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">血清铁蛋白</h4>
                          <p className="text-sm text-gray-600">反映体内铁储存状况的最佳指标</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">转铁蛋白饱和度</h4>
                          <p className="text-sm text-gray-600">反映铁的利用情况，<16%提示缺铁</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">维生素B12和叶酸</h4>
                          <p className="text-sm text-gray-600">诊断巨幼细胞性贫血的关键指标</p>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded">
                          <h4 className="font-medium mb-1">网织红细胞</h4>
                          <p className="text-sm text-gray-600">反映骨髓造血功能，增高提示溶血或失血</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prevention">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded">
                        <h4 className="font-medium text-green-800 mb-3">饮食预防</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 多吃富含铁的食物：红肉、肝脏、菠菜、豆类</li>
                          <li>• 补充维生素C：促进铁吸收</li>
                          <li>• 适量摄入B12：肉类、鱼类、蛋类、乳制品</li>
                          <li>• 增加叶酸摄入：绿叶蔬菜、豆类、坚果</li>
                          <li>• 避免餐时饮茶咖啡：影响铁吸收</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <h4 className="font-medium text-blue-800 mb-3">生活方式</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 规律作息：保证充足睡眠</li>
                          <li>• 适度运动：促进血液循环</li>
                          <li>• 戒烟限酒：减少对造血的影响</li>
                          <li>• 管理压力：避免慢性应激</li>
                          <li>• 定期体检：早期发现问题</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h4 className="font-medium text-yellow-800 mb-3">特殊人群注意</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• 孕妇：增加铁和叶酸摄入</li>
                          <li>• 素食者：注意B12和铁的补充</li>
                          <li>• 月经过多女性：定期检查血红蛋白</li>
                          <li>• 老年人：关注慢性病影响</li>
                          <li>• 运动员：注意运动性贫血</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 重要提醒 */}
            <Alert>
              <AlertDescription>
                <strong>重要提醒：</strong>
                本计算器仅供参考，不能替代专业医学诊断。如果血红蛋白异常或出现相关症状，请及时就医。贫血的诊断和治疗需要综合考虑多项检查结果和临床表现。
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}