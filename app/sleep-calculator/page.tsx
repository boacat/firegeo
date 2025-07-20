"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface SleepResult {
  sleepEfficiency: number;
  sleepQualityScore: number;
  sleepDebt: number;
  riskLevel: string;
  riskColor: string;
  recommendations: string[];
  sleepStages: {
    deep: number;
    rem: number;
    light: number;
  };
}

export default function SleepQualityCalculator() {
  const [bedTime, setBedTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [timeToFallAsleep, setTimeToFallAsleep] = useState("");
  const [nightWakeups, setNightWakeups] = useState("");
  const [wakeupDuration, setWakeupDuration] = useState("");
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [morningFatigue, setMorningFatigue] = useState([3]);
  const [daytimeSleepiness, setDaytimeSleepiness] = useState([3]);
  const [age, setAge] = useState("");
  const [caffeine, setCaffeine] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [exercise, setExercise] = useState(false);
  const [stress, setStress] = useState(false);
  const [screenTime, setScreenTime] = useState(false);
  const [medication, setMedication] = useState(false);
  const [result, setResult] = useState<SleepResult | null>(null);

  const calculateSleepQuality = () => {
    if (!bedTime || !sleepTime || !wakeTime || !timeToFallAsleep) return;
    
    // 计算睡眠时间
    const bedTimeDate = new Date(`2024-01-01 ${bedTime}`);
    const sleepTimeDate = new Date(`2024-01-01 ${sleepTime}`);
    const wakeTimeDate = new Date(`2024-01-02 ${wakeTime}`);
    
    // 如果入睡时间在午夜后，调整日期
    if (sleepTimeDate < bedTimeDate) {
      sleepTimeDate.setDate(sleepTimeDate.getDate() + 1);
    }
    
    const timeInBed = (wakeTimeDate.getTime() - bedTimeDate.getTime()) / (1000 * 60); // 分钟
    const totalSleepTime = (wakeTimeDate.getTime() - sleepTimeDate.getTime()) / (1000 * 60) - 
                          (parseInt(nightWakeups || "0") * parseInt(wakeupDuration || "0")); // 分钟
    
    // 计算睡眠效率
    const sleepEfficiency = Math.round((totalSleepTime / timeInBed) * 100);
    
    // 计算睡眠债务（基于年龄推荐睡眠时间）
    const ageNum = parseInt(age || "30");
    let recommendedSleep = 8; // 小时
    if (ageNum < 18) recommendedSleep = 9;
    else if (ageNum < 26) recommendedSleep = 8.5;
    else if (ageNum < 65) recommendedSleep = 8;
    else recommendedSleep = 7.5;
    
    const actualSleepHours = totalSleepTime / 60;
    const sleepDebt = Math.max(0, recommendedSleep - actualSleepHours);
    
    // 计算睡眠质量评分
    let qualityScore = 0;
    
    // 睡眠效率权重 (30%)
    if (sleepEfficiency >= 85) qualityScore += 30;
    else if (sleepEfficiency >= 75) qualityScore += 25;
    else if (sleepEfficiency >= 65) qualityScore += 20;
    else qualityScore += 10;
    
    // 入睡时间权重 (20%)
    const fallAsleepTime = parseInt(timeToFallAsleep);
    if (fallAsleepTime <= 15) qualityScore += 20;
    else if (fallAsleepTime <= 30) qualityScore += 15;
    else if (fallAsleepTime <= 45) qualityScore += 10;
    else qualityScore += 5;
    
    // 夜间醒来次数权重 (15%)
    const wakeups = parseInt(nightWakeups || "0");
    if (wakeups === 0) qualityScore += 15;
    else if (wakeups <= 1) qualityScore += 12;
    else if (wakeups <= 2) qualityScore += 8;
    else qualityScore += 3;
    
    // 主观睡眠质量权重 (20%)
    qualityScore += (sleepQuality[0] / 10) * 20;
    
    // 晨起疲劳度权重 (10%)
    qualityScore += ((10 - morningFatigue[0]) / 10) * 10;
    
    // 日间嗜睡权重 (5%)
    qualityScore += ((10 - daytimeSleepiness[0]) / 10) * 5;
    
    // 风险因子扣分
    if (caffeine) qualityScore -= 3;
    if (alcohol) qualityScore -= 5;
    if (stress) qualityScore -= 4;
    if (screenTime) qualityScore -= 3;
    if (medication) qualityScore -= 2;
    if (!exercise) qualityScore -= 2;
    
    qualityScore = Math.max(0, Math.min(100, qualityScore));
    
    // 风险等级评估
    let riskLevel = "";
    let riskColor = "";
    let recommendations: string[] = [];
    
    if (qualityScore >= 80) {
      riskLevel = "优秀睡眠";
      riskColor = "text-green-600";
      recommendations = [
        "保持良好的睡眠习惯",
        "继续规律的作息时间",
        "维持健康的睡眠环境"
      ];
    } else if (qualityScore >= 65) {
      riskLevel = "良好睡眠";
      riskColor = "text-blue-600";
      recommendations = [
        "保持现有的睡眠习惯",
        "可以进一步优化睡眠环境",
        "注意睡前放松"
      ];
    } else if (qualityScore >= 50) {
      riskLevel = "一般睡眠";
      riskColor = "text-yellow-600";
      recommendations = [
        "建立更规律的睡眠时间",
        "改善睡眠环境",
        "减少睡前刺激性活动",
        "考虑放松技巧"
      ];
    } else if (qualityScore >= 35) {
      riskLevel = "较差睡眠";
      riskColor = "text-orange-600";
      recommendations = [
        "需要改善睡眠习惯",
        "建立睡前例行程序",
        "避免睡前咖啡因和酒精",
        "考虑咨询睡眠专家"
      ];
    } else {
      riskLevel = "睡眠障碍";
      riskColor = "text-red-600";
      recommendations = [
        "强烈建议咨询睡眠医学专家",
        "可能需要睡眠监测",
        "全面评估睡眠障碍",
        "考虑认知行为疗法"
      ];
    }
    
    // 估算睡眠阶段分布
    const sleepStages = {
      deep: Math.round(actualSleepHours * 0.2 * 60), // 深睡眠约20%
      rem: Math.round(actualSleepHours * 0.25 * 60), // REM睡眠约25%
      light: Math.round(actualSleepHours * 0.55 * 60) // 浅睡眠约55%
    };
    
    setResult({
      sleepEfficiency,
      sleepQualityScore: Math.round(qualityScore),
      sleepDebt: Math.round(sleepDebt * 10) / 10,
      riskLevel,
      riskColor,
      recommendations,
      sleepStages
    });
  };

  const reset = () => {
    setBedTime("");
    setSleepTime("");
    setWakeTime("");
    setTimeToFallAsleep("");
    setNightWakeups("");
    setWakeupDuration("");
    setSleepQuality([7]);
    setMorningFatigue([3]);
    setDaytimeSleepiness([3]);
    setAge("");
    setCaffeine(false);
    setAlcohol(false);
    setExercise(false);
    setStress(false);
    setScreenTime(false);
    setMedication(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            睡眠质量评估计算器
          </h1>
          <p className="text-xl text-gray-600">
            全面评估您的睡眠质量，提供个性化改善建议
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">睡眠数据输入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedTime" className="text-sm font-medium">
                    上床时间
                  </Label>
                  <Input
                    id="bedTime"
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sleepTime" className="text-sm font-medium">
                    入睡时间
                  </Label>
                  <Input
                    id="sleepTime"
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wakeTime" className="text-sm font-medium">
                    起床时间
                  </Label>
                  <Input
                    id="wakeTime"
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeToFallAsleep" className="text-sm font-medium">
                    入睡用时 (分钟)
                  </Label>
                  <Input
                    id="timeToFallAsleep"
                    type="number"
                    placeholder="例如: 15"
                    value={timeToFallAsleep}
                    onChange={(e) => setTimeToFallAsleep(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nightWakeups" className="text-sm font-medium">
                    夜间醒来次数
                  </Label>
                  <Input
                    id="nightWakeups"
                    type="number"
                    placeholder="例如: 1"
                    value={nightWakeups}
                    onChange={(e) => setNightWakeups(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wakeupDuration" className="text-sm font-medium">
                    每次醒来时长 (分钟)
                  </Label>
                  <Input
                    id="wakeupDuration"
                    type="number"
                    placeholder="例如: 10"
                    value={wakeupDuration}
                    onChange={(e) => setWakeupDuration(e.target.value)}
                    className="text-lg p-3"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    主观睡眠质量 (1-10分): {sleepQuality[0]}
                  </Label>
                  <Slider
                    value={sleepQuality}
                    onValueChange={setSleepQuality}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>很差</span>
                    <span>一般</span>
                    <span>很好</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    晨起疲劳度 (1-10分): {morningFatigue[0]}
                  </Label>
                  <Slider
                    value={morningFatigue}
                    onValueChange={setMorningFatigue}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>很清醒</span>
                    <span>一般</span>
                    <span>很疲劳</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    日间嗜睡程度 (1-10分): {daytimeSleepiness[0]}
                  </Label>
                  <Slider
                    value={daytimeSleepiness}
                    onValueChange={setDaytimeSleepiness}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>很清醒</span>
                    <span>一般</span>
                    <span>很困倦</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  年龄
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="例如: 30"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-lg p-3"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">影响因子（昨晚是否有以下情况）</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="caffeine" 
                      checked={caffeine} 
                      onCheckedChange={setCaffeine}
                    />
                    <Label htmlFor="caffeine" className="text-sm">睡前咖啡因</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="alcohol" 
                      checked={alcohol} 
                      onCheckedChange={setAlcohol}
                    />
                    <Label htmlFor="alcohol" className="text-sm">饮酒</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exercise" 
                      checked={exercise} 
                      onCheckedChange={setExercise}
                    />
                    <Label htmlFor="exercise" className="text-sm">规律运动</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="stress" 
                      checked={stress} 
                      onCheckedChange={setStress}
                    />
                    <Label htmlFor="stress" className="text-sm">压力大</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="screenTime" 
                      checked={screenTime} 
                      onCheckedChange={setScreenTime}
                    />
                    <Label htmlFor="screenTime" className="text-sm">睡前看屏幕</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="medication" 
                      checked={medication} 
                      onCheckedChange={setMedication}
                    />
                    <Label htmlFor="medication" className="text-sm">服用药物</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateSleepQuality}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-lg py-3"
                  disabled={!bedTime || !sleepTime || !wakeTime || !timeToFallAsleep}
                >
                  评估睡眠质量
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
              <CardTitle className="text-2xl text-center">睡眠质量评估</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className={`text-4xl font-bold ${result.riskColor}`}>
                      {result.sleepQualityScore}分
                    </div>
                    <div className={`text-2xl font-semibold ${result.riskColor}`}>
                      {result.riskLevel}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.sleepEfficiency}%</div>
                      <div className="text-sm text-gray-600">睡眠效率</div>
                      <div className="text-xs text-gray-500">
                        {result.sleepEfficiency >= 85 ? "优秀" : 
                         result.sleepEfficiency >= 75 ? "良好" : 
                         result.sleepEfficiency >= 65 ? "一般" : "较差"}
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">{result.sleepDebt}h</div>
                      <div className="text-sm text-gray-600">睡眠债务</div>
                      <div className="text-xs text-gray-500">
                        {result.sleepDebt === 0 ? "无债务" : 
                         result.sleepDebt < 1 ? "轻微" : 
                         result.sleepDebt < 2 ? "中等" : "严重"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">估算睡眠阶段分布：</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">深睡眠</span>
                        <span className="font-semibold">{result.sleepStages.deep}分钟</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">REM睡眠</span>
                        <span className="font-semibold">{result.sleepStages.rem}分钟</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">浅睡眠</span>
                        <span className="font-semibold">{result.sleepStages.light}分钟</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '55%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">改善建议：</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">😴</div>
                  <p>请输入睡眠数据进行质量评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 睡眠知识科普 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">睡眠知识科普</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌙</div>
                <h3 className="font-semibold mb-2">深睡眠</h3>
                <p className="text-sm text-gray-600">
                  身体修复和生长激素分泌的关键阶段，约占总睡眠时间的15-20%。
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-2">REM睡眠</h3>
                <p className="text-sm text-gray-600">
                  记忆整合和情绪处理的重要阶段，约占总睡眠时间的20-25%。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">睡眠效率</h3>
                <p className="text-sm text-gray-600">
                  实际睡眠时间占在床时间的比例，85%以上为优秀。
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💤</div>
                <h3 className="font-semibold mb-2">睡眠债务</h3>
                <p className="text-sm text-gray-600">
                  累积的睡眠不足，会影响认知功能和身体健康。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 改善睡眠的建议 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">改善睡眠质量的方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🕘</div>
                <h3 className="font-semibold text-lg mb-3">规律作息</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 固定睡眠和起床时间</li>
                  <li>• 周末也要保持规律</li>
                  <li>• 建立睡前例行程序</li>
                  <li>• 避免长时间午睡</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🛏️</div>
                <h3 className="font-semibold text-lg mb-3">睡眠环境</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 保持房间凉爽安静</li>
                  <li>• 使用遮光窗帘</li>
                  <li>• 舒适的床垫和枕头</li>
                  <li>• 移除电子设备</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🧘</div>
                <h3 className="font-semibold text-lg mb-3">放松技巧</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 深呼吸练习</li>
                  <li>• 渐进性肌肉放松</li>
                  <li>• 冥想或正念练习</li>
                  <li>• 避免睡前刺激</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}