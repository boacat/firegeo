"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function OneRepMaxCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [formula, setFormula] = useState("epley");
  const [result, setResult] = useState<any>(null);

  const calculateOneRepMax = () => {
    if (!weight || !reps) {
      alert("请填写重量和次数");
      return;
    }

    const w = parseFloat(weight);
    const r = parseInt(reps);

    if (r < 1 || r > 20) {
      alert("次数应在1-20之间");
      return;
    }

    let oneRepMax;

    // 不同公式计算1RM
    switch (formula) {
      case "epley":
        // Epley公式: 1RM = weight × (1 + reps/30)
        oneRepMax = w * (1 + r / 30);
        break;
      case "brzycki":
        // Brzycki公式: 1RM = weight × (36/(37-reps))
        oneRepMax = w * (36 / (37 - r));
        break;
      case "lander":
        // Lander公式: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
        oneRepMax = (100 * w) / (101.3 - 2.67123 * r);
        break;
      case "lombardi":
        // Lombardi公式: 1RM = weight × reps^0.10
        oneRepMax = w * Math.pow(r, 0.10);
        break;
      case "mayhew":
        // Mayhew公式: 1RM = (100 × weight) / (52.2 + 41.9 × e^(-0.055 × reps))
        oneRepMax = (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r));
        break;
      case "oconner":
        // O'Conner公式: 1RM = weight × (1 + 0.025 × reps)
        oneRepMax = w * (1 + 0.025 * r);
        break;
      default:
        oneRepMax = w * (1 + r / 30);
    }

    // 计算不同百分比的重量
    const percentages = {
      "95%": Math.round(oneRepMax * 0.95),
      "90%": Math.round(oneRepMax * 0.90),
      "85%": Math.round(oneRepMax * 0.85),
      "80%": Math.round(oneRepMax * 0.80),
      "75%": Math.round(oneRepMax * 0.75),
      "70%": Math.round(oneRepMax * 0.70),
      "65%": Math.round(oneRepMax * 0.65),
      "60%": Math.round(oneRepMax * 0.60)
    };

    // 训练区间建议
    const trainingZones = {
      strength: {
        name: "力量训练",
        percentage: "85-100%",
        reps: "1-5次",
        sets: "3-5组",
        rest: "3-5分钟",
        weight: `${percentages["85%"]}-${Math.round(oneRepMax)}kg`
      },
      power: {
        name: "爆发力训练",
        percentage: "75-90%",
        reps: "1-5次",
        sets: "3-5组",
        rest: "3-5分钟",
        weight: `${percentages["75%"]}-${percentages["90%"]}kg`
      },
      hypertrophy: {
        name: "肌肥大训练",
        percentage: "65-85%",
        reps: "6-12次",
        sets: "3-4组",
        rest: "1-3分钟",
        weight: `${percentages["65%"]}-${percentages["85%"]}kg`
      },
      endurance: {
        name: "肌耐力训练",
        percentage: "50-65%",
        reps: "12-20次",
        sets: "2-3组",
        rest: "30-90秒",
        weight: `${Math.round(oneRepMax * 0.50)}-${percentages["65%"]}kg`
      }
    };

    // 所有公式对比
    const allFormulas = {
      epley: Math.round(w * (1 + r / 30)),
      brzycki: Math.round(w * (36 / (37 - r))),
      lander: Math.round((100 * w) / (101.3 - 2.67123 * r)),
      lombardi: Math.round(w * Math.pow(r, 0.10)),
      mayhew: Math.round((100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r))),
      oconner: Math.round(w * (1 + 0.025 * r))
    };

    const average = Math.round(Object.values(allFormulas).reduce((a, b) => a + b, 0) / Object.values(allFormulas).length);

    setResult({
      oneRepMax: Math.round(oneRepMax),
      percentages,
      trainingZones,
      allFormulas,
      average,
      inputWeight: w,
      inputReps: r,
      selectedFormula: formula
    });
  };

  const resetForm = () => {
    setWeight("");
    setReps("");
    setFormula("epley");
    setResult(null);
  };

  const formulaNames: { [key: string]: string } = {
    epley: "Epley公式",
    brzycki: "Brzycki公式",
    lander: "Lander公式",
    lombardi: "Lombardi公式",
    mayhew: "Mayhew公式",
    oconner: "O'Conner公式"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏋️ 最大重量计算器</h1>
          <p className="text-lg text-gray-600">
            基于多次重复训练数据，科学估算单次最大举重重量 (1RM)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card>
            <CardHeader>
              <CardTitle>训练数据</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">举起重量 (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="例如：80"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="reps">完成次数 *</Label>
                <Input
                  id="reps"
                  type="number"
                  placeholder="例如：8"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  min="1"
                  max="20"
                />
                <p className="text-xs text-gray-500 mt-1">请输入1-20之间的次数</p>
              </div>

              <div>
                <Label htmlFor="formula">计算公式</Label>
                <Select value={formula} onValueChange={setFormula}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择计算公式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epley">Epley公式 (推荐)</SelectItem>
                    <SelectItem value="brzycki">Brzycki公式</SelectItem>
                    <SelectItem value="lander">Lander公式</SelectItem>
                    <SelectItem value="lombardi">Lombardi公式</SelectItem>
                    <SelectItem value="mayhew">Mayhew公式</SelectItem>
                    <SelectItem value="oconner">O'Conner公式</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateOneRepMax} className="flex-1">
                  计算1RM
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  重置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 计算结果 */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>1RM结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600">{result.oneRepMax} kg</div>
                      <div className="text-sm text-gray-600">预估最大重量 (1RM)</div>
                      <div className="text-xs text-gray-500 mt-1">
                        基于 {result.inputWeight}kg × {result.inputReps}次
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">训练重量参考</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(result.percentages).map(([percent, weight]) => (
                      <div key={percent} className="flex justify-between bg-gray-50 p-2 rounded">
                        <span>{percent}:</span>
                        <span className="font-semibold">{weight} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 训练区间建议 */}
        {result && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">训练区间建议</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(result.trainingZones).map(([key, zone]: [string, any]) => (
                <Card key={key} className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>强度:</span>
                        <span className="font-semibold">{zone.percentage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>重量:</span>
                        <span className="font-semibold">{zone.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>次数:</span>
                        <span className="font-semibold">{zone.reps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>组数:</span>
                        <span className="font-semibold">{zone.sets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>休息:</span>
                        <span className="font-semibold">{zone.rest}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 公式对比 */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>公式对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(result.allFormulas).map(([key, value]) => (
                  <div key={key} className={`p-3 rounded-lg border-2 ${
                    key === result.selectedFormula ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <div className="text-center">
                      <div className="font-semibold">{formulaNames[key]}</div>
                      <div className="text-2xl font-bold text-gray-900">{value} kg</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold">平均值: {result.average} kg</div>
                <p className="text-sm text-gray-600 mt-1">建议参考多个公式的平均值</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 安全提示 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ 安全提示</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">测试前准备</h3>
                <ul className="text-sm space-y-1">
                  <li>• 充分热身至少15-20分钟</li>
                  <li>• 确保有经验丰富的保护者</li>
                  <li>• 检查器械安全性</li>
                  <li>• 身体状态良好，无伤病</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">测试注意事项</h3>
                <ul className="text-sm space-y-1">
                  <li>• 循序渐进，不要急于求成</li>
                  <li>• 保持正确的动作技术</li>
                  <li>• 如感到不适立即停止</li>
                  <li>• 建议在专业指导下进行</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">计算原理</h3>
                <ul className="text-sm space-y-1">
                  <li>• 基于多次重复与最大重量的关系</li>
                  <li>• 使用经过验证的数学公式</li>
                  <li>• Epley公式最为常用和准确</li>
                  <li>• 适用于1-20次重复范围</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">准确性说明</h3>
                <ul className="text-sm space-y-1">
                  <li>• 结果为估算值，个体差异较大</li>
                  <li>• 训练经验和技术水平影响准确性</li>
                  <li>• 建议定期重新测试和调整</li>
                  <li>• 仅供训练参考，安全第一</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}