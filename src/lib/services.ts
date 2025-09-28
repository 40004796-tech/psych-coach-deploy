// 服务套餐和价格管理

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // 分钟
  features: string[];
  popular?: boolean;
  category: 'individual' | 'group' | 'online' | 'offline';
}

export const servicePackages: ServicePackage[] = [
  {
    id: 'basic',
    name: '基础咨询',
    description: '适合初次接触心理教练的用户',
    price: 299,
    duration: 50,
    features: [
      '专业心理评估',
      '个性化成长建议',
      '基础情绪管理指导',
      '后续跟进计划'
    ],
    category: 'individual'
  },
  {
    id: 'standard',
    name: '标准套餐',
    description: '最受欢迎的心理教练服务',
    price: 499,
    duration: 60,
    features: [
      '深度心理分析',
      '个性化成长方案',
      '情绪管理技巧训练',
      '人际关系指导',
      '3次免费跟进'
    ],
    popular: true,
    category: 'individual'
  },
  {
    id: 'premium',
    name: '高级套餐',
    description: '全方位心理成长服务',
    price: 799,
    duration: 90,
    features: [
      '全面心理评估',
      '定制化成长计划',
      '高级情绪管理技巧',
      '职业发展指导',
      '亲密关系咨询',
      '5次免费跟进',
      '专属成长档案'
    ],
    category: 'individual'
  },
  {
    id: 'group',
    name: '团体咨询',
    description: '小组形式的心灵成长',
    price: 199,
    duration: 120,
    features: [
      '小组互动学习',
      '同伴支持系统',
      '集体成长活动',
      '经验分享交流'
    ],
    category: 'group'
  },
  {
    id: 'online',
    name: '在线咨询',
    description: '便捷的线上心理服务',
    price: 399,
    duration: 50,
    features: [
      '视频/语音咨询',
      '在线心理评估',
      '数字化成长记录',
      '灵活时间安排'
    ],
    category: 'online'
  }
];

// 获取所有服务套餐
export function getAllServicePackages(): ServicePackage[] {
  return servicePackages;
}

// 根据ID获取服务套餐
export function getServicePackageById(id: string): ServicePackage | undefined {
  return servicePackages.find(pkg => pkg.id === id);
}

// 根据分类获取服务套餐
export function getServicePackagesByCategory(category: ServicePackage['category']): ServicePackage[] {
  return servicePackages.filter(pkg => pkg.category === category);
}

// 获取热门套餐
export function getPopularServicePackages(): ServicePackage[] {
  return servicePackages.filter(pkg => pkg.popular);
}

// 格式化价格显示
export function formatPrice(price: number): string {
  return `¥${price}`;
}

// 格式化时长显示
export function formatDuration(duration: number): string {
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
  }
  return `${duration}分钟`;
}
