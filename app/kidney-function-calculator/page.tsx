"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function KidneyFunctionCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateKidneyFunction = () => {
    if (!age || !gender || !creatinine) {
      alert("请填写必要信息（年龄、性别、肌酐值）");
      return;
    }

    const ageNum = parseInt(age);
    const creatinineNum = parseFloat(creatinine);
    const weightNum = weight ? parseFloat(weight) : null;
    const heightNum = height ? parseFloat(height) : null;

    if (ageNum <= 0 || ageNum > 120 || creatinineNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // CKD-EPI公式计算eGFR
    const calculateCKDEPI = () => {
      let k, alpha, genderFactor;
      
      if (gender === "female") {
        k = 0.7;
        alpha = -0.329;
        genderFactor = 1.018;
      } else {
        k = 0.9;
        alpha = -0.411;
        genderFactor = 1;
      }
      
      const minValue = Math.min(creatinineNum / k, 1);
      const maxValue = Math.max(creatinineNum / k, 1);
      
      const eGFR = 141 * Math.pow(minValue, alpha) * Math.pow(maxValue, -1.209) * Math.pow(0.993, ageNum) * genderFactor;
      
      return Math.round(eGFR);
    };

    const eGFR = calculateCKDEPI();

    // CKD分期
    const getCKDStage = (egfr: number) => {
      if (egfr >= 90) {
        return {
          stage: "G1",
          description: "肾功能正常或轻度下降",
          color: "green",
          recommendation: "保持健康生活方式"
        };
      } else if (egfr >= 60) {
        return {
          stage: "G2",
          description: "肾功能轻度下降",
          color: "yellow",
          recommendation: "定期监测，控制危险因素"
        };
      } else if (egfr >= 45) {
        return {
          stage: "G3a",
          description: "肾功能轻到中度下降",
          color: "orange",
          recommendation: "需要医学评估和治疗"
        };
      } else if (egfr >= 30) {
        return {
          stage: "G3b",
          description: "肾功能中到重度下降",
          color: "orange",
          recommendation: "需要专科治疗"
        };
      } else if (egfr >= 15) {
        return {
          stage: "G4",
          description: "肾功能重度下降",
          color: "red",
          recommendation: "准备肾脏替代治疗"
        };
      } else {
        return {
          stage: "G5",
          description: "肾衰竭",
          color: "red",
          recommendation: "需要透析或肾移植"
        };
      }
    };

    const ckdStage = getCKDStage(eGFR);

    setResult({
      eGFR,
      ckdStage,
      basicInfo: {
        age: ageNum,
        gender,
        weight: weightNum,
        height: heightNum,
        creatinine: creatinineNum,
        bmi: weightNum && heightNum ? (weightNum / Math.pow(heightNum / 100, 2)).toFixed(1) : null
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🫘 肾功能评估计算器</h1>
          <p className="text-lg text-gray-600">
            基于CKD-EPI公式的专业肾功能评估
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
                      placeholder="例如：50"
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

            {/* 实验室检查 */}
            <Card>
              <CardHeader>
                <CardTitle>实验室检查</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="creatinine">血清肌酐 (mg/dL) *</Label>
                  <Input
                    id="creatinine"
                    type="number"
                    step="0.01"
                    placeholder="例如：1.2"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateKidneyFunction} className="w-full">
              计算肾功能
            </Button>
          </div>

          {/* 结果显示 */}
          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>肾功能评估结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg bg-${result.ckdStage.color}-50 border border-${result.ckdStage.color}-200`}>
                        <h3 className={`text-lg font-semibold text-${result.ckdStage.color}-800`}>
                          CKD {result.ckdStage.stage}期
                        </h3>
                        <p className={`text-${result.ckdStage.color}-700`}>
                          {result.ckdStage.description}
                        </p>
                        <p className={`text-sm text-${result.ckdStage.color}-600 mt-2`}>
                          建议：{result.ckdStage.recommendation}
                        </p>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>eGFR：{result.eGFR} mL/min/1.73m²</p>
                        <p>血清肌酐：{result.basicInfo.creatinine} mg/dL</p>
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