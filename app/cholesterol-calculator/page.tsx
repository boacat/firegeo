"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface CholesterolResult {
  totalCholesterol: number;
  ldl: number;
  hdl: number;
  triglycerides: number;
  nonHdl: number;
  ratio: number;
  riskLevel: string;
  riskColor: string;
  recommendations: string[];
  targetLevels: {
    totalCholesterol: string;
    ldl: string;
    hdl: string;
    triglycerides: string;
  };
}

export default function CholesterolCalculator() {
  const [totalCholesterol, setTotalCholesterol] = useState("");
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglycerides, setTriglycerides] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [smoking, setSmoking] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [familyHistory, setFamilyHistory] = useState(false);
  const [result, setResult] = useState<CholesterolResult | null>(null);

  const calculateCholesterol = () => {
    const tc = parseFloat(totalCholesterol);
    const ldlValue = parseFloat(ldl);
    const hdlValue = parseFloat(hdl);
    const tg = parseFloat(triglycerides);
    
    if (tc > 0 && ldlValue > 0 && hdlValue > 0 && tg > 0) {
      // 计算非HDL胆固醇
      const nonHdl = tc - hdlValue;
      
      // 计算总胆固醇/HDL比值
      const ratio = tc / hdlValue;
      
      // 风险评估
      let riskLevel = "";
      let riskColor = "";
      let recommendations: string[] = [];
      
      // 基础风险因子计数
      let riskFactors = 0;
      if (smoking) riskFactors++;
      if (diabetes) riskFactors++;
      if (hypertension) riskFactors++;
      if (familyHistory) riskFactors++;
      if (age && parseInt(age) > 45 && gender === "male") riskFactors++;
      if (age && parseInt(age) > 55 && gender === "female") riskFactors++;
      if (hdlValue < 40) riskFactors++;
      
      // 综合风险评估
      if (ldlValue < 100 && tc < 200 && hdlValue >= 60 && tg < 150 && riskFactors === 0) {
        riskLevel = "理想水平";
        riskColor = "text-green-600";
        recommendations = [
          "保持健康的生活方式",
          "继续均衡饮食",
          "维持规律运动",
          "每年检查一次血脂"
        ];
      } else if (ldlValue < 130 && tc < 240 && tg < 200 && riskFactors <= 1) {
        riskLevel = "正常范围";
        riskColor = "text-blue-600";
        recommendations = [
          "维持健康生活方式",
          "适量有氧运动",
          "控制饱和脂肪摄入",
          "每1-2年检查血脂"
        ];
      } else if (ldlValue < 160 && tc < 240 && riskFactors <= 2) {
        riskLevel = "边缘升高";
        riskColor = "text-yellow-600";
        recommendations = [
          "加强生活方式干预",
          "减少胆固醇摄入",
          "增加纤维素摄入",
          "考虑营养师咨询",
          "每6个月检查血脂"
        ];
      } else if (ldlValue < 190 || tc < 300 || riskFactors <= 3) {
        riskLevel = "中度风险";
        riskColor = "text-orange-600";
        recommendations = [
          "咨询医生制定治疗方案",
          "可能需要药物治疗",
          "严格饮食控制",
          "规律有氧运动",
          "戒烟限酒",
          "每3个月检查血脂"
        ];
      } else {
        riskLevel = "高风险";
        riskColor = "text-red-600";
        recommendations = [
          "立即咨询心血管专科医生",
          "可能需要他汀类药物",
          "严格低脂饮食",
          "监控其他心血管风险因子",
          "每月监测血脂",
          "考虑心血管风险评估"
        ];
      }
      
      // 个性化目标值
      let targetLevels = {
        totalCholesterol: "< 200 mg/dL",
        ldl: "< 100 mg/dL",
        hdl: "> 40 mg/dL (男性), > 50 mg/dL (女性)",
        triglycerides: "< 150 mg/dL"
      };
      
      // 高风险患者的更严格目标
      if (riskFactors >= 2 || diabetes) {
        targetLevels.ldl = "< 70 mg/dL";
        targetLevels.totalCholesterol = "< 180 mg/dL";
      }
      
      // 极高风险患者
      if (riskFactors >= 3 || (diabetes && smoking)) {
        targetLevels.ldl = "< 55 mg/dL";
        targetLevels.totalCholesterol = "< 160 mg/dL";
      }
      
      setResult({
        totalCholesterol: tc,
        ldl: ldlValue,
        hdl: hdlValue,
        triglycerides: tg,
        nonHdl,
        ratio,
        riskLevel,
        riskColor,
        recommendations,
        targetLevels
      });
    }
  };

  const reset = () => {
    setTotalCholesterol("");
    setLdl("");
    setHdl("");
    setTriglycerides("");
    setAge("");
    setGender("");
    setSmoking(false);
    setDiabetes(false);
    setHypertension(false);
    setFamilyHistory(false);
    setResult(null);
  };

  const getCholesterolCategory = (value: number, type: string) => {
    switch (type) {
      case "total":
        if (value < 200) return { category: "理想", color: "text-green-600" };
        if (value < 240) return { category: "边缘高", color: "text-yellow-600" };
        return { category: "高", color: "text-red-600" };
      case "ldl":
        if (value < 100) return { category: "理想", color: "text-green-600" };
        if (value < 130) return { category: "接近理想", color: "text-blue-600" };
        if (value < 160) return { category: "边缘高", color: "text-yellow-600" };
        if (value < 190) return { category: "高", color: "text-orange-600" };
        return { category: "很高", color: "text-red-600" };
      case "hdl":
        if (value < 40) return { category: "低", color: "text-red-600" };
        if (value < 60) return { category: "正常", color: "text-blue-600" };
        return { category: "高（保护性）", color: "text-green-600" };
      case "triglycerides":
        if (value < 150) return { category: "正常", color: "text-green-600" };
        if (value < 200) return { category: "边缘高", color: "text-yellow-600" };
        if (value < 500) return { category: "高", color: "text-orange-600" };
        return { category: "很高", color: "text-red-600" };
      default:
        return { category: "", color: "" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            胆固醇风险评估计算器
          </h1>
          <p className="text-xl text-gray-600">
            评估您的血脂水平和心血管疾病风险
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">血脂数据输入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCholesterol" className="text-lg font-medium">
                    总胆固醇 (mg/dL)
                  </Label>
                  <Input
                    id="totalCholesterol"
                    type="number"
                    placeholder="例如: 200"
                    value={totalCholesterol}
                    onChange={(e) => setTotalCholesterol(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ldl" className="text-lg font-medium">
                    低密度脂蛋白 (LDL)
                  </Label>
                  <Input
                    id="ldl"
                    type="number"
                    placeholder="例如: 100"
                    value={ldl}
                    onChange={(e) => setLdl(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hdl" className="text-lg font-medium">
                    高密度脂蛋白 (HDL)
                  </Label>
                  <Input
                    id="hdl"
                    type="number"
                    placeholder="例如: 50"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="triglycerides" className="text-lg font-medium">
                    甘油三酯 (mg/dL)
                  </Label>
                  <Input
                    id="triglycerides"
                    type="number"
                    placeholder="例如: 150"
                    value={triglycerides}
                    onChange={(e) => setTriglycerides(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lg font-medium">
                    年龄
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="例如: 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-lg font-medium">
                    性别
                  </Label>
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

              <div className="space-y-4">
                <Label className="text-lg font-medium">风险因子（可选）</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="smoking" 
                      checked={smoking} 
                      onCheckedChange={(checked) => setSmoking(checked as boolean)}
                    />
                    <Label htmlFor="smoking">吸烟</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="diabetes" 
                      checked={diabetes} 
                      onCheckedChange={(checked) => setDiabetes(checked as boolean)}
                    />
                    <Label htmlFor="diabetes">糖尿病</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hypertension" 
                      checked={hypertension} 
                      onCheckedChange={(checked) => setHypertension(checked as boolean)}
                    />
                    <Label htmlFor="hypertension">高血压</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="familyHistory" 
                      checked={familyHistory} 
                      onCheckedChange={(checked) => setFamilyHistory(checked as boolean)}
                    />
                    <Label htmlFor="familyHistory">家族史</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateCholesterol}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={!totalCholesterol || !ldl || !hdl || !triglycerides}
                >
                  评估风险
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  className="flex-1 text-lg py-3"
                >
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 结果显示 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">风险评估结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className={`text-3xl font-bold ${result.riskColor}`}>
                      {result.riskLevel}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.totalCholesterol}</div>
                        <div className="text-sm text-gray-600">总胆固醇</div>
                        <div className={`text-xs ${getCholesterolCategory(result.totalCholesterol, "total").color}`}>
                          {getCholesterolCategory(result.totalCholesterol, "total").category}
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{result.ldl}</div>
                        <div className="text-sm text-gray-600">LDL (坏胆固醇)</div>
                        <div className={`text-xs ${getCholesterolCategory(result.ldl, "ldl").color}`}>
                          {getCholesterolCategory(result.ldl, "ldl").category}
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{result.hdl}</div>
                        <div className="text-sm text-gray-600">HDL (好胆固醇)</div>
                        <div className={`text-xs ${getCholesterolCategory(result.hdl, "hdl").color}`}>
                          {getCholesterolCategory(result.hdl, "hdl").category}
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{result.triglycerides}</div>
                        <div className="text-sm text-gray-600">甘油三酯</div>
                        <div className={`text-xs ${getCholesterolCategory(result.triglycerides, "triglycerides").color}`}>
                          {getCholesterolCategory(result.triglycerides, "triglycerides").category}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-purple-600">{result.nonHdl.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">非HDL胆固醇</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-indigo-600">{result.ratio.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">总胆固醇/HDL比值</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">建议措施：</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">您的目标值：</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>总胆固醇: {result.targetLevels.totalCholesterol}</div>
                      <div>LDL: {result.targetLevels.ldl}</div>
                      <div>HDL: {result.targetLevels.hdl}</div>
                      <div>甘油三酯: {result.targetLevels.triglycerides}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🩺</div>
                  <p>请输入血脂数据进行风险评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 血脂知识科普 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">血脂知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-600 mb-2">LDL (坏胆固醇)</h3>
                <p className="text-sm text-gray-600">
                  低密度脂蛋白，容易在血管壁沉积，形成动脉粥样硬化斑块，是心血管疾病的主要风险因子。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-600 mb-2">HDL (好胆固醇)</h3>
                <p className="text-sm text-gray-600">
                  高密度脂蛋白，能够清除血管壁的胆固醇，运输到肝脏代谢，具有保护心血管的作用。
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-600 mb-2">甘油三酯</h3>
                <p className="text-sm text-gray-600">
                  血液中的脂肪，主要来源于饮食和肝脏合成。过高会增加胰腺炎和心血管疾病风险。
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-2">总胆固醇</h3>
                <p className="text-sm text-gray-600">
                  血液中所有胆固醇的总和，包括LDL、HDL和其他脂蛋白中的胆固醇。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 改善血脂的方法 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">改善血脂的方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🥗</div>
                <h3 className="font-semibold text-lg mb-3">饮食调整</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 减少饱和脂肪摄入</li>
                  <li>• 增加膳食纤维</li>
                  <li>• 选择健康油脂</li>
                  <li>• 多吃鱼类和坚果</li>
                  <li>• 限制精制糖</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🏃</div>
                <h3 className="font-semibold text-lg mb-3">运动锻炼</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 每周150分钟中等强度</li>
                  <li>• 有氧运动为主</li>
                  <li>• 力量训练辅助</li>
                  <li>• 提高HDL水平</li>
                  <li>• 降低甘油三酯</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="font-semibold text-lg mb-3">医学干预</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 他汀类药物</li>
                  <li>• 胆汁酸结合剂</li>
                  <li>• PCSK9抑制剂</li>
                  <li>• 定期监测</li>
                  <li>• 遵医嘱用药</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}