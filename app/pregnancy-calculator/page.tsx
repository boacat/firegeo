"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays, differenceInDays, differenceInWeeks } from "date-fns";
import { cn } from "@/lib/utils";

interface PregnancyResult {
  dueDate: Date;
  currentWeek: number;
  currentDay: number;
  daysRemaining: number;
  trimester: number;
  trimesterWeek: number;
  conceptionDate: Date;
  milestones: {
    firstTrimesterEnd: Date;
    secondTrimesterEnd: Date;
    viabilityDate: Date;
    fullTermStart: Date;
  };
  weeklyInfo: {
    babySize: string;
    babyWeight: string;
    development: string[];
    symptoms: string[];
    tips: string[];
  };
  appointments: {
    date: Date;
    type: string;
    description: string;
  }[];
}

export default function PregnancyCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date>();
  const [cycleLength, setCycleLength] = useState("28");
  const [calculationMethod, setCalculationMethod] = useState("lmp"); // lmp, conception, ultrasound
  const [conceptionDate, setConceptionDate] = useState<Date>();
  const [ultrasoundDate, setUltrasoundDate] = useState<Date>();
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState("");
  const [ultrasoundDays, setUltrasoundDays] = useState("");
  
  // 个人信息
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [prePregnancyWeight, setPrePregnancyWeight] = useState("");
  const [firstPregnancy, setFirstPregnancy] = useState("");
  
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const getWeeklyInfo = (week: number) => {
    const weeklyData = {
      4: {
        babySize: "罂粟籽",
        babyWeight: "< 1g",
        development: ["胚胎着床", "神经管开始形成", "心脏开始发育"],
        symptoms: ["可能还没有症状", "轻微疲劳"],
        tips: ["开始服用叶酸", "避免酒精和吸烟", "保持健康饮食"]
      },
      8: {
        babySize: "覆盆子",
        babyWeight: "1g",
        development: ["四肢开始形成", "面部特征发育", "心脏跳动"],
        symptoms: ["晨吐", "乳房胀痛", "疲劳", "尿频"],
        tips: ["多休息", "少食多餐", "避免刺激性食物"]
      },
      12: {
        babySize: "李子",
        babyWeight: "14g",
        development: ["器官基本形成", "开始有反射动作", "性别可能确定"],
        symptoms: ["晨吐可能减轻", "精力恢复", "食欲改善"],
        tips: ["进行产前检查", "考虑告知亲友", "继续补充营养"]
      },
      16: {
        babySize: "鳄梨",
        babyWeight: "100g",
        development: ["听觉发育", "开始长头发", "骨骼硬化"],
        symptoms: ["精力充沛", "皮肤变化", "腹部开始显现"],
        tips: ["开始胎教", "适度运动", "选择孕妇装"]
      },
      20: {
        babySize: "香蕉",
        babyWeight: "300g",
        development: ["可能感受到胎动", "指纹形成", "吞咽羊水"],
        symptoms: ["胎动", "腰痛", "腿部抽筋"],
        tips: ["进行大排畸检查", "注意胎动", "补充钙质"]
      },
      24: {
        babySize: "玉米",
        babyWeight: "600g",
        development: ["肺部发育", "听力完善", "皮肤透明"],
        symptoms: ["胎动明显", "妊娠纹", "便秘"],
        tips: ["糖尿病筛查", "预防妊娠纹", "准备婴儿用品"]
      },
      28: {
        babySize: "茄子",
        babyWeight: "1000g",
        development: ["眼睛可以睁开", "大脑快速发育", "存活率提高"],
        symptoms: ["呼吸困难", "水肿", "背痛"],
        tips: ["开始数胎动", "学习分娩知识", "准备待产包"]
      },
      32: {
        babySize: "椰子",
        babyWeight: "1700g",
        development: ["骨骼硬化", "免疫系统发育", "脂肪积累"],
        symptoms: ["胃灼热", "失眠", "尿频加重"],
        tips: ["增加产检频率", "练习呼吸法", "准备分娩计划"]
      },
      36: {
        babySize: "罗马甜瓜",
        babyWeight: "2500g",
        development: ["肺部基本成熟", "头部向下", "皮肤光滑"],
        symptoms: ["腹部下降", "呼吸改善", "骨盆压力"],
        tips: ["每周产检", "准备分娩", "注意临产征象"]
      },
      40: {
        babySize: "小西瓜",
        babyWeight: "3200g",
        development: ["完全发育成熟", "准备出生", "器官功能完善"],
        symptoms: ["宫缩", "见红", "破水"],
        tips: ["随时准备分娩", "保持冷静", "及时就医"]
      }
    };
    
    // 找到最接近的周数数据
    const availableWeeks = Object.keys(weeklyData).map(Number).sort((a, b) => a - b);
    let closestWeek = availableWeeks[0];
    
    for (const w of availableWeeks) {
      if (week >= w) {
        closestWeek = w;
      } else {
        break;
      }
    }
    
    return weeklyData[closestWeek as keyof typeof weeklyData] || weeklyData[40];
  };

  const calculatePregnancy = () => {
    let calculatedDueDate: Date;
    let calculatedConceptionDate: Date;
    
    if (calculationMethod === "lmp" && lastPeriodDate) {
      // 基于末次月经计算（Naegele法则）
      calculatedDueDate = addDays(lastPeriodDate, 280);
      calculatedConceptionDate = addDays(lastPeriodDate, parseInt(cycleLength) - 14);
    } else if (calculationMethod === "conception" && conceptionDate) {
      // 基于受孕日计算
      calculatedDueDate = addDays(conceptionDate, 266);
      calculatedConceptionDate = conceptionDate;
    } else if (calculationMethod === "ultrasound" && ultrasoundDate && ultrasoundWeeks) {
      // 基于超声检查计算
      const totalDays = parseInt(ultrasoundWeeks) * 7 + (parseInt(ultrasoundDays) || 0);
      const daysSinceConception = totalDays - 14; // 减去受孕前的14天
      calculatedConceptionDate = addDays(ultrasoundDate, -daysSinceConception);
      calculatedDueDate = addDays(calculatedConceptionDate, 266);
    } else {
      alert("请填写必要信息");
      return;
    }
    
    const today = new Date();
    const daysSinceConception = differenceInDays(today, calculatedConceptionDate);
    const totalWeeks = Math.floor((daysSinceConception + 14) / 7); // 加上受孕前的14天
    const currentWeek = Math.max(0, totalWeeks);
    const currentDay = Math.max(0, (daysSinceConception + 14) % 7);
    const daysRemaining = Math.max(0, differenceInDays(calculatedDueDate, today));
    
    // 确定孕期阶段
    let trimester: number;
    let trimesterWeek: number;
    
    if (currentWeek <= 12) {
      trimester = 1;
      trimesterWeek = currentWeek;
    } else if (currentWeek <= 27) {
      trimester = 2;
      trimesterWeek = currentWeek - 12;
    } else {
      trimester = 3;
      trimesterWeek = currentWeek - 27;
    }
    
    // 重要里程碑
    const milestones = {
      firstTrimesterEnd: addDays(calculatedConceptionDate, 84), // 12周
      secondTrimesterEnd: addDays(calculatedConceptionDate, 189), // 27周
      viabilityDate: addDays(calculatedConceptionDate, 168), // 24周
      fullTermStart: addDays(calculatedConceptionDate, 259) // 37周
    };
    
    // 产检安排
    const appointments = [
      {
        date: addDays(calculatedConceptionDate, 42), // 6周
        type: "首次产检",
        description: "确认怀孕，建立孕期档案"
      },
      {
        date: addDays(calculatedConceptionDate, 70), // 10周
        type: "NT检查",
        description: "颈项透明层检查，筛查染色体异常"
      },
      {
        date: addDays(calculatedConceptionDate, 112), // 16周
        type: "唐氏筛查",
        description: "血清学筛查，评估胎儿异常风险"
      },
      {
        date: addDays(calculatedConceptionDate, 140), // 20周
        type: "大排畸检查",
        description: "详细超声检查，筛查结构异常"
      },
      {
        date: addDays(calculatedConceptionDate, 168), // 24周
        type: "糖尿病筛查",
        description: "妊娠期糖尿病筛查"
      },
      {
        date: addDays(calculatedConceptionDate, 224), // 32周
        type: "胎位检查",
        description: "检查胎位，评估分娩方式"
      },
      {
        date: addDays(calculatedConceptionDate, 252), // 36周
        type: "GBS筛查",
        description: "B族链球菌筛查"
      }
    ];
    
    const weeklyInfo = getWeeklyInfo(currentWeek);
    
    setResult({
      dueDate: calculatedDueDate,
      currentWeek,
      currentDay,
      daysRemaining,
      trimester,
      trimesterWeek,
      conceptionDate: calculatedConceptionDate,
      milestones,
      weeklyInfo,
      appointments: appointments.filter(apt => apt.date > today)
    });
  };

  const reset = () => {
    setLastPeriodDate(undefined);
    setCycleLength("28");
    setCalculationMethod("lmp");
    setConceptionDate(undefined);
    setUltrasoundDate(undefined);
    setUltrasoundWeeks("");
    setUltrasoundDays("");
    setAge("");
    setHeight("");
    setPrePregnancyWeight("");
    setFirstPregnancy("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            怀孕预产期计算器
          </h1>
          <p className="text-xl text-gray-600">
            精确计算预产期，追踪孕期进展和胎儿发育
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">孕期信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 计算方法选择 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-purple-600">计算方法</Label>
                <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择计算方法" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lmp">末次月经日期</SelectItem>
                    <SelectItem value="conception">受孕日期</SelectItem>
                    <SelectItem value="ultrasound">超声检查结果</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 末次月经方法 */}
              {calculationMethod === "lmp" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">末次月经开始日期 *</Label>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength" className="text-sm font-medium">月经周期长度（天）</Label>
                    <Input
                      id="cycleLength"
                      type="number"
                      placeholder="28"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(e.target.value)}
                      min="21"
                      max="35"
                    />
                  </div>
                </div>
              )}

              {/* 受孕日期方法 */}
              {calculationMethod === "conception" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">受孕日期 *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !conceptionDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {conceptionDate ? format(conceptionDate, "yyyy年MM月dd日") : "选择日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={conceptionDate}
                        onSelect={setConceptionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* 超声检查方法 */}
              {calculationMethod === "ultrasound" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">超声检查日期 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !ultrasoundDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {ultrasoundDate ? format(ultrasoundDate, "yyyy年MM月dd日") : "选择日期"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={ultrasoundDate}
                          onSelect={setUltrasoundDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ultrasoundWeeks" className="text-sm font-medium">孕周 *</Label>
                      <Input
                        id="ultrasoundWeeks"
                        type="number"
                        placeholder="12"
                        value={ultrasoundWeeks}
                        onChange={(e) => setUltrasoundWeeks(e.target.value)}
                        min="4"
                        max="42"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ultrasoundDays" className="text-sm font-medium">天数</Label>
                      <Input
                        id="ultrasoundDays"
                        type="number"
                        placeholder="3"
                        value={ultrasoundDays}
                        onChange={(e) => setUltrasoundDays(e.target.value)}
                        min="0"
                        max="6"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 个人信息 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-pink-600">个人信息（可选）</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">年龄</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="28"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="15"
                      max="50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">身高（cm）</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="165"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="140"
                      max="200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prePregnancyWeight" className="text-sm font-medium">孕前体重（kg）</Label>
                    <Input
                      id="prePregnancyWeight"
                      type="number"
                      placeholder="60"
                      value={prePregnancyWeight}
                      onChange={(e) => setPrePregnancyWeight(e.target.value)}
                      min="35"
                      max="150"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">是否初产</Label>
                    <Select value={firstPregnancy} onValueChange={setFirstPregnancy}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">是</SelectItem>
                        <SelectItem value="no">否</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculatePregnancy}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-lg py-3"
                >
                  计算预产期
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
              <CardTitle className="text-2xl text-center">孕期信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-purple-600 mb-2">预产期</div>
                      <div className="text-3xl font-bold text-purple-700">
                        {format(result.dueDate, "yyyy年MM月dd日")}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-pink-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-pink-600">{result.currentWeek}</div>
                        <div className="text-sm text-gray-600">孕周</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.daysRemaining}</div>
                        <div className="text-sm text-gray-600">剩余天数</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-green-700">当前孕期阶段：</h3>
                    <p className="text-green-600">
                      第{result.trimester}孕期 第{result.trimesterWeek}周
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      孕{result.currentWeek}周{result.currentDay}天
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-700">胎儿发育情况：</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">大小：</span>{result.weeklyInfo.babySize}</p>
                      <p><span className="font-medium">体重：</span>{result.weeklyInfo.babyWeight}</p>
                      <div>
                        <span className="font-medium">发育特点：</span>
                        <ul className="mt-1 ml-4">
                          {result.weeklyInfo.development.map((item, index) => (
                            <li key={index} className="text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-red-700">可能症状：</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.weeklyInfo.symptoms.map((symptom, index) => (
                        <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-blue-700">本周建议：</h3>
                    <ul className="space-y-1">
                      {result.weeklyInfo.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {result.appointments.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-purple-700">即将到来的产检：</h3>
                      <div className="space-y-2">
                        {result.appointments.slice(0, 3).map((apt, index) => (
                          <div key={index} className="border-l-4 border-purple-400 pl-3">
                            <div className="font-medium text-purple-700">{apt.type}</div>
                            <div className="text-sm text-gray-600">{format(apt.date, "MM月dd日")}</div>
                            <div className="text-sm text-gray-500">{apt.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">🤱</div>
                  <p>请输入相关信息计算预产期</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 孕期知识 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">孕期知识</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-pink-700">第一孕期（1-12周）</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 器官形成关键期</li>
                  <li>• 补充叶酸预防神经管缺陷</li>
                  <li>• 避免有害物质</li>
                  <li>• 应对早孕反应</li>
                  <li>• 建立孕期档案</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">第二孕期（13-27周）</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 胎儿快速发育期</li>
                  <li>• 进行大排畸检查</li>
                  <li>• 感受胎动</li>
                  <li>• 适度运动</li>
                  <li>• 准备婴儿用品</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700">第三孕期（28-40周）</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 胎儿肺部成熟</li>
                  <li>• 数胎动监测胎儿健康</li>
                  <li>• 学习分娩知识</li>
                  <li>• 准备待产包</li>
                  <li>• 注意临产征象</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-purple-700">孕期注意事项：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-1">
                  <li>• 定期产检，按时检查</li>
                  <li>• 均衡饮食，适量补充营养</li>
                  <li>• 避免烟酒和有害物质</li>
                  <li>• 保持适度运动</li>
                </ul>
                <ul className="space-y-1">
                  <li>• 充足睡眠，避免过度劳累</li>
                  <li>• 保持心情愉快</li>
                  <li>• 学习育儿知识</li>
                  <li>• 准备分娩和产后用品</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}