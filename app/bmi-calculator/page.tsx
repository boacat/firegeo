"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInMeters * heightInMeters);
      setBMI(parseFloat(bmiValue.toFixed(1)));
      
      // 确定BMI分类
      if (bmiValue < 18.5) {
        setCategory("体重过轻");
      } else if (bmiValue < 24) {
        setCategory("正常体重");
      } else if (bmiValue < 28) {
        setCategory("超重");
      } else {
        setCategory("肥胖");
      }
    }
  };

  const getBMIColor = () => {
    if (!bmi) return "text-gray-600";
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 24) return "text-green-600";
    if (bmi < 28) return "text-yellow-600";
    return "text-red-600";
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setBMI(null);
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BMI 计算器
          </h1>
          <p className="text-xl text-gray-600">
            计算您的身体质量指数，了解您的健康状况
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">输入您的信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-lg font-medium">
                  身高 (厘米)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="例如: 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-lg p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-lg font-medium">
                  体重 (公斤)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="例如: 65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-lg p-3"
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateBMI}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={!height || !weight}
                >
                  计算 BMI
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
              <CardTitle className="text-2xl text-center">计算结果</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {bmi ? (
                <>
                  <div className="space-y-4">
                    <div className="text-6xl font-bold text-blue-600">
                      {bmi}
                    </div>
                    <div className={`text-2xl font-semibold ${getBMIColor()}`}>
                      {category}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">BMI 分类标准：</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>体重过轻:</span>
                        <span className="text-blue-600">&lt; 18.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>正常体重:</span>
                        <span className="text-green-600">18.5 - 23.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>超重:</span>
                        <span className="text-yellow-600">24.0 - 27.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>肥胖:</span>
                        <span className="text-red-600">≥ 28.0</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <p>请输入身高和体重来计算您的BMI</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 健康建议 */}
        {bmi && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">健康建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">💡 生活建议</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 保持均衡饮食，多吃蔬菜水果</li>
                    <li>• 每周进行150分钟中等强度运动</li>
                    <li>• 保证充足睡眠，每天7-9小时</li>
                    <li>• 多喝水，减少含糖饮料</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue-600">⚠️ 注意事项</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• BMI仅供参考，不能完全反映健康状况</li>
                    <li>• 肌肉发达者BMI可能偏高但很健康</li>
                    <li>• 如有健康问题请咨询专业医生</li>
                    <li>• 定期体检，关注身体变化</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}