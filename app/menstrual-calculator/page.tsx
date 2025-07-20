"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CycleResult {
  nextPeriod: Date;
  ovulationDate: Date;
  fertilityWindow: { start: Date; end: Date };
  cyclePhases: {
    menstrual: { start: Date; end: Date };
    follicular: { start: Date; end: Date };
    ovulation: { start: Date; end: Date };
    luteal: { start: Date; end: Date };
  };
  cycleLength: number;
  periodLength: number;
  cycleRegularity: string;
  predictions: Date[];
  symptoms: string[];
  recommendations: string[];
}

export default function MenstrualCycleCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("");
  const [periodLength, setPeriodLength] = useState("");
  const [age, setAge] = useState("");
  const [contraceptive, setContraceptive] = useState("");
  
  // 症状追踪
  const [cramps, setCramps] = useState(false);
  const [heavyFlow, setHeavyFlow] = useState(false);
  const [irregularCycle, setIrregularCycle] = useState(false);
  const [moodChanges, setMoodChanges] = useState(false);
  const [bloating, setBloating] = useState(false);
  const [breastTenderness, setBreastTenderness] = useState(false);
  const [acne, setAcne] = useState(false);
  const [fatigue, setFatigue] = useState(false);
  
  // 生活方式因素
  const [stressLevel, setStressLevel] = useState("");
  const [exerciseLevel, setExerciseLevel] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [diet, setDiet] = useState("");
  
  const [result, setResult] = useState<CycleResult | null>(null);

  const calculateCycle = () => {
    if (!lastPeriodDate || !cycleLength || !periodLength) {
      alert("请填写必要信息");
      return;
    }
    
    const cycleLengthNum = parseInt(cycleLength);
    const periodLengthNum = parseInt(periodLength);
    
    // 计算下次月经日期
    const nextPeriod = new Date(lastPeriodDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLengthNum);
    
    // 计算排卵日（月经前14天）
    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    
    // 计算受孕窗口期（排卵日前5天到排卵日后1天）
    const fertilityStart = new Date(ovulationDate);
    fertilityStart.setDate(fertilityStart.getDate() - 5);
    const fertilityEnd = new Date(ovulationDate);
    fertilityEnd.setDate(fertilityEnd.getDate() + 1);
    
    // 计算月经周期各阶段
    const menstrualStart = new Date(lastPeriodDate);
    const menstrualEnd = new Date(lastPeriodDate);
    menstrualEnd.setDate(menstrualEnd.getDate() + periodLengthNum - 1);
    
    const follicularStart = new Date(lastPeriodDate);
    const follicularEnd = new Date(ovulationDate);
    follicularEnd.setDate(follicularEnd.getDate() - 1);
    
    const ovulationStart = new Date(ovulationDate);
    ovulationStart.setDate(ovulationStart.getDate() - 1);
    const ovulationEnd = new Date(ovulationDate);
    ovulationEnd.setDate(ovulationEnd.getDate() + 1);
    
    const lutealStart = new Date(ovulationDate);
    lutealStart.setDate(lutealStart.getDate() + 2);
    const lutealEnd = new Date(nextPeriod);
    lutealEnd.setDate(lutealEnd.getDate() - 1);
    
    // 预测未来3个月的月经日期
    const predictions = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(lastPeriodDate);
      futureDate.setDate(futureDate.getDate() + cycleLengthNum * i);
      predictions.push(futureDate);
    }
    
    // 评估周期规律性
    let cycleRegularity = "";
    if (cycleLengthNum >= 21 && cycleLengthNum <= 35) {
      if (cycleLengthNum >= 26 && cycleLengthNum <= 32) {
        cycleRegularity = "非常规律";
      } else {
        cycleRegularity = "基本规律";
      }
    } else {
      cycleRegularity = "不规律";
    }
    
    // 症状分析
    const symptoms = [];
    if (cramps) symptoms.push("痛经");
    if (heavyFlow) symptoms.push("月经量过多");
    if (irregularCycle) symptoms.push("周期不规律");
    if (moodChanges) symptoms.push("情绪变化");
    if (bloating) symptoms.push("腹胀");
    if (breastTenderness) symptoms.push("乳房胀痛");
    if (acne) symptoms.push("痤疮");
    if (fatigue) symptoms.push("疲劳");
    
    // 生成建议
    const recommendations = [];
    
    if (cycleLengthNum < 21 || cycleLengthNum > 35) {
      recommendations.push("建议咨询妇科医生，评估周期异常原因");
    }
    
    if (periodLengthNum > 7) {
      recommendations.push("月经期较长，建议医学检查");
    }
    
    if (cramps) {
      recommendations.push("痛经可通过热敷、适度运动和放松技巧缓解");
    }
    
    if (heavyFlow) {
      recommendations.push("月经量过多可能需要医学评估，注意补充铁质");
    }
    
    if (stressLevel === "high") {
      recommendations.push("高压力可能影响月经周期，建议压力管理");
    }
    
    if (exerciseLevel === "low") {
      recommendations.push("适度运动有助于缓解经期不适");
    }
    
    if (sleepQuality === "poor") {
      recommendations.push("改善睡眠质量有助于激素平衡");
    }
    
    recommendations.push("保持健康饮食，充足水分摄入");
    recommendations.push("记录月经周期有助于健康管理");
    
    setResult({
      nextPeriod,
      ovulationDate,
      fertilityWindow: { start: fertilityStart, end: fertilityEnd },
      cyclePhases: {
        menstrual: { start: menstrualStart, end: menstrualEnd },
        follicular: { start: follicularStart, end: follicularEnd },
        ovulation: { start: ovulationStart, end: ovulationEnd },
        luteal: { start: lutealStart, end: lutealEnd }
      },
      cycleLength: cycleLengthNum,
      periodLength: periodLengthNum,
      cycleRegularity,
      predictions,
      symptoms,
      recommendations
    });
  };

  const reset = () => {
    setLastPeriodDate(undefined);
    setCycleLength("");
    setPeriodLength("");
    setAge("");
    setContraceptive("");
    
    setCramps(false);
    setHeavyFlow(false);
    setIrregularCycle(false);
    setMoodChanges(false);
    setBloating(false);
    setBreastTenderness(false);
    setAcne(false);
    setFatigue(false);
    
    setStressLevel("");
    setExerciseLevel("");
    setSleepQuality("");
    setDiet("");
    
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            月经周期计算器
          </h1>
          <p className="text-xl text-gray-600">
            追踪和预测您的月经周期，了解生理变化规律
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">周期信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">上次月经开始日期 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lastPeriodDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lastPeriodDate ? format(lastPeriodDate, "yyyy年MM月dd日") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lastPeriodDate}
                        onSelect={setLastPeriodDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength" className="text-sm font-medium">周期长度（天）*</Label>
                    <Input
                      id="cycleLength"
                      type="number"
                      placeholder="28"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(e.target.value)}
                      min="15"
                      max="45"
                    />
                    <p className="text-xs text-gray-500">正常范围：21-35天</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="periodLength" className="text-sm font-medium">经期长度（天）*</Label>
                    <Input
                      id="periodLength"
                      type="number"
                      placeholder="5"
                      value={periodLength}
                      onChange={(e) => setPeriodLength(e.target.value)}
                      min="2"
                      max="10"
                    />
                    <p className="text-xs text-gray-500">正常范围：3-7天</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">年龄</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="12"
                      max="60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">避孕方式</Label>
                    <Select value={contraceptive} onValueChange={setContraceptive}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择避孕方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无</SelectItem>
                        <SelectItem value="pill">口服避孕药</SelectItem>
                        <SelectItem value="iud">宫内节育器</SelectItem>
                        <SelectItem value="implant">皮下埋植</SelectItem>
                        <SelectItem value="injection">避孕针</SelectItem>
                        <SelectItem value="barrier">屏障避孕</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 症状追踪 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-pink-600">症状追踪（最近周期）</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cramps" checked={cramps} onCheckedChange={(checked) => setCramps(checked as boolean)} />
                    <Label htmlFor="cramps" className="text-sm">痛经</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="heavyFlow" checked={heavyFlow} onCheckedChange={(checked) => setHeavyFlow(checked as boolean)} />
                    <Label htmlFor="heavyFlow" className="text-sm">月经量过多</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="irregularCycle" checked={irregularCycle} onCheckedChange={(checked) => setIrregularCycle(checked as boolean)} />
                    <Label htmlFor="irregularCycle" className="text-sm">周期不规律</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="moodChanges" checked={moodChanges} onCheckedChange={(checked) => setMoodChanges(checked as boolean)} />
                    <Label htmlFor="moodChanges" className="text-sm">情绪变化</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bloating" checked={bloating} onCheckedChange={(checked) => setBloating(checked as boolean)} />
                    <Label htmlFor="bloating" className="text-sm">腹胀</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="breastTenderness" checked={breastTenderness} onCheckedChange={(checked) => setBreastTenderness(checked as boolean)} />
                    <Label htmlFor="breastTenderness" className="text-sm">乳房胀痛</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="acne" checked={acne} onCheckedChange={(checked) => setAcne(checked as boolean)} />
                    <Label htmlFor="acne" className="text-sm">痤疮</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fatigue" checked={fatigue} onCheckedChange={(checked) => setFatigue(checked as boolean)} />
                    <Label htmlFor="fatigue" className="text-sm">疲劳</Label>
                  </div>
                </div>
              </div>

              {/* 生活方式因素 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-purple-600">生活方式因素</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">压力水平</Label>
                    <Select value={stressLevel} onValueChange={setStressLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择压力水平" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="moderate">中等</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">运动水平</Label>
                    <Select value={exerciseLevel} onValueChange={setExerciseLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择运动水平" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">很少运动</SelectItem>
                        <SelectItem value="moderate">适度运动</SelectItem>
                        <SelectItem value="high">经常运动</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">睡眠质量</Label>
                    <Select value={sleepQuality} onValueChange={setSleepQuality}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择睡眠质量" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">较差</SelectItem>
                        <SelectItem value="fair">一般</SelectItem>
                        <SelectItem value="good">良好</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">饮食习惯</Label>
                    <Select value={diet} onValueChange={setDiet}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择饮食习惯" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">不规律</SelectItem>
                        <SelectItem value="fair">一般</SelectItem>
                        <SelectItem value="good">健康均衡</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateCycle}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-lg py-3"
                >
                  计算周期
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
              <CardTitle className="text-2xl text-center">周期预测</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-pink-600 mb-2">下次月经预测</div>
                      <div className="text-2xl font-bold text-pink-700">
                        {format(result.nextPeriod, "yyyy年MM月dd日")}
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600 mb-2">排卵日预测</div>
                      <div className="text-2xl font-bold text-purple-700">
                        {format(result.ovulationDate, "yyyy年MM月dd日")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-700">受孕窗口期：</h3>
                    <p className="text-blue-600">
                      {format(result.fertilityWindow.start, "MM月dd日")} - {format(result.fertilityWindow.end, "MM月dd日")}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">这段时间受孕概率较高</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-700">{result.cycleLength}天</div>
                      <div className="text-sm text-gray-600">周期长度</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-700">{result.periodLength}天</div>
                      <div className="text-sm text-gray-600">经期长度</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-green-700">周期规律性：</h3>
                    <p className={`text-lg font-semibold ${
                      result.cycleRegularity === "非常规律" ? "text-green-600" :
                      result.cycleRegularity === "基本规律" ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {result.cycleRegularity}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-700">未来3个月预测：</h3>
                    <div className="space-y-2">
                      {result.predictions.map((date, index) => (
                        <div key={index} className="flex justify-between">
                          <span>第{index + 2}次月经：</span>
                          <span className="font-semibold">{format(date, "yyyy年MM月dd日")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {result.symptoms.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-red-700">记录的症状：</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.symptoms.map((symptom, index) => (
                          <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-700">健康建议：</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🌸</div>
                  <p>请输入月经周期信息进行计算</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 月经周期知识 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">月经周期知识</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🩸</div>
                <h3 className="font-semibold mb-2">月经期</h3>
                <p className="text-sm text-gray-600">
                  子宫内膜脱落，持续3-7天。注意保暖，避免剧烈运动。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌱</div>
                <h3 className="font-semibold mb-2">卵泡期</h3>
                <p className="text-sm text-gray-600">
                  卵泡发育期，雌激素上升，精力充沛，适合运动。
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🥚</div>
                <h3 className="font-semibold mb-2">排卵期</h3>
                <p className="text-sm text-gray-600">
                  卵子释放，受孕概率最高，体温略升，分泌物增多。
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌙</div>
                <h3 className="font-semibold mb-2">黄体期</h3>
                <p className="text-sm text-gray-600">
                  孕激素分泌，可能出现PMS症状，注意情绪管理。
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-pink-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-pink-700">经期护理小贴士：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• 保持外阴清洁干燥</li>
                  <li>• 选择透气性好的卫生用品</li>
                  <li>• 避免盆浴，选择淋浴</li>
                  <li>• 适当休息，避免过度劳累</li>
                </ul>
                <ul className="space-y-1">
                  <li>• 多喝温水，避免冷饮</li>
                  <li>• 补充铁质，预防贫血</li>
                  <li>• 适度运动，缓解不适</li>
                  <li>• 记录周期，关注变化</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}