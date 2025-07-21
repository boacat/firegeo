'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function VitaminDCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [skinType, setSkinType] = useState('');
  const [sunExposure, setSunExposure] = useState('');
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');
  const [pregnancy, setPregnancy] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculateVitaminD = () => {
    if (!age || !gender || !weight) {
      alert('请填写所有必填项');
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);

    // 基础需求量（IU/天）
    let baseRequirement = 0;

    // 年龄基础需求
    if (ageNum < 1) {
      baseRequirement = 400;
    } else if (ageNum < 70) {
      baseRequirement = 600;
    } else {
      baseRequirement = 800;
    }

    // 妊娠和哺乳期调整
    if (pregnancy || breastfeeding) {
      baseRequirement = 600;
    }

    // 体重调整
    let weightAdjustment = 1;
    if (weightNum > 70) {
      weightAdjustment = 1.2;
    } else if (weightNum < 50) {
      weightAdjustment = 0.8;
    }

    // 皮肤类型调整
    let skinAdjustment = 1;
    switch (skinType) {
      case 'very-fair':
        skinAdjustment = 0.8;
        break;
      case 'fair':
        skinAdjustment = 0.9;
        break;
      case 'medium':
        skinAdjustment = 1.0;
        break;
      case 'dark':
        skinAdjustment = 1.3;
        break;
      case 'very-dark':
        skinAdjustment = 1.5;
        break;
    }

    // 日照调整
    let sunAdjustment = 1;
    switch (sunExposure) {
      case 'minimal':
        sunAdjustment = 1.5;
        break;
      case 'limited':
        sunAdjustment = 1.2;
        break;
      case 'moderate':
        sunAdjustment = 1.0;
        break;
      case 'high':
        sunAdjustment = 0.7;
        break;
    }

    // 地理位置调整
    let locationAdjustment = 1;
    switch (location) {
      case 'tropical':
        locationAdjustment = 0.8;
        break;
      case 'subtropical':
        locationAdjustment = 0.9;
        break;
      case 'temperate':
        locationAdjustment = 1.0;
        break;
      case 'cold':
        locationAdjustment = 1.2;
        break;
    }

    // 季节调整
    let seasonAdjustment = 1;
    switch (season) {
      case 'spring':
        seasonAdjustment = 1.0;
        break;
      case 'summer':
        seasonAdjustment = 0.8;
        break;
      case 'autumn':
        seasonAdjustment = 1.1;
        break;
      case 'winter':
        seasonAdjustment = 1.3;
        break;
    }

    // 计算最终需求量
    const finalRequirement = Math.round(
      baseRequirement * weightAdjustment * skinAdjustment * sunAdjustment * locationAdjustment * seasonAdjustment
    );

    // 生成建议
    const recommendations = [];
    
    if (finalRequirement > 1000) {
      recommendations.push('建议补充维生素D3');
      recommendations.push('增加户外活动时间');
      recommendations.push('食用富含维生素D的食物');
    } else if (finalRequirement > 600) {
      recommendations.push('适量补充维生素D');
      recommendations.push('保持适度日照');
    } else {
      recommendations.push('保持现有生活方式');
      recommendations.push('定期检测维生素D水平');
    }

    // 食物来源建议
    const foodSources = [
      '富含脂肪的鱼类（三文鱼、金枪鱼）',
      '蛋黄',
      '强化牛奶和谷物',
      '蘑菇（特别是UV照射的蘑菇）',
      '鱼肝油'
    ];

    setResults({
      dailyRequirement: finalRequirement,
      baseRequirement,
      adjustmentFactors: {
        weight: weightAdjustment,
        skin: skinAdjustment,
        sun: sunAdjustment,
        location: locationAdjustment,
        season: seasonAdjustment
      },
      recommendations,
      foodSources
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">☀️ 维生素D需求计算器</h1>
          <p className="text-lg text-gray-600">
            根据您的个人情况计算维生素D的每日需求量
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

                <div>
                  <Label htmlFor="weight">体重 (kg) *</Label>
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
                  <Label htmlFor="skinType">肤色类型</Label>
                  <Select value={skinType} onValueChange={setSkinType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择肤色类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-fair">很白皙</SelectItem>
                      <SelectItem value="fair">白皙</SelectItem>
                      <SelectItem value="medium">中等</SelectItem>
                      <SelectItem value="dark">较深</SelectItem>
                      <SelectItem value="very-dark">很深</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sunExposure">日照情况</Label>
                  <Select value={sunExposure} onValueChange={setSunExposure}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择日照情况" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">很少（室内工作）</SelectItem>
                      <SelectItem value="limited">有限（偶尔户外）</SelectItem>
                      <SelectItem value="moderate">适中（经常户外）</SelectItem>
                      <SelectItem value="high">充足（户外工作）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {gender === 'female' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pregnancy"
                        checked={pregnancy}
                        onCheckedChange={setPregnancy}
                      />
                      <Label htmlFor="pregnancy">怀孕期间</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="breastfeeding"
                        checked={breastfeeding}
                        onCheckedChange={setBreastfeeding}
                      />
                      <Label htmlFor="breastfeeding">哺乳期间</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={calculateVitaminD} className="w-full">
              计算维生素D需求
            </Button>
          </div>

          {/* 结果显示 */}
          <div className="space-y-6">
            {results && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>计算结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {results.dailyRequirement} IU/天
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          推荐每日维生素D摄入量
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded text-center">
                          <div className="text-sm font-medium">基础需求</div>
                          <div className="text-lg">{results.baseRequirement} IU</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded text-center">
                          <div className="text-sm font-medium">调整后需求</div>
                          <div className="text-lg">{results.dailyRequirement} IU</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">建议措施：</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {results.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600">{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">食物来源：</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {results.foodSources.map((food: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600">{food}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    此计算结果仅供参考，具体补充方案请咨询医生或营养师。
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}