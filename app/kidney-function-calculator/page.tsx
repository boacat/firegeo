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

export default function KidneyFunctionCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [bun, setBun] = useState("");
  const [cystatin, setCystatin] = useState("");
  const [uricAcid, setUricAcid] = useState("");
  const [albumin, setAlbumin] = useState("");
  const [proteinuria, setProteinuria] = useState("");
  const [hematuria, setHematuria] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [cardiovascular, setCardiovascular] = useState(false);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const calculateKidneyFunction = () => {
    if (!age || !gender || !weight || !creatinine) {
      alert("请填写必要信息（年龄、性别、体重、肌酐）");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = height ? parseFloat(height) : null;
    const creatinineNum = parseFloat(creatinine);
    const bunNum = bun ? parseFloat(bun) : null;
    const cystatinNum = cystatin ? parseFloat(cystatin) : null;
    const uricAcidNum = uricAcid ? parseFloat(uricAcid) : null;
    const albuminNum = albumin ? parseFloat(albumin) : null;
    const proteinuriaNum = proteinuria ? parseFloat(proteinuria) : null;

    if (ageNum <= 0 || ageNum > 120 || weightNum <= 0 || creatinineNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // 计算BMI（如果有身高）
    const bmi = heightNum ? weightNum / Math.pow(heightNum / 100, 2) : null;

    // 1. CKD-EPI肌酐公式计算eGFR
    const calculateCKDEPI = () => {
      let kappa, alpha, genderFactor, ageFactor, ethnicityFactor;
      
      if (gender === "female") {
        kappa = 0.7;
        alpha = creatinineNum <= 0.7 ? -0.329 : -1.209;
        genderFactor = creatinineNum <= 0.7 ? 1.018 : 1.018;
      } else {
        kappa = 0.9;
        alpha = creatinineNum <= 0.9 ? -0.411 : -1.209;
        genderFactor = 1;
      }
      
      ageFactor = Math.pow(0.993, ageNum);
      ethnicityFactor = ethnicity === "african" ? 1.159 : 1;
      
      const minValue = Math.min(creatinineNum / kappa, 1);
      const maxValue = Math.max(creatinineNum / kappa, 1);
      
      const eGFR = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * ageFactor * genderFactor * ethnicityFactor;
      
      return Math.round(eGFR * 10) / 10;
    };

    // 2. Cockcroft-Gault公式计算肌酐清除率
    const calculateCockcroftGault = () => {
      const genderFactor = gender === "female" ? 0.85 : 1;
      const ccr = ((140 - ageNum) * weightNum * genderFactor) / (72 * creatinineNum);
      return Math.round(ccr * 10) / 10;
    };

    // 3. MDRD公式计算eGFR
    const calculateMDRD = () => {
      const genderFactor = gender === "female" ? 0.742 : 1;
      const ethnicityFactor = ethnicity === "african" ? 1.212 : 1;
      const eGFR = 175 * Math.pow(creatinineNum, -1.154) * Math.pow(ageNum, -0.203) * genderFactor * ethnicityFactor;
      return Math.round(eGFR * 10) / 10;
    };

    // 4. CKD-EPI胱抑素C公式（如果有胱抑素C）
    const calculateCKDEPICystatin = () => {
      if (!cystatinNum) return null;
      
      const alpha = cystatinNum <= 0.8 ? -0.499 : -1.328;
      const minValue = Math.min(cystatinNum / 0.8, 1);
      const maxValue = Math.max(cystatinNum / 0.8, 1);
      const genderFactor = gender === "female" ? 0.932 : 1;
      const ageFactor = Math.pow(0.996, ageNum);
      
      const eGFR = 133 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.328) * ageFactor * genderFactor;
      return Math.round(eGFR * 10) / 10;
    };

    // 5. 联合公式（肌酐+胱抑素C）
    const calculateCombined = () => {
      if (!cystatinNum) return null;
      
      const creatinineEGFR = calculateCKDEPI();
      const cystatinEGFR = calculateCKDEPICystatin();
      
      if (creatinineEGFR && cystatinEGFR) {
        return Math.round((creatinineEGFR + cystatinEGFR) / 2 * 10) / 10;
      }
      return null;
    };

    const ckdEpiGFR = calculateCKDEPI();
    const cockcroftGaultCCR = calculateCockcroftGault();
    const mdrdGFR = calculateMDRD();
    const cystatinGFR = calculateCKDEPICystatin();
    const combinedGFR = calculateCombined();

    // 推荐使用CKD-EPI作为主要评估指标
    const primaryGFR = ckdEpiGFR;

    // CKD分期
    const getCKDStage = (gfr: number) => {
      if (gfr >= 90) {
        return {
          stage: "G1",
          description: "肾功能正常或轻度下降",
          color: "green",
          risk: "低风险"
        };
      } else if (gfr >= 60) {
        return {
          stage: "G2",
          description: "肾功能轻度下降",
          color: "yellow",
          risk: "低-中等风险"
        };
      } else if (gfr >= 45) {
        return {
          stage: "G3a",
          description: "肾功能中度下降",
          color: "orange",
          risk: "中等风险"
        };
      } else if (gfr >= 30) {
        return {
          stage: "G3b",
          description: "肾功能中重度下降",
          color: "orange",
          risk: "中高风险"
        };
      } else if (gfr >= 15) {
        return {
          stage: "G4",
          description: "肾功能重度下降",
          color: "red",
          risk: "高风险"
        };
      } else {
        return {
          stage: "G5",
          description: "肾衰竭",
          color: "red",
          risk: "极高风险"
        };
      }
    };

    const ckdStage = getCKDStage(primaryGFR);

    // 蛋白尿分期
    const getProteinuriaStage = () => {
      if (!proteinuriaNum) return null;
      
      if (proteinuriaNum < 30) {
        return {
          stage: "A1",
          description: "正常或轻度增加",
          color: "green"
        };
      } else if (proteinuriaNum < 300) {
        return {
          stage: "A2",
          description: "中度增加",
          color: "orange"
        };
      } else {
        return {
          stage: "A3",
          description: "重度增加",
          color: "red"
        };
      }
    };

    const proteinuriaStage = getProteinuriaStage();

    // 其他指标评估
    const getOtherIndicators = () => {
      const indicators = [];
      
      // BUN评估
      if (bunNum) {
        if (bunNum > 20) {
          indicators.push({
            name: "血尿素氮(BUN)",
            value: bunNum,
            unit: "mg/dL",
            status: "偏高",
            color: "red",
            note: "可能提示肾功能下降或脱水"
          });
        } else if (bunNum < 7) {
          indicators.push({
            name: "血尿素氮(BUN)",
            value: bunNum,
            unit: "mg/dL",
            status: "偏低",
            color: "orange",
            note: "可能提示营养不良或肝功能异常"
          });
        } else {
          indicators.push({
            name: "血尿素氮(BUN)",
            value: bunNum,
            unit: "mg/dL",
            status: "正常",
            color: "green",
            note: "正常范围内"
          });
        }
      }
      
      // 尿酸评估
      if (uricAcidNum) {
        const normalRange = gender === "male" ? [3.4, 7.0] : [2.4, 6.0];
        if (uricAcidNum > normalRange[1]) {
          indicators.push({
            name: "尿酸",
            value: uricAcidNum,
            unit: "mg/dL",
            status: "偏高",
            color: "red",
            note: "高尿酸血症，可能影响肾功能"
          });
        } else if (uricAcidNum < normalRange[0]) {
          indicators.push({
            name: "尿酸",
            value: uricAcidNum,
            unit: "mg/dL",
            status: "偏低",
            color: "orange",
            note: "尿酸偏低"
          });
        } else {
          indicators.push({
            name: "尿酸",
            value: uricAcidNum,
            unit: "mg/dL",
            status: "正常",
            color: "green",
            note: "正常范围内"
          });
        }
      }
      
      // 白蛋白评估
      if (albuminNum) {
        if (albuminNum < 3.5) {
          indicators.push({
            name: "血清白蛋白",
            value: albuminNum,
            unit: "g/dL",
            status: "偏低",
            color: "red",
            note: "低白蛋白血症，可能提示肾病综合征"
          });
        } else {
          indicators.push({
            name: "血清白蛋白",
            value: albuminNum,
            unit: "g/dL",
            status: "正常",
            color: "green",
            note: "正常范围内"
          });
        }
      }
      
      return indicators;
    };

    const otherIndicators = getOtherIndicators();

    // 风险因子评估
    const getRiskFactors = () => {
      const riskFactors = {
        high: [],
        moderate: [],
        protective: []
      };
      
      // 高风险因子
      if (diabetes) riskFactors.high.push("糖尿病");
      if (hypertension) riskFactors.high.push("高血压");
      if (cardiovascular) riskFactors.high.push("心血管疾病");
      if (familyHistory) riskFactors.high.push("肾病家族史");
      if (ageNum >= 65) riskFactors.high.push("高龄（≥65岁）");
      if (hematuria) riskFactors.high.push("血尿");
      if (proteinuriaNum && proteinuriaNum >= 30) riskFactors.high.push("蛋白尿");
      
      // 中等风险因子
      if (bmi && bmi >= 30) riskFactors.moderate.push("肥胖");
      if (uricAcidNum && uricAcidNum > (gender === "male" ? 7.0 : 6.0)) riskFactors.moderate.push("高尿酸血症");
      if (medications.includes("nsaids")) riskFactors.moderate.push("长期使用NSAIDs");
      if (medications.includes("ace-inhibitors") || medications.includes("arbs")) riskFactors.protective.push("使用ACEI/ARB");
      
      return riskFactors;
    };

    const riskFactors = getRiskFactors();

    // 症状评估
    const getSymptomAssessment = () => {
      const symptomSeverity = {
        mild: [],
        moderate: [],
        severe: []
      };
      
      symptoms.forEach(symptom => {
        switch (symptom) {
          case "fatigue":
            symptomSeverity.mild.push("疲劳乏力");
            break;
          case "swelling":
            symptomSeverity.moderate.push("水肿");
            break;
          case "decreased-urine":
            symptomSeverity.moderate.push("尿量减少");
            break;
          case "foamy-urine":
            symptomSeverity.moderate.push("泡沫尿");
            break;
          case "blood-urine":
            symptomSeverity.severe.push("血尿");
            break;
          case "nausea":
            symptomSeverity.moderate.push("恶心呕吐");
            break;
          case "shortness-breath":
            symptomSeverity.severe.push("呼吸困难");
            break;
          case "chest-pain":
            symptomSeverity.severe.push("胸痛");
            break;
          default:
            break;
        }
      });
      
      return symptomSeverity;
    };

    const symptomAssessment = getSymptomAssessment();

    // 治疗建议
    const getTreatmentRecommendations = () => {
      const recommendations = {
        immediate: [],
        lifestyle: [],
        monitoring: [],
        medication: []
      };
      
      // 立即处理
      if (ckdStage.stage === "G5" || symptomAssessment.severe.length > 0) {
        recommendations.immediate.push("立即就医，考虑肾脏替代治疗");
      } else if (ckdStage.stage === "G4") {
        recommendations.immediate.push("尽快就医，准备肾脏替代治疗");
      } else if (ckdStage.stage === "G3b") {
        recommendations.immediate.push("及时就医，加强监测和治疗");
      }
      
      // 生活方式
      recommendations.lifestyle = [
        "低盐饮食（<6g/天）",
        "优质低蛋白饮食",
        "控制血压<130/80mmHg",
        "控制血糖（如有糖尿病）",
        "戒烟限酒",
        "适量运动",
        "充足睡眠",
        "避免肾毒性药物"
      ];
      
      // 监测建议
      if (ckdStage.stage === "G1" || ckdStage.stage === "G2") {
        recommendations.monitoring = [
          "每年检查肾功能",
          "监测血压和血糖",
          "尿常规检查"
        ];
      } else if (ckdStage.stage === "G3a") {
        recommendations.monitoring = [
          "每6个月检查肾功能",
          "定期监测电解质",
          "评估心血管风险",
          "骨代谢指标检查"
        ];
      } else {
        recommendations.monitoring = [
          "每3个月检查肾功能",
          "密切监测电解质和酸碱平衡",
          "贫血和骨病筛查",
          "心血管风险评估",
          "营养状态评估"
        ];
      }
      
      // 药物治疗
      if (hypertension) {
        recommendations.medication.push("ACEI/ARB类降压药");
      }
      if (diabetes) {
        recommendations.medication.push("SGLT2抑制剂（如适用）");
      }
      if (ckdStage.stage === "G3b" || ckdStage.stage === "G4" || ckdStage.stage === "G5") {
        recommendations.medication.push("磷结合剂（如血磷升高）");
        recommendations.medication.push("促红细胞生成素（如贫血）");
        recommendations.medication.push("维生素D类似物");
      }
      
      return recommendations;
    };

    const treatmentRec = getTreatmentRecommendations();

    // 饮食建议
    const getDietaryRecommendations = () => {
      const dietary = {
        protein: "",
        sodium: "<6g/天",
        potassium: "",
        phosphorus: "",
        fluid: "",
        calories: ""
      };
      
      // 蛋白质建议
      if (ckdStage.stage === "G1" || ckdStage.stage === "G2") {
        dietary.protein = "0.8-1.0g/kg/天（正常蛋白饮食）";
      } else if (ckdStage.stage === "G3a" || ckdStage.stage === "G3b") {
        dietary.protein = "0.6-0.8g/kg/天（低蛋白饮食）";
      } else {
        dietary.protein = "0.6g/kg/天（严格低蛋白饮食）";
      }
      
      // 钾限制
      if (ckdStage.stage === "G4" || ckdStage.stage === "G5") {
        dietary.potassium = "<2g/天（限制高钾食物）";
      } else {
        dietary.potassium = "正常摄入（注意监测血钾）";
      }
      
      // 磷限制
      if (ckdStage.stage === "G3b" || ckdStage.stage === "G4" || ckdStage.stage === "G5") {
        dietary.phosphorus = "<800mg/天（限制高磷食物）";
      } else {
        dietary.phosphorus = "正常摄入";
      }
      
      // 液体限制
      if (ckdStage.stage === "G5" && symptoms.includes("swelling")) {
        dietary.fluid = "限制液体摄入（根据尿量调整）";
      } else {
        dietary.fluid = "充足水分摄入（除非有水肿）";
      }
      
      // 热量
      dietary.calories = "30-35kcal/kg/天（维持理想体重）";
      
      return dietary;
    };

    const dietaryRec = getDietaryRecommendations();

    setResult({
      gfrResults: {
        ckdEpi: ckdEpiGFR,
        cockcroftGault: cockcroftGaultCCR,
        mdrd: mdrdGFR,
        cystatin: cystatinGFR,
        combined: combinedGFR,
        primary: primaryGFR
      },
      ckdStage,
      proteinuriaStage,
      otherIndicators,
      riskFactors,
      symptoms: symptomAssessment,
      treatment: treatmentRec,
      dietary: dietaryRec,
      bmi,
      assessmentFactors: {
        age: ageNum,
        gender,
        weight: weightNum,
        height: heightNum,
        ethnicity,
        creatinine: creatinineNum,
        bun: bunNum,
        cystatin: cystatinNum,
        comorbidities: {
          diabetes,
          hypertension,
          cardiovascular,
          familyHistory
        }
      }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setEthnicity("");
    setCreatinine("");
    setBun("");
    setCystatin("");
    setUricAcid("");
    setAlbumin("");
    setProteinuria("");
    setHematuria(false);
    setHypertension(false);
    setDiabetes(false);
    setCardiovascular(false);
    setFamilyHistory(false);
    setMedications([]);
    setSymptoms([]);
    setResult(null);
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    if (checked) {
      setMedications(prev => [...prev, medication]);
    } else {
      setMedications(prev => prev.filter(med => med !== medication));
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setSymptoms(prev => [...prev, symptom]);
    } else {
      setSymptoms(prev => prev.filter(sym => sym !== symptom));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🫘 肾功能评估计算器</h1>
          <p className="text-lg text-gray-600">
            评估肾小球滤过率(eGFR)和慢性肾病(CKD)分期，制定个性化管理方案
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
                    <Label htmlFor="weight">体重 (kg) *</Label>
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
              </CardContent>
            </Card>

            {/* 实验室检查 */}
            <Card>
              <CardHeader>
                <CardTitle>实验室检查</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="creatinine">血肌酐 (mg/dL) *</Label>
                    <Input
                      id="creatinine"
                      type="number"
                      step="0.01"
                      placeholder="例如：1.2"
                      value={creatinine}
                      onChange={(e) => setCreatinine(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bun">血尿素氮 (mg/dL)</Label>
                    <Input
                      id="bun"
                      type="number"
                      step="0.1"
                      placeholder="例如：15"
                      value={bun}
                      onChange={(e) => setBun(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cystatin">胱抑素C (mg/L)</Label>
                    <Input
                      id="cystatin"
                      type="number"
                      step="0.01"
                      placeholder="例如：1.0"
                      value={cystatin}
                      onChange={(e) => setCystatin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="uricAcid">尿酸 (mg/dL)</Label>
                    <Input
                      id="uricAcid"
                      type="number"
                      step="0.1"
                      placeholder="例如：6.5"
                      value={uricAcid}
                      onChange={(e) => setUricAcid(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="albumin">血清白蛋白 (g/dL)</Label>
                    <Input
                      id="albumin"
                      type="number"
                      step="0.1"
                      placeholder="例如：4.0"
                      value={albumin}
                      onChange={(e) => setAlbumin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="proteinuria">尿蛋白 (mg/g肌酐)</Label>
                    <Input
                      id="proteinuria"
                      type="number"
                      placeholder="例如：150"
                      value={proteinuria}
                      onChange={(e) => setProteinuria(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 既往史和合并症 */}
            <Card>
              <CardHeader>
                <CardTitle>既往史和合并症</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="diabetes"
                    checked={diabetes}
                    onCheckedChange={setDiabetes}
                  />
                  <Label htmlFor="diabetes">糖尿病</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hypertension"
                    checked={hypertension}
                    onCheckedChange={setHypertension}
                  />
                  <Label htmlFor="hypertension">高血压</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cardiovascular"
                    checked={cardiovascular}
                    onCheckedChange={setCardiovascular}
                  />
                  <Label htmlFor="cardiovascular">心血管疾病</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="familyHistory"
                    checked={familyHistory}
                    onCheckedChange={setFamilyHistory}
                  />
                  <Label htmlFor="familyHistory">肾病家族史</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hematuria"
                    checked={hematuria}
                    onCheckedChange={setHematuria}
                  />
                  <Label htmlFor="hematuria">血尿</Label>
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
                    { id: "ace-inhibitors", label: "ACEI类降压药" },
                    { id: "arbs", label: "ARB类降压药" },
                    { id: "diuretics", label: "利尿剂" },
                    { id: "nsaids", label: "非甾体抗炎药(NSAIDs)" },
                    { id: "metformin", label: "二甲双胍" },
                    { id: "contrast", label: "近期使用造影剂" }
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

            {/* 症状 */}
            <Card>
              <CardHeader>
                <CardTitle>相关症状</CardTitle>
                <p className="text-sm text-gray-600">选择您出现的症状</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "fatigue", label: "疲劳乏力" },
                    { id: "swelling", label: "水肿" },
                    { id: "decreased-urine", label: "尿量减少" },
                    { id: "foamy-urine", label: "泡沫尿" },
                    { id: "blood-urine", label: "血尿" },
                    { id: "nausea", label: "恶心呕吐" },
                    { id: "shortness-breath", label: "呼吸困难" },
                    { id: "chest-pain", label: "胸痛" }
                  ].map((symptom) => (
                    <div key={symptom.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom.id}
                        checked={symptoms.includes(symptom.id)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                      />
                      <Label htmlFor={symptom.id}>{symptom.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateKidneyFunction} className="flex-1">
                计算肾功能
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
                    <CardTitle>肾功能评估结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border text-center ${
                      result.ckdStage.color === "green" ? "bg-green-50 border-green-200" :
                      result.ckdStage.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                      result.ckdStage.color === "orange" ? "bg-orange-50 border-orange-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        result.ckdStage.color === "green" ? "text-green-700" :
                        result.ckdStage.color === "yellow" ? "text-yellow-700" :
                        result.ckdStage.color === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        CKD {result.ckdStage.stage}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {result.ckdStage.description} | {result.ckdStage.risk}
                      </div>
                      <div className="text-lg font-semibold mb-3">
                        eGFR: {result.gfrResults.primary} mL/min/1.73m²
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, (result.gfrResults.primary / 120) * 100))} 
                        className="mb-3"
                      />
                    </div>

                    {/* GFR计算结果对比 */}
                    <div className="space-y-2">
                      <h4 className="font-medium">不同公式计算结果</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">CKD-EPI</div>
                          <div>{result.gfrResults.ckdEpi} mL/min/1.73m²</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">Cockcroft-Gault</div>
                          <div>{result.gfrResults.cockcroftGault} mL/min</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">MDRD</div>
                          <div>{result.gfrResults.mdrd} mL/min/1.73m²</div>
                        </div>
                        {result.gfrResults.cystatin && (
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-medium">胱抑素C</div>
                            <div>{result.gfrResults.cystatin} mL/min/1.73m²</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 蛋白尿分期 */}
                    {result.proteinuriaStage && (
                      <div className={`p-3 rounded border ${
                        result.proteinuriaStage.color === "green" ? "bg-green-50 border-green-200" :
                        result.proteinuriaStage.color === "orange" ? "bg-orange-50 border-orange-200" :
                        "bg-red-50 border-red-200"
                      }`}>
                        <div className="font-medium">蛋白尿分期: {result.proteinuriaStage.stage}</div>
                        <div className="text-sm">{result.proteinuriaStage.description}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 其他指标 */}
                {result.otherIndicators.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>其他指标评估</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.otherIndicators.map((indicator: any, i: number) => (
                          <div key={i} className={`p-3 rounded border ${
                            indicator.color === "green" ? "bg-green-50 border-green-200" :
                            indicator.color === "orange" ? "bg-orange-50 border-orange-200" :
                            "bg-red-50 border-red-200"
                          }`}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{indicator.name}</span>
                              <span className={`text-sm px-2 py-1 rounded ${
                                indicator.color === "green" ? "bg-green-100 text-green-700" :
                                indicator.color === "orange" ? "bg-orange-100 text-orange-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {indicator.status}
                              </span>
                            </div>
                            <div className="text-sm">
                              {indicator.value} {indicator.unit}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {indicator.note}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 详细分析 */}
                <Tabs defaultValue="treatment" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="treatment">治疗建议</TabsTrigger>
                    <TabsTrigger value="diet">饮食指导</TabsTrigger>
                    <TabsTrigger value="risks">风险因子</TabsTrigger>
                    <TabsTrigger value="symptoms">症状评估</TabsTrigger>
                  </TabsList>

                  <TabsContent value="treatment">
                    <Card>
                      <CardHeader>
                        <CardTitle>治疗和监测建议</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.treatment.immediate.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">紧急处理</h4>
                            <ul className="text-sm space-y-1">
                              {result.treatment.immediate.map((item: string, i: number) => (
                                <li key={i} className="text-red-600">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">生活方式干预</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatment.lifestyle.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">监测建议</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatment.monitoring.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {result.treatment.medication.length > 0 && (
                          <div>
                            <h4 className="font-medium text-purple-700 mb-2">药物治疗</h4>
                            <ul className="text-sm space-y-1">
                              {result.treatment.medication.map((item: string, i: number) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="diet">
                    <Card>
                      <CardHeader>
                        <CardTitle>饮食指导</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-3 bg-blue-50 rounded">
                            <h4 className="font-medium text-blue-700 mb-2">蛋白质</h4>
                            <p className="text-sm">{result.dietary.protein}</p>
                          </div>
                          
                          <div className="p-3 bg-orange-50 rounded">
                            <h4 className="font-medium text-orange-700 mb-2">钠盐</h4>
                            <p className="text-sm">{result.dietary.sodium}</p>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded">
                            <h4 className="font-medium text-green-700 mb-2">钾</h4>
                            <p className="text-sm">{result.dietary.potassium}</p>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded">
                            <h4 className="font-medium text-purple-700 mb-2">磷</h4>
                            <p className="text-sm">{result.dietary.phosphorus}</p>
                          </div>
                          
                          <div className="p-3 bg-cyan-50 rounded">
                            <h4 className="font-medium text-cyan-700 mb-2">液体</h4>
                            <p className="text-sm">{result.dietary.fluid}</p>
                          </div>
                          
                          <div className="p-3 bg-yellow-50 rounded">
                            <h4 className="font-medium text-yellow-700 mb-2">热量</h4>
                            <p className="text-sm">{result.dietary.calories}</p>
                          </div>
                        </div>
                        
                        <Alert>
                          <AlertDescription>
                            饮食建议应在营养师指导下个性化调整，定期评估营养状态。
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
                        {result.riskFactors.high.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">高风险因子</h4>
                            <ul className="text-sm space-y-1">
                              {result.riskFactors.high.map((factor: string, i: number) => (
                                <li key={i} className="text-red-600">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.riskFactors.moderate.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-700 mb-2">中等风险因子</h4>
                            <ul className="text-sm space-y-1">
                              {result.riskFactors.moderate.map((factor: string, i: number) => (
                                <li key={i} className="text-orange-600">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.riskFactors.protective.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">保护性因子</h4>
                            <ul className="text-sm space-y-1">
                              {result.riskFactors.protective.map((factor: string, i: number) => (
                                <li key={i} className="text-green-600">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Alert>
                          <AlertDescription>
                            积极控制可改变的风险因子，定期监测肾功能变化。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="symptoms">
                    <Card>
                      <CardHeader>
                        <CardTitle>症状评估</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.symptoms.severe.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">严重症状</h4>
                            <ul className="text-sm space-y-1">
                              {result.symptoms.severe.map((symptom: string, i: number) => (
                                <li key={i} className="text-red-600">• {symptom}</li>
                              ))}
                            </ul>
                            <Alert className="mt-2">
                              <AlertDescription className="text-red-600">
                                出现严重症状，建议立即就医！
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                        
                        {result.symptoms.moderate.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-700 mb-2">中等症状</h4>
                            <ul className="text-sm space-y-1">
                              {result.symptoms.moderate.map((symptom: string, i: number) => (
                                <li key={i} className="text-orange-600">• {symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.symptoms.mild.length > 0 && (
                          <div>
                            <h4 className="font-medium text-yellow-700 mb-2">轻度症状</h4>
                            <ul className="text-sm space-y-1">
                              {result.symptoms.mild.map((symptom: string, i: number) => (
                                <li key={i} className="text-yellow-600">• {symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.symptoms.severe.length === 0 && result.symptoms.moderate.length === 0 && result.symptoms.mild.length === 0 && (
                          <div className="text-center text-gray-500 py-8">
                            暂无相关症状
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>

        {/* 肾功能知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🫘 肾功能知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">什么是eGFR</h3>
                <ul className="text-sm space-y-1">
                  <li>• 估算肾小球滤过率</li>
                  <li>• 反映肾脏清除废物的能力</li>
                  <li>• 正常值：≥90 mL/min/1.73m²</li>
                  <li>• 是评估肾功能的金标准</li>
                  <li>• 用于CKD分期和治疗决策</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">CKD分期</h3>
                <ul className="text-sm space-y-1">
                  <li>• G1: eGFR ≥90（正常或轻度下降）</li>
                  <li>• G2: eGFR 60-89（轻度下降）</li>
                  <li>• G3a: eGFR 45-59（中度下降）</li>
                  <li>• G3b: eGFR 30-44（中重度下降）</li>
                  <li>• G4: eGFR 15-29（重度下降）</li>
                  <li>• G5: eGFR <15（肾衰竭）</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">肾病的危害</h3>
                <ul className="text-sm space-y-1">
                  <li>• 心血管疾病风险增加</li>
                  <li>• 贫血和骨病</li>
                  <li>• 电解质紊乱</li>
                  <li>• 营养不良</li>
                  <li>• 生活质量下降</li>
                  <li>• 需要肾脏替代治疗</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">预防措施</h3>
                <ul className="text-sm space-y-1">
                  <li>• 控制血压和血糖</li>
                  <li>• 健康饮食和适量运动</li>
                  <li>• 避免肾毒性药物</li>
                  <li>• 定期体检和肾功能检查</li>
                  <li>• 及时治疗泌尿系感染</li>
                  <li>• 戒烟限酒</li>
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
                <h3 className="font-semibold mb-2">计算原理</h3>
                <ul className="text-sm space-y-1">
                  <li>• 基于多种eGFR计算公式</li>
                  <li>• CKD-EPI公式最为准确</li>
                  <li>• 考虑年龄、性别、种族因素</li>
                  <li>• 结合临床症状和实验室检查</li>
                  <li>• 参考KDIGO指南</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 计算结果仅供参考</li>
                  <li>• 不能替代专业医学诊断</li>
                  <li>• 需要结合临床情况综合判断</li>
                  <li>• 定期复查肾功能</li>
                  <li>• 有症状应及时就医</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}