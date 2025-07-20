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

export default function LiverFunctionCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [alt, setAlt] = useState("");
  const [ast, setAst] = useState("");
  const [alp, setAlp] = useState("");
  const [ggt, setGgt] = useState("");
  const [bilirubin, setBilirubin] = useState("");
  const [directBilirubin, setDirectBilirubin] = useState("");
  const [albumin, setAlbumin] = useState("");
  const [totalProtein, setTotalProtein] = useState("");
  const [pt, setPt] = useState("");
  const [inr, setInr] = useState("");
  const [platelet, setPlatelet] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const calculateLiverFunction = () => {
    if (!age || !gender || !alt || !ast) {
      alert("请填写必要信息（年龄、性别、ALT、AST）");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = weight ? parseFloat(weight) : null;
    const heightNum = height ? parseFloat(height) : null;
    const altNum = parseFloat(alt);
    const astNum = parseFloat(ast);
    const alpNum = alp ? parseFloat(alp) : null;
    const ggtNum = ggt ? parseFloat(ggt) : null;
    const bilirubinNum = bilirubin ? parseFloat(bilirubin) : null;
    const directBilirubinNum = directBilirubin ? parseFloat(directBilirubin) : null;
    const albuminNum = albumin ? parseFloat(albumin) : null;
    const totalProteinNum = totalProtein ? parseFloat(totalProtein) : null;
    const ptNum = pt ? parseFloat(pt) : null;
    const inrNum = inr ? parseFloat(inr) : null;
    const plateletNum = platelet ? parseFloat(platelet) : null;
    const alcoholNum = alcohol ? parseFloat(alcohol) : 0;

    if (ageNum <= 0 || ageNum > 120 || altNum < 0 || astNum < 0) {
      alert("请输入有效的数值");
      return;
    }

    // 计算BMI
    const bmi = weightNum && heightNum ? weightNum / Math.pow(heightNum / 100, 2) : null;

    // 获取参考范围
    const getReferenceRanges = () => {
      const ranges = {
        alt: { min: 7, max: gender === "male" ? 56 : 35, unit: "U/L" },
        ast: { min: 10, max: gender === "male" ? 40 : 31, unit: "U/L" },
        alp: { min: 44, max: gender === "male" ? 147 : 104, unit: "U/L" },
        ggt: { min: 9, max: gender === "male" ? 64 : 36, unit: "U/L" },
        bilirubin: { min: 0.3, max: 1.2, unit: "mg/dL" },
        directBilirubin: { min: 0.0, max: 0.3, unit: "mg/dL" },
        albumin: { min: 3.5, max: 5.0, unit: "g/dL" },
        totalProtein: { min: 6.3, max: 8.2, unit: "g/dL" },
        pt: { min: 11, max: 13, unit: "秒" },
        inr: { min: 0.8, max: 1.1, unit: "" },
        platelet: { min: 150, max: 450, unit: "×10³/μL" }
      };

      // 年龄调整
      if (ageNum >= 65) {
        ranges.alt.max = Math.round(ranges.alt.max * 1.2);
        ranges.ast.max = Math.round(ranges.ast.max * 1.2);
        ranges.alp.max = Math.round(ranges.alp.max * 1.3);
      }

      return ranges;
    };

    const refRanges = getReferenceRanges();

    // 评估各项指标
    const evaluateIndicator = (value: number | null, range: any, name: string) => {
      if (value === null) return null;
      
      let status, color, interpretation, severity;
      
      if (value < range.min) {
        status = "偏低";
        color = "blue";
        severity = "轻度";
        if (name === "albumin" || name === "totalProtein") {
          interpretation = "可能提示营养不良或肝脏合成功能减退";
        } else if (name === "platelet") {
          interpretation = "血小板减少，可能提示脾功能亢进";
        } else {
          interpretation = "低于正常范围";
        }
      } else if (value > range.max) {
        const fold = value / range.max;
        if (fold >= 3) {
          status = "显著升高";
          color = "red";
          severity = "重度";
        } else if (fold >= 2) {
          status = "明显升高";
          color = "red";
          severity = "中度";
        } else {
          status = "轻度升高";
          color = "orange";
          severity = "轻度";
        }
        
        if (name === "alt" || name === "ast") {
          interpretation = "肝细胞损伤";
        } else if (name === "alp" || name === "ggt") {
          interpretation = "胆汁淤积或胆道疾病";
        } else if (name === "bilirubin") {
          interpretation = "黄疸，肝功能异常";
        } else if (name === "pt" || name === "inr") {
          interpretation = "凝血功能异常";
        } else {
          interpretation = "高于正常范围";
        }
      } else {
        status = "正常";
        color = "green";
        severity = "无";
        interpretation = "正常范围内";
      }
      
      return {
        name,
        value,
        unit: range.unit,
        status,
        color,
        severity,
        interpretation,
        range: `${range.min}-${range.max}`,
        fold: value / range.max
      };
    };

    const indicators = {
      alt: evaluateIndicator(altNum, refRanges.alt, "ALT"),
      ast: evaluateIndicator(astNum, refRanges.ast, "AST"),
      alp: evaluateIndicator(alpNum, refRanges.alp, "ALP"),
      ggt: evaluateIndicator(ggtNum, refRanges.ggt, "GGT"),
      bilirubin: evaluateIndicator(bilirubinNum, refRanges.bilirubin, "总胆红素"),
      directBilirubin: evaluateIndicator(directBilirubinNum, refRanges.directBilirubin, "直接胆红素"),
      albumin: evaluateIndicator(albuminNum, refRanges.albumin, "白蛋白"),
      totalProtein: evaluateIndicator(totalProteinNum, refRanges.totalProtein, "总蛋白"),
      pt: evaluateIndicator(ptNum, refRanges.pt, "凝血酶原时间"),
      inr: evaluateIndicator(inrNum, refRanges.inr, "INR"),
      platelet: evaluateIndicator(plateletNum, refRanges.platelet, "血小板")
    };

    // 计算AST/ALT比值
    const astAltRatio = astNum / altNum;
    const astAltInterpretation = {
      ratio: astAltRatio,
      interpretation: astAltRatio > 2 ? "提示酒精性肝病或肝硬化" :
                     astAltRatio > 1 ? "可能提示慢性肝病" :
                     "急性肝细胞损伤可能性大"
    };

    // 肝功能分级评估
    const getLiverFunctionGrade = () => {
      let score = 0;
      let abnormalCount = 0;
      
      // 转氨酶评分
      if (indicators.alt?.severity === "重度" || indicators.ast?.severity === "重度") {
        score += 3;
        abnormalCount++;
      } else if (indicators.alt?.severity === "中度" || indicators.ast?.severity === "中度") {
        score += 2;
        abnormalCount++;
      } else if (indicators.alt?.severity === "轻度" || indicators.ast?.severity === "轻度") {
        score += 1;
        abnormalCount++;
      }
      
      // 胆红素评分
      if (indicators.bilirubin?.severity === "重度") {
        score += 3;
        abnormalCount++;
      } else if (indicators.bilirubin?.severity === "中度") {
        score += 2;
        abnormalCount++;
      } else if (indicators.bilirubin?.severity === "轻度") {
        score += 1;
        abnormalCount++;
      }
      
      // 白蛋白评分
      if (indicators.albumin?.status === "偏低") {
        if (albuminNum && albuminNum < 2.8) {
          score += 3;
        } else if (albuminNum && albuminNum < 3.2) {
          score += 2;
        } else {
          score += 1;
        }
        abnormalCount++;
      }
      
      // 凝血功能评分
      if (indicators.pt?.severity === "重度" || indicators.inr?.severity === "重度") {
        score += 3;
        abnormalCount++;
      } else if (indicators.pt?.severity === "中度" || indicators.inr?.severity === "中度") {
        score += 2;
        abnormalCount++;
      } else if (indicators.pt?.severity === "轻度" || indicators.inr?.severity === "轻度") {
        score += 1;
        abnormalCount++;
      }
      
      let grade, description, color;
      
      if (score === 0) {
        grade = "正常";
        description = "肝功能正常";
        color = "green";
      } else if (score <= 3) {
        grade = "轻度异常";
        description = "肝功能轻度受损";
        color = "yellow";
      } else if (score <= 6) {
        grade = "中度异常";
        description = "肝功能中度受损";
        color = "orange";
      } else {
        grade = "重度异常";
        description = "肝功能重度受损";
        color = "red";
      }
      
      return {
        grade,
        description,
        color,
        score,
        abnormalCount
      };
    };

    const liverGrade = getLiverFunctionGrade();

    // Child-Pugh评分（如果有足够数据）
    const getChildPughScore = () => {
      if (!bilirubinNum || !albuminNum || !ptNum) {
        return null;
      }
      
      let score = 0;
      let details = [];
      
      // 胆红素评分
      if (bilirubinNum < 2) {
        score += 1;
        details.push("胆红素: 1分");
      } else if (bilirubinNum <= 3) {
        score += 2;
        details.push("胆红素: 2分");
      } else {
        score += 3;
        details.push("胆红素: 3分");
      }
      
      // 白蛋白评分
      if (albuminNum > 3.5) {
        score += 1;
        details.push("白蛋白: 1分");
      } else if (albuminNum >= 2.8) {
        score += 2;
        details.push("白蛋白: 2分");
      } else {
        score += 3;
        details.push("白蛋白: 3分");
      }
      
      // PT评分
      if (ptNum < 4) {
        score += 1;
        details.push("PT延长: 1分");
      } else if (ptNum <= 6) {
        score += 2;
        details.push("PT延长: 2分");
      } else {
        score += 3;
        details.push("PT延长: 3分");
      }
      
      let grade, prognosis;
      if (score <= 6) {
        grade = "A级";
        prognosis = "预后良好，1年生存率>95%";
      } else if (score <= 9) {
        grade = "B级";
        prognosis = "预后中等，1年生存率80-90%";
      } else {
        grade = "C级";
        prognosis = "预后差，1年生存率45-65%";
      }
      
      return {
        score,
        grade,
        prognosis,
        details
      };
    };

    const childPugh = getChildPughScore();

    // 肝病类型推测
    const getLiverDiseaseType = () => {
      const types = [];
      
      // 酒精性肝病
      if (alcoholNum > 20 || astAltRatio > 2) {
        types.push({
          type: "酒精性肝病",
          probability: "高",
          evidence: ["AST/ALT比值>2", "饮酒史"],
          color: "red"
        });
      }
      
      // 病毒性肝炎
      if (indicators.alt?.severity !== "无" && indicators.ast?.severity !== "无" && astAltRatio < 1.5) {
        types.push({
          type: "病毒性肝炎",
          probability: "中",
          evidence: ["转氨酶升高", "ALT>AST"],
          color: "orange"
        });
      }
      
      // 胆汁淤积性肝病
      if (indicators.alp?.severity !== "无" || indicators.ggt?.severity !== "无") {
        types.push({
          type: "胆汁淤积性肝病",
          probability: "中",
          evidence: ["ALP或GGT升高"],
          color: "yellow"
        });
      }
      
      // 脂肪肝
      if (bmi && bmi >= 25 && indicators.alt?.severity === "轻度") {
        types.push({
          type: "非酒精性脂肪肝",
          probability: "中",
          evidence: ["BMI≥25", "轻度转氨酶升高"],
          color: "blue"
        });
      }
      
      // 肝硬化
      if (indicators.albumin?.status === "偏低" && indicators.platelet?.status === "偏低" && astAltRatio > 1) {
        types.push({
          type: "肝硬化",
          probability: "中",
          evidence: ["白蛋白降低", "血小板减少", "AST/ALT>1"],
          color: "red"
        });
      }
      
      return types;
    };

    const diseaseTypes = getLiverDiseaseType();

    // 风险评估
    const getRiskAssessment = () => {
      const risks = {
        high: [],
        moderate: [],
        low: []
      };
      
      // 高风险因子
      if (alcoholNum > 40) risks.high.push("重度饮酒（>40g/天）");
      if (riskFactors.includes("hepatitis-b")) risks.high.push("乙型肝炎感染");
      if (riskFactors.includes("hepatitis-c")) risks.high.push("丙型肝炎感染");
      if (medications.includes("acetaminophen")) risks.high.push("对乙酰氨基酚使用");
      if (riskFactors.includes("family-history")) risks.high.push("肝病家族史");
      
      // 中等风险因子
      if (alcoholNum > 20) risks.moderate.push("中度饮酒（20-40g/天）");
      if (bmi && bmi >= 30) risks.moderate.push("肥胖（BMI≥30）");
      if (riskFactors.includes("diabetes")) risks.moderate.push("糖尿病");
      if (medications.includes("statins")) risks.moderate.push("他汀类药物使用");
      if (ageNum >= 60) risks.moderate.push("高龄（≥60岁）");
      
      // 低风险因子
      if (alcoholNum <= 10) risks.low.push("低度饮酒或不饮酒");
      if (bmi && bmi >= 18.5 && bmi < 25) risks.low.push("正常体重");
      if (riskFactors.includes("exercise")) risks.low.push("规律运动");
      
      return risks;
    };

    const riskAssessment = getRiskAssessment();

    // 治疗建议
    const getTreatmentRecommendations = () => {
      const recommendations = {
        immediate: [],
        lifestyle: [],
        medication: [],
        monitoring: [],
        followUp: []
      };
      
      // 立即处理
      if (liverGrade.grade === "重度异常") {
        recommendations.immediate.push("建议立即就医，进行专科评估");
        recommendations.immediate.push("避免肝毒性药物和酒精");
      } else if (liverGrade.grade === "中度异常") {
        recommendations.immediate.push("建议消化科或肝病科就诊");
      }
      
      // 生活方式
      recommendations.lifestyle = [
        "戒酒或严格限制饮酒",
        "均衡饮食，控制体重",
        "规律运动，每周至少150分钟中等强度运动",
        "充足睡眠，避免熬夜",
        "避免肝毒性药物和保健品",
        "接种甲肝、乙肝疫苗"
      ];
      
      // 药物治疗
      if (diseaseTypes.some(d => d.type.includes("病毒性"))) {
        recommendations.medication.push("抗病毒治疗（如适用）");
      }
      if (diseaseTypes.some(d => d.type.includes("脂肪肝"))) {
        recommendations.medication.push("考虑护肝药物");
        recommendations.medication.push("控制血糖、血脂");
      }
      if (indicators.bilirubin?.severity !== "无") {
        recommendations.medication.push("利胆药物（如适用）");
      }
      
      // 监测建议
      if (liverGrade.grade === "重度异常") {
        recommendations.monitoring = [
          "每2-4周复查肝功能",
          "监测凝血功能",
          "定期腹部超声检查",
          "监测并发症"
        ];
      } else if (liverGrade.grade === "中度异常") {
        recommendations.monitoring = [
          "每1-3个月复查肝功能",
          "每6个月腹部超声检查",
          "监测病情进展"
        ];
      } else {
        recommendations.monitoring = [
          "每6-12个月复查肝功能",
          "年度体检时关注肝脏健康"
        ];
      }
      
      // 随访建议
      recommendations.followUp = [
        "定期专科随访",
        "监测肝功能变化趋势",
        "评估治疗效果",
        "调整治疗方案"
      ];
      
      return recommendations;
    };

    const treatmentRec = getTreatmentRecommendations();

    // 饮食建议
    const getDietaryRecommendations = () => {
      const dietary = {
        recommended: [],
        avoid: [],
        supplements: [],
        notes: []
      };
      
      // 推荐食物
      dietary.recommended = [
        "优质蛋白质：鱼类、瘦肉、蛋类、豆制品",
        "新鲜蔬菜水果：富含维生素和抗氧化剂",
        "全谷物：燕麦、糙米、全麦面包",
        "坚果类：核桃、杏仁（适量）",
        "橄榄油：富含不饱和脂肪酸",
        "绿茶：具有保肝作用"
      ];
      
      // 避免食物
      dietary.avoid = [
        "酒精：完全戒酒或严格限制",
        "高脂肪食物：油炸食品、肥肉",
        "加工食品：罐头、腌制品",
        "高糖食物：甜点、含糖饮料",
        "霉变食物：含黄曲霉毒素",
        "生或半生食物：避免感染"
      ];
      
      // 营养补充
      if (liverGrade.grade !== "正常") {
        dietary.supplements = [
          "维生素B族：支持肝脏代谢",
          "维生素E：抗氧化作用",
          "奶蓟草：护肝作用",
          "α-硫辛酸：抗氧化"
        ];
      }
      
      // 注意事项
      dietary.notes = [
        "少食多餐，避免暴饮暴食",
        "充足水分摄入",
        "控制总热量摄入",
        "避免空腹饮酒",
        "注意食品安全和卫生"
      ];
      
      return dietary;
    };

    const dietaryRec = getDietaryRecommendations();

    setResult({
      liverGrade,
      indicators,
      astAltRatio: astAltInterpretation,
      childPugh,
      diseaseTypes,
      riskAssessment,
      treatment: treatmentRec,
      dietary: dietaryRec,
      bmi,
      referenceRanges: refRanges,
      assessmentFactors: {
        age: ageNum,
        gender,
        weight: weightNum,
        height: heightNum,
        alcohol: alcoholNum,
        medications,
        symptoms,
        riskFactors
      }
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setHeight("");
    setAlt("");
    setAst("");
    setAlp("");
    setGgt("");
    setBilirubin("");
    setDirectBilirubin("");
    setAlbumin("");
    setTotalProtein("");
    setPt("");
    setInr("");
    setPlatelet("");
    setAlcohol("");
    setMedications([]);
    setSymptoms([]);
    setRiskFactors([]);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🫀 肝功能评估计算器</h1>
          <p className="text-lg text-gray-600">
            评估肝功能状态，诊断肝脏疾病，制定个性化治疗和护肝方案
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
                  <Label htmlFor="alcohol">日均饮酒量 (g)</Label>
                  <Input
                    id="alcohol"
                    type="number"
                    step="0.1"
                    placeholder="例如：20（1瓶啤酒约20g酒精）"
                    value={alcohol}
                    onChange={(e) => setAlcohol(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    参考：1瓶啤酒≈20g，1两白酒≈20g，1杯红酒≈12g
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 肝功能检查 */}
            <Card>
              <CardHeader>
                <CardTitle>肝功能检查</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alt">ALT (U/L) *</Label>
                    <Input
                      id="alt"
                      type="number"
                      step="0.1"
                      placeholder="例如：25"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ast">AST (U/L) *</Label>
                    <Input
                      id="ast"
                      type="number"
                      step="0.1"
                      placeholder="例如：30"
                      value={ast}
                      onChange={(e) => setAst(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alp">ALP (U/L)</Label>
                    <Input
                      id="alp"
                      type="number"
                      step="0.1"
                      placeholder="例如：80"
                      value={alp}
                      onChange={(e) => setAlp(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ggt">GGT (U/L)</Label>
                    <Input
                      id="ggt"
                      type="number"
                      step="0.1"
                      placeholder="例如：35"
                      value={ggt}
                      onChange={(e) => setGgt(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bilirubin">总胆红素 (mg/dL)</Label>
                    <Input
                      id="bilirubin"
                      type="number"
                      step="0.1"
                      placeholder="例如：0.8"
                      value={bilirubin}
                      onChange={(e) => setBilirubin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="directBilirubin">直接胆红素 (mg/dL)</Label>
                    <Input
                      id="directBilirubin"
                      type="number"
                      step="0.1"
                      placeholder="例如：0.2"
                      value={directBilirubin}
                      onChange={(e) => setDirectBilirubin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="albumin">白蛋白 (g/dL)</Label>
                    <Input
                      id="albumin"
                      type="number"
                      step="0.1"
                      placeholder="例如：4.2"
                      value={albumin}
                      onChange={(e) => setAlbumin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalProtein">总蛋白 (g/dL)</Label>
                    <Input
                      id="totalProtein"
                      type="number"
                      step="0.1"
                      placeholder="例如：7.5"
                      value={totalProtein}
                      onChange={(e) => setTotalProtein(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 凝血功能 */}
            <Card>
              <CardHeader>
                <CardTitle>凝血功能</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pt">PT (秒)</Label>
                    <Input
                      id="pt"
                      type="number"
                      step="0.1"
                      placeholder="例如：12"
                      value={pt}
                      onChange={(e) => setPt(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="inr">INR</Label>
                    <Input
                      id="inr"
                      type="number"
                      step="0.01"
                      placeholder="例如：1.0"
                      value={inr}
                      onChange={(e) => setInr(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="platelet">血小板 (×10³/μL)</Label>
                    <Input
                      id="platelet"
                      type="number"
                      placeholder="例如：250"
                      value={platelet}
                      onChange={(e) => setPlatelet(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 危险因素 */}
            <Card>
              <CardHeader>
                <CardTitle>危险因素</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "hepatitis-b", label: "乙型肝炎感染" },
                    { id: "hepatitis-c", label: "丙型肝炎感染" },
                    { id: "family-history", label: "肝病家族史" },
                    { id: "diabetes", label: "糖尿病" },
                    { id: "exercise", label: "规律运动" }
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
                <CardTitle>药物使用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "acetaminophen", label: "对乙酰氨基酚" },
                    { id: "statins", label: "他汀类药物" },
                    { id: "antibiotics", label: "抗生素" },
                    { id: "nsaids", label: "非甾体抗炎药" },
                    { id: "herbal", label: "中草药/保健品" }
                  ].map((med) => (
                    <div key={med.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={med.id}
                        checked={medications.includes(med.id)}
                        onCheckedChange={(checked) => handleArrayChange(med.id, checked as boolean, setMedications)}
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
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "fatigue", label: "疲劳乏力" },
                    { id: "jaundice", label: "黄疸" },
                    { id: "abdominal-pain", label: "腹痛" },
                    { id: "nausea", label: "恶心呕吐" },
                    { id: "loss-appetite", label: "食欲不振" },
                    { id: "dark-urine", label: "尿色深" },
                    { id: "pale-stool", label: "大便颜色浅" },
                    { id: "swelling", label: "腹胀水肿" }
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

            <div className="flex gap-4">
              <Button onClick={calculateLiverFunction} className="flex-1">
                评估肝功能
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
                    <CardTitle>肝功能评估结果</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`p-4 rounded-lg border text-center ${
                      result.liverGrade.color === "green" ? "bg-green-50 border-green-200" :
                      result.liverGrade.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                      result.liverGrade.color === "orange" ? "bg-orange-50 border-orange-200" :
                      "bg-red-50 border-red-200"
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        result.liverGrade.color === "green" ? "text-green-700" :
                        result.liverGrade.color === "yellow" ? "text-yellow-700" :
                        result.liverGrade.color === "orange" ? "text-orange-700" :
                        "text-red-700"
                      }`}>
                        {result.liverGrade.grade}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {result.liverGrade.description}
                      </div>
                      <div className="text-lg font-semibold">
                        评分: {result.liverGrade.score}分 | 异常指标: {result.liverGrade.abnormalCount}项
                      </div>
                    </div>

                    {/* AST/ALT比值 */}
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium mb-2">AST/ALT比值: {result.astAltRatio.ratio.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        {result.astAltRatio.interpretation}
                      </div>
                    </div>

                    {/* Child-Pugh评分 */}
                    {result.childPugh && (
                      <div className={`p-3 rounded border ${
                        result.childPugh.grade === "A级" ? "bg-green-50 border-green-200" :
                        result.childPugh.grade === "B级" ? "bg-yellow-50 border-yellow-200" :
                        "bg-red-50 border-red-200"
                      }`}>
                        <div className="font-medium mb-2">Child-Pugh评分: {result.childPugh.score}分 ({result.childPugh.grade})</div>
                        <div className="text-sm text-gray-600 mb-2">
                          {result.childPugh.prognosis}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.childPugh.details.join("、")}
                        </div>
                      </div>
                    )}
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
                          indicator.color === "blue" ? "bg-blue-50 border-blue-200" :
                          indicator.color === "orange" ? "bg-orange-50 border-orange-200" :
                          "bg-red-50 border-red-200"
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{indicator.name}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              indicator.color === "green" ? "bg-green-100 text-green-700" :
                              indicator.color === "blue" ? "bg-blue-100 text-blue-700" :
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
                    <TabsTrigger value="disease">疾病类型</TabsTrigger>
                    <TabsTrigger value="risks">风险评估</TabsTrigger>
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
                          <h4 className="font-medium text-green-700 mb-2">生活方式干预</h4>
                          <ul className="text-sm space-y-1">
                            {result.treatment.lifestyle.map((item: string, i: number) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
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
                        <div className="p-3 bg-green-50 rounded">
                          <h4 className="font-medium text-green-700 mb-2">推荐食物</h4>
                          <ul className="text-sm space-y-1">
                            {result.dietary.recommended.map((food: string, i: number) => (
                              <li key={i}>• {food}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-red-50 rounded">
                          <h4 className="font-medium text-red-700 mb-2">避免食物</h4>
                          <ul className="text-sm space-y-1">
                            {result.dietary.avoid.map((food: string, i: number) => (
                              <li key={i}>• {food}</li>
                            ))}
                          </ul>
                        </div>
                        
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
                        
                        <div className="p-3 bg-yellow-50 rounded">
                          <h4 className="font-medium text-yellow-700 mb-2">注意事项</h4>
                          <ul className="text-sm space-y-1">
                            {result.dietary.notes.map((note: string, i: number) => (
                              <li key={i}>• {note}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <Alert>
                          <AlertDescription>
                            饮食建议应在医生指导下个性化调整，定期评估肝功能变化。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="disease">
                    <Card>
                      <CardHeader>
                        <CardTitle>可能的肝病类型</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.diseaseTypes.length > 0 ? (
                          result.diseaseTypes.map((disease: any, i: number) => (
                            <div key={i} className={`p-3 rounded border ${
                              disease.color === "red" ? "bg-red-50 border-red-200" :
                              disease.color === "orange" ? "bg-orange-50 border-orange-200" :
                              disease.color === "yellow" ? "bg-yellow-50 border-yellow-200" :
                              "bg-blue-50 border-blue-200"
                            }`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{disease.type}</span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  disease.probability === "高" ? "bg-red-100 text-red-700" :
                                  disease.probability === "中" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-green-100 text-green-700"
                                }`}>
                                  {disease.probability}可能性
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                依据: {disease.evidence.join("、")}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-500 py-8">
                            暂无明确的疾病类型提示
                          </div>
                        )}
                        
                        <Alert>
                          <AlertDescription>
                            以上仅为初步评估，确诊需要结合临床症状、影像学检查和病理检查。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="risks">
                    <Card>
                      <CardHeader>
                        <CardTitle>风险因子评估</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.riskAssessment.high.length > 0 && (
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">高风险因子</h4>
                            <ul className="text-sm space-y-1">
                              {result.riskAssessment.high.map((factor: string, i: number) => (
                                <li key={i} className="text-red-600">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.riskAssessment.moderate.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-700 mb-2">中等风险因子</h4>
                            <ul className="text-sm space-y-1">
                              {result.riskAssessment.moderate.map((factor: string, i: number) => (
                                <li key={i} className="text-orange-600">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.riskAssessment.low.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">保护性因子</h4>
                            <ul className="text-sm space-y-1">
                              {result.riskAssessment.low.map((factor: string, i: number) => (
                                <li key={i} className="text-green-600">• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Alert>
                          <AlertDescription>
                            积极控制可改变的风险因子，定期监测肝功能变化。
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

        {/* 肝脏健康知识科普 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🫀 肝脏健康知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">肝功能检查指标</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• <strong>ALT/AST：</strong>肝细胞损伤标志</li>
                  <li>• <strong>ALP/GGT：</strong>胆汁淤积标志</li>
                  <li>• <strong>胆红素：</strong>肝脏处理胆红素能力</li>
                  <li>• <strong>白蛋白：</strong>肝脏合成功能</li>
                  <li>• <strong>凝血功能：</strong>肝脏合成凝血因子能力</li>
                  <li>• <strong>血小板：</strong>脾功能和门脉压力</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">护肝建议</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 戒酒或限制饮酒</li>
                  <li>• 均衡饮食，控制体重</li>
                  <li>• 规律运动，增强体质</li>
                  <li>• 避免肝毒性药物</li>
                  <li>• 接种肝炎疫苗</li>
                  <li>• 定期体检，早期发现</li>
                  <li>• 保持良好作息</li>
                  <li>• 避免接触有毒化学物质</li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 重要提醒</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 本计算器仅供参考，不能替代专业医学诊断</li>
                <li>• 肝功能异常需要结合临床症状和其他检查综合判断</li>
                <li>• 如有肝功能异常，请及时就医咨询专科医生</li>
                <li>• 定期监测肝功能变化，评估治疗效果</li>
                <li>• 遵医嘱用药，不要自行停药或换药</li>
              </ul>
            </div>
          </CardContent>
         </Card>
       </div>
     </div>
   );
 }