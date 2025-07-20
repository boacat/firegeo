"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function VitaminDCalculatorPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [skinType, setSkinType] = useState("");
  const [sunExposure, setSunExposure] = useState("");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [hasConditions, setHasConditions] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateVitaminD = () => {
    if (!age || !gender || !weight || !skinType || !sunExposure || !location || !season) {
      alert("请填写所有必填项");
      return;
    }

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);

    // 基础需求量 (IU/天)
    let baseRequirement;
    if (ageNum < 1) {
      baseRequirement = 400;
    } else if (ageNum < 70) {
      baseRequirement = 600;
    } else {
      baseRequirement = 800;
    }

    // 特殊情况调整
    if (isPregnant || isBreastfeeding) {
      baseRequirement = 600;
    }

    // 皮肤类型系数
    const skinFactors: { [key: string]: number } = {
      very_fair: 1.0,
      fair: 1.2,
      medium: 1.5,
      dark: 2.0,
      very_dark: 2.5
    };

    // 日照时间系数
    const sunFactors: { [key: string]: number } = {
      none: 2.0,
      minimal: 1.8,
      moderate: 1.3,
      adequate: 1.0,
      excessive: 0.8
    };

    // 地理位置系数
    const locationFactors: { [key: string]: number } = {
      tropical: 0.8,
      subtropical: 1.0,
      temperate: 1.3,
      cold: 1.6,
      polar: 2.0
    };

    // 季节系数
    const seasonFactors: { [key: string]: number } = {
      spring: 1.0,
      summer: 0.8,
      autumn: 1.2,
      winter: 1.5
    };

    // 疾病状况系数
    const conditionFactor = hasConditions ? 1.5 : 1.0;

    // 计算调整后需求量
    const adjustedRequirement = baseRequirement * 
      skinFactors[skinType] * 
      sunFactors[sunExposure] * 
      locationFactors[location] * 
      seasonFactors[season] * 
      conditionFactor;

    // 食物来源建议 (约占总需求的20-30%)
    const foodSources = Math.round(adjustedRequirement * 0.25);
    const supplementNeeded = Math.round(adjustedRequirement - foodSources);

    // 安全上限
    const upperLimit = ageNum < 9 ? 2500 : 4000;

    // 评估等级
    let level, levelColor, recommendation;
    if (adjustedRequirement <= baseRequirement * 1.2) {
      level = "正常";
      levelColor = "text-green-600";
      recommendation = "维持当前生活方式，注意均衡饮食";
    } else if (adjustedRequirement <= baseRequirement * 1.8) {
      level = "轻度缺乏风险";
      levelColor = "text-yellow-600";
      recommendation = "增加户外活动时间，考虑补充维生素D";
    } else {
      level = "高缺乏风险";
      levelColor = "text-red-600";
      recommendation = "建议咨询医生，可能需要维生素D补充剂";
    }

    setResult({
      baseRequirement,
      adjustedRequirement: Math.round(adjustedRequirement),
      foodSources,
      supplementNeeded,
      upperLimit,
      level,
      levelColor,
      recommendation
    });
  };

  const resetForm = () => {
    setAge("");
    setGender("");
    setWeight("");
    setSkinType("");
    setSunExposure("");
    setLocation("");
    setSeason("");
    setIsPregnant(false);
    setIsBreastfeeding(false);
    setHasConditions(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">☀️ 维生素D需求计算器</h1>
          <p className="text-lg text-gray-600">
            根据个人情况评估维生素D需求量，预防维生素D缺乏症
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
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

              <div>
                <Label htmlFor="weight">体重 (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="例如：70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="skinType">皮肤类型 *</Label>
                <Select value={skinType} onValueChange={setSkinType}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择皮肤类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_fair">很白皙（容易晒伤，不易晒黑）</SelectItem>
                    <SelectItem value="fair">白皙（容易晒伤，轻微晒黑）</SelectItem>
                    <SelectItem value="medium">中等（偶尔晒伤，容易晒黑）</SelectItem>
                    <SelectItem value="dark">较深（很少晒伤，容易晒黑）</SelectItem>
                    <SelectItem value="very_dark">很深（从不晒伤，已经很黑）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sunExposure">日照时间 *</Label>
                <Select value={sunExposure} onValueChange={setSunExposure}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择日照时间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">几乎没有（室内工作，很少外出）</SelectItem>
                    <SelectItem value="minimal">很少（每天<15分钟）</SelectItem>
                    <SelectItem value="moderate">适中（每天15-30分钟）</SelectItem>
                    <SelectItem value="adequate">充足（每天30-60分钟）</SelectItem>
                    <SelectItem value="excessive">过多（每天>60分钟）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">地理位置 *</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择地理位置" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tropical">热带地区</SelectItem>
                      <SelectItem value="subtropical">亚热带地区</SelectItem>
                      <SelectItem value="temperate">温带地区</SelectItem>
                      <SelectItem value="cold">寒带地区</SelectItem>
                      <SelectItem value="polar">极地地区</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="season">当前季节 *</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择季节" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">春季</SelectItem>
                      <SelectItem value="summer">夏季</SelectItem>
                      <SelectItem value="autumn">秋季</SelectItem>
                      <SelectItem value="winter">冬季</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>特殊情况</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pregnant" 
                      checked={isPregnant} 
                      onCheckedChange={setIsPregnant}
                    />
                    <Label htmlFor="pregnant">怀孕期间</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="breastfeeding" 
                      checked={isBreastfeeding} 
                      onCheckedChange={setIsBreastfeeding}
                    />
                    <Label htmlFor="breastfeeding">哺乳期间</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="conditions" 
                      checked={hasConditions} 
                      onCheckedChange={setHasConditions}
                    />
                    <Label htmlFor="conditions">有骨质疏松、肾病等相关疾病</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateVitaminD} className="flex-1">
                  计算维生素D需求
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 计算结果 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>评估结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className={`font-semibold ${result.levelColor}`}>
                      维生素D状态：{result.level}
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{result.adjustedRequirement} IU</div>
                    <div className="text-sm text-gray-600">每日推荐摄入量</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>基础需求量:</span>
                    <span>{result.baseRequirement} IU/天</span>
                  </div>
                  <div className="flex justify-between">
                    <span>食物来源:</span>
                    <span>{result.foodSources} IU/天</span>
                  </div>
                  <div className="flex justify-between">
                    <span>建议补充:</span>
                    <span>{result.supplementNeeded} IU/天</span>
                  </div>
                  <div className="flex justify-between">
                    <span>安全上限:</span>
                    <span>{result.upperLimit} IU/天</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>建议：</strong>{result.recommendation}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 维生素D知识 */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🌞 维生素D来源</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">阳光合成（主要来源）</h4>
                  <p className="text-sm text-gray-600">皮肤在阳光照射下合成维生素D3</p>
                </div>
                <div>
                  <h4 className="font-semibold">食物来源</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 深海鱼类（三文鱼、金枪鱼）</li>
                    <li>• 蛋黄、肝脏</li>
                    <li>• 强化食品（牛奶、谷物）</li>
                    <li>• 蘑菇类</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">补充剂</h4>
                  <p className="text-sm text-gray-600">维生素D2或D3补充剂</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚠️ 缺乏症状与风险</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">缺乏症状</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 骨痛、肌肉无力</li>
                    <li>• 疲劳、抑郁</li>
                    <li>• 免疫力下降</li>
                    <li>• 伤口愈合缓慢</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">长期风险</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 骨质疏松症</li>
                    <li>• 佝偻病（儿童）</li>
                    <li>• 心血管疾病风险增加</li>
                    <li>• 某些癌症风险增加</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">计算依据</h3>
                <ul className="text-sm space-y-1">
                  <li>• 基于年龄的基础需求量</li>
                  <li>• 考虑皮肤类型和日照时间</li>
                  <li>• 结合地理位置和季节因素</li>
                  <li>• 特殊生理状态调整</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 结果仅供参考，不替代医学诊断</li>
                  <li>• 补充前请咨询医生或营养师</li>
                  <li>• 避免过量摄入维生素D</li>
                  <li>• 定期检测血液维生素D水平</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}