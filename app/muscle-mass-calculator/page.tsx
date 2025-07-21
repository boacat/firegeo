"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MuscleMassCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [bicep, setBicep] = useState("");
  const [forearm, setForearm] = useState("");
  const [thigh, setThigh] = useState("");
  const [calf, setCalf] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateMuscleMass = () => {
    if (!age || !gender || !weight || !height) {
      alert("请填写必要信息（年龄、性别、体重、身高）");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const bodyFatNum = bodyFat ? parseFloat(bodyFat) : null;
    const bicepNum = bicep ? parseFloat(bicep) : null;
    const forearmNum = forearm ? parseFloat(forearm) : null;
    const thighNum = thigh ? parseFloat(thigh) : null;
    const calfNum = calf ? parseFloat(calf) : null;

    if (ageNum <= 0 || ageNum > 120 || weightNum <= 0 || heightNum <= 0) {
      alert("请输入有效的数值");
      return;
    }

    // 计算BMI
    const bmi = weightNum / Math.pow(heightNum / 100, 2);

    // 计算瘦体重（Lee公式）
    const calculateLeanBodyMass = () => {
      if (gender === "male") {
        return (0.407 * weightNum) + (0.267 * heightNum) - 19.2;
      } else {
        return (0.252 * weightNum) + (0.473 * heightNum) - 48.3;
      }
    };

    const leanBodyMass = calculateLeanBodyMass();

    // 根据体脂率计算肌肉量
    const calculateMuscleMassFromBodyFat = () => {
      if (!bodyFatNum) return null;
      const fatMass = (bodyFatNum / 100) * weightNum;
      const leanMass = weightNum - fatMass;
      // 肌肉量约占瘦体重的45-50%
      return leanMass * 0.47;
    };

    const muscleMassFromBodyFat = calculateMuscleMassFromBodyFat();

    // 根据围度计算肌肉量（简化公式）
    const calculateMuscleMassFromMeasurements = () => {
      if (!bicepNum || !forearmNum || !thighNum || !calfNum) return null;
      
      // 简化的肌肉量估算公式
      const armMuscle = (bicepNum + forearmNum) * 0.5;
      const legMuscle = (thighNum + calfNum) * 0.6;
      const totalMuscle = (armMuscle + legMuscle) * heightNum * 0.01;
      
      return totalMuscle;
    };

    const muscleMassFromMeasurements = calculateMuscleMassFromMeasurements();

    // 选择最佳估算值
    const estimatedMuscleMass = muscleMassFromBodyFat || muscleMassFromMeasurements || leanBodyMass * 0.47;

    // 肌肉量评估
    const getMuscleMassAssessment = (muscleMass: number) => {
      const muscleMassIndex = muscleMass / Math.pow(heightNum / 100, 2);
      
      let category, color, description;
      
      if (gender === "male") {
        if (muscleMassIndex >= 10.75) {
          category = "优秀";
          color = "green";
          description = "肌肉量非常充足";
        } else if (muscleMassIndex >= 8.87) {
          category = "良好";
          color = "blue";
          description = "肌肉量良好";
        } else if (muscleMassIndex >= 8.50) {
          category = "正常";
          color = "yellow";
          description = "肌肉量正常";
        } else {
          category = "偏低";
          color = "red";
          description = "肌肉量不足";
        }
      } else {
        if (muscleMassIndex >= 8.29) {
          category = "优秀";
          color = "green";
          description = "肌肉量非常充足";
        } else if (muscleMassIndex >= 6.68) {
          category = "良好";
          color = "blue";
          description = "肌肉量良好";
        } else if (muscleMassIndex >= 5.70) {
          category = "正常";
          color = "yellow";
          description = "肌肉量正常";
        } else {
          category = "偏低";
          color = "red";
          description = "肌肉量不足";
        }
      }
      
      return { category, color, description, index: muscleMassIndex };
    };

    const muscleMassAssessment = getMuscleMassAssessment(estimatedMuscleMass);

    // BMI评估
    const getBMIAssessment = (bmi: number) => {
      if (bmi < 18.5) {
        return { category: "偏瘦", color: "blue", description: "体重不足" };
      } else if (bmi < 24) {
        return { category: "正常", color: "green", description: "体重正常" };
      } else if (bmi < 28) {
        return { category: "超重", color: "yellow", description: "体重超重" };
      } else {
        return { category: "肥胖", color: "red", description: "体重肥胖" };
      }
    };

    const bmiAssessment = getBMIAssessment(bmi);

    setResult({
      muscleMass: estimatedMuscleMass,
      muscleMassAssessment,
      leanBodyMass,
      bmi,
      bmiAssessment,
      bodyFatPercentage: bodyFatNum,
      basicInfo: {
        age: ageNum,
        gender,
        weight: weightNum,
        height: heightNum
      },
      measurements: {
        bicep: bicepNum,
        forearm: forearmNum,
        thigh: thighNum,
        calf: calfNum
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">💪 肌肉量计算器</h1>
          <p className="text-lg text-gray-600">
            科学评估身体肌肉量和体成分
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
                    <Label htmlFor="height">身高 (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="例如：175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bodyFat">体脂率 (%)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="例如：15"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 身体测量 */}
            <Card>
              <CardHeader>
                <CardTitle>身体测量（可选）</CardTitle>
                <p className="text-sm text-gray-600">测量各部位围度可提高计算精度</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bicep">上臂围 (cm)</Label>
                    <Input
                      id="bicep"
                      type="number"
                      step="0.1"
                      placeholder="例如：32"
                      value={bicep}
                      onChange={(e) => setBicep(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="forearm">前臂围 (cm)</Label>
                    <Input
                      id="forearm"
                      type="number"
                      step="0.1"
                      placeholder="例如：28"
                      value={forearm}
                      onChange={(e) => setForearm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="thigh">大腿围 (cm)</Label>
                    <Input
                      id="thigh"
                      type="number"
                      step="0.1"
                      placeholder="例如：55"
                      value={thigh}
                      onChange={(e) => setThigh(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calf">小腿围 (cm)</Label>
                    <Input
                      id="calf"
                      type="number"
                      step="0.1"
                      placeholder="例如：38"
                      value={calf}
                      onChange={(e) => setCalf(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateMuscleMass} className="w-full">
              计算肌肉量
            </Button>
          </div>

          {/* 结果显示 */}
          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>肌肉量评估</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg bg-${result.muscleMassAssessment.color}-50 border border-${result.muscleMassAssessment.color}-200`}>
                        <h3 className={`text-lg font-semibold text-${result.muscleMassAssessment.color}-800`}>
                          {result.muscleMassAssessment.category}
                        </h3>
                        <p className={`text-${result.muscleMassAssessment.color}-700`}>
                          {result.muscleMassAssessment.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">估算肌肉量</div>
                          <div>{result.muscleMass.toFixed(1)} kg</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">肌肉量指数</div>
                          <div>{result.muscleMassAssessment.index.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">瘦体重</div>
                          <div>{result.leanBodyMass.toFixed(1)} kg</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="font-medium">BMI</div>
                          <div>{result.bmi.toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>身体成分分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className={`p-3 rounded border bg-${result.bmiAssessment.color}-50 border-${result.bmiAssessment.color}-200`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">BMI状态</span>
                          <span className={`text-${result.bmiAssessment.color}-700 font-medium`}>
                            {result.bmiAssessment.category}
                          </span>
                        </div>
                        <div className={`text-sm text-${result.bmiAssessment.color}-600`}>
                          {result.bmiAssessment.description}
                        </div>
                      </div>
                      
                      {result.bodyFatPercentage && (
                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">体脂率</span>
                            <span className="text-blue-700 font-medium">
                              {result.bodyFatPercentage}%
                            </span>
                          </div>
                        </div>
                      )}
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