'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';

export default function BoneDensityCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [menopauseAge, setMenopauseAge] = useState('');
  const [familyHistory, setFamilyHistory] = useState(false);
  const [previousFractures, setPreviousFractures] = useState(false);
  const [smoking, setSmoking] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [exercise, setExercise] = useState('');
  const [calcium, setCalcium] = useState('');
  const [vitaminD, setVitaminD] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculateRisk = () => {
    if (!age || !gender || !height || !weight) {
      alert('请填写所有必填项');
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const bmi = weightNum / ((heightNum / 100) ** 2);

    let riskScore = 0;
    let riskFactors = [];

    // 年龄风险
    if (ageNum >= 65) {
      riskScore += 3;
      riskFactors.push('年龄≥65岁');
    } else if (ageNum >= 50) {
      riskScore += 2;
      riskFactors.push('年龄50-64岁');
    }

    // 性别风险
    if (gender === 'female') {
      riskScore += 1;
      riskFactors.push('女性');
      
      // 绝经风险
      if (menopauseAge && parseInt(menopauseAge) < 45) {
        riskScore += 2;
        riskFactors.push('早期绝经');
      }
    }

    // BMI风险
    if (bmi < 18.5) {
      riskScore += 2;
      riskFactors.push('体重过轻');
    }

    // 家族史
    if (familyHistory) {
      riskScore += 2;
      riskFactors.push('家族骨质疏松史');
    }

    // 既往骨折
    if (previousFractures) {
      riskScore += 3;
      riskFactors.push('既往骨折史');
    }

    // 吸烟
    if (smoking === 'current') {
      riskScore += 2;
      riskFactors.push('目前吸烟');
    }

    // 饮酒
    if (alcohol === 'heavy') {
      riskScore += 1;
      riskFactors.push('大量饮酒');
    }

    // 运动不足
    if (exercise === 'sedentary') {
      riskScore += 1;
      riskFactors.push('缺乏运动');
    }

    // 营养不良
    if (calcium === 'very-low' || calcium === 'low') {
      riskScore += 1;
      riskFactors.push('钙摄入不足');
    }

    if (vitaminD === 'deficient' || vitaminD === 'insufficient') {
      riskScore += 1;
      riskFactors.push('维生素D不足');
    }

    let riskLevel = '';
    let riskColor = '';
    let recommendations = [];

    if (riskScore <= 2) {
      riskLevel = '低风险';
      riskColor = 'text-green-600';
      recommendations = [
        '保持健康的生活方式',
        '确保充足的钙和维生素D摄入',
        '进行适量的负重运动',
        '定期体检'
      ];
    } else if (riskScore <= 5) {
      riskLevel = '中等风险';
      riskColor = 'text-yellow-600';
      recommendations = [
        '建议进行骨密度检查',
        '增加钙和维生素D补充',
        '加强负重和阻力训练',
        '戒烟限酒',
        '咨询医生制定预防方案'
      ];
    } else {
      riskLevel = '高风险';
      riskColor = 'text-red-600';
      recommendations = [
        '立即进行骨密度检查',
        '咨询骨科或内分泌科医生',
        '考虑药物治疗',
        '严格的生活方式干预',
        '定期监测和随访'
      ];
    }

    setResults({
      riskScore,
      riskLevel,
      riskColor,
      riskFactors,
      recommendations,
      bmi: bmi.toFixed(1)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🦴 骨密度风险评估</h1>
          <p className="text-lg text-gray-600">
            评估您的骨质疏松风险，制定个性化的骨骼健康管理方案
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
                      placeholder="例如：55"
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
                    <Label htmlFor="height">身高 (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="例如：165"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">体重 (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="例如：60"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="familyHistory"
                      checked={familyHistory}
                      onCheckedChange={setFamilyHistory}
                    />
                    <Label htmlFor="familyHistory">家族有骨质疏松或骨折史</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="previousFractures"
                      checked={previousFractures}
                      onCheckedChange={setPreviousFractures}
                    />
                    <Label htmlFor="previousFractures">既往有骨折史</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={calculateRisk} className="w-full">
              计算骨密度风险
            </Button>
          </div>

          {/* 结果显示 */}
          <div className="space-y-6">
            {results && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>风险评估结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${results.riskColor}`}>
                          {results.riskLevel}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          风险评分：{results.riskScore} 分
                        </div>
                        <div className="text-sm text-gray-600">
                          BMI：{results.bmi}
                        </div>
                      </div>

                      {results.riskFactors.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">主要风险因素：</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {results.riskFactors.map((factor: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600">{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">建议措施：</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {results.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm text-gray-600">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    此评估仅供参考，不能替代专业医疗诊断。如有疑虑，请咨询医生。
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