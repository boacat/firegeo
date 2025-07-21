"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Users, Shield, CreditCard, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "条款接受",
      icon: FileText,
      content: [
        {
          subtitle: "协议生效",
          text: "通过访问或使用健康计算器平台的任何服务，您即表示同意受本服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。"
        },
        {
          subtitle: "用户资格",
          text: "您必须年满18周岁或在父母/监护人的监督下使用我们的服务。使用我们的服务即表示您确认具备法律行为能力。"
        },
        {
          subtitle: "条款修改",
          text: "我们保留随时修改这些条款的权利。重大变更将提前30天通知用户。继续使用服务即表示接受修改后的条款。"
        }
      ]
    },
    {
      id: "services",
      title: "服务描述",
      icon: Users,
      content: [
        {
          subtitle: "健康计算器",
          text: "我们提供各种健康相关的计算工具，包括但不限于BMI计算、卡路里计算、心率分析等。这些工具仅供参考，不能替代专业医疗建议。"
        },
        {
          subtitle: "AI健康咨询",
          text: "我们的AI系统基于您提供的信息生成个性化健康建议。这些建议仅供参考，不构成医疗诊断或治疗建议。"
        },
        {
          subtitle: "数据分析",
          text: "我们提供健康数据的趋势分析和报告生成服务，帮助您更好地了解自己的健康状况。"
        }
      ]
    },
    {
      id: "user-obligations",
      title: "用户义务",
      icon: Shield,
      content: [
        {
          subtitle: "信息准确性",
          text: "您有责任确保提供给我们的所有信息都是准确、完整和最新的。错误信息可能导致不准确的计算结果。"
        },
        {
          subtitle: "账户安全",
          text: "您有责任保护您的账户安全，包括保密您的登录凭据。如发现账户被盗用，请立即通知我们。"
        },
        {
          subtitle: "合法使用",
          text: "您同意仅将我们的服务用于合法目的，不得进行任何可能损害我们服务或其他用户的活动。"
        },
        {
          subtitle: "禁止行为",
          text: "禁止逆向工程、破解、传播恶意软件、进行网络攻击或任何其他可能损害我们系统安全的行为。"
        }
      ]
    },
    {
      id: "payment-terms",
      title: "付费条款",
      icon: CreditCard,
      content: [
        {
          subtitle: "订阅服务",
          text: "我们提供免费和付费订阅服务。付费服务的具体功能和价格在我们的定价页面中详细说明。"
        },
        {
          subtitle: "付款方式",
          text: "我们接受主要信用卡、借记卡和其他指定的付款方式。所有付款都通过安全的第三方支付处理器处理。"
        },
        {
          subtitle: "自动续费",
          text: "订阅服务将自动续费，除非您在当前计费周期结束前取消。您可以随时在账户设置中管理订阅。"
        },
        {
          subtitle: "退款政策",
          text: "我们提供7天无理由退款保证。如果您在购买后7天内不满意，可以申请全额退款。"
        }
      ]
    },
    {
      id: "intellectual-property",
      title: "知识产权",
      icon: Scale,
      content: [
        {
          subtitle: "平台所有权",
          text: "健康计算器平台及其所有内容、功能和特性均为我们或我们的许可方所有，受版权、商标和其他知识产权法保护。"
        },
        {
          subtitle: "用户内容",
          text: "您保留对您提供给我们的内容的所有权，但授予我们使用、修改和展示这些内容以提供服务的许可。"
        },
        {
          subtitle: "使用限制",
          text: "除非明确授权，您不得复制、修改、分发、销售或租赁我们服务的任何部分。"
        }
      ]
    },
    {
      id: "disclaimers",
      title: "免责声明",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "医疗免责",
          text: "我们的服务不提供医疗建议、诊断或治疗。所有计算结果和建议仅供参考，不能替代专业医疗咨询。"
        },
        {
          subtitle: "准确性声明",
          text: "虽然我们努力确保信息的准确性，但我们不保证服务的完全准确性、可靠性或完整性。"
        },
        {
          subtitle: "服务可用性",
          text: "我们努力保持服务的持续可用性，但不保证服务不会中断。我们可能因维护、更新或其他原因暂停服务。"
        },
        {
          subtitle: "第三方链接",
          text: "我们的服务可能包含指向第三方网站的链接。我们不对这些网站的内容或隐私做法负责。"
        }
      ]
    },
    {
      id: "limitation-liability",
      title: "责任限制",
      icon: Shield,
      content: [
        {
          subtitle: "损害赔偿",
          text: "在法律允许的最大范围内，我们对因使用或无法使用我们的服务而产生的任何直接、间接、偶然或后果性损害不承担责任。"
        },
        {
          subtitle: "赔偿上限",
          text: "我们的总责任不超过您在过去12个月内为我们的服务支付的金额。"
        },
        {
          subtitle: "用户赔偿",
          text: "您同意就因您违反这些条款或滥用我们的服务而产生的任何索赔、损失或损害对我们进行赔偿。"
        }
      ]
    },
    {
      id: "termination",
      title: "服务终止",
      icon: AlertTriangle,
      content: [
        {
          subtitle: "用户终止",
          text: "您可以随时通过删除账户或停止使用我们的服务来终止与我们的协议。"
        },
        {
          subtitle: "我们的终止权",
          text: "我们保留在您违反这些条款或出于其他合理原因时暂停或终止您的账户的权利。"
        },
        {
          subtitle: "终止后果",
          text: "账户终止后，您将失去访问我们服务的权利，但某些条款（如知识产权和责任限制）将继续有效。"
        }
      ]
    }
  ];

  const importantNotices = [
    {
      title: "医疗免责声明",
      content: "本平台提供的所有健康计算器和建议仅供参考，不能替代专业医疗建议、诊断或治疗。如有健康问题，请咨询合格的医疗专业人员。",
      type: "warning"
    },
    {
      title: "数据准确性",
      content: "计算结果的准确性取决于您提供的输入数据。请确保输入准确的个人信息以获得最佳结果。",
      type: "info"
    },
    {
      title: "紧急情况",
      content: "如果您遇到医疗紧急情况，请立即拨打急救电话或前往最近的医院，不要依赖我们的服务进行紧急医疗决策。",
      type: "error"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            服务条款
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="text-sm">
              最后更新：2024年12月
            </Badge>
            <Badge variant="outline" className="text-sm">
              版本：2.0
            </Badge>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            欢迎使用健康计算器平台。请仔细阅读以下服务条款，
            这些条款构成您与我们之间的法律协议。
          </p>
        </div>

        {/* 重要提示 */}
        <div className="mb-16 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">重要提示</h2>
          {importantNotices.map((notice, index) => (
            <Alert key={index} className={`border-2 ${
              notice.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              notice.type === 'error' ? 'border-red-200 bg-red-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              <AlertTriangle className={`h-4 w-4 ${
                notice.type === 'warning' ? 'text-yellow-600' :
                notice.type === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`} />
              <AlertDescription>
                <strong className="block mb-1">{notice.title}</strong>
                {notice.content}
              </AlertDescription>
            </Alert>
          ))}
        </div>

        {/* 详细条款 */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <IconComponent className="h-8 w-8 text-green-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.subtitle}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 争议解决 */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Scale className="h-8 w-8 text-green-600" />
                争议解决
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">适用法律</h4>
                <p className="text-gray-600">本协议受中华人民共和国法律管辖，不考虑法律冲突原则。</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">争议解决方式</h4>
                <p className="text-gray-600">任何争议应首先通过友好协商解决。如协商不成，应提交至北京仲裁委员会进行仲裁。</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">管辖法院</h4>
                <p className="text-gray-600">如仲裁不适用，争议应提交至北京市朝阳区人民法院管辖。</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 联系信息 */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">条款相关咨询</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                如果您对本服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>法务部门：</strong> legal@healthcalculator.com
                </p>
                <p className="text-gray-900">
                  <strong>客服热线：</strong> 400-123-4567
                </p>
                <p className="text-gray-900">
                  <strong>邮寄地址：</strong> 北京市朝阳区健康科技园区
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  联系我们
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 条款生效 */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg bg-green-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">条款生效</h3>
              <p className="text-gray-600 text-sm">
                本服务条款自2024年12月起生效。通过继续使用我们的服务，
                您确认已阅读、理解并同意受本条款的约束。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}