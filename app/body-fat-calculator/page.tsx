"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBodyFat = () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);

    if (heightNum > 0 && weightNum > 0 && neckNum > 0 && waistNum > 0 && gender) {
      let bodyFatPercentage;

      if (gender === "male") {
        // 男性体脂率计算公式 (US Navy Method)
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistNum - neckNum) + 0.15456 * Math.log10(heightNum)) - 450;
      } else {
        // 女性体脂率计算公式 (US Navy Method)
        if (hipNum > 0) {
          bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistNum + hipNum - neckNum) + 0.22100 * Math.log10(heightNum)) - 450;
        } else {
          return;
        }
      }

      const roundedBodyFat = Math.round(bodyFatPercentage * 10) / 10;
      setBodyFat(roundedBodyFat);

      // 确定体脂率分类
      if (gender === "male") {
        if (bodyFatPercentage < 6) {
          setCategory("过低");
        } else if (bodyFatPercentage < 14) {
          setCategory("运动员水平");
        } else if (bodyFatPercentage < 18) {
          setCategory("健康");
        } else if (bodyFatPercentage < 25) {
          setCategory("可接受");
        } else {
          setCategory("肥胖");
        }
      } else {
        if (bodyFatPercentage < 16) {
          setCategory("过低");
        } else if (bodyFatPercentage < 20) {
          setCategory("运动员水平");
        } else if (bodyFatPercentage < 25) {
          setCategory("健康");
        } else if (bodyFatPercentage < 32) {
          setCategory("可接受");
        } else {
          setCategory("肥胖");
        }
      }
    }
  };

  const getBodyFatColor = () => {
    if (!bodyFat) return "text-gray-600";
    if (category === "过低") return "text-blue-600";
    if (category === "运动员水平" || category === "健康") return "text-green-600";
    if (category === "可接受") return "text-yellow-600";
    return "text-red-600";
  };

  const reset = () => {
    setGender("");
    setAge("");
    setHeight("");
    setWeight("");
    setNeck("");
    setWaist("");
    setHip("");
    setBodyFat(null);
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            体脂率计算器
          </h1>
          <p className="text-xl text-gray-600">
            使用美国海军体脂率计算方法，准确评估您的身体脂肪百分比
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">输入身体数据</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lg font-medium">
                    年龄
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="例如: 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neck" className="text-lg font-medium">
                    颈围 (厘米)
                  </Label>
                  <Input
                    id="neck"
                    type="number"
                    placeholder="例如: 35"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-lg font-medium">
                    腰围 (厘米)
                  </Label>
                  <Input
                    id="waist"
                    type="number"
                    placeholder="例如: 80"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              {gender === "female" && (
                <div className="space-y-2">
                  <Label htmlFor="hip" className="text-lg font-medium">
                    臀围 (厘米) - 女性必填
                  </Label>
                  <Input
                    id="hip"
                    type="number"
                    placeholder="例如: 95"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              )}
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateBodyFat}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-lg py-3"
                  disabled={!height || !weight || !neck || !waist || !gender || (gender === "female" && !hip)}
                >
                  计算体脂率
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
              {bodyFat !== null ? (
                <>
                  <div className="space-y-4">
                    <div className="text-6xl font-bold text-purple-600">
                      {bodyFat}%
                    </div>
                    <div className={`text-2xl font-semibold ${getBodyFatColor()}`}>
                      {category}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">体脂率分类标准 ({gender === "male" ? "男性" : "女性"})：</h3>
                    <div className="text-sm space-y-1">
                      {gender === "male" ? (
                        <>
                          <div className="flex justify-between">
                            <span>过低:</span>
                            <span className="text-blue-600">&lt; 6%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>运动员水平:</span>
                            <span className="text-green-600">6% - 13%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>健康:</span>
                            <span className="text-green-600">14% - 17%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>可接受:</span>
                            <span className="text-yellow-600">18% - 24%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>肥胖:</span>
                            <span className="text-red-600">≥ 25%</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>过低:</span>
                            <span className="text-blue-600">&lt; 16%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>运动员水平:</span>
                            <span className="text-green-600">16% - 19%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>健康:</span>
                            <span className="text-green-600">20% - 24%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>可接受:</span>
                            <span className="text-yellow-600">25% - 31%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>肥胖:</span>
                            <span className="text-red-600">≥ 32%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <p>请输入完整的身体数据来计算体脂率</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 测量指南 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">测量指南</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-purple-600">📏 正确测量方法</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>颈围：</strong>在喉结下方最细处测量</li>
                  <li>• <strong>腰围：</strong>在肚脐水平线处测量</li>
                  <li>• <strong>臀围：</strong>在臀部最宽处测量（女性）</li>
                  <li>• <strong>测量时间：</strong>建议早晨空腹时测量</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">⚠️ 注意事项</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 此方法为估算值，仅供参考</li>
                  <li>• 专业体脂测量需要专业设备</li>
                  <li>• 肌肉发达者可能结果偏高</li>
                  <li>• 如有疑问请咨询专业人士</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 健康建议 */}
        {bodyFat !== null && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">健康建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">💪 改善建议</h3>
                  <ul className="space-y-2 text-gray-700">
                    {category === "过低" && (
                      <>
                        <li>• 增加健康脂肪摄入（坚果、鱼类）</li>
                        <li>• 进行力量训练增加肌肉量</li>
                        <li>• 咨询营养师制定增重计划</li>
                      </>
                    )}
                    {(category === "运动员水平" || category === "健康") && (
                      <>
                        <li>• 保持当前的健康生活方式</li>
                        <li>• 继续规律运动和均衡饮食</li>
                        <li>• 定期监测身体成分变化</li>
                      </>
                    )}
                    {category === "可接受" && (
                      <>
                        <li>• 增加有氧运动频率</li>
                        <li>• 控制饮食热量摄入</li>
                        <li>• 加强力量训练</li>
                      </>
                    )}
                    {category === "肥胖" && (
                      <>
                        <li>• 制定科学的减脂计划</li>
                        <li>• 咨询专业健身教练</li>
                        <li>• 考虑寻求医生建议</li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-orange-600">🎯 目标设定</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 设定合理的体脂率目标</li>
                    <li>• 每月测量1-2次追踪进展</li>
                    <li>• 关注整体健康而非单一指标</li>
                    <li>• 保持耐心，健康改变需要时间</li>
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