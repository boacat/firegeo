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

    setResult({
      hemoglobinStatus,
      normalRange,
      basicInfo: {
        age: ageNum,
        gender,
        weight: weightNum,
        height: heightNum,
        bmi: weightNum && heightNum ? (weightNum / Math.pow(heightNum / 100, 2)).toFixed(1) : null
      }
    });
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
              </CardContent>
            </Card>

            {/* 血液检查结果 */}
            <Card>
              <CardHeader>
                <CardTitle>血液检查结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Button onClick={calculateHemoglobin} className="w-full">
              计算血红蛋白状态
            </Button>
          </div>

          {/* 结果显示 */}
          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>血红蛋白评估结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg bg-${result.hemoglobinStatus.color}-50 border border-${result.hemoglobinStatus.color}-200`}>
                        <h3 className={`text-lg font-semibold text-${result.hemoglobinStatus.color}-800`}>
                          {result.hemoglobinStatus.status}
                        </h3>
                        <p className={`text-${result.hemoglobinStatus.color}-700`}>
                          {result.hemoglobinStatus.description}
                        </p>
                        <p className={`text-sm text-${result.hemoglobinStatus.color}-600 mt-2`}>
                          建议：{result.hemoglobinStatus.recommendation}
                        </p>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>正常范围：{result.normalRange.min} - {result.normalRange.max} g/dL</p>
                        {result.basicInfo.bmi && (
                          <p>BMI：{result.basicInfo.bmi}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}