export const zhCN = {
  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    reset: '重置',
    submit: '提交',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    view: '查看',
    download: '下载',
    upload: '上传',
    copy: '复制',
    share: '分享',
    print: '打印',
    export: '导出',
    import: '导入',
    refresh: '刷新',
    more: '更多',
    less: '收起',
    all: '全部',
    none: '无',
    yes: '是',
    no: '否',
    optional: '可选',
    required: '必填',
    email: '邮箱',
    password: '密码',
    username: '用户名',
    phone: '电话',
    address: '地址',
    date: '日期',
    time: '时间',
    name: '姓名',
    description: '描述',
    status: '状态',
    type: '类型',
    category: '分类',
    tag: '标签',
    price: '价格',
    amount: '金额',
    quantity: '数量',
    total: '总计',
    subtotal: '小计',
    discount: '折扣',
    tax: '税费',
    free: '免费',
    paid: '已付费',
    pending: '待处理',
    active: '活跃',
    inactive: '非活跃',
    enabled: '已启用',
    disabled: '已禁用',
    public: '公开',
    private: '私有',
    draft: '草稿',
    published: '已发布',
    archived: '已归档'
  },

  // 导航
  nav: {
    home: '首页',
    dashboard: '仪表板',
    healthCalculators: '健康计算器',
    healthReports: '健康报告',
    healthNews: '健康资讯',
    chat: '智能咨询',
    plans: '套餐方案',
    about: '关于我们',
    contact: '联系我们',
    privacy: '隐私政策',
    terms: '服务条款',
    apiDocs: 'API文档',
    admin: '管理后台',
    profile: '个人资料',
    settings: '设置',
    logout: '退出登录',
    login: '登录',
    register: '注册',
    language: '语言',
    calculations: '计算次数',
    loggingOut: '退出中...'
  },

  // 认证
  auth: {
    login: {
      title: '登录',
      subtitle: '欢迎回来！请登录您的账户',
      emailPlaceholder: '请输入邮箱地址',
      passwordPlaceholder: '请输入密码',
      rememberMe: '记住我',
      forgotPassword: '忘记密码？',
      loginButton: '登录',
      noAccount: '还没有账户？',
      signUp: '立即注册',
      loginWith: '使用以下方式登录',
      google: 'Google',
      github: 'GitHub'
    },
    register: {
      title: '注册',
      subtitle: '创建您的账户，开始健康管理之旅',
      namePlaceholder: '请输入姓名',
      emailPlaceholder: '请输入邮箱地址',
      passwordPlaceholder: '请输入密码',
      confirmPasswordPlaceholder: '请确认密码',
      agreeTerms: '我同意',
      termsOfService: '服务条款',
      and: '和',
      privacyPolicy: '隐私政策',
      registerButton: '注册',
      hasAccount: '已有账户？',
      signIn: '立即登录'
    },
    forgotPassword: {
      title: '忘记密码',
      subtitle: '输入您的邮箱地址，我们将发送重置密码的链接',
      emailPlaceholder: '请输入邮箱地址',
      sendButton: '发送重置链接',
      backToLogin: '返回登录',
      emailSent: '重置链接已发送到您的邮箱'
    },
    resetPassword: {
      title: '重置密码',
      subtitle: '请输入您的新密码',
      passwordPlaceholder: '请输入新密码',
      confirmPasswordPlaceholder: '请确认新密码',
      resetButton: '重置密码',
      passwordReset: '密码重置成功'
    }
  },

  // 首页
  home: {
    hero: {
      title: 'FireGEO 健康管理平台',
      subtitle: '智能健康分析，个性化健康管理，让您的健康数据更有价值',
      description: '专业健康计算器、AI咨询、个性化报告 - 您的全方位健康管理解决方案',
      getStarted: '开始使用',
      learnMore: '了解更多',
      startButton: '开始健康评估',
      plansButton: '查看套餐',
      features: '核心功能'
    },
    stats: {
      users: '用户',
      calculations: '计算次数',
      reports: '生成报告',
      satisfaction: '满意度',
      bmi: {
        title: 'BMI计算器',
        description: '计算您的身体质量指数',
        value: '50,000+'
      },
      calories: {
        title: '卡路里',
        description: '每日摄入'
      },
      bodyFat: {
        title: '体脂率',
        description: '身体成分'
      },
      advice: {
        title: 'AI建议',
        description: '智能提示'
      }
    },
    pricing: {
      title: '选择您的健康计划',
      subtitle: '灵活的定价方案，适合每个健康旅程',
      description: '为您的健康之旅选择完美的计划',
      viewPlans: '查看所有套餐',
      starter: {
        title: '入门版',
        description: '适合初学者',
        price: '免费',
        period: '/月',
        feature1: '基础健康计算器',
        feature2: '健康小贴士',
        feature3: '进度跟踪',
        button: '开始使用'
      },
      pro: {
        title: '专业版',
        description: '适合认真的健康爱好者',
        price: '¥68',
        period: '/月',
        badge: '最受欢迎',
        feature1: '所有计算器',
        feature2: 'AI健康建议',
        feature3: '详细报告',
        button: '开始专业版'
      },
      enterprise: {
        title: '企业版',
        description: '适合医疗专业人士',
        price: '联系我们',
        feature1: '定制解决方案',
        feature2: 'API访问',
        feature3: '优先支持',
        button: '联系销售'
      }
    },
    cta1: {
      title: '今天开始您的健康之旅',
      description: '加入数千名信任我们平台进行健康管理的用户',
      button: '立即开始'
    },
    cta2: {
      title: '准备好改变您的健康状况了吗？',
      description: '通过我们全面的工具和专家指导，掌控您的健康',
      button1: '开始免费试用',
      button2: '查看定价'
    },
    faq: {
      title: '常见问题',
      description: '关于我们健康平台的一切您需要了解的信息',
      question1: '健康计算器的准确性如何？',
      answer1: '我们的计算器使用科学验证的公式，并根据最新的医学研究定期更新。',
      question2: '我的健康数据安全吗？',
      answer2: '是的，我们使用行业标准加密，绝不会与第三方分享您的个人健康信息。',
      question3: '我可以在移动设备上使用吗？',
      answer3: '当然可以！我们的平台完全响应式，在包括智能手机和平板电脑在内的所有设备上都能无缝运行。',
      question4: '我需要创建账户吗？',
      answer4: '基础计算器可以在不创建账户的情况下使用，但创建账户可以让您保存进度并访问高级功能。',
      question5: '你们接受哪些付款方式？',
      answer5: '我们接受所有主要信用卡、支付宝、微信支付，并提供多种订阅选项以满足您的需求。'
    }
  },

  // 健康计算器
  calculators: {
    title: '健康计算器大全',
    subtitle: '30种专业健康计算器，全方位守护您的健康。从基础指标到专业评估，科学管理您的健康数据。',
    searchPlaceholder: '搜索计算器...',
    categories: {
      all: '全部',
      basic: '基础指标',
      cardiovascular: '心血管',
      nutrition: '营养饮食',
      exercise: '运动健身',
      women: '女性健康',
      children: '儿童健康',
      elderly: '老年健康',
      sleep: '睡眠压力',
      disease: '疾病风险',
      comprehensive: '综合评估'
    },
    popular: '🔥 热门计算器',
    popularDescription: '最受欢迎的健康计算工具',
    calculate: '开始计算',
    result: '计算结果',
    interpretation: '结果解读',
    recommendations: '健康建议',
    shareResult: '分享结果',
    saveResult: '保存结果',
    newCalculation: '重新计算',
    noResults: {
      title: '未找到相关计算器',
      description: '请尝试其他搜索词或选择不同的分类'
    },
    healthTips: {
      title: '💡 健康管理小贴士',
      tip1: {
        title: '定期监测',
        description: '定期使用健康计算器监测身体指标变化'
      },
      tip2: {
        title: '设定目标',
        description: '根据计算结果设定合理的健康目标'
      },
      tip3: {
        title: '记录进展',
        description: '记录健康数据变化，追踪改善进展'
      },
      tip4: {
        title: '专业咨询',
        description: '如有异常请及时咨询专业医生'
      }
    },
    bmi: {
      title: 'BMI 计算器',
      subtitle: '计算您的身体质量指数，了解您的健康状况',
      inputTitle: '输入您的信息',
      height: '身高 (厘米)',
      weight: '体重 (公斤)',
      heightPlaceholder: '例如: 170',
      weightPlaceholder: '例如: 65',
      calculate: '计算 BMI',
      reset: '重置',
      resultTitle: '计算结果',
      categories: {
        underweight: '体重过轻',
        normal: '正常体重',
        overweight: '超重',
        obese: '肥胖'
      },
      classification: 'BMI 分类标准：',
      ranges: {
        underweight: '< 18.5',
        normal: '18.5 - 23.9',
        overweight: '24.0 - 27.9',
        obese: '≥ 28.0'
      },
      placeholder: '请输入身高和体重来计算您的BMI',
      advice: {
        title: '健康建议',
        lifestyle: {
          title: '💡 生活建议',
          tip1: '保持均衡饮食，多吃蔬菜水果',
          tip2: '每周进行150分钟中等强度运动',
          tip3: '保证充足睡眠，每天7-9小时',
          tip4: '多喝水，减少含糖饮料'
        },
        notes: {
          title: '⚠️ 注意事项',
          note1: 'BMI仅供参考，不能完全反映健康状况',
          note2: '肌肉发达者BMI可能偏高但很健康',
          note3: '如有健康问题请咨询专业医生',
          note4: '定期体检，关注身体变化'
        }
      }
    }
  },

  // 健康计算器
  calculators: {
    title: '健康计算器大全',
    subtitle: '30种专业健康计算器，全方位守护您的健康。从基础指标到专业评估，科学管理您的健康数据。',
    searchPlaceholder: '搜索计算器...',
    categories: {
      all: '全部',
      basic: '基础指标',
      cardiovascular: '心血管',
      nutrition: '营养饮食',
      exercise: '运动健身',
      women: '女性健康',
      children: '儿童健康',
      elderly: '老年健康',
      sleep: '睡眠压力',
      disease: '疾病风险',
      comprehensive: '综合评估'
    },
    popular: '🔥 热门计算器',
    popularDescription: '最受欢迎的健康计算工具',
    calculate: '开始计算',
    result: '计算结果',
    interpretation: '结果解读',
    recommendations: '健康建议',
    shareResult: '分享结果',
    saveResult: '保存结果',
    newCalculation: '重新计算',
    noResults: {
      title: '未找到相关计算器',
      description: '请尝试其他搜索词或选择不同的分类'
    },
    healthTips: {
      title: '💡 健康管理小贴士',
      tip1: {
        title: '定期监测',
        description: '定期使用健康计算器监测身体指标变化'
      },
      tip2: {
        title: '设定目标',
        description: '根据计算结果设定合理的健康目标'
      },
      tip3: {
        title: '记录进展',
        description: '记录健康数据变化，追踪改善进展'
      },
      tip4: {
        title: '专业咨询',
        description: '如有异常请及时咨询专业医生'
      }
    },
    items: {
      bmi: {
        name: 'BMI计算器',
        description: '计算身体质量指数，评估体重状况',
        category: '基础指标'
      },
      calorie: {
        name: '卡路里计算器',
        description: '计算每日所需卡路里和基础代谢率',
        category: '基础指标'
      },
      'body-fat': {
        name: '体脂率计算器',
        description: '估算身体脂肪百分比',
        category: '基础指标'
      },
      'ideal-weight': {
        name: '理想体重计算器',
        description: '根据身高计算理想体重范围',
        category: '基础指标'
      },
      'waist-hip': {
        name: '腰臀比计算器',
        description: '评估腹部肥胖风险',
        category: '基础指标'
      },
      'heart-rate': {
        name: '心率区间计算器',
        description: '计算运动时的目标心率区间',
        category: '心血管'
      },
      'blood-pressure': {
        name: '血压评估器',
        description: '评估血压水平和健康风险',
        category: '心血管'
      },
      cholesterol: {
        name: '胆固醇风险评估',
        description: '评估心血管疾病风险',
        category: '心血管'
      },
      water: {
        name: '每日饮水量计算器',
        description: '计算每日推荐饮水量',
        category: '营养饮食'
      },
      protein: {
        name: '蛋白质需求计算器',
        description: '计算每日蛋白质需求量',
        category: '营养饮食'
      },
      macro: {
        name: '宏量营养素计算器',
        description: '计算碳水、蛋白质、脂肪比例',
        category: '营养饮食'
      },
      'vitamin-d': {
        name: '维生素D需求计算器',
        description: '评估维生素D需求量',
        category: '营养饮食'
      },
      'exercise-calorie': {
        name: '运动消耗计算器',
        description: '计算各种运动的卡路里消耗',
        category: '运动健身'
      },
      'one-rep-max': {
        name: '最大重量计算器',
        description: '计算单次最大举重重量',
        category: '运动健身'
      },
      pace: {
        name: '跑步配速计算器',
        description: '计算跑步配速和完赛时间',
        category: '运动健身'
      },
      'vo2-max': {
        name: '最大摄氧量计算器',
        description: '评估心肺功能水平',
        category: '运动健身'
      },
      'pregnancy-weight': {
        name: '孕期体重计算器',
        description: '计算孕期合理体重增长',
        category: '女性健康'
      },
      ovulation: {
        name: '排卵期计算器',
        description: '预测排卵期和受孕窗口',
        category: '女性健康'
      },
      menstrual: {
        name: '月经周期计算器',
        description: '追踪和预测月经周期',
        category: '女性健康'
      },
      'child-growth': {
        name: '儿童生长曲线',
        description: '评估儿童身高体重发育情况',
        category: '儿童健康'
      },
      'child-bmi': {
        name: '儿童BMI计算器',
        description: '计算儿童和青少年BMI百分位',
        category: '儿童健康'
      },
      'bone-density': {
        name: '骨密度风险评估',
        description: '评估骨质疏松风险',
        category: '老年健康'
      },
      'fall-risk': {
        name: '跌倒风险评估',
        description: '评估老年人跌倒风险',
        category: '老年健康'
      },
      sleep: {
        name: '睡眠需求计算器',
        description: '计算最佳睡眠时间和周期',
        category: '睡眠压力'
      },
      stress: {
        name: '压力水平评估',
        description: '评估心理压力和健康影响',
        category: '睡眠压力'
      },
      'diabetes-risk': {
        name: '糖尿病风险评估',
        description: '评估2型糖尿病患病风险',
        category: '疾病风险'
      },
      kidney: {
        name: '肾功能计算器',
        description: '计算肾小球滤过率',
        category: '疾病风险'
      },
      'body-age': {
        name: '身体年龄计算器',
        description: '评估身体的生理年龄',
        category: '综合评估'
      },
      'health-score': {
        name: '健康评分计算器',
        description: '综合评估整体健康状况',
        category: '综合评估'
      },
      'life-expectancy': {
        name: '预期寿命计算器',
        description: '基于生活方式预测预期寿命',
        category: '综合评估'
      }
    },
    exercise: {
      title: '🏃 运动消耗计算器',
      subtitle: '精确计算各种运动的卡路里消耗，科学指导您的健身计划',
      inputInfo: '运动信息',
      weight: '体重 (kg) *',
      weightPlaceholder: '例如：70',
      exerciseType: '运动类型 *',
      exerciseTypePlaceholder: '选择运动类型',
      intensity: '运动强度 *',
      intensityPlaceholder: '选择运动强度',
      selectExercise: '选择运动类型',
      selectIntensity: '选择运动强度',
      duration: '运动时间 (分钟) *',
      durationPlaceholder: '例如：30',
      calculate: '计算消耗',
      reset: '重置',
      resultTitle: '消耗结果',
      caloriesBurned: '卡路里消耗',
      fatBurned: '脂肪燃烧',
      metValue: 'MET值',
      foodEquivalents: '相当于消耗',
      weightComparison: '体重对比',
      exercises: {
        running: '跑步',
        cycling: '骑行',
        swimming: '游泳',
        walking: '步行',
        basketball: '篮球',
        football: '足球',
        tennis: '网球',
        badminton: '羽毛球',
        yoga: '瑜伽',
        weightlifting: '举重',
        dancing: '舞蹈',
        hiking: '徒步'
      },
      intensities: {
        light: '轻度 - 轻松，可以正常对话',
        moderate: '中度 - 稍微费力，对话略困难',
        vigorous: '高强度 - 很费力，难以对话'
      },
      intensityNames: {
        light: '轻度',
        moderate: '中度',
        vigorous: '高强度'
      },
      foods: {
        rice: '🍚 米饭:',
        apple: '🍎 苹果:',
        chocolate: '🍫 巧克力:',
        coke: '🥤 可乐:',
        riceBowls: '碗',
        appleCount: '个',
        chocolatePieces: '块',
        cokeCups: '杯'
      },
      weightComparisonLabels: {
        lighter: '体重-10kg:',
        heavier: '体重+10kg:',
        calories: '卡路里'
      },
      guides: {
        highIntensity: {
          title: '🔥 高消耗运动',
          exercises: [
            '跑步 (8-12 MET)',
            '游泳 (6-11 MET)',
            '骑行 (4-10 MET)',
            '足球 (5-10 MET)',
            '篮球 (4.5-8 MET)'
          ]
        },
        mediumIntensity: {
          title: '⚖️ 中等消耗运动',
          exercises: [
            '网球 (5-8 MET)',
            '羽毛球 (4.5-7 MET)',
            '举重 (3-6 MET)',
            '舞蹈 (3-7.8 MET)',
            '徒步 (4-8 MET)'
          ]
        },
        lowIntensity: {
          title: '🧘 低消耗运动',
          exercises: [
            '瑜伽 (2.5-4 MET)',
            '步行 (2.5-5 MET)',
            '太极 (3-4 MET)',
            '拉伸 (2.3 MET)',
            '慢舞 (3 MET)'
          ]
        }
      },
      advice: {
        title: '💡 运动建议',
        weightLoss: {
          title: '减重建议',
          tips: [
            '每周至少150分钟中等强度运动',
            '或75分钟高强度运动',
            '结合有氧和力量训练',
            '创造每日300-500卡路里缺口'
          ]
        },
        precautions: {
          title: '注意事项',
          tips: [
            '运动前充分热身',
            '根据体能循序渐进',
            '注意补充水分',
            '运动后适当拉伸'
          ]
        }
      },
      instructions: {
        title: '📋 使用说明',
        principle: {
          title: '计算原理',
          points: [
            '基于MET (代谢当量) 值计算',
            '公式：MET × 体重 × 时间',
            '考虑运动强度差异',
            '数据来源于运动生理学研究'
          ]
        },
        accuracy: {
          title: '准确性说明',
          points: [
            '结果为估算值，个体差异较大',
            '实际消耗受体能、技术等影响',
            '建议结合心率监测设备',
            '仅供健身参考，不替代专业指导'
          ]
        }
      },
      validation: {
        fillAllFields: '请填写所有必填项'
      }
    }
  },

  // 健康报告
  reports: {
    title: '健康报告中心',
    subtitle: '您的个性化健康分析报告',
    generateReport: '生成新报告',
    viewReport: '查看报告',
    downloadReport: '下载报告',
    shareReport: '分享报告',
    reportHistory: '历史报告',
    overview: '概览',
    details: '详细信息',
    trends: '趋势分析',
    recommendations: '改善建议',
    achievements: '健康成就',
    riskFactors: '风险因素',
    actionPlan: '行动计划',
    nextSteps: '下一步建议'
  },

  // 健康资讯
  news: {
    title: '健康资讯',
    subtitle: '最新的健康知识和医疗资讯',
    featured: '精选文章',
    latest: '最新文章',
    popular: '热门文章',
    categories: {
      all: '全部',
      nutrition: '营养健康',
      exercise: '运动健身',
      mentalHealth: '心理健康',
      preventiveCare: '预防保健',
      chronicDisease: '慢性疾病',
      wellness: '健康生活'
    },
    readMore: '阅读更多',
    readTime: '阅读时间',
    minutes: '分钟',
    author: '作者',
    publishDate: '发布日期',
    tags: '标签',
    relatedArticles: '相关文章',
    subscribe: '订阅通知',
    subscribeDescription: '订阅我们的健康资讯，获取最新健康知识'
  },

  // 智能咨询
  chat: {
    title: 'AI健康咨询',
    subtitle: '24/7智能健康咨询服务',
    placeholder: '请输入您的健康问题...',
    send: '发送',
    thinking: 'AI正在思考...',
    newChat: '新对话',
    chatHistory: '对话历史',
    clearHistory: '清空历史',
    exportChat: '导出对话',
    feedback: '反馈',
    helpful: '有帮助',
    notHelpful: '没帮助',
    disclaimer: '免责声明：AI咨询仅供参考，不能替代专业医疗建议。如有严重健康问题，请及时就医。'
  },

  // 套餐方案
  plans: {
    title: '简单透明的健康套餐',
    description: '选择最适合您的健康管理套餐，随时灵活升级或降级。',
    currentUser: '当前登录用户',
    viewAll: '查看所有套餐 →',
    subtitle: '选择适合您的健康管理方案',
    monthly: '月付',
    yearly: '年付',
    save: '节省',
    mostPopular: '最受欢迎',
    recommended: '推荐',
    choosePlan: '选择方案',
    upgrade: '升级',
    downgrade: '降级',
    currentPlan: '当前方案',
    cancel: '取消套餐',
    getStarted: '开始使用',
    features: '功能特性',
    unlimited: '无限制',
    limited: '有限制',
    support: '客户支持',
    priority: '优先',
    standard: '标准',
    basic: '基础',
    advanced: '高级',
    premium: '专业版',
    enterprise: '企业版',
    billing: {
      monthly: '按月',
      yearly: '按年',
      save: '节省 20%'
    },
    free: {
      name: '基础版',
      description: '适合初次体验健康管理服务',
      price: {
        primary: '免费',
        secondary: '无需信用卡'
      },
      features: {
        consultations: {
          primary: '每月10次健康咨询',
          secondary: 'AI智能健康顾问'
        },
        support: {
          primary: '社区支持',
          secondary: '获得社区用户帮助'
        },
        basic: {
          primary: '基础功能',
          secondary: 'BMI和卡路里计算器'
        }
      }
    },
    pro: {
      name: '专业版',
      description: '满足您的全面健康管理需求',
      recommend: '最受欢迎',
      price: {
        primary: '¥68/月',
        secondary: '按月计费'
      },
      features: {
        consultations: {
          primary: '每月100次健康咨询',
          secondary: 'AI智能健康顾问'
        },
        support: {
          primary: '专业支持',
          secondary: '获得专业团队帮助'
        },
        priority: {
          primary: '优先体验',
          secondary: '优先体验新功能'
        }
      }
    }
  },

  // 仪表板
  dashboard: {
    title: '健康仪表板',
    welcome: '欢迎回来',
    overview: '概览',
    recentActivity: '最近活动',
    healthMetrics: '健康指标',
    quickActions: '快速操作',
    notifications: '通知',
    reminders: '提醒',
    goals: '健康目标',
    progress: '进度',
    achievements: '成就',
    recommendations: '推荐',
    viewAll: '查看全部',
    noData: '暂无数据',
    lastUpdated: '最后更新'
  },

  // 个人资料
  profile: {
    title: '个人资料',
    basicInfo: '基本信息',
    healthInfo: '健康信息',
    preferences: '偏好设置',
    privacy: '隐私设置',
    security: '安全设置',
    avatar: '头像',
    changeAvatar: '更换头像',
    firstName: '名',
    lastName: '姓',
    dateOfBirth: '出生日期',
    gender: '性别',
    male: '男',
    female: '女',
    other: '其他',
    height: '身高',
    weight: '体重',
    bloodType: '血型',
    allergies: '过敏史',
    medications: '用药情况',
    medicalHistory: '病史',
    emergencyContact: '紧急联系人',
    saveChanges: '保存更改',
    changesSaved: '更改已保存'
  },

  // 设置
  settings: {
    title: '设置',
    general: '通用设置',
    notifications: '通知设置',
    privacy: '隐私设置',
    security: '安全设置',
    billing: '账单设置',
    language: '语言',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
    timezone: '时区',
    dateFormat: '日期格式',
    timeFormat: '时间格式',
    currency: '货币',
    emailNotifications: '邮件通知',
    pushNotifications: '推送通知',
    smsNotifications: '短信通知',
    marketingEmails: '营销邮件',
    securityAlerts: '安全提醒',
    changePassword: '修改密码',
    twoFactorAuth: '双重认证',
    loginHistory: '登录历史',
    connectedAccounts: '关联账户',
    dataExport: '数据导出',
    deleteAccount: '删除账户'
  },

  // 管理后台
  admin: {
    title: '管理后台',
    dashboard: '管理面板',
    users: '用户管理',
    content: '内容管理',
    analytics: '数据分析',
    settings: '系统设置',
    userManagement: {
      title: '用户管理',
      totalUsers: '总用户数',
      activeUsers: '活跃用户',
      newUsers: '新用户',
      userList: '用户列表',
      userDetails: '用户详情',
      banUser: '封禁用户',
      unbanUser: '解封用户',
      deleteUser: '删除用户'
    },
    systemMonitoring: {
      title: '系统监控',
      serverStatus: '服务器状态',
      performance: '性能指标',
      errorLogs: '错误日志',
      uptime: '运行时间',
      memoryUsage: '内存使用',
      cpuUsage: 'CPU使用',
      diskUsage: '磁盘使用'
    },
    dataStatistics: {
      title: '数据统计',
      calculations: '计算统计',
      reports: '报告统计',
      consultations: '咨询统计',
      userGrowth: '用户增长',
      revenue: '收入统计'
    }
  },

  // Footer
  footer: {
    title: '健康计算器',
    description: '专业的健康数据分析平台，为您提供精准的健康指标计算和个性化健康建议。',
    tools: {
      title: '健康工具',
      bmi: 'BMI计算器',
      calorie: '卡路里计算器',
      plans: '健康套餐',
      dashboard: '健康仪表板'
    },
    about: {
      title: '关于我们',
      about: '关于我们',
      news: '健康资讯',
      careers: '加入我们',
      contact: '联系我们'
    },
    copyright: '健康计算器. 保留所有权利。',
    privacy: '隐私政策',
    terms: '服务条款'
  },

  // 错误信息
  errors: {
    general: '发生了未知错误',
    network: '网络连接错误',
    server: '服务器错误',
    notFound: '页面未找到',
    unauthorized: '未授权访问',
    forbidden: '访问被禁止',
    validation: '输入验证失败',
    required: '此字段为必填项',
    invalidEmail: '邮箱格式不正确',
    invalidPassword: '密码格式不正确',
    passwordMismatch: '密码不匹配',
    userNotFound: '用户不存在',
    userExists: '用户已存在',
    loginFailed: '登录失败',
    sessionExpired: '会话已过期',
    permissionDenied: '权限不足'
  },

  // 成功信息
  success: {
    saved: '保存成功',
    updated: '更新成功',
    deleted: '删除成功',
    created: '创建成功',
    sent: '发送成功',
    uploaded: '上传成功',
    downloaded: '下载成功',
    copied: '复制成功',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    passwordChanged: '密码修改成功',
    emailVerified: '邮箱验证成功',
    profileUpdated: '个人资料更新成功',
    settingsSaved: '设置保存成功'
  },

  // 时间相关
  time: {
    now: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    weeksAgo: '周前',
    monthsAgo: '个月前',
    yearsAgo: '年前',
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    lastWeek: '上周',
    nextWeek: '下周',
    thisMonth: '本月',
    lastMonth: '上月',
    nextMonth: '下月',
    thisYear: '今年',
    lastYear: '去年',
    nextYear: '明年'
  }
};

export default zhCN;