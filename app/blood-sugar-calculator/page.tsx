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

export default function BloodSugarCalculatorPage() {
  const [fastingGlucose, setFastingGlucose] = useState("");
  const [postprandialGlucose, setPostprandialGlucose] = useState("");
  const [randomGlucose, setRandomGlucose] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [testType, setTestType] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  // 血糖参考范围 (mg/dL)
  const glucoseRanges = {
    fasting: {
      normal: [70, 100],
      prediabetes: [100, 126],
      diabetes: [126, 999]
    },
    postprandial: {
      normal: [70, 140],
      prediabetes: [140, 200],
      diabetes: [200, 999]
    },
    random: {
      normal: [70, 140],
      concern: [140, 200],
      diabetes: [200, 999]
    },
    hba1c: {
      normal: [4.0, 5.7],
      prediabetes: [5.7, 6.5],
      diabetes: [6.5, 15.0]
    }
  };

  // 症状列表
  const symptomsList = {
    "frequent-urination": { name: "多尿", severity: "高", description: "尿量增多，夜尿频繁" },
    "excessive-thirst": { name: "多饮", severity: "高", description: "口渴难耐，饮水量增加" },
    "increased-appetite": { name: "多食", severity: "中", description: "食欲亢进，容易饥饿" },
    "weight-loss": { name: "体重下降", severity: "高", description: "不明原因体重减轻" },
    "fatigue": { name: "乏力", severity: "中", description: "疲劳感，精神不振" },
    "blurred-vision": { name: "视力模糊", severity: "中", description: "视物不清，视力下降" },
    "slow-healing": { name: "伤口愈合慢", severity: "中", description: "外伤愈合延迟" },
    "frequent-infections": { name: "反复感染", severity: "中", description: "皮肤、泌尿系统感染" },
    "numbness": { name: "手脚麻木", severity: "中", description: "四肢末梢神经症状" },
    "dry-mouth": { name: "口干", severity: "低", description: "口腔干燥，唾液减少" },
    "skin-itching": { name: "皮肤瘙痒", severity: "低", description: "全身或局部瘙痒" },
    "mood-changes": { name: "情绪变化", severity: "低", description: "易怒、焦虑、抑郁" }
  };

  // 风险因子
  const riskFactorsList = {
    "family-history": { name: "糖尿病家族史", impact: "高", description: "直系亲属患糖尿病" },
    "obesity": { name: "肥胖", impact: "高", description: "BMI≥28或腹型肥胖" },
    "hypertension": { name: "高血压", impact: "中", description: "血压≥140/90mmHg" },
    "dyslipidemia": { name: "血脂异常", impact: "中", description: "胆固醇或甘油三酯异常" },
    "sedentary": { name: "缺乏运动", impact: "中", description: "久坐少动的生活方式" },
    "gestational-diabetes": { name: "妊娠糖尿病史", impact: "高", description: "曾患妊娠期糖尿病" },
    "pcos": { name: "多囊卵巢综合征", impact: "中", description: "内分泌代谢异常" },
    "stress": { name: "慢性压力", impact: "中", description: "长期精神压力大" },
    "sleep-disorders": { name: "睡眠障碍", impact: "中", description: "睡眠不足或质量差" },
    "smoking": { name: "吸烟", impact: "中", description: "增加胰岛素抵抗" },
    "age-risk": { name: "年龄≥45岁", impact: "中", description: "年龄相关风险增加" },
    "ethnicity": { name: "高危种族", impact: "中", description: "亚洲人群糖尿病易感" }
  };

  // 药物影响
  const medicationsList = {
    "steroids": { name: "糖皮质激素", effect: "升高", description: "长期使用可致血糖升高" },
    "diuretics": { name: "利尿剂", effect: "升高", description: "某些利尿剂影响糖代谢" },
    "beta-blockers": { name: "β受体阻滞剂", effect: "影响", description: "可能掩盖低血糖症状" },
    "antipsychotics": { name: "抗精神病药", effect: "升高", description: "部分药物增加糖尿病风险" },
    "immunosuppressants": { name: "免疫抑制剂", effect: "升高", description: "如他克莫司等" },
    "niacin": { name: "烟酸", effect: "升高", description: "大剂量烟酸影响血糖" },
    "phenytoin": { name: "苯妥英钠", effect: "升高", description: "抗癫痫药物" },
    "thiazides": { name: "噻嗪类药物", effect: "升高", description: "影响胰岛素敏感性" }
  };

  const classifyGlucose = (value: number, type: string) => {
    const ranges = glucoseRanges[type as keyof typeof glucoseRanges];
    
    if (type === "hba1c") {
      if (value < ranges.normal[1]) return { level: "正常", color: "green", risk: "低" };
      if (value < ranges.prediabetes[1]) return { level: "糖尿病前期", color: "yellow", risk: "中" };
      return { level: "糖尿病", color: "red", risk: "高" };
    } else {
      if (value >= ranges.normal[0] && value < ranges.normal[1]) {
        return { level: "正常", color: "green", risk: "低" };
      }
      if (type === "random") {
        if (value < ranges.concern[1]) return { level: "需关注", color: "yellow", risk: "中" };
        return { level: "疑似糖尿病", color: "red", risk: "高" };
      } else {
        if (value < ranges.prediabetes[1]) return { level: "糖尿病前期", color: "yellow", risk: "中" };
        return { level: "糖尿病", color: "red", risk: "高" };
      }
    }
  };

  const calculateRisk = () => {
    if (!fastingGlucose && !postprandialGlucose && !randomGlucose && !hba1c) {
      alert("请至少填写一项血糖指标");
      return;
    }

    if (!age || !gender) {
      alert("请填写年龄和性别");
      return;
    }

    const fg = parseFloat(fastingGlucose) || 0;
    const ppg = parseFloat(postprandialGlucose) || 0;
    const rg = parseFloat(randomGlucose) || 0;
    const hba1cValue = parseFloat(hba1c) || 0;
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight) || 0;
    const heightNum = parseFloat(height) || 0;
    
    if (ageNum <= 0 || ageNum > 120) {
      alert("请输入有效的年龄");
      return;
    }

    // 计算BMI
    let bmi = 0;
    if (weightNum > 0 && heightNum > 0) {
      bmi = Math.round((weightNum / Math.pow(heightNum / 100, 2)) * 10) / 10;
    }
    
    // 血糖分类
    const classifications = {
      fasting: fg > 0 ? classifyGlucose(fg, "fasting") : null,
      postprandial: ppg > 0 ? classifyGlucose(ppg, "postprandial") : null,
      random: rg > 0 ? classifyGlucose(rg, "random") : null,
      hba1c: hba1cValue > 0 ? classifyGlucose(hba1cValue, "hba1c") : null
    };
    
    // 估算平均血糖 (从HbA1c)
    let estimatedAvgGlucose = 0;
    if (hba1cValue > 0) {
      estimatedAvgGlucose = Math.round((28.7 * hba1cValue - 46.7) * 10) / 10;
    }
    
    // 风险评分计算
    let riskScore = 0;
    
    // 血糖水平风险
    if (classifications.fasting) {
      if (classifications.fasting.level === "糖尿病") riskScore += 5;
      else if (classifications.fasting.level === "糖尿病前期") riskScore += 3;
    }
    
    if (classifications.postprandial) {
      if (classifications.postprandial.level === "糖尿病") riskScore += 5;
      else if (classifications.postprandial.level === "糖尿病前期") riskScore += 3;
    }
    
    if (classifications.random) {
      if (classifications.random.level === "疑似糖尿病") riskScore += 4;
      else if (classifications.random.level === "需关注") riskScore += 2;
    }
    
    if (classifications.hba1c) {
      if (classifications.hba1c.level === "糖尿病") riskScore += 5;
      else if (classifications.hba1c.level === "糖尿病前期") riskScore += 3;
    }
    
    // 症状评分
    let symptomScore = 0;
    symptoms.forEach(symptom => {
      const symptomInfo = symptomsList[symptom as keyof typeof symptomsList];
      if (symptomInfo) {
        if (symptomInfo.severity === "高") symptomScore += 3;
        else if (symptomInfo.severity === "中") symptomScore += 2;
        else symptomScore += 1;
      }
    });
    
    // 风险因子评分
    let riskFactorScore = 0;
    riskFactors.forEach(factor => {
      const factorInfo = riskFactorsList[factor as keyof typeof riskFactorsList];
      if (factorInfo) {
        if (factorInfo.impact === "高") riskFactorScore += 3;
        else if (factorInfo.impact === "中") riskFactorScore += 2;
      }
    });
    
    // 年龄风险
    if (ageNum >= 65) riskScore += 2;
    else if (ageNum >= 45) riskScore += 1;
    
    // BMI风险
    if (bmi >= 28) riskScore += 3;
    else if (bmi >= 24) riskScore += 2;
    else if (bmi >= 23) riskScore += 1; // 亚洲人群标准
    
    // 药物影响评分
    let medicationScore = 0;
    medications.forEach(med => {
      const medInfo = medicationsList[med as keyof typeof medicationsList];
      if (medInfo && medInfo.effect === "升高") {
        medicationScore += 1;
      }
    });
    
    // 最终风险评分
    const totalRiskScore = riskScore + symptomScore + riskFactorScore + medicationScore;
    
    // 诊断建议
    let diagnosis = "正常";
    let diagnosisColor = "green";
    let urgency = "低";
    
    // 根据血糖值确定诊断
    const hasHighGlucose = (
      (fg > 0 && fg >= 126) ||
      (ppg > 0 && ppg >= 200) ||
      (rg > 0 && rg >= 200) ||
      (hba1cValue > 0 && hba1cValue >= 6.5)
    );
    
    const hasPrediabetes = (
      (fg > 0 && fg >= 100 && fg < 126) ||
      (ppg > 0 && ppg >= 140 && ppg < 200) ||
      (hba1cValue > 0 && hba1cValue >= 5.7 && hba1cValue < 6.5)
    );
    
    if (hasHighGlucose) {
      diagnosis = "疑似糖尿病";
      diagnosisColor = "red";
      urgency = "高";
    } else if (hasPrediabetes) {
      diagnosis = "糖尿病前期";
      diagnosisColor = "orange";
      urgency = "中";
    } else if (totalRiskScore >= 10) {
      diagnosis = "高风险";
      diagnosisColor = "orange";
      urgency = "中";
    } else if (totalRiskScore >= 6) {
      diagnosis = "中等风险";
      diagnosisColor = "yellow";
      urgency = "中";
    }
    
    // 建议检查
    const recommendedTests = [];
    if (!fg && !ppg && !hba1cValue) {
      recommendedTests.push("空腹血糖检测");
    }
    if (!hba1cValue && (hasHighGlucose || hasPrediabetes)) {
      recommendedTests.push("糖化血红蛋白检测");
    }
    if (hasHighGlucose && !ppg) {
      recommendedTests.push("餐后2小时血糖");
    }
    if (hasHighGlucose || hasPrediabetes) {
      recommendedTests.push("口服葡萄糖耐量试验(OGTT)");
      recommendedTests.push("胰岛功能检测");
      recommendedTests.push("糖尿病抗体检测");
    }
    
    // 治疗建议
    const treatmentRecommendations = [];
    
    if (diagnosis === "正常") {
      treatmentRecommendations.push("保持健康生活方式");
      treatmentRecommendations.push("定期体检监测血糖");
    } else if (diagnosis === "中等风险" || diagnosis === "高风险") {
      treatmentRecommendations.push("生活方式干预");
      treatmentRecommendations.push("控制体重");
      treatmentRecommendations.push("定期监测血糖");
      treatmentRecommendations.push("3-6个月后复查");
    } else if (diagnosis === "糖尿病前期") {
      treatmentRecommendations.push("强化生活方式干预");
      treatmentRecommendations.push("减重5-10%");
      treatmentRecommendations.push("每月监测血糖");
      treatmentRecommendations.push("考虑二甲双胍预防");
    } else {
      treatmentRecommendations.push("立即就医确诊");
      treatmentRecommendations.push("开始降糖治疗");
      treatmentRecommendations.push("血糖自我监测");
      treatmentRecommendations.push("糖尿病教育");
    }
    
    // 并发症风险
    const complications = {
      macrovascular: totalRiskScore >= 12 ? "高" : totalRiskScore >= 8 ? "中" : "低",
      microvascular: totalRiskScore >= 10 ? "高" : totalRiskScore >= 6 ? "中" : "低",
      neuropathy: totalRiskScore >= 8 ? "高" : totalRiskScore >= 5 ? "中" : "低",
      nephropathy: totalRiskScore >= 9 ? "高" : totalRiskScore >= 6 ? "中" : "低",
      retinopathy: totalRiskScore >= 8 ? "高" : totalRiskScore >= 5 ? "中" : "低"
    };
    
    // 生活方式建议
    const lifestyleAdvice = {
      diet: [
        "控制总热量摄入",
        "选择低血糖指数食物",
        "增加膳食纤维摄入",
        "限制精制糖和甜食",
        "规律进餐，少食多餐",
        "控制碳水化合物比例"
      ],
      exercise: [
        "每周至少150分钟中等强度运动",
        "餐后30分钟适度活动",
        "结合有氧和阻抗运动",
        "避免空腹剧烈运动",
        "运动前后监测血糖"
      ],
      monitoring: [
        "定期监测血糖",
        "记录血糖日记",
        "监测体重变化",
        "关注症状变化",
        "定期复查HbA1c",
        "监测血压和血脂"
      ]
    };
    
    setResult({
      values: {
        fasting: fg,
        postprandial: ppg,
        random: rg,
        hba1c: hba1cValue,
        estimatedAvgGlucose
      },
      classifications,
      bmi,
      riskScores: {
        glucose: riskScore,
        symptoms: symptomScore,
        riskFactors: riskFactorScore,
        medications: medicationScore,
        total: totalRiskScore
      },
      diagnosis: {
        result: diagnosis,
        color: diagnosisColor,
        urgency
      },
      recommendedTests,
      treatmentRecommendations,
      complications,
      lifestyleAdvice,
      symptomsAnalysis: symptoms.map(s => symptomsList[s as keyof typeof symptomsList]),
      riskFactorsAnalysis: riskFactors.map(f => riskFactorsList[f as keyof typeof riskFactorsList]),
      medicationsAnalysis: medications.map(m => medicationsList[m as keyof typeof medicationsList]),
      inputData: { age: ageNum, gender, weight: weightNum, height: heightNum, testType }
    });
  };

  const resetForm = () => {
    setFastingGlucose("");
    setPostprandialGlucose("");
    setRandomGlucose("");
    setHba1c("");
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setTestType("");
    setSymptoms([]);
    setRiskFactors([]);
    setMedications([]);
    setResult(null);
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms([...symptoms, symptom]);
    } else {
      setSymptoms(symptoms.filter(s => s !== symptom));
    }
  };

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    if (checked) {
      setRiskFactors([...riskFactors, factor]);
    } else {
      setRiskFactors(riskFactors.filter(f => f !== factor));
    }
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    if (checked) {
      setMedications([...medications, medication]);
    } else {
      setMedications(medications.filter(m => m !== medication));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🩸 血糖风险评估器</h1>
          <p className="text-lg text-gray-600">
            专业血糖分析，评估糖尿病风险，提供个性化管理建议
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <div className="space-y-6">
            {/* 血糖检测值 */}
            <Card>
              <CardHeader>
                <CardTitle>血糖检测值</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fastingGlucose">空腹血糖 (mg/dL)</Label>
                    <Input
                      id="fastingGlucose"
                      type="number"
                      placeholder="例如：100"
                      value={fastingGlucose}
                      onChange={(e) => setFastingGlucose(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postprandialGlucose">餐后2h血糖 (mg/dL)</Label>
                    <Input
                      id="postprandialGlucose"
                      type="number"
                      placeholder="例如：140"
                      value={postprandialGlucose}
                      onChange={(e) => setPostprandialGlucose(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="randomGlucose">随机血糖 (mg/dL)</Label>
                    <Input
                      id="randomGlucose"
                      type="number"
                      placeholder="例如：120"
                      value={randomGlucose}
                      onChange={(e) => setRandomGlucose(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hba1c">糖化血红蛋白 (%)</Label>
                    <Input
                      id="hba1c"
                      type="number"
                      step="0.1"
                      placeholder="例如：5.5"
                      value={hba1c}
                      onChange={(e) => setHba1c(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="testType">检测类型</Label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择检测类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">常规体检</SelectItem>
                      <SelectItem value="symptoms">有症状检查</SelectItem>
                      <SelectItem value="screening">糖尿病筛查</SelectItem>
                      <SelectItem value="follow-up">随访复查</SelectItem>
                      <SelectItem value="emergency">急诊检查</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Alert>
                  <AlertDescription className="text-xs">
                    <strong>检测提示:</strong> 空腹血糖需禁食8-12小时，餐后血糖从进食第一口开始计时。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

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
                      placeholder="例如：45"
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
                      placeholder="例如：175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle>症状评估</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(symptomsList).map(([key, symptom]) => (
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
                            symptom.severity === "高" ? "bg-red-100 text-red-700" :
                            symptom.severity === "中" ? "bg-orange-100 text-orange-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {symptom.severity}度
                          </span>
                        </Label>
                        <p className="text-xs text-gray-500">{symptom.description}</p>
                      </div>
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
                <div className="space-y-3">
                  {Object.entries(riskFactorsList).map(([key, factor]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Checkbox
                        id={key}
                        checked={riskFactors.includes(key)}
                        onCheckedChange={(checked) => handleRiskFactorChange(key, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {factor.name}
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            factor.impact === "高" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {factor.impact}风险
                          </span>
                        </Label>
                        <p className="text-xs text-gray-500">{factor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 药物影响 */}
            <Card>
              <CardHeader>
                <CardTitle>药物影响</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(medicationsList).map(([key, medication]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <Checkbox
                        id={key}
                        checked={medications.includes(key)}
                        onCheckedChange={(checked) => handleMedicationChange(key, checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {medication.name}
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            medication.effect === "升高" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {medication.effect}血糖
                          </span>
                        </Label>
                        <p className="text-xs text-gray-500">{medication.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateRisk} className="flex-1">
                评估血糖风险
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
                    <CardTitle>血糖检测结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {result.values.fasting > 0 && (
                        <div className={`p-3 rounded border ${
                          result.classifications.fasting?.color === "green" ? "bg-green-50 border-green-200" :
                          result.classifications.fasting?.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                          "bg-red-50 border-red-200"
                        }`}>
                          <div className="text-sm font-medium">空腹血糖</div>
                          <div className="text-lg font-bold">{result.values.fasting} mg/dL</div>
                          <div className={`text-xs ${
                            result.classifications.fasting?.color === "green" ? "text-green-700" :
                            result.classifications.fasting?.color === "yellow" ? "text-yellow-700" :
                            "text-red-700"
                          }`}>
                            {result.classifications.fasting?.level}
                          </div>
                        </div>
                      )}
                      
                      {result.values.postprandial > 0 && (
                        <div className={`p-3 rounded border ${
                          result.classifications.postprandial?.color === "green" ? "bg-green-50 border-green-200" :
                          result.classifications.postprandial?.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                          "bg-red-50 border-red-200"
                        }`}>
                          <div className="text-sm font-medium">餐后2h血糖</div>
                          <div className="text-lg font-bold">{result.values.postprandial} mg/dL</div>
                          <div className={`text-xs ${
                            result.classifications.postprandial?.color === "green" ? "text-green-700" :
                            result.classifications.postprandial?.color === "yellow" ? "text-yellow-700" :
                            "text-red-700"
                          }`}>
                            {result.classifications.postprandial?.level}
                          </div>
                        </div>
                      )}
                      
                      {result.values.random > 0 && (
                        <div className={`p-3 rounded border ${
                          result.classifications.random?.color === "green" ? "bg-green-50 border-green-200" :
                          result.classifications.random?.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                          "bg-red-50 border-red-200"
                        }`}>
                          <div className="text-sm font-medium">随机血糖</div>
                          <div className="text-lg font-bold">{result.values.random} mg/dL</div>
                          <div className={`text-xs ${
                            result.classifications.random?.color === "green" ? "text-green-700" :
                            result.classifications.random?.color === "yellow" ? "text-yellow-700" :
                            "text-red-700"
                          }`}>
                            {result.classifications.random?.level}
                          </div>
                        </div>
                      )}
                      
                      {result.values.hba1c > 0 && (
                        <div className={`p-3 rounded border ${
                          result.classifications.hba1c?.color === "green" ? "bg-green-50 border-green-200" :
                          result.classifications.hba1c?.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                          "bg-red-50 border-red-200"
                        }`}>
                          <div className="text-sm font-medium">糖化血红蛋白</div>
                          <div className="text-lg font-bold">{result.values.hba1c}%</div>
                          <div className={`text-xs ${
                            result.classifications.hba1c?.color === "green" ? "text-green-700" :
                            result.classifications.hba1c?.color === "yellow" ? "text-yellow-700" :
                            "text-red-700"
                          }`}>
                            {result.classifications.hba1c?.level}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className={`p-3 rounded text-center border ${
                      result.diagnosis.color === "green" ? "bg-green-50 border-green-200" :
                      result.diagnosis.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                      result.diagnosis.color === "orange" ? "bg-orange-50 border-orange-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className={`font-semibold ${
                        result.diagnosis.color === "green" ? "text-green-700" :
                        result.diagnosis.color === "yellow" ? "text-yellow-700" :
                        result.diagnosis.color === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        诊断建议: {result.diagnosis.result}
                      </div>
                      <div className="text-sm text-gray-600">
                        风险评分: {result.riskScores.total}/25 | 紧急程度: {result.diagnosis.urgency}
                      </div>
                    </div>

                    {/* 估算平均血糖 */}
                    {result.values.estimatedAvgGlucose > 0 && (
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <span className="font-medium">估算平均血糖:</span>
                        <span className="ml-2">{result.values.estimatedAvgGlucose} mg/dL</span>
                      </div>
                    )}

                    {/* BMI */}
                    {result.bmi > 0 && (
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <span className="font-medium">BMI:</span>
                        <span className="ml-2">{result.bmi}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 建议检查 */}
                {result.recommendedTests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>建议检查</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {result.recommendedTests.map((test: string, i: number) => (
                          <div key={i} className="flex items-center p-2 bg-blue-50 rounded">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            <span className="text-sm">{test}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 并发症风险 */}
                <Card>
                  <CardHeader>
                    <CardTitle>并发症风险评估</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded border ${
                        result.complications.macrovascular === "高" ? "bg-red-50 border-red-200" :
                        result.complications.macrovascular === "中" ? "bg-orange-50 border-orange-200" :
                        "bg-green-50 border-green-200"
                      }`}>
                        <div className="font-medium">大血管病变</div>
                        <div className={`text-sm ${
                          result.complications.macrovascular === "高" ? "text-red-700" :
                          result.complications.macrovascular === "中" ? "text-orange-700" :
                          "text-green-700"
                        }`}>
                          {result.complications.macrovascular}
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded border ${
                        result.complications.microvascular === "高" ? "bg-red-50 border-red-200" :
                        result.complications.microvascular === "中" ? "bg-orange-50 border-orange-200" :
                        "bg-green-50 border-green-200"
                      }`}>
                        <div className="font-medium">微血管病变</div>
                        <div className={`text-sm ${
                          result.complications.microvascular === "高" ? "text-red-700" :
                          result.complications.microvascular === "中" ? "text-orange-700" :
                          "text-green-700"
                        }`}>
                          {result.complications.microvascular}
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded border ${
                        result.complications.neuropathy === "高" ? "bg-red-50 border-red-200" :
                        result.complications.neuropathy === "中" ? "bg-orange-50 border-orange-200" :
                        "bg-green-50 border-green-200"
                      }`}>
                        <div className="font-medium">神经病变</div>
                        <div className={`text-sm ${
                          result.complications.neuropathy === "高" ? "text-red-700" :
                          result.complications.neuropathy === "中" ? "text-orange-700" :
                          "text-green-700"
                        }`}>
                          {result.complications.neuropathy}
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded border ${
                        result.complications.retinopathy === "高" ? "bg-red-50 border-red-200" :
                        result.complications.retinopathy === "中" ? "bg-orange-50 border-orange-200" :
                        "bg-green-50 border-green-200"
                      }`}>
                        <div className="font-medium">视网膜病变</div>
                        <div className={`text-sm ${
                          result.complications.retinopathy === "高" ? "text-red-700" :
                          result.complications.retinopathy === "中" ? "text-orange-700" :
                          "text-green-700"
                        }`}>
                          {result.complications.retinopathy}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 治疗建议 */}
                <Card>
                  <CardHeader>
                    <CardTitle>治疗建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.treatmentRecommendations.map((recommendation: string, i: number) => (
                        <div key={i} className="flex items-center p-2 bg-blue-50 rounded">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          <span className="text-sm">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* 生活方式建议 */}
        {result && (
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>饮食管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.lifestyleAdvice.diet.map((advice: string, i: number) => (
                    <div key={i} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {advice}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>运动指导</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.lifestyleAdvice.exercise.map((advice: string, i: number) => (
                    <div key={i} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {advice}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>监测管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.lifestyleAdvice.monitoring.map((advice: string, i: number) => (
                    <div key={i} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {advice}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 血糖知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🧠 血糖知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">血糖的作用</h3>
                <ul className="text-sm space-y-1">
                  <li>• 为细胞提供主要能量来源</li>
                  <li>• 维持大脑正常功能</li>
                  <li>• 参与蛋白质和脂肪代谢</li>
                  <li>• 调节体内酸碱平衡</li>
                  <li>• 影响免疫系统功能</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">糖尿病类型</h3>
                <ul className="text-sm space-y-1">
                  <li>• 1型: 胰岛β细胞破坏，绝对缺乏胰岛素</li>
                  <li>• 2型: 胰岛素抵抗和相对缺乏</li>
                  <li>• 妊娠期: 妊娠期间发生的糖代谢异常</li>
                  <li>• 特殊类型: 基因缺陷、药物等引起</li>
                  <li>• MODY: 青少年发病的成人型糖尿病</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">血糖监测</h3>
                <ul className="text-sm space-y-1">
                  <li>• 空腹血糖: 反映基础胰岛素分泌</li>
                  <li>• 餐后血糖: 反映胰岛素储备功能</li>
                  <li>• 糖化血红蛋白: 反映2-3个月平均血糖</li>
                  <li>• 糖化白蛋白: 反映2-3周平均血糖</li>
                  <li>• 连续血糖监测: 实时血糖变化</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">预防措施</h3>
                <ul className="text-sm space-y-1">
                  <li>• 保持健康体重</li>
                  <li>• 规律运动锻炼</li>
                  <li>• 均衡营养饮食</li>
                  <li>• 定期健康体检</li>
                  <li>• 管理心理压力</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}