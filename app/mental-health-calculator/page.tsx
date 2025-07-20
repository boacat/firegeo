"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Brain, Heart, Users, Lightbulb, Activity, Moon, Coffee } from "lucide-react";

interface MentalHealthResult {
  overallScore: number;
  riskLevel: string;
  riskColor: string;
  moodScore: number;
  anxietyScore: number;
  stressScore: number;
  socialScore: number;
  sleepScore: number;
  energyScore: number;
  recommendations: string[];
  riskFactors: string[];
  protectiveFactors: string[];
  professionalHelp: boolean;
  emergencyHelp: boolean;
}

export default function MentalHealthCalculator() {
  // 基本信息
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  
  // 情绪症状 (PHQ-9 简化版)
  const [littleInterest, setLittleInterest] = useState([0]); // 0-3
  const [feelingDown, setFeelingDown] = useState([0]);
  const [sleepProblems, setSleepProblems] = useState([0]);
  const [feelingTired, setFeelingTired] = useState([0]);
  const [appetiteChanges, setAppetiteChanges] = useState([0]);
  const [feelingBad, setFeelingBad] = useState([0]);
  const [concentrationProblems, setConcentrationProblems] = useState([0]);
  const [movingSlow, setMovingSlow] = useState([0]);
  const [selfHarmThoughts, setSelfHarmThoughts] = useState([0]);
  
  // 焦虑症状 (GAD-7 简化版)
  const [feelingNervous, setFeelingNervous] = useState([0]);
  const [cantStopWorrying, setCantStopWorrying] = useState([0]);
  const [worryingTooMuch, setWorryingTooMuch] = useState([0]);
  const [troubleRelaxing, setTroubleRelaxing] = useState([0]);
  const [restlessness, setRestlessness] = useState([0]);
  const [easilyAnnoyed, setEasilyAnnoyed] = useState([0]);
  const [feelingAfraid, setFeelingAfraid] = useState([0]);
  
  // 压力水平
  const [workStress, setWorkStress] = useState([5]);
  const [financialStress, setFinancialStress] = useState([5]);
  const [relationshipStress, setRelationshipStress] = useState([5]);
  const [healthStress, setHealthStress] = useState([5]);
  
  // 社交支持
  const [socialSupport, setSocialSupport] = useState([5]);
  const [familySupport, setFamilySupport] = useState([5]);
  const [friendSupport, setFriendSupport] = useState([5]);
  
  // 生活方式
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [sleepQuality, setSleepQuality] = useState([5]);
  const [sleepHours, setSleepHours] = useState("");
  const [alcoholUse, setAlcoholUse] = useState("");
  const [substanceUse, setSubstanceUse] = useState(false);
  const [smokingStatus, setSmokingStatus] = useState("");
  
  // 应对策略
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);
  const [professionalHelp, setProfessionalHelp] = useState("");
  const [medicationUse, setMedicationUse] = useState(false);
  
  // 特殊情况
  const [chronicIllness, setChronicIllness] = useState(false);
  const [majorLifeChanges, setMajorLifeChanges] = useState(false);
  const [traumaHistory, setTraumaHistory] = useState(false);
  const [familyMentalHealth, setFamilyMentalHealth] = useState(false);
  
  const [result, setResult] = useState<MentalHealthResult | null>(null);
  
  const calculateMentalHealth = () => {
    // PHQ-9 抑郁评分
    const depressionScore = littleInterest[0] + feelingDown[0] + sleepProblems[0] + 
                           feelingTired[0] + appetiteChanges[0] + feelingBad[0] + 
                           concentrationProblems[0] + movingSlow[0] + selfHarmThoughts[0];
    
    // GAD-7 焦虑评分
    const anxietyScore = feelingNervous[0] + cantStopWorrying[0] + worryingTooMuch[0] + 
                        troubleRelaxing[0] + restlessness[0] + easilyAnnoyed[0] + feelingAfraid[0];
    
    // 压力评分
    const stressScore = (workStress[0] + financialStress[0] + relationshipStress[0] + healthStress[0]) / 4;
    
    // 社交支持评分
    const socialScore = (socialSupport[0] + familySupport[0] + friendSupport[0]) / 3;
    
    // 生活方式评分
    let lifestyleScore = sleepQuality[0];
    if (exerciseFrequency === "每天") lifestyleScore += 2;
    else if (exerciseFrequency === "每周3-5次") lifestyleScore += 1;
    else if (exerciseFrequency === "每周1-2次") lifestyleScore += 0.5;
    
    if (alcoholUse === "不饮酒") lifestyleScore += 1;
    else if (alcoholUse === "偶尔饮酒") lifestyleScore += 0.5;
    else if (alcoholUse === "经常饮酒") lifestyleScore -= 1;
    
    if (smokingStatus === "从不吸烟") lifestyleScore += 1;
    else if (smokingStatus === "已戒烟") lifestyleScore += 0.5;
    else if (smokingStatus === "目前吸烟") lifestyleScore -= 1;
    
    // 风险因子评分
    let riskFactorScore = 0;
    if (chronicIllness) riskFactorScore += 2;
    if (majorLifeChanges) riskFactorScore += 2;
    if (traumaHistory) riskFactorScore += 3;
    if (familyMentalHealth) riskFactorScore += 1;
    if (substanceUse) riskFactorScore += 2;
    
    // 保护因子评分
    let protectiveFactorScore = socialScore;
    if (copingStrategies.length > 0) protectiveFactorScore += copingStrategies.length * 0.5;
    if (professionalHelp === "是，正在接受") protectiveFactorScore += 2;
    else if (professionalHelp === "曾经接受过") protectiveFactorScore += 1;
    
    // 综合评分计算
    const moodScore = Math.max(0, Math.min(100, 100 - (depressionScore / 27) * 100));
    const anxietyScoreNormalized = Math.max(0, Math.min(100, 100 - (anxietyScore / 21) * 100));
    const stressScoreNormalized = Math.max(0, Math.min(100, 100 - (stressScore / 10) * 100));
    const socialScoreNormalized = Math.max(0, Math.min(100, (socialScore / 10) * 100));
    const sleepScoreNormalized = Math.max(0, Math.min(100, (sleepQuality[0] / 10) * 100));
    const energyScoreNormalized = Math.max(0, Math.min(100, (lifestyleScore / 10) * 100));
    
    const overallScore = Math.round(
      (moodScore * 0.25 + anxietyScoreNormalized * 0.2 + stressScoreNormalized * 0.15 + 
       socialScoreNormalized * 0.15 + sleepScoreNormalized * 0.1 + energyScoreNormalized * 0.15) - 
      (riskFactorScore * 5) + (protectiveFactorScore * 2)
    );
    
    // 风险等级判定
    let riskLevel = "";
    let riskColor = "";
    if (overallScore >= 80) {
      riskLevel = "心理健康状况良好";
      riskColor = "text-green-600";
    } else if (overallScore >= 60) {
      riskLevel = "轻度心理健康风险";
      riskColor = "text-yellow-600";
    } else if (overallScore >= 40) {
      riskLevel = "中度心理健康风险";
      riskColor = "text-orange-600";
    } else {
      riskLevel = "高度心理健康风险";
      riskColor = "text-red-600";
    }
    
    // 生成建议
    const recommendations = [];
    const riskFactors = [];
    const protectiveFactors = [];
    
    if (depressionScore > 10) {
      recommendations.push("建议寻求专业心理健康服务评估抑郁症状");
      riskFactors.push("抑郁症状较重");
    }
    
    if (anxietyScore > 10) {
      recommendations.push("建议学习焦虑管理技巧，如深呼吸和正念练习");
      riskFactors.push("焦虑症状明显");
    }
    
    if (stressScore > 7) {
      recommendations.push("需要改善压力管理，考虑减少压力源或学习应对技巧");
      riskFactors.push("压力水平过高");
    }
    
    if (socialScore < 5) {
      recommendations.push("建议加强社交联系，寻求家人朋友的支持");
      riskFactors.push("社交支持不足");
    } else {
      protectiveFactors.push("良好的社交支持");
    }
    
    if (sleepQuality[0] < 5) {
      recommendations.push("改善睡眠质量，建立规律的睡眠习惯");
      riskFactors.push("睡眠质量差");
    }
    
    if (exerciseFrequency === "很少" || exerciseFrequency === "从不") {
      recommendations.push("增加体育锻炼，每周至少150分钟中等强度运动");
      riskFactors.push("缺乏运动");
    } else if (exerciseFrequency === "每天" || exerciseFrequency === "每周3-5次") {
      protectiveFactors.push("规律运动习惯");
    }
    
    if (copingStrategies.length > 2) {
      protectiveFactors.push("多样化的应对策略");
    }
    
    if (professionalHelp === "是，正在接受") {
      protectiveFactors.push("正在接受专业帮助");
    }
    
    // 判断是否需要专业帮助
    const needsProfessionalHelp = overallScore < 60 || depressionScore > 10 || anxietyScore > 10 || selfHarmThoughts[0] > 0;
    const needsEmergencyHelp = selfHarmThoughts[0] > 1 || overallScore < 30;
    
    if (needsEmergencyHelp) {
      recommendations.unshift("⚠️ 紧急：如有自伤想法，请立即联系心理危机干预热线或就医");
    } else if (needsProfessionalHelp) {
      recommendations.unshift("建议咨询心理健康专业人士进行评估和治疗");
    }
    
    setResult({
      overallScore: Math.max(0, Math.min(100, overallScore)),
      riskLevel,
      riskColor,
      moodScore: Math.round(moodScore),
      anxietyScore: Math.round(anxietyScoreNormalized),
      stressScore: Math.round(stressScoreNormalized),
      socialScore: Math.round(socialScoreNormalized),
      sleepScore: Math.round(sleepScoreNormalized),
      energyScore: Math.round(energyScoreNormalized),
      recommendations,
      riskFactors,
      protectiveFactors,
      professionalHelp: needsProfessionalHelp,
      emergencyHelp: needsEmergencyHelp
    });
  };
  
  const handleCopingStrategyChange = (strategy: string, checked: boolean) => {
    if (checked) {
      setCopingStrategies([...copingStrategies, strategy]);
    } else {
      setCopingStrategies(copingStrategies.filter(s => s !== strategy));
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">心理健康评估计算器</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            全面评估您的心理健康状况，包括情绪、焦虑、压力、社交支持等多个维度，
            为您提供个性化的心理健康建议和专业指导。
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 输入表单 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">年龄</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="请输入年龄"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">性别</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="男">男</SelectItem>
                        <SelectItem value="女">女</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="occupation">职业状况</Label>
                    <Select value={occupation} onValueChange={setOccupation}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择职业状况" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="学生">学生</SelectItem>
                        <SelectItem value="在职">在职</SelectItem>
                        <SelectItem value="失业">失业</SelectItem>
                        <SelectItem value="退休">退休</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="relationship">感情状况</Label>
                    <Select value={relationshipStatus} onValueChange={setRelationshipStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择感情状况" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="单身">单身</SelectItem>
                        <SelectItem value="恋爱中">恋爱中</SelectItem>
                        <SelectItem value="已婚">已婚</SelectItem>
                        <SelectItem value="离异">离异</SelectItem>
                        <SelectItem value="丧偶">丧偶</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 情绪症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  情绪症状评估
                </CardTitle>
                <CardDescription>
                  过去两周内，以下问题困扰您的频率如何？(0=从不，1=几天，2=一半以上的天数，3=几乎每天)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>对事物缺乏兴趣或乐趣: {littleInterest[0]}</Label>
                    <Slider value={littleInterest} onValueChange={setLittleInterest} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>感到沮丧、抑郁或绝望: {feelingDown[0]}</Label>
                    <Slider value={feelingDown} onValueChange={setFeelingDown} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>入睡困难、睡眠不安或睡眠过多: {sleepProblems[0]}</Label>
                    <Slider value={sleepProblems} onValueChange={setSleepProblems} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>感到疲倦或缺乏精力: {feelingTired[0]}</Label>
                    <Slider value={feelingTired} onValueChange={setFeelingTired} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>食欲不振或暴饮暴食: {appetiteChanges[0]}</Label>
                    <Slider value={appetiteChanges} onValueChange={setAppetiteChanges} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>觉得自己很糟糕或失败: {feelingBad[0]}</Label>
                    <Slider value={feelingBad} onValueChange={setFeelingBad} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>注意力集中困难: {concentrationProblems[0]}</Label>
                    <Slider value={concentrationProblems} onValueChange={setConcentrationProblems} max={3} min={0} step={1} />
                  </div>
                  <div>
                    <Label>动作或说话缓慢，或坐立不安: {movingSlow[0]}</Label>
                    <Slider value={movingSlow} onValueChange={setMovingSlow} max={3} min={0} step={1} />
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <Label className="text-red-700">有自伤或死亡的想法: {selfHarmThoughts[0]}</Label>
                    <Slider value={selfHarmThoughts} onValueChange={setSelfHarmThoughts} max={3} min={0} step={1} />
                    {selfHarmThoughts[0] > 0 && (
                      <p className="text-red-600 text-sm mt-2 font-medium">
                        ⚠️ 如有自伤想法，请立即寻求专业帮助或拨打心理危机干预热线
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 焦虑症状评估 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  焦虑症状评估
                </CardTitle>
                <CardDescription>
                  过去两周内，以下问题困扰您的频率如何？(0=从不，1=几天，2=一半以上的天数，3=几乎每天)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>感到紧张、焦虑或急躁: {feelingNervous[0]}</Label>
                  <Slider value={feelingNervous} onValueChange={setFeelingNervous} max={3} min={0} step={1} />
                </div>
                <div>
                  <Label>无法停止或控制担忧: {cantStopWorrying[0]}</Label>
                  <Slider value={cantStopWorrying} onValueChange={setCantStopWorrying} max={3} min={0} step={1} />
                </div>
                <div>
                  <Label>对各种事情过度担心: {worryingTooMuch[0]}</Label>
                  <Slider value={worryingTooMuch} onValueChange={setWorryingTooMuch} max={3} min={0} step={1} />
                </div>
                <div>
                  <Label>难以放松: {troubleRelaxing[0]}</Label>
                  <Slider value={troubleRelaxing} onValueChange={setTroubleRelaxing} max={3} min={0} step={1} />
                </div>
                <div>
                  <Label>坐立不安，难以安静坐着: {restlessness[0]}</Label>
                  <Slider value={restlessness} onValueChange={setRestlessness} max={3} min={0} step={1} />
                </div>
                <div>
                  <Label>容易烦躁或易怒: {easilyAnnoyed[0]}</Label>
                  <Slider value={easilyAnnoyed} onValueChange={setEasilyAnnoyed} max={3} min={0} step={1} />
                </div>
                <div>
                  <Label>感到害怕，好像要发生可怕的事: {feelingAfraid[0]}</Label>
                  <Slider value={feelingAfraid} onValueChange={setFeelingAfraid} max={3} min={0} step={1} />
                </div>
              </CardContent>
            </Card>
            
            {/* 压力评估 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  压力水平评估
                </CardTitle>
                <CardDescription>
                  请评估以下各方面给您带来的压力程度 (1-10分，10分为极高压力)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>工作/学业压力: {workStress[0]}</Label>
                  <Slider value={workStress} onValueChange={setWorkStress} max={10} min={1} step={1} />
                </div>
                <div>
                  <Label>经济压力: {financialStress[0]}</Label>
                  <Slider value={financialStress} onValueChange={setFinancialStress} max={10} min={1} step={1} />
                </div>
                <div>
                  <Label>人际关系压力: {relationshipStress[0]}</Label>
                  <Slider value={relationshipStress} onValueChange={setRelationshipStress} max={10} min={1} step={1} />
                </div>
                <div>
                  <Label>健康压力: {healthStress[0]}</Label>
                  <Slider value={healthStress} onValueChange={setHealthStress} max={10} min={1} step={1} />
                </div>
              </CardContent>
            </Card>
            
            {/* 社交支持 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  社交支持评估
                </CardTitle>
                <CardDescription>
                  请评估您获得的社交支持程度 (1-10分，10分为非常充足的支持)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>社交网络支持: {socialSupport[0]}</Label>
                  <Slider value={socialSupport} onValueChange={setSocialSupport} max={10} min={1} step={1} />
                </div>
                <div>
                  <Label>家庭支持: {familySupport[0]}</Label>
                  <Slider value={familySupport} onValueChange={setFamilySupport} max={10} min={1} step={1} />
                </div>
                <div>
                  <Label>朋友支持: {friendSupport[0]}</Label>
                  <Slider value={friendSupport} onValueChange={setFriendSupport} max={10} min={1} step={1} />
                </div>
              </CardContent>
            </Card>
            
            {/* 生活方式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-indigo-500" />
                  生活方式评估
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise">运动频率</Label>
                    <Select value={exerciseFrequency} onValueChange={setExerciseFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择运动频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="每天">每天</SelectItem>
                        <SelectItem value="每周3-5次">每周3-5次</SelectItem>
                        <SelectItem value="每周1-2次">每周1-2次</SelectItem>
                        <SelectItem value="很少">很少</SelectItem>
                        <SelectItem value="从不">从不</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sleep-hours">平均睡眠时间</Label>
                    <Select value={sleepHours} onValueChange={setSleepHours}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择睡眠时间" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5小时">少于5小时</SelectItem>
                        <SelectItem value="5-6小时">5-6小时</SelectItem>
                        <SelectItem value="7-8小时">7-8小时</SelectItem>
                        <SelectItem value="9-10小时">9-10小时</SelectItem>
                        <SelectItem value=">10小时">超过10小时</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alcohol">饮酒情况</Label>
                    <Select value={alcoholUse} onValueChange={setAlcoholUse}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择饮酒情况" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="不饮酒">不饮酒</SelectItem>
                        <SelectItem value="偶尔饮酒">偶尔饮酒</SelectItem>
                        <SelectItem value="适量饮酒">适量饮酒</SelectItem>
                        <SelectItem value="经常饮酒">经常饮酒</SelectItem>
                        <SelectItem value="过量饮酒">过量饮酒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="smoking">吸烟状况</Label>
                    <Select value={smokingStatus} onValueChange={setSmokingStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择吸烟状况" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="从不吸烟">从不吸烟</SelectItem>
                        <SelectItem value="已戒烟">已戒烟</SelectItem>
                        <SelectItem value="偶尔吸烟">偶尔吸烟</SelectItem>
                        <SelectItem value="目前吸烟">目前吸烟</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>睡眠质量: {sleepQuality[0]}</Label>
                  <Slider value={sleepQuality} onValueChange={setSleepQuality} max={10} min={1} step={1} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="substance"
                    checked={substanceUse}
                    onCheckedChange={setSubstanceUse}
                  />
                  <Label htmlFor="substance">使用其他物质（如药物滥用）</Label>
                </div>
              </CardContent>
            </Card>
            
            {/* 应对策略 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green-500" />
                  应对策略和支持
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium">您常用的应对策略（可多选）：</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      "运动锻炼", "冥想/正念", "听音乐", "阅读", "社交活动", "写日记",
                      "深呼吸", "寻求帮助", "兴趣爱好", "宗教信仰", "专业咨询", "其他"
                    ].map((strategy) => (
                      <div key={strategy} className="flex items-center space-x-2">
                        <Checkbox
                          id={strategy}
                          checked={copingStrategies.includes(strategy)}
                          onCheckedChange={(checked) => handleCopingStrategyChange(strategy, checked as boolean)}
                        />
                        <Label htmlFor={strategy} className="text-sm">{strategy}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="professional-help">是否接受过专业心理健康服务？</Label>
                  <Select value={professionalHelp} onValueChange={setProfessionalHelp}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="从未接受过">从未接受过</SelectItem>
                      <SelectItem value="曾经接受过">曾经接受过</SelectItem>
                      <SelectItem value="是，正在接受">是，正在接受</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medication"
                    checked={medicationUse}
                    onCheckedChange={setMedicationUse}
                  />
                  <Label htmlFor="medication">目前正在服用心理健康相关药物</Label>
                </div>
              </CardContent>
            </Card>
            
            {/* 特殊情况 */}
            <Card>
              <CardHeader>
                <CardTitle>特殊情况和风险因子</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="chronic-illness"
                      checked={chronicIllness}
                      onCheckedChange={setChronicIllness}
                    />
                    <Label htmlFor="chronic-illness">患有慢性疾病</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="major-changes"
                      checked={majorLifeChanges}
                      onCheckedChange={setMajorLifeChanges}
                    />
                    <Label htmlFor="major-changes">近期经历重大生活变化（如失业、离婚、丧亲等）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trauma"
                      checked={traumaHistory}
                      onCheckedChange={setTraumaHistory}
                    />
                    <Label htmlFor="trauma">有创伤经历</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="family-mental-health"
                      checked={familyMentalHealth}
                      onCheckedChange={setFamilyMentalHealth}
                    />
                    <Label htmlFor="family-mental-health">家族有心理健康问题史</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 计算按钮 */}
            <Button 
              onClick={calculateMentalHealth} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
              size="lg"
            >
              <Brain className="mr-2 h-5 w-5" />
              开始心理健康评估
            </Button>
          </div>
          
          {/* 结果显示 */}
          <div className="space-y-6">
            {result && (
              <>
                {/* 总体评分 */}
                <Card className="border-2 border-purple-200">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">心理健康评估结果</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {result.overallScore}
                      </div>
                      <div className="text-lg text-gray-600 mb-2">综合评分</div>
                      <Badge className={`${result.riskColor} bg-transparent border text-lg px-4 py-1`}>
                        {result.riskLevel}
                      </Badge>
                    </div>
                    
                    {result.emergencyHelp && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                          <AlertCircle className="h-5 w-5" />
                          紧急提醒
                        </div>
                        <p className="text-red-600 text-sm">
                          检测到您可能存在严重的心理健康风险，请立即寻求专业帮助或拨打心理危机干预热线：400-161-9995
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* 各维度评分 */}
                <Card>
                  <CardHeader>
                    <CardTitle>各维度评分</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-red-600">{result.moodScore}</div>
                        <div className="text-sm text-gray-600">情绪状态</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-yellow-600">{result.anxietyScore}</div>
                        <div className="text-sm text-gray-600">焦虑水平</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-orange-600">{result.stressScore}</div>
                        <div className="text-sm text-gray-600">压力管理</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-blue-600">{result.socialScore}</div>
                        <div className="text-sm text-gray-600">社交支持</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-indigo-600">{result.sleepScore}</div>
                        <div className="text-sm text-gray-600">睡眠质量</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-600">{result.energyScore}</div>
                        <div className="text-sm text-gray-600">生活方式</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 风险因子和保护因子 */}
                <Card>
                  <CardHeader>
                    <CardTitle>风险和保护因子分析</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.riskFactors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">⚠️ 风险因子：</h4>
                        <ul className="space-y-1">
                          {result.riskFactors.map((factor, index) => (
                            <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                              • {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.protectiveFactors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">✅ 保护因子：</h4>
                        <ul className="space-y-1">
                          {result.protectiveFactors.map((factor, index) => (
                            <li key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                              • {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* 个性化建议 */}
                <Card>
                  <CardHeader>
                    <CardTitle>个性化建议</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-purple-600 mt-1">•</span>
                          <span className={rec.includes('⚠️') ? 'text-red-600 font-semibold' : ''}>
                            {rec}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* 心理健康知识 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  心理健康知识
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">🧠 心理健康的重要性</h4>
                  <p className="text-gray-600">
                    心理健康是整体健康的重要组成部分，影响我们的思维、情感和行为。
                    良好的心理健康有助于我们应对生活压力、与他人建立良好关系、做出健康选择。
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">📊 评估工具说明</h4>
                  <p className="text-gray-600">
                    本评估基于PHQ-9（抑郁症状）、GAD-7（焦虑症状）等标准化量表，
                    结合压力、社交支持、生活方式等多维度因素进行综合评估。
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">🔍 何时寻求专业帮助</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 持续的情绪低落或焦虑超过2周</li>
                    <li>• 影响日常工作、学习或人际关系</li>
                    <li>• 有自伤或自杀想法</li>
                    <li>• 物质滥用问题</li>
                    <li>• 创伤后应激反应</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">💡 日常心理保健</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 保持规律作息和充足睡眠</li>
                    <li>• 适度运动，释放压力</li>
                    <li>• 培养兴趣爱好，增加生活乐趣</li>
                    <li>• 维护良好的人际关系</li>
                    <li>• 学习压力管理和情绪调节技巧</li>
                    <li>• 定期进行心理健康自我评估</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">📞 紧急求助资源</h4>
                  <ul className="text-blue-600 text-sm space-y-1">
                    <li>• 全国心理危机干预热线：400-161-9995</li>
                    <li>• 北京危机干预热线：400-161-9995</li>
                    <li>• 上海心理援助热线：021-34289888</li>
                    <li>• 紧急情况请拨打120或前往最近医院</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}