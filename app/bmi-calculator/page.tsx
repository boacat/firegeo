"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

export default function BMICalculator() {
  const { t } = useI18n();
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
        setCategory(t('calculators.bmi.categories.underweight'));
      } else if (bmiValue < 24) {
        setCategory(t('calculators.bmi.categories.normal'));
      } else if (bmiValue < 28) {
        setCategory(t('calculators.bmi.categories.overweight'));
      } else {
        setCategory(t('calculators.bmi.categories.obese'));
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
            {t('calculators.bmi.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('calculators.bmi.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 计算器 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('calculators.bmi.inputTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-lg font-medium">
                  {t('calculators.bmi.height')}
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={t('calculators.bmi.heightPlaceholder')}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-lg p-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-lg font-medium">
                  {t('calculators.bmi.weight')}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={t('calculators.bmi.weightPlaceholder')}
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
                  {t('calculators.bmi.calculate')}
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  className="flex-1 text-lg py-3"
                >
                  {t('calculators.bmi.reset')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 结果显示 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('calculators.bmi.resultTitle')}</CardTitle>
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
                    <h3 className="font-semibold mb-2">{t('calculators.bmi.classification')}</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>{t('calculators.bmi.categories.underweight')}:</span>
                        <span className="text-blue-600">{t('calculators.bmi.ranges.underweight')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('calculators.bmi.categories.normal')}:</span>
                        <span className="text-green-600">{t('calculators.bmi.ranges.normal')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('calculators.bmi.categories.overweight')}:</span>
                        <span className="text-yellow-600">{t('calculators.bmi.ranges.overweight')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('calculators.bmi.categories.obese')}:</span>
                        <span className="text-red-600">{t('calculators.bmi.ranges.obese')}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <p>{t('calculators.bmi.placeholder')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 健康建议 */}
        {bmi && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('calculators.bmi.advice.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-green-600">{t('calculators.bmi.advice.lifestyle.title')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• {t('calculators.bmi.advice.lifestyle.tip1')}</li>
                    <li>• {t('calculators.bmi.advice.lifestyle.tip2')}</li>
                    <li>• {t('calculators.bmi.advice.lifestyle.tip3')}</li>
                    <li>• {t('calculators.bmi.advice.lifestyle.tip4')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue-600">{t('calculators.bmi.advice.notes.title')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• {t('calculators.bmi.advice.notes.note1')}</li>
                    <li>• {t('calculators.bmi.advice.notes.note2')}</li>
                    <li>• {t('calculators.bmi.advice.notes.note3')}</li>
                    <li>• {t('calculators.bmi.advice.notes.note4')}</li>
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