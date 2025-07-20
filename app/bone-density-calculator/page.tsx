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

export default function BoneDensityCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [menopauseAge, setMenopauseAge] = useState("");
  const [familyHistory, setFamilyHistory] = useState(false);
  const [smoking, setSmoking] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [exercise, setExercise] = useState("");
  const [calcium, setCalcium] = useState("");
  const [vitaminD, setVitaminD] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [previousFractures, setPreviousFractures] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateBoneDensity = () => {
    if (!age || !gender || !height || !weight) {
      alert("请填写基本信息");
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const menopauseAgeNum = menopauseAge ? parseInt(menopauseAge) : null;

    if (ageNum <= 0 || ageNum > 120 || heightNum <= 0 || weightNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // 计算BMI
    const bmi = weightNum / Math.pow(heightNum / 100, 2);

    // 基础骨密度评分（基于年龄和性别）
    let baseScore = 100; // 年轻成人峰值骨密度为100%

    // 年龄因子
    if (ageNum >= 30) {
      const ageDecline = (ageNum - 30) * (gender === "female" ? 0.8 : 0.5); // 女性骨密度下降更快
      baseScore -= ageDecline;
    }

    // 性别和绝经因子
    if (gender === "female") {
      if (menopauseAgeNum && ageNum >= menopauseAgeNum) {
        const postMenopauseYears = ageNum - menopauseAgeNum;
        // 绝经后前5年骨密度快速下降
        const rapidLoss = Math.min(5, postMenopauseYears) * 2;
        const slowLoss = Math.max(0, postMenopauseYears - 5) * 0.5;
        baseScore -= (rapidLoss + slowLoss);
      }
    }

    // BMI因子
    let bmiAdjustment = 0;
    if (bmi < 18.5) {
      bmiAdjustment = -10; // 体重过轻增加骨质疏松风险
    } else if (bmi > 30) {
      bmiAdjustment = 5; // 适度超重对骨密度有保护作用
    }
    baseScore += bmiAdjustment;

    // 种族因子
    let ethnicityAdjustment = 0;
    switch (ethnicity) {
      case "african":
        ethnicityAdjustment = 10; // 非洲裔骨密度通常较高
        break;
      case "asian":
        ethnicityAdjustment = -5; // 亚洲人骨密度相对较低
        break;
      case "hispanic":
        ethnicityAdjustment = 2;
        break;
      case "caucasian":
      default:
        ethnicityAdjustment = 0;
        break;
    }
    baseScore += ethnicityAdjustment;

    // 生活方式因子
    let lifestyleAdjustment = 0;

    // 吸烟
    switch (smoking) {
      case "current":
        lifestyleAdjustment -= 8;
        break;
      case "former":
        lifestyleAdjustment -= 3;
        break;
      case "never":
      default:
        break;
    }

    // 饮酒
    switch (alcohol) {
      case "heavy":
        lifestyleAdjustment -= 6;
        break;
      case "moderate":
        lifestyleAdjustment += 2; // 适量饮酒可能有益
        break;
      case "light":
        lifestyleAdjustment += 1;
        break;
      case "none":
      default:
        break;
    }

    // 运动
    switch (exercise) {
      case "high":
        lifestyleAdjustment += 8;
        break;
      case "moderate":
        lifestyleAdjustment += 5;
        break;
      case "light":
        lifestyleAdjustment += 2;
        break;
      case "sedentary":
        lifestyleAdjustment -= 3;
        break;
      default:
        break;
    }

    baseScore += lifestyleAdjustment;

    // 营养因子
    let nutritionAdjustment = 0;

    // 钙摄入
    switch (calcium) {
      case "high":
        nutritionAdjustment += 3;
        break;
      case "adequate":
        nutritionAdjustment += 1;
        break;
      case "low":
        nutritionAdjustment -= 4;
        break;
      case "very-low":
        nutritionAdjustment -= 8;
        break;
      default:
        break;
    }

    // 维生素D
    switch (vitaminD) {
      case "high":
        nutritionAdjustment += 3;
        break;
      case "adequate":
        nutritionAdjustment += 1;
        break;
      case "low":
        nutritionAdjustment -= 4;
        break;
      case "deficient":
        nutritionAdjustment -= 8;
        break;
      default:
        break;
    }

    baseScore += nutritionAdjustment;

    // 药物因子
    let medicationAdjustment = 0;
    medications.forEach(med => {
      switch (med) {
        case "corticosteroids":
          medicationAdjustment -= 10;
          break;
        case "anticonvulsants":
          medicationAdjustment -= 5;
          break;
        case "ppi":
          medicationAdjustment -= 3;
          break;
        case "bisphosphonates":
          medicationAdjustment += 8;
          break;
        case "hormone-therapy":
          medicationAdjustment += 5;
          break;
        case "calcium-supplements":
          medicationAdjustment += 2;
          break;
        default:
          break;
      }
    });
    baseScore += medicationAdjustment;

    // 疾病因子
    let diseaseAdjustment = 0;
    medicalConditions.forEach(condition => {
      switch (condition) {
        case "rheumatoid-arthritis":
          diseaseAdjustment -= 8;
          break;
        case "hyperthyroidism":
          diseaseAdjustment -= 6;
          break;
        case "diabetes-t1":
          diseaseAdjustment -= 5;
          break;
        case "celiac":
          diseaseAdjustment -= 4;
          break;
        case "kidney-disease":
          diseaseAdjustment -= 6;
          break;
        case "liver-disease":
          diseaseAdjustment -= 4;
          break;
        default:
          break;
      }
    });
    baseScore += diseaseAdjustment;

    // 骨折史
    if (previousFractures) {
      baseScore -= 8;
    }

    // 家族史
    if (familyHistory) {
      baseScore -= 5;
    }

    // 确保分数在合理范围内
    const finalScore = Math.max(30, Math.min(120, baseScore));

    // 转换为T-score（标准差）
    // T-score = (患者骨密度 - 年轻成人峰值骨密度) / 年轻成人标准差
    const tScore = (finalScore - 100) / 12.5; // 假设标准差为12.5%

    // 根据T-score分类
    let category = "";
    let categoryColor = "";
    let riskLevel = "";
    let recommendations = [];

    if (tScore >= -1.0) {
      category = "正常";
      categoryColor = "green";
      riskLevel = "低风险";
      recommendations = [
        "保持健康的生活方式",
        "继续规律运动",
        "维持充足的钙和维生素D摄入"
      ];
    } else if (tScore >= -2.5) {
      category = "骨量减少";
      categoryColor = "orange";
      riskLevel = "中等风险";
      recommendations = [
        "增加负重运动",
        "优化钙和维生素D摄入",
        "定期监测骨密度",
        "考虑生活方式干预"
      ];
    } else {
      category = "骨质疏松";
      categoryColor = "red";
      riskLevel = "高风险";
      recommendations = [
        "立即就医咨询",
        "考虑药物治疗",
        "防跌倒措施",
        "专业营养指导",
        "定期骨密度监测"
      ];
    }

    // 10年骨折风险评估（简化版FRAX）
    let fracture10YearRisk = 0;
    
    // 基础风险（基于年龄和性别）
    if (gender === "female") {
      if (ageNum >= 50) fracture10YearRisk = (ageNum - 50) * 0.5;
    } else {
      if (ageNum >= 60) fracture10YearRisk = (ageNum - 60) * 0.3;
    }
    
    // T-score调整
    if (tScore < -2.5) {
      fracture10YearRisk += 15;
    } else if (tScore < -1.0) {
      fracture10YearRisk += 5;
    }
    
    // 其他风险因子
    if (familyHistory) fracture10YearRisk += 3;
    if (previousFractures) fracture10YearRisk += 8;
    if (smoking === "current") fracture10YearRisk += 4;
    if (bmi < 18.5) fracture10YearRisk += 5;
    
    fracture10YearRisk = Math.min(50, Math.max(0, fracture10YearRisk));

    // 生活方式建议
    const getLifestyleRecommendations = () => {
      const recommendations = {
        exercise: [],
        nutrition: [],
        lifestyle: [],
        monitoring: []
      };

      // 运动建议
      if (tScore >= -1.0) {
        recommendations.exercise = [
          "负重运动：步行、慢跑、爬楼梯",
          "阻力训练：举重、弹力带训练",
          "平衡训练：太极、瑜伽",
          "每周至少150分钟中等强度运动"
        ];
      } else {
        recommendations.exercise = [
          "低冲击负重运动",
          "渐进式阻力训练",
          "平衡和协调训练",
          "避免高冲击运动",
          "在专业指导下进行"
        ];
      }

      // 营养建议
      recommendations.nutrition = [
        "钙：成人每日1000-1200mg",
        "维生素D：每日800-1000IU",
        "蛋白质：每公斤体重1.0-1.2g",
        "限制咖啡因和钠摄入",
        "戒烟限酒"
      ];

      // 生活方式
      recommendations.lifestyle = [
        "保持健康体重",
        "充足睡眠",
        "适度日晒",
        "防跌倒措施",
        "定期体检"
      ];

      // 监测建议
      if (tScore >= -1.0) {
        recommendations.monitoring = [
          "每2-3年检查一次骨密度",
          "定期评估风险因子"
        ];
      } else if (tScore >= -2.5) {
        recommendations.monitoring = [
          "每1-2年检查一次骨密度",
          "监测生化指标",
          "评估治疗效果"
        ];
      } else {
        recommendations.monitoring = [
          "每年检查骨密度",
          "定期监测骨代谢指标",
          "评估药物治疗效果",
          "监测不良反应"
        ];
      }

      return recommendations;
    };

    const lifestyleRec = getLifestyleRecommendations();

    // 营养补充建议
    const getSupplementRecommendations = () => {
      const supplements = [];
      
      if (calcium === "low" || calcium === "very-low") {
        supplements.push({
          name: "钙补充剂",
          dosage: "500-600mg，分次服用",
          timing: "餐后服用，避免与铁剂同服",
          type: "碳酸钙或柠檬酸钙"
        });
      }
      
      if (vitaminD === "low" || vitaminD === "deficient") {
        supplements.push({
          name: "维生素D3",
          dosage: "1000-2000IU/天",
          timing: "随餐服用",
          type: "胆钙化醇（D3）优于麦角钙化醇（D2）"
        });
      }
      
      if (tScore < -2.5) {
        supplements.push({
          name: "镁补充剂",
          dosage: "200-400mg/天",
          timing: "睡前服用",
          type: "有助于钙吸收和骨骼健康"
        });
        
        supplements.push({
          name: "维生素K2",
          dosage: "100-200μg/天",
          timing: "随脂肪餐服用",
          type: "促进骨钙素活化"
        });
      }
      
      return supplements;
    };

    const supplementRec = getSupplementRecommendations();

    // 风险因子分析
    const getRiskFactorAnalysis = () => {
      const riskFactors = {
        modifiable: [],
        nonModifiable: []
      };
      
      // 可改变的风险因子
      if (smoking === "current") riskFactors.modifiable.push("吸烟");
      if (alcohol === "heavy") riskFactors.modifiable.push("过量饮酒");
      if (exercise === "sedentary") riskFactors.modifiable.push("缺乏运动");
      if (bmi < 18.5) riskFactors.modifiable.push("体重过轻");
      if (calcium === "low" || calcium === "very-low") riskFactors.modifiable.push("钙摄入不足");
      if (vitaminD === "low" || vitaminD === "deficient") riskFactors.modifiable.push("维生素D不足");
      
      // 不可改变的风险因子
      if (ageNum >= 65) riskFactors.nonModifiable.push("高龄");
      if (gender === "female") riskFactors.nonModifiable.push("女性");
      if (familyHistory) riskFactors.nonModifiable.push("家族史");
      if (previousFractures) riskFactors.nonModifiable.push("既往骨折史");
      if (ethnicity === "asian" || ethnicity === "caucasian") riskFactors.nonModifiable.push("种族因素");
      
      return riskFactors;
    };

    const riskFactorAnalysis = getRiskFactorAnalysis();

    setResult({
      boneDensity: {
        score: Math.round(finalScore * 10) / 10,
        tScore: Math.round(tScore * 100) / 100,
        category,
        categoryColor,
        riskLevel
      },
      fracture10YearRisk: Math.round(fracture10YearRisk * 10) / 10,
      recommendations,
      lifestyle: lifestyleRec,
      supplements: supplementRec,
      riskFactors: riskFactorAnalysis,
      bmi: Math.round(bmi * 10) / 10,
      assessmentFactors: {
        age: ageNum,
        gender,
        bmi,
        lifestyle: {
          smoking,
          alcohol,
          exercise
        },
        nutrition: {
          calcium,
          vitaminD
        },
        medical: {
          medications: medications.length,
          conditions: medicalConditions.length,
          familyHistory,
          previousFractures
        }
      }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setEthnicity("");
    setMenopauseAge("");
    setFamilyHistory(false);
    setSmoking("");
    setAlcohol("");
    setExercise("");
    setCalcium("");
    setVitaminD("");
    setMedications([]);
    setMedicalConditions([]);
    setPreviousFractures(false);
    setResult(null);
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    if (checked) {
      setMedications(prev => [...prev, medication]);
    } else {
      setMedications(prev => prev.filter(med => med !== medication));
    }
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setMedicalConditions(prev => [...prev, condition]);
    } else {
      setMedicalConditions(prev => prev.filter(cond => cond !== condition));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🦴 骨密度风险评估</h1>
          <p className="text-lg text-gray-600">
            评估您的骨质疏松风险，制定个性化的骨骼健康管理方案
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
                      placeholder="例如：55"
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
                      placeholder="例如：165"
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
                      placeholder="例如：60"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ethnicity">种族</Label>
                    <Select value={ethnicity} onValueChange={setEthnicity}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择种族" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asian">亚洲人</SelectItem>
                        <SelectItem value="caucasian">白种人</SelectItem>
                        <SelectItem value="african">非洲裔</SelectItem>
                        <SelectItem value="hispanic">西班牙裔</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {gender === "female" && (
                    <div>
                      <Label htmlFor="menopauseAge">绝经年龄</Label>
                      <Input
                        id="menopauseAge"
                        type="number"
                        placeholder="例如：50（如未绝经可留空）"
                        value={menopauseAge}
                        onChange={(e) => setMenopauseAge(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="familyHistory"
                      checked={familyHistory}
                      onCheckedChange={setFamilyHistory}
                    />
                    <Label htmlFor="familyHistory">家族有骨质疏松或骨折史</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="previousFractures"
                      checked={previousFractures}
                      onCheckedChange={setPreviousFractures}
                    />
                    <Label htmlFor="previousFractures">既往有骨折史</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 生活方式 */}
            <Card>
              <CardHeader>
                <CardTitle>生活方式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smoking">吸烟状况</Label>
                  <Select value={smoking} onValueChange={setSmoking}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择吸烟状况" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">从不吸烟</SelectItem>
                      <SelectItem value="former">已戒烟</SelectItem>
                      <SelectItem value="current">目前吸烟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="alcohol">饮酒情况</Label>
                  <Select value={alcohol} onValueChange={setAlcohol}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择饮酒情况" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">不饮酒</SelectItem>
                      <SelectItem value="light">偶尔饮酒（每周1-2次）</SelectItem>
                      <SelectItem value="moderate">适量饮酒（每周3-7次）</SelectItem>
                      <SelectItem value="heavy">大量饮酒（每天多次）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exercise">运动水平</Label>
                  <Select value={exercise} onValueChange={setExercise}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择运动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">久坐少动</SelectItem>
                      <SelectItem value="light">轻度运动（每周1-2次）</SelectItem>
                      <SelectItem value="moderate">中度运动（每周3-4次）</SelectItem>
                      <SelectItem value="high">高强度运动（每周5次以上）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 营养状况 */}
            <Card>
              <CardHeader>
                <CardTitle>营养状况</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="calcium">钙摄入水平</Label>
                  <Select value={calcium} onValueChange={setCalcium}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择钙摄入水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-low">很少（<400mg/天）</SelectItem>
                      <SelectItem value="low">不足（400-800mg/天）</SelectItem>
                      <SelectItem value="adequate">充足（800-1200mg/天）</SelectItem>
                      <SelectItem value="high">丰富（>1200mg/天）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vitaminD">维生素D状况</Label>
                  <Select value={vitaminD} onValueChange={setVitaminD}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择维生素D状况" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deficient">缺乏（<20ng/ml）</SelectItem>
                      <SelectItem value="low">不足（20-30ng/ml）</SelectItem>
                      <SelectItem value="adequate">充足（30-50ng/ml）</SelectItem>
                      <SelectItem value="high">丰富（>50ng/ml）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 药物使用 */}
            <Card>
              <CardHeader>
                <CardTitle>药物使用</CardTitle>
                <p className="text-sm text-gray-600">选择您正在使用的药物</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "corticosteroids", label: "糖皮质激素" },
                    { id: "anticonvulsants", label: "抗癫痫药" },
                    { id: "ppi", label: "质子泵抑制剂" },
                    { id: "bisphosphonates", label: "双膦酸盐" },
                    { id: "hormone-therapy", label: "激素替代治疗" },
                    { id: "calcium-supplements", label: "钙补充剂" }
                  ].map((med) => (
                    <div key={med.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={med.id}
                        checked={medications.includes(med.id)}
                        onCheckedChange={(checked) => handleMedicationChange(med.id, checked as boolean)}
                      />
                      <Label htmlFor={med.id}>{med.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 疾病史 */}
            <Card>
              <CardHeader>
                <CardTitle>相关疾病史</CardTitle>
                <p className="text-sm text-gray-600">选择您患有的疾病</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "rheumatoid-arthritis", label: "类风湿关节炎" },
                    { id: "hyperthyroidism", label: "甲状腺功能亢进" },
                    { id: "diabetes-t1", label: "1型糖尿病" },
                    { id: "celiac", label: "乳糜泻" },
                    { id: "kidney-disease", label: "肾脏疾病" },
                    { id: "liver-disease", label: "肝脏疾病" }
                  ].map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition.id}
                        checked={medicalConditions.includes(condition.id)}
                        onCheckedChange={(checked) => handleConditionChange(condition.id, checked as boolean)}
                      />
                      <Label htmlFor={condition.id}>{condition.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateBoneDensity} className="flex-1">
                评估骨密度风险
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
                    <CardTitle>骨密度风险评估</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border text-center ${
                      result.boneDensity.categoryColor === "green" ? "bg-green-50 border-green-200" :
                      result.boneDensity.categoryColor === "orange" ? "bg-orange-50 border-orange-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        result.boneDensity.categoryColor === "green" ? "text-green-700" :
                        result.boneDensity.categoryColor === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        {result.boneDensity.category}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        T-score: {result.boneDensity.tScore} | 风险等级: {result.boneDensity.riskLevel}
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, (result.boneDensity.score / 100) * 100))} 
                        className="mb-3"
                      />
                      <div className="space-y-1">
                        {result.recommendations.map((rec: string, i: number) => (
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
                        <div className="text-sm font-medium">骨密度评分</div>
                        <div className="text-lg">{result.boneDensity.score}%</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded text-center">
                        <div className="text-sm font-medium">10年骨折风险</div>
                        <div className="text-lg">{result.fracture10YearRisk}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 详细分析 */}
                <Tabs defaultValue="lifestyle" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="lifestyle">生活方式</TabsTrigger>
                    <TabsTrigger value="supplements">营养补充</TabsTrigger>
                    <TabsTrigger value="risks">风险因子</TabsTrigger>
                    <TabsTrigger value="monitoring">监测建议</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lifestyle">
                    <Card>
                      <CardHeader>
                        <CardTitle>生活方式建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">运动建议</h4>
                          <ul className="text-sm space-y-1">
                            {result.lifestyle.exercise.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">营养建议</h4>
                          <ul className="text-sm space-y-1">
                            {result.lifestyle.nutrition.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-orange-700 mb-2">生活习惯</h4>
                          <ul className="text-sm space-y-1">
                            {result.lifestyle.lifestyle.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="supplements">
                    <Card>
                      <CardHeader>
                        <CardTitle>营养补充建议</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {result.supplements.length > 0 ? (
                          <div className="space-y-4">
                            {result.supplements.map((supplement: any, i: number) => (
                              <div key={i} className="p-3 bg-gray-50 rounded">
                                <h4 className="font-medium text-blue-700 mb-2">{supplement.name}</h4>
                                <div className="text-sm space-y-1">
                                  <div><strong>剂量：</strong>{supplement.dosage}</div>
                                  <div><strong>服用时间：</strong>{supplement.timing}</div>
                                  <div><strong>说明：</strong>{supplement.type}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            根据您的情况，暂无特殊补充剂建议
                          </div>
                        )}
                        
                        <Alert className="mt-4">
                          <AlertDescription>
                            补充剂建议仅供参考，请在医生指导下使用。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risks">
                    <Card>
                      <CardHeader>
                        <CardTitle>风险因子分析</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-red-700 mb-2">可改变的风险因子</h4>
                          {result.riskFactors.modifiable.length > 0 ? (
                            <ul className="text-sm space-y-1">
                              {result.riskFactors.modifiable.map((factor: string, i: number) => (
                                <li key={i} className="text-red-600">• {factor}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-600">暂无可改变的高风险因子</p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">不可改变的风险因子</h4>
                          {result.riskFactors.nonModifiable.length > 0 ? (
                            <ul className="text-sm space-y-1">
                              {result.riskFactors.nonModifiable.map((factor: string, i: number) => (
                                <li key={i} className="text-gray-600">• {factor}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-600">暂无不可改变的高风险因子</p>
                          )}
                        </div>
                        
                        <Alert>
                          <AlertDescription>
                            重点关注可改变的风险因子，通过生活方式调整降低骨质疏松风险。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="monitoring">
                    <Card>
                      <CardHeader>
                        <CardTitle>监测和随访建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">监测频率</h4>
                          <ul className="text-sm space-y-1">
                            {result.lifestyle.monitoring.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">推荐检查项目</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 双能X线吸收测定法（DEXA）</li>
                            <li>• 血清25-羟维生素D</li>
                            <li>• 血清钙、磷</li>
                            <li>• 甲状旁腺激素（PTH）</li>
                            <li>• 骨代谢标志物</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-orange-700 mb-2">就医指征</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 身高明显下降（>3cm）</li>
                            <li>• 轻微外伤后骨折</li>
                            <li>• 持续性腰背疼痛</li>
                            <li>• 驼背加重</li>
                            <li>• 骨密度T-score < -2.5</li>
                          </ul>
                        </div>
                        
                        <Alert>
                          <AlertDescription>
                            定期监测有助于早期发现骨密度变化，及时调整治疗方案。
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

        {/* 骨密度知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🦴 骨密度知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">什么是骨密度</h3>
                <ul className="text-sm space-y-1">
                  <li>• 骨密度是骨骼强度的重要指标</li>
                  <li>• 反映单位体积内骨矿物质含量</li>
                  <li>• 通常在30岁左右达到峰值</li>
                  <li>• 随年龄增长逐渐下降</li>
                  <li>• 女性绝经后下降更快</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">T-score解读</h3>
                <ul className="text-sm space-y-1">
                  <li>• T-score ≥ -1.0：正常</li>
                  <li>• -2.5 < T-score < -1.0：骨量减少</li>
                  <li>• T-score ≤ -2.5：骨质疏松</li>
                  <li>• 每降低1个标准差，骨折风险增加1.5-3倍</li>
                  <li>• 需结合临床因素综合评估</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">骨质疏松的危害</h3>
                <ul className="text-sm space-y-1">
                  <li>• 增加骨折风险</li>
                  <li>• 脊柱压缩性骨折导致驼背</li>
                  <li>• 髋部骨折可能致残</li>
                  <li>• 影响生活质量</li>
                  <li>• 增加医疗费用负担</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">预防措施</h3>
                <ul className="text-sm space-y-1">
                  <li>• 充足的钙和维生素D摄入</li>
                  <li>• 规律的负重运动</li>
                  <li>• 戒烟限酒</li>
                  <li>• 防跌倒措施</li>
                  <li>• 定期骨密度检查</li>
                  <li>• 必要时药物治疗</li>
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
                <h3 className="font-semibold mb-2">评估原理</h3>
                <ul className="text-sm space-y-1">
                  <li>• 基于多种风险因子综合评估</li>
                  <li>• 参考WHO骨质疏松诊断标准</li>
                  <li>• 结合FRAX风险评估工具</li>
                  <li>• 考虑年龄、性别、生活方式等因素</li>
                  <li>• 提供个性化建议</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 评估结果仅供参考</li>
                  <li>• 不能替代专业医学诊断</li>
                  <li>• 建议定期进行DEXA检查</li>
                  <li>• 有症状应及时就医</li>
                  <li>• 治疗方案需医生制定</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}