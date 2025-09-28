// 应用常量配置

export const APP_CONFIG = {
  name: "心青心理教练",
  description: "专业的心理成长与情绪管理服务",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  version: "1.0.0"
} as const;

export const AUTH_CONFIG = {
  tokenKey: "psych_coach_auth",
  expirationDuration: 2 * 60 * 60 * 1000, // 2小时
  adminTokenKey: "adminLoggedIn"
} as const;

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  password: {
    minLength: 6
  }
} as const;

export const SERVICE_PACKAGES = [
  {
    id: "basic",
    name: "基础咨询",
    price: 299,
    duration: 50,
    features: [
      "专业心理评估",
      "个性化成长建议", 
      "基础情绪管理指导",
      "后续跟进计划"
    ]
  },
  {
    id: "premium",
    name: "深度咨询",
    price: 599,
    duration: 60,
    features: [
      "深度心理分析",
      "个性化治疗方案",
      "情绪管理技巧训练",
      "长期成长规划",
      "24小时在线支持"
    ]
  },
  {
    id: "vip",
    name: "VIP专属",
    price: 899,
    duration: 90,
    features: [
      "一对一专属服务",
      "全方位心理评估",
      "定制化治疗方案",
      "定期进度跟踪",
      "紧急情况支持",
      "专属客服通道"
    ]
  }
] as const;

export const TOPICS = [
  "情绪管理",
  "亲密关系", 
  "职业发展",
  "自我探索",
  "焦虑抑郁",
  "人际关系",
  "家庭关系",
  "学习压力"
] as const;

export const MODES = [
  "线上视频",
  "线下见面",
  "均可"
] as const;

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED", 
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const;

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive"
} as const;

