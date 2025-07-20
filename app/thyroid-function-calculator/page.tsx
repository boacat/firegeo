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

export default function ThyroidFunctionCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [tsh, setTsh] = useState("");
  const [ft4, setFt4] = useState("");
  const [ft3, setFt3] = useState("");
  const [t4, setT4] = useState("");
  const [t3, setT3] = useState("");
  const [antiTPO, setAntiTPO] = useState("");
  const [antiTG, setAntiTG] = useState("");
  const [thyroglobulin, setThyroglobulin] = useState("");
  const [pregnancy, setPregnancy] = useState(false);
  const [trimester, setTrimester] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [autoimmune, setAutoimmune] = useState(false);
  const [iodineExposure, setIodineExposure] = useState(false);
  const [radiation, setRadiation] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateThyroidFunction = () => {
    if (!age || !gender || !tsh) {
      alert("请填写必要信息（年龄、性别、TSH）");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = weight ? parseFloat(weight) : null;
    const heightNum = height ? parseFloat(height) : null;
    const tshNum = parseFloat(tsh);
    const ft4Num = ft4 ? parseFloat(ft4) : null;
    const ft3Num = ft3 ? parseFloat(ft3) : null;
    const t4Num = t4 ? parseFloat(t4) : null;
    const t3Num = t3 ? parseFloat(t3) : null;
    const antiTPONum = antiTPO ? parseFloat(antiTPO) : null;
    const antiTGNum = antiTG ? parseFloat(antiTG) : null;
    const thyroglobulinNum = thyroglobulin ? parseFloat(thyroglobulin) : null;

    if (ageNum <= 0 || ageNum > 120 || tshNum < 0) {
      alert("请输入有效的数值");
      return;
    }

    // 计算BMI（如果有身高体重）
    const bmi = weightNum && heightNum ? weightNum / Math.pow(heightNum / 100, 2) : null;

    // 获取参考范围（根据年龄、性别、妊娠状态调整）
    const getReferenceRanges = () => {
      let ranges = {
        tsh: { min: 0.4, max: 4.0, unit: "mIU/L" },
        ft4: { min: 0.8, max: 1.8, unit: "ng/dL" },
        ft3: { min: 2.3, max: 4.2, unit: "pg/mL" },
        t4: { min: 4.5, max: 12.0, unit: "μg/dL" },
        t3: { min: 80, max: 200, unit: "ng/dL" },
        antiTPO: { max: 35, unit: "IU/mL" },
        antiTG: { max: 40, unit: "IU/mL" },
        thyroglobulin: { min: 1.4, max: 78, unit: "ng/mL" }
      };

      // 妊娠期调整
      if (pregnancy) {
        if (trimester === "first") {
          ranges.tsh = { min: 0.1, max: 2.5, unit: "mIU/L" };
          ranges.ft4 = { min: 0.9, max: 1.7, unit: "ng/dL" };
        } else if (trimester === "second") {
          ranges.tsh = { min: 0.2, max: 3.0, unit: "mIU/L" };
          ranges.ft4 = { min: 0.8, max: 1.5, unit: "ng/dL" };
        } else if (trimester === "third") {
          ranges.tsh = { min: 0.3, max: 3.5, unit: "mIU/L" };
          ranges.ft4 = { min: 0.8, max: 1.4, unit: "ng/dL" };
        }
      }

      // 年龄调整
      if (ageNum >= 65) {
        ranges.tsh.max = 6.0; // 老年人TSH上限可适当放宽
      }

      return ranges;
    };

    const refRanges = getReferenceRanges();

    // 评估各项指标
    const evaluateIndicator = (value: number | null, range: any, name: string) => {
      if (value === null) return null;
      
      let status, color, interpretation;
      
      if (name === "antiTPO" || name === "antiTG") {
        if (value <= range.max) {
          status = "正常";
          color = "green";
          interpretation = "阴性";
        } else {
          status = "升高";
          color = "red";
          interpretation = "阳性，提示自身免疫性甲状腺疾病";
        }
      } else {
        if (value < range.min) {
          status = "偏低";
          color = "orange";
          interpretation = name === "tsh" ? "可能提示甲亢" : "可能提示甲减";
        } else if (value > range.max) {
          status = "偏高";
          color = "red";
          interpretation = name === "tsh" ? "可能提示甲减" : "可能提示甲亢";
        } else {
          status = "正常";
          color = "green";
          interpretation = "正常范围内";
        }
      }
      
      return {
        name,
        value,
        unit: range.unit,
        status,
        color,
        interpretation,
        range: name === "antiTPO" || name === "antiTG" ? 
          `<${range.max}` : 
          `${range.min}-${range.max}`
      };
    };

    const indicators = {
      tsh: evaluateIndicator(tshNum, refRanges.tsh, "TSH"),
      ft4: evaluateIndicator(ft4Num, refRanges.ft4, "FT4"),
      ft3: evaluateIndicator(ft3Num, refRanges.ft3, "FT3"),
      t4: evaluateIndicator(t4Num, refRanges.t4, "T4"),
      t3: evaluateIndicator(t3Num, refRanges.t3, "T3"),
      antiTPO: evaluateIndicator(antiTPONum, refRanges.antiTPO, "抗TPO抗体"),
      antiTG: evaluateIndicator(antiTGNum, refRanges.antiTG, "抗TG抗体"),
      thyroglobulin: evaluateIndicator(thyroglobulinNum, refRanges.thyroglobulin, "甲状腺球蛋白")
    };

    // 甲状腺功能诊断
    const getDiagnosis = () => {
      const tshStatus = indicators.tsh?.status;
      const ft4Status = indicators.ft4?.status;
      const ft3Status = indicators.ft3?.status;
      
      // 甲亢诊断
      if (tshStatus === "偏低") {
        if (ft4Status === "偏高" || ft3Status === "偏高") {
          return {
            condition: "甲状腺功能亢进症（甲亢）",
            type: "显性甲亢",
            severity: "明显",
            color: "red",
            description: "TSH抑制，FT4/FT3升高"
          };
        } else if (ft4Status === "正常" && ft3Status === "正常") {
          return {
            condition: "亚临床甲亢",
            type: "亚临床",
            severity: "轻度",
            color: "orange",
            description: "TSH抑制，FT4/FT3正常"
          };
        }
      }
      
      // 甲减诊断
      if (tshStatus === "偏高") {
        if (ft4Status === "偏低") {
          return {
            condition: "甲状腺功能减退症（甲减）",
            type: "显性甲减",
            severity: "明显",
            color: "red",
            description: "TSH升高，FT4降低"
          };
        } else if (ft4Status === "正常") {
          return {
            condition: "亚临床甲减",
            type: "亚临床",
            severity: "轻度",
            color: "orange",
            description: "TSH升高，FT4正常"
          };
        }
      }
      
      // 正常甲状腺功能
      if (tshStatus === "正常" && (ft4Status === "正常" || ft4Status === null)) {
        return {
          condition: "甲状腺功能正常",
          type: "正常",
          severity: "无",
          color: "green",
          description: "各项指标均在正常范围内"
        };
      }
      
      // 其他情况
      return {
        condition: "甲状腺功能异常",
        type: "待进一步评估",
        severity: "不明",
        color: "yellow",
        description: "指标异常，需要进一步检查"
      };
    };

    const diagnosis = getDiagnosis();

    // 自身免疫评估
    const getAutoImmuneAssessment = () => {
      const assessment = {
        risk: "低风险",
        color: "green",
        antibodies: [],
        interpretation: ""
      };
      
      if (indicators.antiTPO?.status === "升高") {
        assessment.antibodies.push("抗TPO抗体阳性");
        assessment.risk = "高风险";
        assessment.color = "red";
      }
      
      if (indicators.antiTG?.status === "升高") {
        assessment.antibodies.push("抗TG抗体阳性");
        assessment.risk = "高风险";
        assessment.color = "red";
      }
      
      if (assessment.antibodies.length > 0) {
        assessment.interpretation = "提示自身免疫性甲状腺疾病（如桥本甲状腺炎、Graves病）";
      } else {
        assessment.interpretation = "暂无自身免疫性甲状腺疾病证据";
      }
      
      return assessment;
    };

    const autoImmuneAssessment = getAutoImmuneAssessment();

    // 风险因子评估
    const getRiskFactors = () => {
      const riskFactors = {
        high: [],
        moderate: [],
        protective: []
      };
      
      // 高风险因子
      if (familyHistory) riskFactors.high.push("甲状腺疾病家族史");
      if (autoimmune) riskFactors.high.push("其他自身免疫性疾病");
      if (gender === "female") riskFactors.high.push("女性（甲状腺疾病高发）");
      if (pregnancy) riskFactors.high.push("妊娠期（甲状腺负荷增加）");
      if (ageNum >= 60) riskFactors.high.push("高龄（≥60岁）");
      if (radiation) riskFactors.high.push("既往放射线暴露史");
      if (iodineExposure) riskFactors.high.push("碘摄入异常");
      
      // 中等风险因子
      if (bmi && bmi >= 30) riskFactors.moderate.push("肥胖");
      if (medications.includes("lithium")) riskFactors.moderate.push("锂盐治疗");
      if (medications.includes("amiodarone")) riskFactors.moderate.push("胺碘酮治疗");
      if (medications.includes("interferon")) riskFactors.moderate.push("干扰素治疗");
      
      // 保护性因子
      if (medications.includes("levothyroxine")) riskFactors.protective.push("左甲状腺素替代治疗");
      if (medications.includes("methimazole")) riskFactors.protective.push("抗甲状腺药物治疗");
      
      return riskFactors;
    };

    const riskFactors = getRiskFactors();

    // 症状评估
    const getSymptomAssessment = () => {
      const symptomCategories = {
        hyperthyroid: [],
        hypothyroid: [],
        general: []
      };
      
      symptoms.forEach(symptom => {
        switch (symptom) {
          case "palpitations":
          case "weight-loss":
          case "heat-intolerance":
          case "sweating":
          case "tremor":
          case "anxiety":
          case "insomnia":
          case "diarrhea":
            symptomCategories.hyperthyroid.push(getSymptomName(symptom));
            break;
          case "fatigue":
          case "weight-gain":
          case "cold-intolerance":
          case "constipation":
          case "dry-skin":
          case "hair-loss":
          case "depression":
          case "memory-problems":
            symptomCategories.hypothyroid.push(getSymptomName(symptom));
            break;
          case "neck-swelling":
          case "voice-changes":
          case "difficulty-swallowing":
            symptomCategories.general.push(getSymptomName(symptom));
            break;
          default:
            break;
        }
      });
      
      return symptomCategories;
    };

    const getSymptomName = (symptom: string) => {
      const symptomMap: { [key: string]: string } = {
        "palpitations": "心悸",
        "weight-loss": "体重减轻",
        "heat-intolerance": "怕热",
        "sweating": "多汗",
        "tremor": "手抖",
        "anxiety": "焦虑",
        "insomnia": "失眠",
        "diarrhea": "腹泻",
        "fatigue": "疲劳乏力",
        "weight-gain": "体重增加",
        "cold-intolerance": "怕冷",
        "constipation": "便秘",
        "dry-skin": "皮肤干燥",
        "hair-loss": "脱发",
        "depression": "抑郁",
        "memory-problems": "记忆力减退",
        "neck-swelling": "颈部肿大",
        "voice-changes": "声音改变",
        "difficulty-swallowing": "吞咽困难"
      };
      return symptomMap[symptom] || symptom;
    };

    const symptomAssessment = getSymptomAssessment();

    // 治疗建议
    const getTreatmentRecommendations = () => {
      const recommendations = {
        immediate: [],
        medication: [],
        lifestyle: [],
        monitoring: [],
        followUp: []
      };
      
      // 立即处理
      if (diagnosis.severity === "明显") {
        recommendations.immediate.push("建议尽快就医，开始专科治疗");
      } else if (diagnosis.severity === "轻度") {
        recommendations.immediate.push("建议内分泌科就诊，评估治疗必要性");
      }
      
      // 药物治疗
      if (diagnosis.condition.includes("甲亢")) {
        recommendations.medication = [
          "抗甲状腺药物（甲巯咪唑、丙硫氧嘧啶）",
          "β受体阻滞剂（控制心率和震颤）",
          "必要时考虑放射性碘治疗或手术"
        ];
      } else if (diagnosis.condition.includes("甲减")) {
        recommendations.medication = [
          "左甲状腺素钠片替代治疗",
          "从小剂量开始，逐渐调整至目标剂量",
          "空腹服用，避免与其他药物同时服用"
        ];
      }
      
      // 生活方式
      recommendations.lifestyle = [
        "均衡饮食，适量碘摄入",
        "规律作息，充足睡眠",
        "适度运动，避免过度劳累",
        "戒烟限酒",
        "避免精神压力过大",
        "定期监测甲状腺功能"
      ];
      
      if (diagnosis.condition.includes("甲亢")) {
        recommendations.lifestyle.push("避免含碘食物和药物");
        recommendations.lifestyle.push("避免剧烈运动");
      } else if (diagnosis.condition.includes("甲减")) {
        recommendations.lifestyle.push("适量补充碘");
        recommendations.lifestyle.push("注意保暖");
      }
      
      // 监测建议
      if (diagnosis.severity === "明显") {
        recommendations.monitoring = [
          "治疗初期每4-6周复查甲状腺功能",
          "稳定后每3-6个月复查",
          "监测心率、血压变化",
          "注意药物副作用"
        ];
      } else if (diagnosis.severity === "轻度") {
        recommendations.monitoring = [
          "每3-6个月复查甲状腺功能",
          "监测症状变化",
          "评估是否需要治疗"
        ];
      } else {
        recommendations.monitoring = [
          "每年常规体检时检查甲状腺功能",
          "注意甲状腺疾病相关症状"
        ];
      }
      
      // 随访建议
      if (pregnancy) {
        recommendations.followUp = [
          "妊娠期每4-6周监测甲状腺功能",
          "产后6-12周复查",
          "哺乳期注意药物安全性"
        ];
      } else {
        recommendations.followUp = [
          "按医嘱定期复查",
          "症状变化时及时就医",
          "长期随访评估"
        ];
      }
      
      return recommendations;
    };

    const treatmentRec = getTreatmentRecommendations();

    // 饮食建议
    const getDietaryRecommendations = () => {
      const dietary = {
        iodine: "",
        foods: {
          recommended: [],
          avoid: []
        },
        supplements: [],
        notes: []
      };
      
      if (diagnosis.condition.includes("甲亢")) {
        dietary.iodine = "限制碘摄入";
        dietary.foods.avoid = [
          "海带、紫菜等海藻类",
          "海鱼、海虾等海产品",
          "加碘盐",
          "含碘药物和造影剂"
        ];
        dietary.foods.recommended = [
          "新鲜蔬菜水果",
          "优质蛋白质",
          "全谷物食品",
          "坚果类（适量）"
        ];
        dietary.supplements = ["维生素D", "钙剂（如需要）"];
        dietary.notes = [
          "避免咖啡因和酒精",
          "少食多餐",
          "充足水分摄入"
        ];
      } else if (diagnosis.condition.includes("甲减")) {
        dietary.iodine = "适量碘摄入";
        dietary.foods.recommended = [
          "含碘食物（适量）",
          "富含硒的食物",
          "优质蛋白质",
          "富含纤维的食物"
        ];
        dietary.foods.avoid = [
          "生的十字花科蔬菜（大量）",
          "大豆制品（与药物间隔）",
          "高脂肪食物",
          "精制糖类"
        ];
        dietary.supplements = ["维生素D", "维生素B12", "铁剂（如缺乏）"];
        dietary.notes = [
          "控制体重",
          "规律饮食",
          "避免生冷食物"
        ];
      } else {
        dietary.iodine = "正常碘摄入";
        dietary.foods.recommended = [
          "均衡营养",
          "新鲜蔬菜水果",
          "适量海产品",
          "全谷物食品"
        ];
        dietary.notes = [
          "维持健康体重",
          "规律饮食",
          "适量运动"
        ];
      }
      
      return dietary;
    };

    const dietaryRec = getDietaryRecommendations();

    setResult({
      diagnosis,
      indicators,
      autoImmuneAssessment,
      riskFactors,
      symptoms: symptomAssessment,
      treatment: treatmentRec,
      dietary: dietaryRec,
      bmi,
      referenceRanges: refRanges,
      assessmentFactors: {
        age: ageNum,
        gender,
        weight: weightNum,
        height: heightNum,
        pregnancy,
        trimester,
        medications,
        symptoms
      }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setTsh("");
    setFt4("");
    setFt3("");
    setT4("");
    setT3("");
    setAntiTPO("");
    setAntiTG("");
    setThyroglobulin("");
    setPregnancy(false);
    setTrimester("");
    setMedications([]);
    setSymptoms([]);
    setFamilyHistory(false);
    setAutoimmune(false);
    setIodineExposure(false);
    setRadiation(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🦋 甲状腺功能评估计算器</h1>
          <p className="text-lg text-gray-600">
            评估甲状腺功能状态，诊断甲亢、甲减等疾病，制定个性化治疗方案
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
                      placeholder="例如：65"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">身高 (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="例如：165"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pregnancy"
                      checked={pregnancy}
                      onCheckedChange={setPregnancy}
                    />
                    <Label htmlFor="pregnancy">妊娠期</Label>
                  </div>
                  
                  {pregnancy && (
                    <div>
                      <Label htmlFor="trimester">妊娠期</Label>
                      <Select value={trimester} onValueChange={setTrimester}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择妊娠期" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first">早期（1-12周）</SelectItem>
                          <SelectItem value="second">中期（13-27周）</SelectItem>
                          <SelectItem value="third">晚期（28-40周）</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 甲状腺功能检查 */}
            <Card>
              <CardHeader>
                <CardTitle>甲状腺功能检查</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tsh">TSH (mIU/L) *</Label>
                    <Input
                      id="tsh"
                      type="number"
                      step="0.01"
                      placeholder="例如：2.5"
                      value={tsh}
                      onChange={(e) => setTsh(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ft4">FT4 (ng/dL)</Label>
                    <Input
                      id="ft4"
                      type="number"
                      step="0.01"
                      placeholder="例如：1.2"
                      value={ft4}
                      onChange={(e) => setFt4(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ft3">FT3 (pg/mL)</Label>
                    <Input
                      id="ft3"
                      type="number"
                      step="0.01"
                      placeholder="例如：3.2"
                      value={ft3}
                      onChange={(e) => setFt3(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="t4">T4 (μg/dL)</Label>
                    <Input
                      id="t4"
                      type="number"
                      step="0.1"
                      placeholder="例如：8.5"
                      value={t4}
                      onChange={(e) => setT4(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="t3">T3 (ng/dL)</Label>
                  <Input
                    id="t3"
                    type="number"
                    step="1"
                    placeholder="例如：120"
                    value={t3}
                    onChange={(e) => setT3(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 自身免疫指标 */}
            <Card>
              <CardHeader>
                <CardTitle>自身免疫指标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="antiTPO">抗TPO抗体 (IU/mL)</Label>
                    <Input
                      id="antiTPO"
                      type="number"
                      step="0.1"
                      placeholder="例如：25"
                      value={antiTPO}
                      onChange={(e) => setAntiTPO(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="antiTG">抗TG抗体 (IU/mL)</Label>
                    <Input
                      id="antiTG"
                      type="number"
                      step="0.1"
                      placeholder="例如：30"
                      value={antiTG}
                      onChange={(e) => setAntiTG(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="thyroglobulin">甲状腺球蛋白 (ng/mL)</Label>
                  <Input
                    id="thyroglobulin"
                    type="number"
                    step="0.1"
                    placeholder="例如：15"
                    value={thyroglobulin}
                    onChange={(e) => setThyroglobulin(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 既往史和危险因素 */}
            <Card>
              <CardHeader>
                <CardTitle>既往史和危险因素</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="familyHistory"
                    checked={familyHistory}
                    onCheckedChange={setFamilyHistory}
                  />
                  <Label htmlFor="familyHistory">甲状腺疾病家族史</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoimmune"
                    checked={autoimmune}
                    onCheckedChange={setAutoimmune}
                  />
                  <Label htmlFor="autoimmune">其他自身免疫性疾病</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="iodineExposure"
                    checked={iodineExposure}
                    onCheckedChange={setIodineExposure}
                  />
                  <Label htmlFor="iodineExposure">碘摄入异常</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="radiation"
                    checked={radiation}
                    onCheckedChange={setRadiation}
                  />
                  <Label htmlFor="radiation">既往放射线暴露史</Label>
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
                    { id: "levothyroxine", label: "左甲状腺素" },
                    { id: "methimazole", label: "甲巯咪唑" },
                    { id: "propylthiouracil", label: "丙硫氧嘧啶" },
                    { id: "lithium", label: "锂盐" },
                    { id: "amiodarone", label: "胺碘酮" },
                    { id: "interferon", label: "干扰素" },
                    { id: "biotin", label: "生物素" },
                    { id: "steroids", label: "糖皮质激素" }
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">甲亢相关症状</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "palpitations", label: "心悸" },
                        { id: "weight-loss", label: "体重减轻" },
                        { id: "heat-intolerance", label: "怕热" },
                        { id: "sweating", label: "多汗" },
                        { id: "tremor", label: "手抖" },
                        { id: "anxiety", label: "焦虑" },
                        { id: "insomnia", label: "失眠" },
                        { id: "diarrhea", label: "腹泻" }
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
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">甲减相关症状</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "fatigue", label: "疲劳乏力" },
                        { id: "weight-gain", label: "体重增加" },
                        { id: "cold-intolerance", label: "怕冷" },
                        { id: "constipation", label: "便秘" },
                        { id: "dry-skin", label: "皮肤干燥" },
                        { id: "hair-loss", label: "脱发" },
                        { id: "depression", label: "抑郁" },
                        { id: "memory-problems", label: "记忆力减退" }
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
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-purple-600 mb-2">其他症状</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "neck-swelling", label: "颈部肿大" },
                        { id: "voice-changes", label: "声音改变" },
                        { id: "difficulty-swallowing", label: "吞咽困难" }
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
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={calculateThyroidFunction} className="flex-1">
                评估甲状腺功能
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
                    <CardTitle>甲状腺功能评估结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border text-center ${
                      result.diagnosis.color === "green" ? "bg-green-50 border-green-200" :
                      result.diagnosis.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                      result.diagnosis.color === "orange" ? "bg-orange-50 border-orange-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        result.diagnosis.color === "green" ? "text-green-700" :
                        result.diagnosis.color === "yellow" ? "text-yellow-700" :
                        result.diagnosis.color === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        {result.diagnosis.condition}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {result.diagnosis.description}
                      </div>
                      <div className="text-lg font-semibold">
                        类型: {result.diagnosis.type} | 严重程度: {result.diagnosis.severity}
                      </div>
                    </div>

                    {/* 自身免疫评估 */}
                    <div className={`p-3 rounded border ${
                      result.autoImmuneAssessment.color === "green" ? "bg-green-50 border-green-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className="font-medium mb-2">自身免疫评估: {result.autoImmuneAssessment.risk}</div>
                      {result.autoImmuneAssessment.antibodies.length > 0 && (
                        <div className="text-sm mb-2">
                          {result.autoImmuneAssessment.antibodies.join("、")}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        {result.autoImmuneAssessment.interpretation}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 检查指标详情 */}
                <Card>
                  <CardHeader>
                    <CardTitle>检查指标详情</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.values(result.indicators).filter((indicator: any) => indicator !== null).map((indicator: any, i: number) => (
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
                          <div className="text-sm mb-1">
                            检测值: {indicator.value} {indicator.unit}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            参考范围: {indicator.range} {indicator.unit}
                          </div>
                          <div className="text-xs text-gray-600">
                            {indicator.interpretation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 详细分析 */}
                <Tabs defaultValue="treatment" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="treatment">治疗建议</TabsTrigger>
                    <TabsTrigger value="diet">饮食指导</TabsTrigger>
                    <TabsTrigger value="risks">风险因子</TabsTrigger>
                    <TabsTrigger value="symptoms">症状分析</TabsTrigger>
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
                        
                        {result.treatment.medication.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">药物治疗</h4>
                            <ul className="text-sm space-y-1">
                              {result.treatment.medication.map((item: string, i: number) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">生活方式干预</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatment.lifestyle.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-purple-700 mb-2">监测建议</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatment.monitoring.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-orange-700 mb-2">随访建议</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatment.followUp.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="diet">
                    <Card>
                      <CardHeader>
                        <CardTitle>饮食指导</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded">
                          <h4 className="font-medium text-blue-700 mb-2">碘摄入建议</h4>
                          <p className="text-sm">{result.dietary.iodine}</p>
                        </div>
                        
                        {result.dietary.foods.recommended.length > 0 && (
                          <div className="p-3 bg-green-50 rounded">
                            <h4 className="font-medium text-green-700 mb-2">推荐食物</h4>
                            <ul className="text-sm space-y-1">
                              {result.dietary.foods.recommended.map((food: string, i: number) => (
                                <li key={i}>• {food}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.dietary.foods.avoid.length > 0 && (
                          <div className="p-3 bg-red-50 rounded">
                            <h4 className="font-medium text-red-700 mb-2">避免食物</h4>
                            <ul className="text-sm space-y-1">
                              {result.dietary.foods.avoid.map((food: string, i: number) => (
                                <li key={i}>• {food}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.dietary.supplements.length > 0 && (
                          <div className="p-3 bg-purple-50 rounded">
                            <h4 className="font-medium text-purple-700 mb-2">营养补充</h4>
                            <ul className="text-sm space-y-1">
                              {result.dietary.supplements.map((supplement: string, i: number) => (
                                <li key={i}>• {supplement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.dietary.notes.length > 0 && (
                          <div className="p-3 bg-yellow-50 rounded">
                            <h4 className="font-medium text-yellow-700 mb-2">注意事项</h4>
                            <ul className="text-sm space-y-1">
                              {result.dietary.notes.map((note: string, i: number) => (
                                <li key={i}>• {note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Alert>
                          <AlertDescription>
                            饮食建议应在医生指导下个性化调整，定期评估甲状腺功能。
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
                            积极控制可改变的风险因子，定期监测甲状腺功能变化。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="symptoms">
                    <Card>
                      <CardHeader>
                        <CardTitle>症状分析</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.symptoms.hyperthyroid.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">甲亢相关症状</h4>
                            <ul className="text-sm space-y-1">
                              {result.symptoms.hyperthyroid.map((symptom: string, i: number) => (
                                <li key={i} className="text-red-600">• {symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.symptoms.hypothyroid.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">甲减相关症状</h4>
                            <ul className="text-sm space-y-1">
                              {result.symptoms.hypothyroid.map((symptom: string, i: number) => (
                                <li key={i} className="text-blue-600">• {symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.symptoms.general.length > 0 && (
                          <div>
                            <h4 className="font-medium text-purple-700 mb-2">其他症状</h4>
                            <ul className="text-sm space-y-1">
                              {result.symptoms.general.map((symptom: string, i: number) => (
                                <li key={i} className="text-purple-600">• {symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.symptoms.hyperthyroid.length === 0 && result.symptoms.hypothyroid.length === 0 && result.symptoms.general.length === 0 && (
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

        {/* 甲状腺知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🦋 甲状腺知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">甲状腺的作用</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 调节新陈代谢和能量消耗</li>
                  <li>• 影响心率和血压</li>
                  <li>• 调节体温</li>
                  <li>• 影响生长发育</li>
                  <li>• 调节情绪和认知功能</li>
                  <li>• 影响生殖功能</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">常见甲状腺疾病</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <strong>甲亢：</strong>甲状腺激素分泌过多</li>
                  <li>• <strong>甲减：</strong>甲状腺激素分泌不足</li>
                  <li>• <strong>桥本甲状腺炎：</strong>自身免疫性甲状腺炎</li>
                  <li>• <strong>Graves病：</strong>自身免疫性甲亢</li>
                  <li>• <strong>甲状腺结节：</strong>甲状腺内肿块</li>
                  <li>• <strong>甲状腺癌：</strong>甲状腺恶性肿瘤</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">检查指标说明</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <strong>TSH：</strong>促甲状腺激素，最敏感的筛查指标</li>
                  <li>• <strong>FT4：</strong>游离甲状腺素，反映甲状腺功能</li>
                  <li>• <strong>FT3：</strong>游离三碘甲状腺原氨酸，活性最强</li>
                  <li>• <strong>抗TPO抗体：</strong>自身免疫标志物</li>
                  <li>• <strong>抗TG抗体：</strong>自身免疫标志物</li>
                  <li>• <strong>甲状腺球蛋白：</strong>甲状腺癌监测指标</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">预防措施</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 适量碘摄入，避免过多或过少</li>
                  <li>• 定期体检，早期发现异常</li>
                  <li>• 避免过度压力</li>
                  <li>• 戒烟限酒</li>
                  <li>• 避免不必要的放射线暴露</li>
                  <li>• 合理使用影响甲状腺的药物</li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">⚠️ 重要提醒</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 本计算器仅供参考，不能替代专业医学诊断</li>
                <li>• 甲状腺功能异常需要专科医生综合评估</li>
                <li>• 妊娠期甲状腺功能管理需要特别关注</li>
                <li>• 定期复查甲状腺功能，监测病情变化</li>
                <li>• 如有异常结果，请及时就医</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}