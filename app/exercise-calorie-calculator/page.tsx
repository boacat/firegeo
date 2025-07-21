"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";

export default function ExerciseCalorieCalculatorPage() {
  const { t } = useI18n();
  const [weight, setWeight] = useState("");
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [result, setResult] = useState<any>(null);

  // 运动MET值数据库
  const exerciseDatabase: { [key: string]: { [key: string]: number } } = {
    running: {
      light: 6.0,    // 慢跑 6-8 km/h
      moderate: 8.3, // 中速跑 8-10 km/h
      vigorous: 11.0 // 快跑 >10 km/h
    },
    cycling: {
      light: 4.0,    // 休闲骑行 <16 km/h
      moderate: 6.8, // 中速骑行 16-19 km/h
      vigorous: 10.0 // 快速骑行 >19 km/h
    },
    swimming: {
      light: 6.0,    // 慢游
      moderate: 8.3, // 中速游泳
      vigorous: 11.0 // 快速游泳
    },
    walking: {
      light: 2.5,    // 慢走 <4 km/h
      moderate: 3.8, // 中速走 4-5 km/h
      vigorous: 5.0  // 快走 >5 km/h
    },
    basketball: {
      light: 4.5,    // 投篮练习
      moderate: 6.5, // 半场比赛
      vigorous: 8.0  // 全场比赛
    },
    football: {
      light: 5.0,    // 传球练习
      moderate: 7.0, // 训练
      vigorous: 10.0 // 比赛
    },
    tennis: {
      light: 5.0,    // 双打
      moderate: 7.3, // 单打
      vigorous: 8.0  // 竞技单打
    },
    badminton: {
      light: 4.5,    // 休闲
      moderate: 5.5, // 一般
      vigorous: 7.0  // 竞技
    },
    yoga: {
      light: 2.5,    // 哈他瑜伽
      moderate: 3.0, // 流瑜伽
      vigorous: 4.0  // 热瑜伽
    },
    weightlifting: {
      light: 3.0,    // 轻重量
      moderate: 5.0, // 中等重量
      vigorous: 6.0  // 大重量
    },
    dancing: {
      light: 3.0,    // 慢舞
      moderate: 4.8, // 一般舞蹈
      vigorous: 7.8  // 激烈舞蹈
    },
    hiking: {
      light: 4.0,    // 平地徒步
      moderate: 6.0, // 山地徒步
      vigorous: 8.0  // 负重登山
    }
  };

  const getExerciseName = (key: string) => {
    return t(`calculators.exercise.exercises.${key}`);
  };

  const getIntensityName = (key: string) => {
    return t(`calculators.exercise.intensities.${key}`);
  };

  const calculateCalories = () => {
    if (!weight || !exercise || !duration || !intensity) {
      alert(t('calculators.exercise.validation.fillAllFields'));
      return;
    }

    const w = parseFloat(weight);
    const d = parseFloat(duration);
    const met = exerciseDatabase[exercise][intensity];

    // 卡路里消耗公式: MET × 体重(kg) × 时间(小时)
    const caloriesBurned = met * w * (d / 60);
    
    // 脂肪燃烧量 (1g脂肪 ≈ 9卡路里)
    const fatBurned = caloriesBurned / 9;
    
    // 相当于食物
    const foodEquivalents = {
      rice: Math.round(caloriesBurned / 116), // 100g米饭
      apple: Math.round(caloriesBurned / 52), // 1个苹果
      chocolate: Math.round(caloriesBurned / 546), // 100g巧克力
      coke: Math.round(caloriesBurned / 43) // 100ml可乐
    };

    // 不同体重的消耗对比
    const weightComparison = {
      lighter: Math.round(met * (w - 10) * (d / 60)),
      heavier: Math.round(met * (w + 10) * (d / 60))
    };

    setResult({
      caloriesBurned: Math.round(caloriesBurned),
      fatBurned: fatBurned.toFixed(1),
      met,
      exerciseName: getExerciseName(exercise),
      intensityName: getIntensityName(intensity),
      foodEquivalents,
      weightComparison
    });
  };

  const resetForm = () => {
    setWeight("");
    setExercise("");
    setDuration("");
    setIntensity("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('calculators.exercise.title')}</h1>
          <p className="text-lg text-gray-600">
            {t('calculators.exercise.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('calculators.exercise.inputInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">{t('calculators.exercise.weight')}</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={t('calculators.exercise.weightPlaceholder')}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="exercise">{t('calculators.exercise.exerciseType')}</Label>
                <Select value={exercise} onValueChange={setExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calculators.exercise.selectExercise')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(exerciseDatabase).map((key) => (
                      <SelectItem key={key} value={key}>{getExerciseName(key)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="intensity">{t('calculators.exercise.intensity')}</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calculators.exercise.selectIntensity')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{getIntensityName('light')}</SelectItem>
                    <SelectItem value="moderate">{getIntensityName('moderate')}</SelectItem>
                    <SelectItem value="vigorous">{getIntensityName('vigorous')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">{t('calculators.exercise.duration')}</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder={t('calculators.exercise.durationPlaceholder')}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateCalories} className="flex-1">
                  {t('calculators.exercise.calculate')}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  {t('calculators.exercise.reset')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 计算结果 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>{t('calculators.exercise.resultTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{result.caloriesBurned}</div>
                      <div className="text-sm text-gray-600">{t('calculators.exercise.caloriesBurned')}</div>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-semibold text-blue-600">{result.fatBurned}g</div>
                    <div className="text-xs text-gray-600">{t('calculators.exercise.fatBurned')}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-semibold text-purple-600">{result.met}</div>
                    <div className="text-xs text-gray-600">{t('calculators.exercise.metValue')}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">{t('calculators.exercise.foodEquivalents')}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>🍚 {t('calculators.exercise.foods.rice')}</span>
                      <span>{result.foodEquivalents.rice} {t('calculators.exercise.foods.riceBowls')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🍎 {t('calculators.exercise.foods.apple')}</span>
                      <span>{result.foodEquivalents.apple} {t('calculators.exercise.foods.appleCount')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🍫 {t('calculators.exercise.foods.chocolate')}</span>
                      <span>{result.foodEquivalents.chocolate} {t('calculators.exercise.foods.chocolatePieces')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🥤 {t('calculators.exercise.foods.coke')}</span>
                      <span>{result.foodEquivalents.coke} {t('calculators.exercise.foods.cokeCups')}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">{t('calculators.exercise.weightComparison')}</h4>
                  <div className="text-sm space-y-1">
                     <div className="flex justify-between">
                       <span>{t('calculators.exercise.weightComparisonLabels.lighter')}</span>
                       <span>{result.weightComparison.lighter} {t('calculators.exercise.weightComparisonLabels.calories')}</span>
                     </div>
                     <div className="flex justify-between">
                       <span>{t('calculators.exercise.weightComparisonLabels.heavier')}</span>
                       <span>{result.weightComparison.heavier} {t('calculators.exercise.weightComparisonLabels.calories')}</span>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 运动指南 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">{t('calculators.exercise.guides.highIntensity.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Running (8-12 MET)</li>
                <li>• Swimming (6-11 MET)</li>
                <li>• Cycling (4-10 MET)</li>
                <li>• Football (5-10 MET)</li>
                <li>• Basketball (4.5-8 MET)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">{t('calculators.exercise.guides.mediumIntensity.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Tennis (5-8 MET)</li>
                <li>• Badminton (4.5-7 MET)</li>
                <li>• Weightlifting (3-6 MET)</li>
                <li>• Dancing (3-7.8 MET)</li>
                <li>• Hiking (4-8 MET)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">{t('calculators.exercise.guides.lowIntensity.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>• Walking (2-4 MET)</li>
                <li>• Yoga (2-4 MET)</li>
                <li>• Tai Chi (1.5-4 MET)</li>
                <li>• Stretching (2.3 MET)</li>
                <li>• Light housework (2-3.5 MET)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 运动建议 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('calculators.exercise.advice.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">{t('calculators.exercise.advice.weightLoss.title')}</h3>
                <ul className="text-sm space-y-1">
                  <li>• Combine aerobic and strength training</li>
                  <li>• Exercise at least 150 minutes per week</li>
                  <li>• Maintain consistent workout schedule</li>
                  <li>• Gradually increase exercise intensity</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('calculators.exercise.advice.precautions.title')}</h3>
                <ul className="text-sm space-y-1">
                  <li>• Warm up before exercising</li>
                  <li>• Stay hydrated during workouts</li>
                  <li>• Listen to your body and rest when needed</li>
                  <li>• Consult doctor before starting new exercise program</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('calculators.exercise.instructions.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">{t('calculators.exercise.instructions.principle.title')}</h3>
                <ul className="text-sm space-y-1">
                  {t('calculators.exercise.instructions.principle.points', { returnObjects: true }).map((point: string, index: number) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('calculators.exercise.instructions.accuracy.title')}</h3>
                <ul className="text-sm space-y-1">
                  {t('calculators.exercise.instructions.accuracy.points', { returnObjects: true }).map((point: string, index: number) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}