'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface WaterIntakeData {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  climate: string;
  temperature: number;
  humidity: number;
  exerciseDuration: number;
  exerciseIntensity: string;
  pregnancy: boolean;
  breastfeeding: boolean;
  illness: string[];
  medications: string[];
  caffeineIntake: number;
  alcoholIntake: number;
  dietType: string;
  workEnvironment: string;
  sweatingLevel: string;
  urineColor: string;
  thirstLevel: number;
}

interface WaterIntakeResult {
  dailyWaterNeeds: {
    baseline: number;
    withActivity: number;
    withClimate: number;
    withFactors: number;
    total: number;
  };
  hourlyIntake: number;
  intakeSchedule: Array<{
    time: string;
    amount: number;
    type: string;
    reason: string;
  }>;
  hydrationStatus: {
    level: string;
    description: string;
    color: string;
    indicators: string[];
  };
  recommendations: {
    timing: string[];
    sources: string[];
    monitoring: string[];
    adjustments: string[];
  };
  fluidSources: Array<{
    source: string;
    amount: number;
    hydrationValue: number;
    benefits: string;
    notes: string;
  }>;
  warnings: string[];
  specialConsiderations: string[];
}

export default function WaterIntakeCalculator() {
  const [formData, setFormData] = useState<WaterIntakeData>({
    age: 30,
    gender: '',
    weight: 70,
    height: 170,
    activityLevel: '',
    climate: '',
    temperature: 25,
    humidity: 50,
    exerciseDuration: 0,
    exerciseIntensity: '',
    pregnancy: false,
    breastfeeding: false,
    illness: [],
    medications: [],
    caffeineIntake: 0,
    alcoholIntake: 0,
    dietType: '',
    workEnvironment: '',
    sweatingLevel: '',
    urineColor: '',
    thirstLevel: 3
  });

  const [result, setResult] = useState<WaterIntakeResult | null>(null);

  const calculateWaterIntake = (): WaterIntakeResult => {
    // 基础水分需求计算
    let baselineWater = 0;
    
    // 根据体重计算基础需求 (35ml/kg)
    baselineWater = formData.weight * 35;
    
    // 性别调整
    if (formData.gender === 'male') {
      baselineWater *= 1.0;
    } else if (formData.gender === 'female') {
      baselineWater *= 0.9;
    }
    
    // 年龄调整
    if (formData.age > 65) {
      baselineWater *= 0.9; // 老年人需水量略减
    } else if (formData.age < 18) {
      baselineWater *= 1.1; // 青少年需水量增加
    }
    
    // 活动水平调整
    let activityMultiplier = 1.0;
    switch (formData.activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.0;
        break;
      case 'light':
        activityMultiplier = 1.1;
        break;
      case 'moderate':
        activityMultiplier = 1.3;
        break;
      case 'active':
        activityMultiplier = 1.5;
        break;
      case 'very_active':
        activityMultiplier = 1.7;
        break;
    }
    
    const withActivity = baselineWater * activityMultiplier;
    
    // 运动额外需求
    let exerciseWater = 0;
    if (formData.exerciseDuration > 0) {
      const baseExerciseWater = formData.exerciseDuration * 12; // 12ml/分钟
      
      switch (formData.exerciseIntensity) {
        case 'low':
          exerciseWater = baseExerciseWater * 1.0;
          break;
        case 'moderate':
          exerciseWater = baseExerciseWater * 1.5;
          break;
        case 'high':
          exerciseWater = baseExerciseWater * 2.0;
          break;
        case 'very_high':
          exerciseWater = baseExerciseWater * 2.5;
          break;
      }
    }
    
    // 气候调整
    let climateAdjustment = 0;
    if (formData.temperature > 30) {
      climateAdjustment += (formData.temperature - 30) * 20; // 每度增加20ml
    }
    if (formData.humidity < 30) {
      climateAdjustment += 200; // 干燥环境增加200ml
    }
    if (formData.climate === 'hot_humid') {
      climateAdjustment += 500;
    } else if (formData.climate === 'hot_dry') {
      climateAdjustment += 700;
    } else if (formData.climate === 'cold_dry') {
      climateAdjustment += 300;
    }
    
    const withClimate = withActivity + climateAdjustment + exerciseWater;
    
    // 其他因子调整
    let factorAdjustment = 0;
    
    // 妊娠和哺乳
    if (formData.pregnancy) {
      factorAdjustment += 300;
    }
    if (formData.breastfeeding) {
      factorAdjustment += 700;
    }
    
    // 疾病调整
    if (formData.illness.includes('fever')) {
      factorAdjustment += 500;
    }
    if (formData.illness.includes('diarrhea')) {
      factorAdjustment += 800;
    }
    if (formData.illness.includes('vomiting')) {
      factorAdjustment += 600;
    }
    if (formData.illness.includes('kidney_disease')) {
      factorAdjustment -= 500; // 肾病可能需要限水
    }
    if (formData.illness.includes('heart_failure')) {
      factorAdjustment -= 300; // 心衰可能需要限水
    }
    
    // 药物调整
    if (formData.medications.includes('diuretics')) {
      factorAdjustment += 400;
    }
    if (formData.medications.includes('ace_inhibitors')) {
      factorAdjustment += 200;
    }
    
    // 咖啡因和酒精
    factorAdjustment += formData.caffeineIntake * 1.5; // 每杯咖啡增加1.5倍水分
    factorAdjustment += formData.alcoholIntake * 2.0; // 每杯酒精增加2倍水分
    
    // 工作环境
    if (formData.workEnvironment === 'air_conditioned') {
      factorAdjustment += 200;
    } else if (formData.workEnvironment === 'heated') {
      factorAdjustment += 300;
    } else if (formData.workEnvironment === 'outdoor') {
      factorAdjustment += 400;
    }
    
    // 出汗水平
    switch (formData.sweatingLevel) {
      case 'minimal':
        factorAdjustment += 0;
        break;
      case 'light':
        factorAdjustment += 200;
        break;
      case 'moderate':
        factorAdjustment += 400;
        break;
      case 'heavy':
        factorAdjustment += 600;
        break;
      case 'excessive':
        factorAdjustment += 800;
        break;
    }
    
    const withFactors = withClimate + factorAdjustment;
    const totalWater = Math.max(withFactors, 1500); // 最低1500ml
    
    // 水分状态评估
    const getHydrationStatus = () => {
      let score = 0;
      
      // 尿液颜色评分
      switch (formData.urineColor) {
        case 'pale_yellow':
          score += 4;
          break;
        case 'light_yellow':
          score += 3;
          break;
        case 'yellow':
          score += 2;
          break;
        case 'dark_yellow':
          score += 1;
          break;
        case 'amber':
          score += 0;
          break;
      }
      
      // 口渴程度评分
      score += (5 - formData.thirstLevel);
      
      if (score >= 7) {
        return {
          level: '良好',
          description: '水分状态良好，继续保持',
          color: 'green',
          indicators: ['尿液颜色正常', '很少感到口渴', '皮肤弹性好', '精神状态佳']
        };
      } else if (score >= 4) {
        return {
          level: '轻度缺水',
          description: '需要增加水分摄入',
          color: 'yellow',
          indicators: ['尿液颜色偏深', '偶尔感到口渴', '可能有轻微疲劳']
        };
      } else {
        return {
          level: '明显缺水',
          description: '需要立即补充水分',
          color: 'red',
          indicators: ['尿液颜色深', '经常感到口渴', '可能有头痛、疲劳等症状']
        };
      }
    };
    
    // 生成饮水时间表
    const generateIntakeSchedule = () => {
      const schedule = [];
      const hourlyAmount = Math.round(totalWater / 16); // 16小时分配
      
      schedule.push({ time: '06:00', amount: Math.round(hourlyAmount * 1.5), type: '温水', reason: '晨起补水，启动代谢' });
      schedule.push({ time: '07:30', amount: hourlyAmount, type: '温水', reason: '餐前30分钟' });
      schedule.push({ time: '09:00', amount: hourlyAmount, type: '温水', reason: '上午补水' });
      schedule.push({ time: '10:30', amount: hourlyAmount, type: '温水', reason: '工作间隙' });
      schedule.push({ time: '11:30', amount: hourlyAmount, type: '温水', reason: '餐前30分钟' });
      schedule.push({ time: '13:30', amount: hourlyAmount, type: '温水', reason: '餐后1小时' });
      schedule.push({ time: '15:00', amount: hourlyAmount, type: '温水', reason: '下午补水' });
      schedule.push({ time: '16:30', amount: hourlyAmount, type: '温水', reason: '工作间隙' });
      schedule.push({ time: '17:30', amount: hourlyAmount, type: '温水', reason: '餐前30分钟' });
      schedule.push({ time: '19:30', amount: hourlyAmount, type: '温水', reason: '餐后1小时' });
      schedule.push({ time: '21:00', amount: Math.round(hourlyAmount * 0.8), type: '温水', reason: '睡前适量' });
      
      if (formData.exerciseDuration > 0) {
        schedule.push({ time: '运动前', amount: 200, type: '运动饮料', reason: '运动前预备' });
        schedule.push({ time: '运动中', amount: Math.round(exerciseWater * 0.6), type: '运动饮料', reason: '运动中补充' });
        schedule.push({ time: '运动后', amount: Math.round(exerciseWater * 0.4), type: '电解质水', reason: '运动后恢复' });
      }
      
      return schedule;
    };
    
    // 水分来源建议
    const getFluidSources = () => {
      const sources = [
        {
          source: '纯净水',
          amount: Math.round(totalWater * 0.6),
          hydrationValue: 100,
          benefits: '最佳的水分补充来源',
          notes: '建议选择优质饮用水'
        },
        {
          source: '淡茶水',
          amount: Math.round(totalWater * 0.2),
          hydrationValue: 95,
          benefits: '含抗氧化物质，有益健康',
          notes: '避免浓茶，影响铁吸收'
        },
        {
          source: '新鲜果汁',
          amount: Math.round(totalWater * 0.1),
          hydrationValue: 85,
          benefits: '提供维生素和矿物质',
          notes: '注意糖分含量，适量饮用'
        },
        {
          source: '汤类',
          amount: Math.round(totalWater * 0.1),
          hydrationValue: 90,
          benefits: '提供水分和营养',
          notes: '注意盐分含量'
        }
      ];
      
      if (formData.exerciseDuration > 0) {
        sources.push({
          source: '运动饮料',
          amount: Math.round(exerciseWater),
          hydrationValue: 95,
          benefits: '快速补充电解质',
          notes: '仅在运动时使用'
        });
      }
      
      return sources;
    };
    
    // 生成建议
    const getRecommendations = () => {
      const timing = [
        '起床后立即喝一杯温水',
        '餐前30分钟适量饮水',
        '餐后1小时再次补水',
        '睡前2小时停止大量饮水'
      ];
      
      const sources = [
        '以纯净水为主要水分来源',
        '适量饮用淡茶水',
        '新鲜果汁要稀释饮用',
        '避免过多含糖饮料'
      ];
      
      const monitoring = [
        '观察尿液颜色变化',
        '注意口渴感觉',
        '监测体重变化',
        '关注皮肤弹性'
      ];
      
      const adjustments = [
        '高温天气增加水分摄入',
        '运动时及时补充',
        '生病时适当增加',
        '根据个人感觉调整'
      ];
      
      return { timing, sources, monitoring, adjustments };
    };
    
    // 生成警告和特殊考虑
    const getWarnings = () => {
      const warnings = [];
      
      if (totalWater > 4000) {
        warnings.push('每日水分摄入量较高，请分次饮用，避免水中毒');
      }
      
      if (formData.illness.includes('kidney_disease')) {
        warnings.push('肾病患者请遵医嘱控制水分摄入量');
      }
      
      if (formData.illness.includes('heart_failure')) {
        warnings.push('心衰患者需要限制水分，请咨询医生');
      }
      
      if (formData.medications.includes('diuretics')) {
        warnings.push('服用利尿剂期间需要增加水分摄入');
      }
      
      return warnings;
    };
    
    const getSpecialConsiderations = () => {
      const considerations = [];
      
      if (formData.pregnancy) {
        considerations.push('孕期需要额外水分支持胎儿发育和羊水形成');
      }
      
      if (formData.breastfeeding) {
        considerations.push('哺乳期需要大量水分用于乳汁分泌');
      }
      
      if (formData.age > 65) {
        considerations.push('老年人口渴感觉减退，需要主动补水');
      }
      
      if (formData.activityLevel === 'very_active') {
        considerations.push('高强度运动者需要特别关注电解质平衡');
      }
      
      return considerations;
    };
    
    return {
      dailyWaterNeeds: {
        baseline: Math.round(baselineWater),
        withActivity: Math.round(withActivity),
        withClimate: Math.round(withClimate),
        withFactors: Math.round(withFactors),
        total: Math.round(totalWater)
      },
      hourlyIntake: Math.round(totalWater / 16),
      intakeSchedule: generateIntakeSchedule(),
      hydrationStatus: getHydrationStatus(),
      recommendations: getRecommendations(),
      fluidSources: getFluidSources(),
      warnings: getWarnings(),
      specialConsiderations: getSpecialConsiderations()
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculationResult = calculateWaterIntake();
    setResult(calculationResult);
  };

  const handleInputChange = (field: keyof WaterIntakeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'illness' | 'medications', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">💧 水分摄入计算器</h1>
            <p className="text-xl text-gray-600">
              科学计算您的每日水分需求，制定个性化补水方案
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">年龄</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    min="1"
                    max="120"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">性别</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="weight">体重 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    min="20"
                    max="300"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">身高 (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                    min="100"
                    max="250"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>环境因素</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="climate">气候类型</Label>
                  <Select value={formData.climate} onValueChange={(value) => handleInputChange('climate', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择气候类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperate">温带 (温和气候)</SelectItem>
                      <SelectItem value="hot_humid">炎热潮湿 (夏季高温高湿)</SelectItem>
                      <SelectItem value="hot_dry">炎热干燥 (沙漠气候)</SelectItem>
                      <SelectItem value="cold_dry">寒冷干燥 (冬季低温低湿)</SelectItem>
                      <SelectItem value="tropical">热带 (全年高温)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temperature">环境温度 (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
                      min="-20"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="humidity">相对湿度 (%)</Label>
                    <Input
                      id="humidity"
                      type="number"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange('humidity', parseInt(e.target.value))}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workEnvironment">工作环境</Label>
                    <Select value={formData.workEnvironment} onValueChange={(value) => handleInputChange('workEnvironment', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择工作环境" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">办公室 (常温)</SelectItem>
                        <SelectItem value="air_conditioned">空调环境 (干燥)</SelectItem>
                        <SelectItem value="heated">暖气环境 (干燥)</SelectItem>
                        <SelectItem value="outdoor">户外工作</SelectItem>
                        <SelectItem value="factory">工厂车间</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sweatingLevel">出汗水平</Label>
                    <Select value={formData.sweatingLevel} onValueChange={(value) => handleInputChange('sweatingLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择出汗水平" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">极少出汗</SelectItem>
                        <SelectItem value="light">轻微出汗</SelectItem>
                        <SelectItem value="moderate">中等出汗</SelectItem>
                        <SelectItem value="heavy">大量出汗</SelectItem>
                        <SelectItem value="excessive">过度出汗</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>健康状况</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pregnancy"
                      checked={formData.pregnancy}
                      onCheckedChange={(checked) => handleInputChange('pregnancy', checked)}
                    />
                    <Label htmlFor="pregnancy">怀孕</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breastfeeding"
                      checked={formData.breastfeeding}
                      onCheckedChange={(checked) => handleInputChange('breastfeeding', checked)}
                    />
                    <Label htmlFor="breastfeeding">哺乳期</Label>
                  </div>
                </div>
                
                <div>
                  <Label>当前疾病或症状</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      { value: 'fever', label: '发热' },
                      { value: 'diarrhea', label: '腹泻' },
                      { value: 'vomiting', label: '呕吐' },
                      { value: 'kidney_disease', label: '肾病' },
                      { value: 'heart_failure', label: '心衰' },
                      { value: 'diabetes', label: '糖尿病' }
                    ].map((illness) => (
                      <div key={illness.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={illness.value}
                          checked={formData.illness.includes(illness.value)}
                          onCheckedChange={(checked) => handleArrayChange('illness', illness.value, checked as boolean)}
                        />
                        <Label htmlFor={illness.value} className="text-sm">{illness.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>正在服用的药物</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      { value: 'diuretics', label: '利尿剂' },
                      { value: 'ace_inhibitors', label: 'ACE抑制剂' },
                      { value: 'beta_blockers', label: 'β受体阻滞剂' },
                      { value: 'antidepressants', label: '抗抑郁药' },
                      { value: 'antihistamines', label: '抗组胺药' },
                      { value: 'pain_relievers', label: '止痛药' }
                    ].map((medication) => (
                      <div key={medication.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={medication.value}
                          checked={formData.medications.includes(medication.value)}
                          onCheckedChange={(checked) => handleArrayChange('medications', medication.value, checked as boolean)}
                        />
                        <Label htmlFor={medication.value} className="text-sm">{medication.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>生活方式</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caffeineIntake">每日咖啡因摄入 (杯)</Label>
                    <Input
                      id="caffeineIntake"
                      type="number"
                      value={formData.caffeineIntake}
                      onChange={(e) => handleInputChange('caffeineIntake', parseInt(e.target.value))}
                      min="0"
                      max="20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="alcoholIntake">每日酒精摄入 (杯)</Label>
                    <Input
                      id="alcoholIntake"
                      type="number"
                      value={formData.alcoholIntake}
                      onChange={(e) => handleInputChange('alcoholIntake', parseInt(e.target.value))}
                      min="0"
                      max="20"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dietType">饮食类型</Label>
                  <Select value={formData.dietType} onValueChange={(value) => handleInputChange('dietType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择饮食类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">均衡饮食</SelectItem>
                      <SelectItem value="high_sodium">高盐饮食</SelectItem>
                      <SelectItem value="low_sodium">低盐饮食</SelectItem>
                      <SelectItem value="high_protein">高蛋白饮食</SelectItem>
                      <SelectItem value="vegetarian">素食</SelectItem>
                      <SelectItem value="keto">生酮饮食</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>当前水分状态评估</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="urineColor">尿液颜色</Label>
                  <Select value={formData.urineColor} onValueChange={(value) => handleInputChange('urineColor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择尿液颜色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pale_yellow">淡黄色 (理想状态)</SelectItem>
                      <SelectItem value="light_yellow">浅黄色 (良好)</SelectItem>
                      <SelectItem value="yellow">黄色 (正常)</SelectItem>
                      <SelectItem value="dark_yellow">深黄色 (轻度缺水)</SelectItem>
                      <SelectItem value="amber">琥珀色 (明显缺水)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="thirstLevel">口渴程度 (1-5分)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[formData.thirstLevel]}
                      onValueChange={(value) => handleInputChange('thirstLevel', value[0])}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>不渴</span>
                      <span>轻微</span>
                      <span>中等</span>
                      <span>很渴</span>
                      <span>极渴</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
              计算水分需求
            </Button>
          </form>

          {result && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl text-blue-600">
                    💧 您的水分摄入建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{result.dailyWaterNeeds.total}ml</div>
                      <div className="text-sm text-gray-600">每日总需水量</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{result.hourlyIntake}ml</div>
                      <div className="text-sm text-gray-600">建议每小时摄入</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{Math.round(result.dailyWaterNeeds.total / 250)}</div>
                      <div className="text-sm text-gray-600">约等于杯数 (250ml/杯)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="schedule">饮水时间表</TabsTrigger>
                  <TabsTrigger value="status">水分状态</TabsTrigger>
                  <TabsTrigger value="sources">水分来源</TabsTrigger>
                  <TabsTrigger value="recommendations">建议</TabsTrigger>
                  <TabsTrigger value="breakdown">需求分解</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule">
                  <Card>
                    <CardHeader>
                      <CardTitle>个性化饮水时间表</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.intakeSchedule.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-16 text-sm font-medium text-blue-600">{item.time}</div>
                              <div className="text-sm text-gray-600">{item.type}</div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-lg font-bold text-gray-900">{item.amount}ml</div>
                              <div className="text-sm text-gray-500">{item.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="status">
                  <Card>
                    <CardHeader>
                      <CardTitle>当前水分状态评估</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${
                          result.hydrationStatus.color === 'green' ? 'bg-green-50 border border-green-200' :
                          result.hydrationStatus.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-4 h-4 rounded-full ${
                              result.hydrationStatus.color === 'green' ? 'bg-green-500' :
                              result.hydrationStatus.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <div className="font-bold text-lg">{result.hydrationStatus.level}</div>
                          </div>
                          <div className="text-gray-700 mb-3">{result.hydrationStatus.description}</div>
                          <div className="space-y-1">
                            {result.hydrationStatus.indicators.map((indicator, index) => (
                              <div key={index} className="text-sm text-gray-600">• {indicator}</div>
                            ))}
                          </div>
                        </div>
                        
                        {result.warnings.length > 0 && (
                          <Alert>
                            <AlertDescription>
                              <div className="font-bold mb-2">⚠️ 重要提醒：</div>
                              {result.warnings.map((warning, index) => (
                                <div key={index} className="text-sm">• {warning}</div>
                              ))}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {result.specialConsiderations.length > 0 && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="font-bold mb-2">💡 特殊考虑：</div>
                            {result.specialConsiderations.map((consideration, index) => (
                              <div key={index} className="text-sm text-gray-700">• {consideration}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sources">
                  <Card>
                    <CardHeader>
                      <CardTitle>推荐水分来源</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.fluidSources.map((source, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-lg">{source.source}</div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-600">{source.amount}ml</div>
                                <div className="text-sm text-gray-500">水分价值: {source.hydrationValue}%</div>
                              </div>
                            </div>
                            <div className="text-gray-700 mb-1">{source.benefits}</div>
                            <div className="text-sm text-gray-500">{source.notes}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations">
                  <Card>
                    <CardHeader>
                      <CardTitle>专业建议</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold mb-3 text-blue-600">⏰ 饮水时机</h4>
                          <div className="space-y-2">
                            {result.recommendations.timing.map((tip, index) => (
                              <div key={index} className="text-sm text-gray-700">• {tip}</div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-3 text-green-600">💧 水分来源</h4>
                          <div className="space-y-2">
                            {result.recommendations.sources.map((tip, index) => (
                              <div key={index} className="text-sm text-gray-700">• {tip}</div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-3 text-purple-600">📊 监测方法</h4>
                          <div className="space-y-2">
                            {result.recommendations.monitoring.map((tip, index) => (
                              <div key={index} className="text-sm text-gray-700">• {tip}</div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-3 text-orange-600">🔄 调整策略</h4>
                          <div className="space-y-2">
                            {result.recommendations.adjustments.map((tip, index) => (
                              <div key={index} className="text-sm text-gray-700">• {tip}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="breakdown">
                  <Card>
                    <CardHeader>
                      <CardTitle>水分需求分解</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">基础需求</div>
                            <div className="text-2xl font-bold text-gray-900">{result.dailyWaterNeeds.baseline}ml</div>
                            <div className="text-xs text-gray-500">基于体重和年龄</div>
                          </div>
                          
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">活动调整后</div>
                            <div className="text-2xl font-bold text-blue-600">{result.dailyWaterNeeds.withActivity}ml</div>
                            <div className="text-xs text-gray-500">考虑日常活动水平</div>
                          </div>
                          
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">环境调整后</div>
                            <div className="text-2xl font-bold text-green-600">{result.dailyWaterNeeds.withClimate}ml</div>
                            <div className="text-xs text-gray-500">考虑气候和运动</div>
                          </div>
                          
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">最终需求</div>
                            <div className="text-2xl font-bold text-purple-600">{result.dailyWaterNeeds.total}ml</div>
                            <div className="text-xs text-gray-500">考虑所有因素</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>💡 水分健康知识</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold mb-3 text-blue-600">水分的重要性</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>体温调节：</strong>通过出汗和呼吸调节体温</p>
                        <p>• <strong>营养运输：</strong>将营养物质运送到各个器官</p>
                        <p>• <strong>废物排除：</strong>通过尿液和汗液排出代谢废物</p>
                        <p>• <strong>关节润滑：</strong>保持关节滑液的正常功能</p>
                        <p>• <strong>消化吸收：</strong>参与食物的消化和营养吸收</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-3 text-green-600">脱水的危害</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>轻度脱水 (2-3%)：</strong>口渴、疲劳、注意力下降</p>
                        <p>• <strong>中度脱水 (4-6%)：</strong>头痛、头晕、尿量减少</p>
                        <p>• <strong>重度脱水 (>6%)：</strong>心率加快、血压下降、意识模糊</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-3 text-purple-600">补水技巧</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>少量多次：</strong>避免一次性大量饮水</p>
                        <p>• <strong>温度适宜：</strong>常温或微温水更易吸收</p>
                        <p>• <strong>运动补水：</strong>运动前、中、后都要补充水分</p>
                        <p>• <strong>电解质平衡：</strong>大量出汗后需补充电解质</p>
                        <p>• <strong>个体差异：</strong>根据个人感觉调整摄入量</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-3 text-orange-600">特殊情况</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>孕期：</strong>需要额外300ml支持胎儿发育</p>
                        <p>• <strong>哺乳期：</strong>需要额外700ml用于乳汁分泌</p>
                        <p>• <strong>老年人：</strong>口渴感觉减退，需要主动补水</p>
                        <p>• <strong>疾病期：</strong>发热、腹泻、呕吐时需增加摄入</p>
                        <p>• <strong>高原环境：</strong>低氧环境下需要更多水分</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertDescription>
                  <div className="text-center">
                    <strong>⚠️ 重要提醒：</strong>
                    本计算器提供的建议仅供参考，不能替代专业医疗建议。
                    如有特殊疾病或健康问题，请咨询医生或营养师。
                    过量饮水可能导致水中毒，请根据个人感觉适量调整。
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

            <Card>
              <CardHeader>
                <CardTitle>活动水平</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="activityLevel">日常活动水平</Label>
                  <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择活动水平" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">久坐 (办公室工作，很少运动)</SelectItem>
                      <SelectItem value="light">轻度活动 (轻松步行，轻度家务)</SelectItem>
                      <SelectItem value="moderate">中度活动 (规律运动，每周3-4次)</SelectItem>
                      <SelectItem value="active">活跃 (每天运动或重体力工作)</SelectItem>
                      <SelectItem value="very_active">非常活跃 (高强度训练或体力劳动)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseDuration">运动时长 (分钟/天)</Label>
                    <Input
                      id="exerciseDuration"
                      type="number"
                      value={formData.exerciseDuration}
                      onChange={(e) => handleInputChange('exerciseDuration', parseInt(e.target.value))}
                      min="0"
                      max="480"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="exerciseIntensity">运动强度</Label>
                    <Select value={formData.exerciseIntensity} onValueChange={(value) => handleInputChange('exerciseIntensity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择运动强度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低强度 (散步、瑜伽)</SelectItem>
                        <SelectItem value="moderate">中强度 (快走、游泳)</SelectItem>
                        <SelectItem value="high">高强度 (跑步、球类运动)</SelectItem>
                        <SelectItem value="very_high">极高强度 (竞技训练)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>