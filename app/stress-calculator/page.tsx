"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface StressResult {
  stressScore: number;
  stressLevel: string;
  riskColor: string;
  physicalSymptoms: number;
  emotionalSymptoms: number;
  behavioralSymptoms: number;
  cognitiveSymptoms: number;
  recommendations: string[];
  copingStrategies: string[];
}

export default function StressLevelCalculator() {
  // 生理症状
  const [headaches, setHeadaches] = useState(false);
  const [muscletension, setMuscleTension] = useState(false);
  const [fatigue, setFatigue] = useState(false);
  const [sleepProblems, setSleepProblems] = useState(false);
  const [digestiveIssues, setDigestiveIssues] = useState(false);
  const [heartPalpitations, setHeartPalpitations] = useState(false);
  const [frequentIllness, setFrequentIllness] = useState(false);
  
  // 情绪症状
  const [anxiety, setAnxiety] = useState(false);
  const [irritability, setIrritability] = useState(false);
  const [depression, setDepression] = useState(false);
  const [moodSwings, setMoodSwings] = useState(false);
  const [overwhelmed, setOverwhelmed] = useState(false);
  const [restlessness, setRestlessness] = useState(false);
  
  // 行为症状
  const [overeating, setOvereating] = useState(false);
  const [undereating, setUndereating] = useState(false);
  const [socialWithdrawal, setSocialWithdrawal] = useState(false);
  const [procrastination, setProcrastination] = useState(false);
  const [substanceUse, setSubstanceUse] = useState(false);
  const [nervousHabits, setNervousHabits] = useState(false);
  
  // 认知症状
  const [memoryProblems, setMemoryProblems] = useState(false);
  const [concentrationIssues, setConcentrationIssues] = useState(false);
  const [indecisiveness, setIndecisiveness] = useState(false);
  const [negativeThinking, setNegativeThinking] = useState(false);
  const [worrying, setWorrying] = useState(false);
  const [racingThoughts, setRacingThoughts] = useState(false);
  
  // 压力源评估
  const [workStress, setWorkStress] = useState([5]);
  const [relationshipStress, setRelationshipStress] = useState([5]);
  const [financialStress, setFinancialStress] = useState([5]);
  const [healthStress, setHealthStress] = useState([5]);
  const [familyStress, setFamilyStress] = useState([5]);
  
  // 个人信息
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [supportSystem, setSupportSystem] = useState("");
  const [copingSkills, setCopingSkills] = useState("");
  
  const [result, setResult] = useState<StressResult | null>(null);

  const calculateStressLevel = () => {
    // 计算各类症状得分
    const physicalSymptoms = [
      headaches, muscletension, fatigue, sleepProblems, 
      digestiveIssues, heartPalpitations, frequentIllness
    ].filter(Boolean).length;
    
    const emotionalSymptoms = [
      anxiety, irritability, depression, moodSwings, 
      overwhelmed, restlessness
    ].filter(Boolean).length;
    
    const behavioralSymptoms = [
      overeating, undereating, socialWithdrawal, 
      procrastination, substanceUse, nervousHabits
    ].filter(Boolean).length;
    
    const cognitiveSymptoms = [
      memoryProblems, concentrationIssues, indecisiveness, 
      negativeThinking, worrying, racingThoughts
    ].filter(Boolean).length;
    
    // 计算压力源总分
    const stressSourcesScore = workStress[0] + relationshipStress[0] + 
                              financialStress[0] + healthStress[0] + familyStress[0];
    
    // 计算总压力分数
    let stressScore = 0;
    
    // 症状权重 (60%)
    stressScore += (physicalSymptoms / 7) * 15; // 生理症状 15%
    stressScore += (emotionalSymptoms / 6) * 20; // 情绪症状 20%
    stressScore += (behavioralSymptoms / 6) * 15; // 行为症状 15%
    stressScore += (cognitiveSymptoms / 6) * 10; // 认知症状 10%
    
    // 压力源权重 (30%)
    stressScore += (stressSourcesScore / 50) * 30;
    
    // 保护因子调整 (10%)
    let protectionFactor = 0;
    if (exerciseFrequency === "regular") protectionFactor += 3;
    else if (exerciseFrequency === "sometimes") protectionFactor += 1;
    
    if (supportSystem === "strong") protectionFactor += 3;
    else if (supportSystem === "moderate") protectionFactor += 1;
    
    if (copingSkills === "good") protectionFactor += 4;
    else if (copingSkills === "fair") protectionFactor += 2;
    
    stressScore -= protectionFactor;
    stressScore = Math.max(0, Math.min(100, stressScore));
    
    // 压力等级评估
    let stressLevel = "";
    let riskColor = "";
    let recommendations: string[] = [];
    let copingStrategies: string[] = [];
    
    if (stressScore <= 25) {
      stressLevel = "低压力";
      riskColor = "text-green-600";
      recommendations = [
        "保持现有的健康生活方式",
        "继续使用有效的压力管理技巧",
        "定期进行自我评估"
      ];
      copingStrategies = [
        "维持规律的运动习惯",
        "保持良好的社交关系",
        "继续培养兴趣爱好"
      ];
    } else if (stressScore <= 50) {
      stressLevel = "轻度压力";
      riskColor = "text-blue-600";
      recommendations = [
        "学习基本的压力管理技巧",
        "增加放松活动",
        "保持规律的作息",
        "适当运动"
      ];
      copingStrategies = [
        "深呼吸练习",
        "短暂的散步",
        "听音乐放松",
        "与朋友交流"
      ];
    } else if (stressScore <= 70) {
      stressLevel = "中度压力";
      riskColor = "text-yellow-600";
      recommendations = [
        "积极学习压力管理技巧",
        "考虑寻求专业指导",
        "调整生活方式",
        "增强社会支持",
        "定期监测压力水平"
      ];
      copingStrategies = [
        "冥想或正念练习",
        "瑜伽或太极",
        "时间管理技巧",
        "设定合理目标",
        "寻求心理咨询"
      ];
    } else if (stressScore <= 85) {
      stressLevel = "高压力";
      riskColor = "text-orange-600";
      recommendations = [
        "强烈建议寻求专业帮助",
        "可能需要心理治疗",
        "评估和调整生活压力源",
        "建立强有力的支持系统",
        "考虑短期休息或调整"
      ];
      copingStrategies = [
        "认知行为疗法技巧",
        "专业心理咨询",
        "压力管理课程",
        "放松训练",
        "生活方式重大调整"
      ];
    } else {
      stressLevel = "极高压力";
      riskColor = "text-red-600";
      recommendations = [
        "立即寻求专业心理健康帮助",
        "可能需要医学评估",
        "考虑暂时减少压力源",
        "建立紧急支持网络",
        "密切监测身心健康"
      ];
      copingStrategies = [
        "专业心理治疗",
        "可能需要药物辅助",
        "危机干预",
        "住院或密集治疗",
        "家庭和社会支持"
      ];
    }
    
    setResult({
      stressScore: Math.round(stressScore),
      stressLevel,
      riskColor,
      physicalSymptoms,
      emotionalSymptoms,
      behavioralSymptoms,
      cognitiveSymptoms,
      recommendations,
      copingStrategies
    });
  };

  const reset = () => {
    // 重置所有状态
    setHeadaches(false);
    setMuscleTension(false);
    setFatigue(false);
    setSleepProblems(false);
    setDigestiveIssues(false);
    setHeartPalpitations(false);
    setFrequentIllness(false);
    
    setAnxiety(false);
    setIrritability(false);
    setDepression(false);
    setMoodSwings(false);
    setOverwhelmed(false);
    setRestlessness(false);
    
    setOvereating(false);
    setUndereating(false);
    setSocialWithdrawal(false);
    setProcrastination(false);
    setSubstanceUse(false);
    setNervousHabits(false);
    
    setMemoryProblems(false);
    setConcentrationIssues(false);
    setIndecisiveness(false);
    setNegativeThinking(false);
    setWorrying(false);
    setRacingThoughts(false);
    
    setWorkStress([5]);
    setRelationshipStress([5]);
    setFinancialStress([5]);
    setHealthStress([5]);
    setFamilyStress([5]);
    
    setAge("");
    setGender("");
    setExerciseFrequency("");
    setSupportSystem("");
    setCopingSkills("");
    
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            压力水平评估计算器
          </h1>
          <p className="text-xl text-gray-600">
            全面评估您的压力水平，提供个性化的压力管理建议
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">压力评估问卷</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 生理症状 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-red-600">生理症状（最近一个月是否经历）</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="headaches" checked={headaches} onCheckedChange={(checked) => setHeadaches(checked as boolean)} />
                    <Label htmlFor="headaches" className="text-sm">头痛</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="muscletension" checked={muscletension} onCheckedChange={(checked) => setMuscleTension(checked as boolean)} />
                    <Label htmlFor="muscletension" className="text-sm">肌肉紧张</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="fatigue" checked={fatigue} onCheckedChange={(checked) => setFatigue(checked as boolean)} />
                    <Label htmlFor="fatigue" className="text-sm">疲劳乏力</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sleepProblems" checked={sleepProblems} onCheckedChange={(checked) => setSleepProblems(checked as boolean)} />
                    <Label htmlFor="sleepProblems" className="text-sm">睡眠问题</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="digestiveIssues" checked={digestiveIssues} onCheckedChange={(checked) => setDigestiveIssues(checked as boolean)} />
                    <Label htmlFor="digestiveIssues" className="text-sm">消化问题</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="heartPalpitations" checked={heartPalpitations} onCheckedChange={(checked) => setHeartPalpitations(checked as boolean)} />
                    <Label htmlFor="heartPalpitations" className="text-sm">心悸</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="frequentIllness" checked={frequentIllness} onCheckedChange={(checked) => setFrequentIllness(checked as boolean)} />
                    <Label htmlFor="frequentIllness" className="text-sm">频繁生病</Label>
                  </div>
                </div>
              </div>

              {/* 情绪症状 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-blue-600">情绪症状</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="anxiety" checked={anxiety} onCheckedChange={(checked) => setAnxiety(checked as boolean)} />
                    <Label htmlFor="anxiety" className="text-sm">焦虑不安</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="irritability" checked={irritability} onCheckedChange={(checked) => setIrritability(checked as boolean)} />
                    <Label htmlFor="irritability" className="text-sm">易怒烦躁</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="depression" checked={depression} onCheckedChange={(checked) => setDepression(checked as boolean)} />
                    <Label htmlFor="depression" className="text-sm">情绪低落</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="moodSwings" checked={moodSwings} onCheckedChange={(checked) => setMoodSwings(checked as boolean)} />
                    <Label htmlFor="moodSwings" className="text-sm">情绪波动</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="overwhelmed" checked={overwhelmed} onCheckedChange={(checked) => setOverwhelmed(checked as boolean)} />
                    <Label htmlFor="overwhelmed" className="text-sm">感到不堪重负</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="restlessness" checked={restlessness} onCheckedChange={(checked) => setRestlessness(checked as boolean)} />
                    <Label htmlFor="restlessness" className="text-sm">坐立不安</Label>
                  </div>
                </div>
              </div>

              {/* 行为症状 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-green-600">行为症状</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="overeating" checked={overeating} onCheckedChange={(checked) => setOvereating(checked as boolean)} />
                    <Label htmlFor="overeating" className="text-sm">暴饮暴食</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="undereating" checked={undereating} onCheckedChange={(checked) => setUndereating(checked as boolean)} />
                    <Label htmlFor="undereating" className="text-sm">食欲不振</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="socialWithdrawal" checked={socialWithdrawal} onCheckedChange={(checked) => setSocialWithdrawal(checked as boolean)} />
                    <Label htmlFor="socialWithdrawal" className="text-sm">社交回避</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="procrastination" checked={procrastination} onCheckedChange={(checked) => setProcrastination(checked as boolean)} />
                    <Label htmlFor="procrastination" className="text-sm">拖延症</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="substanceUse" checked={substanceUse} onCheckedChange={(checked) => setSubstanceUse(checked as boolean)} />
                    <Label htmlFor="substanceUse" className="text-sm">物质依赖</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nervousHabits" checked={nervousHabits} onCheckedChange={(checked) => setNervousHabits(checked as boolean)} />
                    <Label htmlFor="nervousHabits" className="text-sm">紧张习惯</Label>
                  </div>
                </div>
              </div>

              {/* 认知症状 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-purple-600">认知症状</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="memoryProblems" checked={memoryProblems} onCheckedChange={(checked) => setMemoryProblems(checked as boolean)} />
                    <Label htmlFor="memoryProblems" className="text-sm">记忆问题</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="concentrationIssues" checked={concentrationIssues} onCheckedChange={(checked) => setConcentrationIssues(checked as boolean)} />
                    <Label htmlFor="concentrationIssues" className="text-sm">注意力不集中</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="indecisiveness" checked={indecisiveness} onCheckedChange={(checked) => setIndecisiveness(checked as boolean)} />
                    <Label htmlFor="indecisiveness" className="text-sm">犹豫不决</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="negativeThinking" checked={negativeThinking} onCheckedChange={(checked) => setNegativeThinking(checked as boolean)} />
                    <Label htmlFor="negativeThinking" className="text-sm">消极思维</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="worrying" checked={worrying} onCheckedChange={(checked) => setWorrying(checked as boolean)} />
                    <Label htmlFor="worrying" className="text-sm">过度担忧</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="racingThoughts" checked={racingThoughts} onCheckedChange={(checked) => setRacingThoughts(checked as boolean)} />
                    <Label htmlFor="racingThoughts" className="text-sm">思维混乱</Label>
                  </div>
                </div>
              </div>

              {/* 压力源评估 */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-orange-600">压力源评估 (1-10分)</Label>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">工作压力: {workStress[0]}</Label>
                    <Slider value={workStress} onValueChange={setWorkStress} max={10} min={1} step={1} />
                  </div>
                  <div>
                    <Label className="text-sm">人际关系压力: {relationshipStress[0]}</Label>
                    <Slider value={relationshipStress} onValueChange={setRelationshipStress} max={10} min={1} step={1} />
                  </div>
                  <div>
                    <Label className="text-sm">经济压力: {financialStress[0]}</Label>
                    <Slider value={financialStress} onValueChange={setFinancialStress} max={10} min={1} step={1} />
                  </div>
                  <div>
                    <Label className="text-sm">健康压力: {healthStress[0]}</Label>
                    <Slider value={healthStress} onValueChange={setHealthStress} max={10} min={1} step={1} />
                  </div>
                  <div>
                    <Label className="text-sm">家庭压力: {familyStress[0]}</Label>
                    <Slider value={familyStress} onValueChange={setFamilyStress} max={10} min={1} step={1} />
                  </div>
                </div>
              </div>

              {/* 保护因子 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">运动频率</Label>
                  <Select value={exerciseFrequency} onValueChange={setExerciseFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择运动频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">从不运动</SelectItem>
                      <SelectItem value="rarely">很少运动</SelectItem>
                      <SelectItem value="sometimes">偶尔运动</SelectItem>
                      <SelectItem value="regular">规律运动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">社会支持</Label>
                  <Select value={supportSystem} onValueChange={setSupportSystem}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择支持程度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">支持较少</SelectItem>
                      <SelectItem value="moderate">支持一般</SelectItem>
                      <SelectItem value="strong">支持良好</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">应对技能</Label>
                <Select value={copingSkills} onValueChange={setCopingSkills}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择应对能力" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">应对能力较差</SelectItem>
                    <SelectItem value="fair">应对能力一般</SelectItem>
                    <SelectItem value="good">应对能力良好</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={calculateStressLevel}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-lg py-3"
                >
                  评估压力水平
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
              <CardTitle className="text-2xl text-center">压力评估结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result ? (
                <>
                  <div className="text-center space-y-4">
                    <div className={`text-4xl font-bold ${result.riskColor}`}>
                      {result.stressScore}分
                    </div>
                    <div className={`text-2xl font-semibold ${result.riskColor}`}>
                      {result.stressLevel}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">{result.physicalSymptoms}</div>
                      <div className="text-sm text-gray-600">生理症状</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.emotionalSymptoms}</div>
                      <div className="text-sm text-gray-600">情绪症状</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{result.behavioralSymptoms}</div>
                      <div className="text-sm text-gray-600">行为症状</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.cognitiveSymptoms}</div>
                      <div className="text-sm text-gray-600">认知症状</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">建议措施：</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">应对策略：</h3>
                    <ul className="space-y-2">
                      {result.copingStrategies.map((strategy, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 py-12 text-center">
                  <div className="text-4xl mb-4">😰</div>
                  <p>请完成问卷进行压力水平评估</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 压力管理技巧 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">压力管理技巧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧘</div>
                <h3 className="font-semibold mb-2">放松技巧</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 深呼吸练习</li>
                  <li>• 渐进性肌肉放松</li>
                  <li>• 冥想和正念</li>
                  <li>• 瑜伽和太极</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏃</div>
                <h3 className="font-semibold mb-2">身体活动</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 规律有氧运动</li>
                  <li>• 户外散步</li>
                  <li>• 力量训练</li>
                  <li>• 舞蹈或游泳</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-semibold mb-2">认知调节</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 积极思维</li>
                  <li>• 问题解决技巧</li>
                  <li>• 时间管理</li>
                  <li>• 目标设定</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-semibold mb-2">社会支持</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 与朋友交流</li>
                  <li>• 寻求专业帮助</li>
                  <li>• 参加支持小组</li>
                  <li>• 培养兴趣爱好</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}