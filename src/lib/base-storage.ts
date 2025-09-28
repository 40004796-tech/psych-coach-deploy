// 通用存储基类
export abstract class BaseStorage<T extends { id: string }> {
  protected items: T[] = [];

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  add(item: Omit<T, 'id'>): T {
    const newItem = {
      ...item,
      id: this.generateId()
    } as T;
    
    this.items.push(newItem);
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  delete(id: string): T | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    return this.items.splice(index, 1)[0];
  }

  exists(predicate: (item: T) => boolean): boolean {
    return this.items.some(predicate);
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// 导入持久化存储基类
import { PersistentStorage } from './persistent-storage';

// 用户存储类
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // 存储密码哈希
  registerDate: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  bookings: number;
}

// 配置项接口
export interface ConfigItem {
  id: string;
  type: 'service' | 'team' | 'process' | 'article' | 'coach' | 'testimonial' | 'faq' | 'hero' | 'feature' | 'callout' | 'footer' | 'footer_section' | 'footer_link' | 'footer_social' | 'service_package' | 'system_settings';
  title: string;
  description: string;
  content: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // 扩展字段，用于不同类型的特殊数据
  extra?: {
    tags?: string[]; // 用于教练标签
    role?: string; // 用于用户评价的角色
    bio?: string; // 用于教练简介
    question?: string; // 用于FAQ问题
    answer?: string; // 用于FAQ答案
    icon?: string; // 用于特性图标
    buttonText?: string; // 用于按钮文本
    buttonLink?: string; // 用于按钮链接
    // 底部配置字段
    logo?: string; // 用于底部logo
    companyName?: string; // 用于公司名称
    companyDescription?: string; // 用于公司描述
    sectionTitle?: string; // 用于底部区块标题
    links?: Array<{text: string; url: string}>; // 用于底部链接
    socialLinks?: Array<{platform: string; url: string; icon: string}>; // 用于社交媒体链接
    copyright?: string; // 用于版权信息
    // 服务套餐配置字段
    packageId?: string; // 套餐ID
    price?: number; // 价格
    duration?: number; // 时长（分钟）
    features?: string[]; // 功能特性列表
    popular?: boolean; // 是否热门
    category?: 'individual' | 'group' | 'online' | 'offline'; // 套餐分类
    // 系统设置字段
    settingType?: 'theme' | 'layout' | 'font' | 'color' | 'section_order' | 'section_settings'; // 设置类型
    settingKey?: string; // 设置键名
    settingValue?: any; // 设置值
    // 主题设置
    primaryColor?: string; // 主色调
    secondaryColor?: string; // 辅助色
    backgroundColor?: string; // 背景色
    textColor?: string; // 文字颜色
    borderColor?: string; // 边框颜色
    linkColor?: string; // 链接颜色
    hoverColor?: string; // 悬停颜色
    copyrightColor?: string; // 版权文字颜色
    // 字体设置
    fontFamily?: string; // 字体族
    fontSize?: string; // 字体大小
    fontWeight?: string; // 字体粗细
    heroFontSize?: string; // 首页标题字体大小
    heroSubtitleSize?: string; // 首页副标题字体大小
    heroButtonSize?: string; // 首页按钮字体大小
    // 布局设置
    sectionOrder?: string[]; // 板块顺序
    sectionSpacing?: number; // 板块间距
    containerWidth?: string; // 容器宽度
    heroPadding?: string; // 首页顶部框上下间距
    // 板块显示设置
    showHero?: boolean; // 显示首页横幅
    showFeatures?: boolean; // 显示特性介绍
    showCallout?: boolean; // 显示行动号召
    showServices?: boolean; // 显示服务
    showTeam?: boolean; // 显示团队
    showProcess?: boolean; // 显示流程
    showArticles?: boolean; // 显示文章
    showCoaches?: boolean; // 显示教练
    showTestimonials?: boolean; // 显示用户评价
    showFAQ?: boolean; // 显示FAQ
    showBooking?: boolean; // 显示预约
    // 板块单独设置
    sectionSettings?: {
      [sectionKey: string]: {
        theme?: {
          primaryColor?: string;
          secondaryColor?: string;
          backgroundColor?: string;
          textColor?: string;
          borderColor?: string;
          linkColor?: string;
          hoverColor?: string;
          copyrightColor?: string;
        };
        font?: {
          fontFamily?: string;
          fontSize?: string;
          fontWeight?: string;
          titleFontSize?: string;
          titleFontWeight?: string;
          copyrightFontSize?: string;
          copyrightFontWeight?: string;
        };
        layout?: {
          padding?: string;
          margin?: string;
          borderRadius?: string;
          boxShadow?: string;
          borderWidth?: string;
          borderStyle?: string;
          textAlign?: 'left' | 'center' | 'right';
          titleAlign?: 'left' | 'center' | 'right';
          copyrightAlign?: 'left' | 'center' | 'right';
          gap?: string;
          sectionGap?: string;
        };
        customCSS?: string; // 自定义CSS
      };
    };
  };
}

export class UserStorage extends PersistentStorage<User> {
  constructor() {
    super('users.json');
  }

  // 验证密码
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = this.items.find(u => u.email === email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  // 创建用户（带密码哈希）
  async createUser(userData: Omit<User, 'id' | 'passwordHash' | 'registerDate' | 'lastLogin' | 'status' | 'bookings'>, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString().split('T')[0];
    
    const newUser = {
      ...userData,
      passwordHash,
      id: this.generateId(),
      registerDate: now,
      lastLogin: now,
      status: "active" as const,
      bookings: 0
    };
    
    this.items.push(newUser);
    this.saveData(); // 保存到文件
    return newUser;
  }

  emailExists(email: string): boolean {
    return this.exists(user => user.email === email);
  }

  phoneExists(phone: string): boolean {
    return this.exists(user => user.phone === phone);
  }

  nameExists(name: string): boolean {
    return this.exists(user => user.name === name);
  }
}

// 预约存储类
export interface Booking {
  id: string;
  name: string;
  contact: string;
  topic: string;
  mode: string;
  note: string;
  servicePackage: {
    id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
  };
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  // 新增字段（都是可选的，兼容现有数据）
  scheduledTime?: string; // 预约时间
  adminNotes?: string; // 管理员备注
  userNotes?: string; // 用户备注
  updatedAt?: string; // 更新时间
  cancelledAt?: string; // 取消时间
  completedAt?: string; // 完成时间
}

export class BookingStorage extends PersistentStorage<Booking> {
  constructor() {
    super('bookings.json');
  }

  add(booking: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
    const newBooking = {
      ...booking,
      id: this.generateId(),
      status: 'PENDING' as const,
      createdAt: new Date().toISOString()
    };
    
    this.items.push(newBooking);
    this.saveData(); // 保存到文件
    return newBooking;
  }

  getByStatus(status: Booking['status']): Booking[] {
    return this.items.filter(booking => booking.status === status);
  }

  // 更新预约状态
  updateStatus(id: string, status: Booking['status'], adminNotes?: string): Booking | null {
    const booking = this.getById(id);
    if (!booking) return null;
    
    const now = new Date().toISOString();
    const updates: Partial<Booking> = {
      status,
      updatedAt: now
    };
    
    if (status === 'CANCELLED') {
      updates.cancelledAt = now;
    } else if (status === 'COMPLETED') {
      updates.completedAt = now;
    }
    
    if (adminNotes) {
      updates.adminNotes = adminNotes;
    }
    
    // 直接更新数组中的项目，然后保存
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    this.saveData();
    return this.items[index];
  }

  // 设置预约时间
  setScheduledTime(id: string, scheduledTime: string, adminNotes?: string): Booking | null {
    const updates: Partial<Booking> = {
      scheduledTime,
      updatedAt: new Date().toISOString()
    };
    
    if (adminNotes) {
      updates.adminNotes = adminNotes;
    }
    
    // 直接更新数组中的项目，然后保存
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    this.saveData();
    return this.items[index];
  }

  // 获取用户的预约
  getByUser(contact: string): Booking[] {
    return this.items
      .filter(booking => booking.contact === contact)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 检查是否可以取消（24小时内）
  canCancel(booking: Booking): boolean {
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return false;
    }
    
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff <= 24;
  }

  // 删除预约
  deleteBooking(id: string): Booking | null {
    const booking = this.getById(id);
    if (!booking) return null;
    
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const deletedBooking = this.items.splice(index, 1)[0];
    this.saveData(); // 保存到文件
    return deletedBooking;
  }

  // 根据用户联系方式删除所有预约
  deleteByUser(contact: string): Booking[] {
    const userBookings = this.items.filter(booking => booking.contact === contact);
    this.items = this.items.filter(booking => booking.contact !== contact);
    this.saveData(); // 保存到文件
    return userBookings;
  }

  getBookingStats() {
    const total = this.items.length;
    const pending = this.getByStatus('PENDING').length;
    const totalRevenue = this.items.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    const topics: Record<string, number> = {};
    const modes: Record<string, number> = {};
    
    this.items.forEach(booking => {
      topics[booking.topic] = (topics[booking.topic] || 0) + 1;
      modes[booking.mode] = (modes[booking.mode] || 0) + 1;
    });
    
    return { total, pending, totalRevenue, topics, modes };
  }
}

// 配置存储类
export class ConfigStorage extends PersistentStorage<ConfigItem> {
  constructor() {
    super('configs.json');
  }

  // 按类型获取配置
  getByType(type: ConfigItem['type']): ConfigItem[] {
    return this.items
      .filter(item => item.type === type && item.isActive)
      .sort((a, b) => a.order - b.order);
  }

  // 按类型和ID获取配置
  getByTypeAndId(type: ConfigItem['type'], id: string): ConfigItem | undefined {
    return this.items.find(item => item.type === type && item.id === id);
  }

  // 创建配置项
  createConfig(configData: Omit<ConfigItem, 'id' | 'createdAt' | 'updatedAt'>): ConfigItem {
    const now = new Date().toISOString();
    const newConfig: ConfigItem = {
      ...configData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    this.items.push(newConfig);
    this.saveData(); // 保存到文件
    return newConfig;
  }

  // 更新配置项
  updateConfig(id: string, updates: Partial<Omit<ConfigItem, 'id' | 'createdAt'>>): ConfigItem | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(); // 保存到文件
    return this.items[index];
  }

  // 批量更新排序
  updateOrder(type: ConfigItem['type'], orderUpdates: { id: string; order: number }[]): void {
    orderUpdates.forEach(({ id, order }) => {
      const item = this.items.find(item => item.id === id && item.type === type);
      if (item) {
        item.order = order;
        item.updatedAt = new Date().toISOString();
      }
    });
    this.saveData(); // 保存到文件
  }
}

// 初始化数据 - 移除测试数据，只保持真实数据
const initialUsers: User[] = [];

// 初始化配置数据
const initialConfigs: ConfigItem[] = [
  {
    id: 'service-1',
    type: 'service',
    title: '个人心理咨询',
    description: '一对一专业心理辅导',
    content: '提供专业的个人心理咨询服务，帮助您解决心理困扰，提升生活质量。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'service-2',
    type: 'service',
    title: '情感关系咨询',
    description: '改善人际关系和情感问题',
    content: '专业的情感关系咨询，帮助您建立健康的人际关系和情感连接。',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'team-1',
    type: 'team',
    title: '张心理师',
    description: '资深心理咨询师',
    content: '拥有10年心理咨询经验，擅长情绪管理和人际关系咨询。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'process-1',
    type: 'process',
    title: '预约咨询',
    description: '在线预约专业心理咨询',
    content: '通过我们的平台轻松预约心理咨询师，选择合适的时间进行咨询。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'article-1',
    type: 'article',
    title: '心理健康的重要性',
    description: '了解心理健康对生活的影响',
    content: '心理健康是整体健康的重要组成部分，影响着我们的思维、情感和行为。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // 教练配置
  {
    id: 'coach-1',
    type: 'coach',
    title: '林晨',
    description: '国家二级心理咨询师 / 青年成长教练',
    content: '温暖稳重的陪伴风格，擅长帮助来访者建立自我支持。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      bio: '温暖稳重的陪伴风格，擅长帮助来访者建立自我支持。',
      tags: ['情绪管理', '自我探索', '关系沟通']
    }
  },
  {
    id: 'coach-2',
    type: 'coach',
    title: '苏宁',
    description: '职业发展教练 / ICF ACC',
    content: '以目标为导向，兼顾情绪与行动，助你稳步成长。',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      bio: '以目标为导向，兼顾情绪与行动，助你稳步成长。',
      tags: ['职业规划', '目标达成', '压力管理']
    }
  },
  {
    id: 'coach-3',
    type: 'coach',
    title: '张一',
    description: '亲密关系教练 / 婚恋沟通',
    content: '关注关系中的真实需要，促进更清晰的表达与理解。',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      bio: '关注关系中的真实需要，促进更清晰的表达与理解。',
      tags: ['亲密关系', '沟通技巧', '自我价值']
    }
  },
  // 用户评价
  {
    id: 'testimonial-1',
    type: 'testimonial',
    title: 'Y.同学',
    description: '大学生',
    content: '每次结束都更有力量，开始愿意表达真实的需要，也更理解自己了。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      role: '大学生'
    }
  },
  {
    id: 'testimonial-2',
    type: 'testimonial',
    title: 'L.同事',
    description: '设计师',
    content: '焦虑明显减少，能把注意力放回当下，逐步建立稳定节奏。',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      role: '设计师'
    }
  },
  {
    id: 'testimonial-3',
    type: 'testimonial',
    title: 'C.朋友',
    description: '产品经理',
    content: '在职业困惑期得到很大支持，行动计划也更清晰可行。',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      role: '产品经理'
    }
  },
  // FAQ
  {
    id: 'faq-1',
    type: 'faq',
    title: '一次多长时间？',
    description: '咨询时长说明',
    content: '单次约50分钟，首次会根据你的目标进行评估和计划制定。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      question: '一次多长时间？',
      answer: '单次约50分钟，首次会根据你的目标进行评估和计划制定。'
    }
  },
  {
    id: 'faq-2',
    type: 'faq',
    title: '线上还是线下？',
    description: '咨询方式说明',
    content: '均可。我们提供视频与线下空间，视你的方便选择。',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      question: '线上还是线下？',
      answer: '均可。我们提供视频与线下空间，视你的方便选择。'
    }
  },
  {
    id: 'faq-3',
    type: 'faq',
    title: '价格如何？',
    description: '价格说明',
    content: '根据教练资历与服务形式，区间为¥299-¥899/次。',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      question: '价格如何？',
      answer: '根据教练资历与服务形式，区间为¥299-¥899/次。'
    }
  },
  {
    id: 'faq-4',
    type: 'faq',
    title: '隐私如何保障？',
    description: '隐私保护说明',
    content: '遵循严格保密原则，除法律要求或安全风险外，不会泄露任何信息。',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      question: '隐私如何保障？',
      answer: '遵循严格保密原则，除法律要求或安全风险外，不会泄露任何信息。'
    }
  },
  // 特性介绍
  {
    id: 'feature-1',
    type: 'feature',
    title: '严选教练',
    description: '专业资质与经验审核，持续督导与成长。',
    content: '我们严格筛选每一位心理教练，确保他们具备专业资质和丰富经验。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      icon: '/icons/heart.svg'
    }
  },
  {
    id: 'feature-2',
    type: 'feature',
    title: '隐私保障',
    description: '全程加密与隐私保护，安全可信赖。',
    content: '我们采用先进的加密技术，确保您的隐私信息得到充分保护。',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      icon: '/icons/shield.svg'
    }
  },
  {
    id: 'feature-3',
    type: 'feature',
    title: '灵活预约',
    description: '多时段可选，线上线下均可，支持随时改期。',
    content: '提供灵活的预约时间选择，支持线上和线下两种咨询方式。',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      icon: '/icons/calendar.svg'
    }
  },
  // 行动号召
  {
    id: 'callout-1',
    type: 'callout',
    title: '让我们一起，走向更有力量的明天',
    description: '适合情绪压力、关系困扰、自我探索、职业发展等多种主题。',
    content: '年轻、温暖、具备实效的心理教练服务。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      buttonText: '立即预约',
      buttonLink: '#book'
    }
  },
  // 底部配置
  {
    id: 'footer-1',
    type: 'footer',
    title: '心青心理教练',
    description: '温馨、青春、正能量的心理成长伙伴',
    content: '专业的心理教练服务，帮助您实现更好的自己。',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      logo: '心',
      companyName: '心青心理教练',
      companyDescription: '温馨、青春、正能量的心理成长伙伴。',
      copyright: '© 2025 心青心理教练 · All rights reserved.'
    }
  },
  // 底部服务区块
  {
    id: 'footer-section-1',
    type: 'footer_section',
    title: '服务',
    description: '我们的服务项目',
    content: '提供专业的心理教练服务',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      sectionTitle: '服务',
      links: [
        { text: '个体教练', url: '#services' },
        { text: '关系议题', url: '#services' },
        { text: '职场发展', url: '#services' }
      ]
    }
  },
  // 底部支持区块
  {
    id: 'footer-section-2',
    type: 'footer_section',
    title: '支持',
    description: '用户支持信息',
    content: '为用户提供全面的支持服务',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      sectionTitle: '支持',
      links: [
        { text: '隐私政策', url: '/privacy' },
        { text: '用户条款', url: '/terms' },
        { text: '联系客服', url: '/contact' }
      ]
    }
  },
  // 社交媒体链接
  {
    id: 'footer-social-1',
    type: 'footer_social',
    title: '关注我们',
    description: '社交媒体链接',
    content: '关注我们的社交媒体账号',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      sectionTitle: '关注我们',
      socialLinks: [
        { platform: 'WeChat', url: '#', icon: '微' },
        { platform: 'Weibo', url: '#', icon: '博' }
      ]
    }
  },
  // 服务套餐配置
  {
    id: 'package-basic',
    type: 'service_package',
    title: '基础咨询',
    description: '适合初次接触心理教练的用户',
    content: '专业心理评估，个性化成长建议，基础情绪管理指导，后续跟进计划',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      packageId: 'basic',
      price: 299,
      duration: 50,
      features: [
        '专业心理评估',
        '个性化成长建议',
        '基础情绪管理指导',
        '后续跟进计划'
      ],
      popular: false,
      category: 'individual'
    }
  },
  {
    id: 'package-standard',
    type: 'service_package',
    title: '标准套餐',
    description: '最受欢迎的心理教练服务',
    content: '深度心理分析，个性化成长方案，情绪管理技巧训练，人际关系指导，3次免费跟进',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      packageId: 'standard',
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
    }
  },
  {
    id: 'package-premium',
    type: 'service_package',
    title: '高级套餐',
    description: '全方位心理成长服务',
    content: '全面心理评估，定制化成长计划，高级情绪管理技巧，职业发展指导，亲密关系咨询，5次免费跟进，专属成长档案',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      packageId: 'premium',
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
      popular: false,
      category: 'individual'
    }
  },
  {
    id: 'package-group',
    type: 'service_package',
    title: '团体咨询',
    description: '小组形式的心灵成长',
    content: '小组互动学习，同伴支持系统，集体成长活动，经验分享交流',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      packageId: 'group',
      price: 199,
      duration: 120,
      features: [
        '小组互动学习',
        '同伴支持系统',
        '集体成长活动',
        '经验分享交流'
      ],
      popular: false,
      category: 'group'
    }
  },
  {
    id: 'package-online',
    type: 'service_package',
    title: '在线咨询',
    description: '便捷的线上心理服务',
    content: '视频/语音咨询，在线心理评估，数字化成长记录，灵活时间安排',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      packageId: 'online',
      price: 399,
      duration: 50,
      features: [
        '视频/语音咨询',
        '在线心理评估',
        '数字化成长记录',
        '灵活时间安排'
      ],
      popular: false,
      category: 'online'
    }
  },
  // 系统设置配置
  {
    id: 'system-theme',
    type: 'system_settings',
    title: '主题设置',
    description: '网站主题颜色配置',
    content: '配置网站的主色调、辅助色、背景色等主题设置',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      settingType: 'theme',
      primaryColor: '#ff8ba7',
      secondaryColor: '#ffc3a0',
      backgroundColor: '#ffffff',
      textColor: '#1f2937'
    }
  },
  {
    id: 'system-font',
    type: 'system_settings',
    title: '字体设置',
    description: '网站字体配置',
    content: '配置网站的字体族、字体大小、字体粗细等设置',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      settingType: 'font',
      fontFamily: 'Plus Jakarta Sans',
      fontSize: '16px',
      fontWeight: '400'
    }
  },
  {
    id: 'system-layout',
    type: 'system_settings',
    title: '布局设置',
    description: '网站布局配置',
    content: '配置网站的容器宽度、板块间距等布局设置',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      settingType: 'layout',
      containerWidth: '1200px',
      sectionSpacing: 24
    }
  },
  {
    id: 'system-sections',
    type: 'system_settings',
    title: '板块设置',
    description: '首页板块显示和顺序配置',
    content: '配置首页各个板块的显示状态和显示顺序',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      settingType: 'section_order',
      sectionOrder: ['Hero', 'features', 'callout', 'services', 'team', 'process', 'articles', 'coaches', 'testimonials', 'faq', 'booking'],
      showHero: true,
      showFeatures: true,
      showCallout: true,
      showServices: true,
      showTeam: true,
      showProcess: true,
      showArticles: true,
      showCoaches: true,
      showTestimonials: true,
      showFAQ: true,
      showBooking: true
    }
  },
  // 板块单独设置配置
  {
    id: 'system-section-settings',
    type: 'system_settings',
    title: '板块单独设置',
    description: '每个板块的独立主题、字体、布局配置',
    content: '为每个板块配置独立的主题颜色、字体设置、布局样式等',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    extra: {
      settingType: 'section_settings',
      sectionSettings: {
        hero: {
          theme: {
            primaryColor: '#ff8ba7',
            secondaryColor: '#ffc3a0',
            backgroundColor: '#fffaf7',
            textColor: '#1f2937'
          },
          font: {
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '18px',
            fontWeight: '600'
          },
          layout: {
            padding: '80px 0',
            margin: '0',
            borderRadius: '0',
            boxShadow: 'none'
          }
        },
        features: {
          theme: {
            primaryColor: '#ff8ba7',
            secondaryColor: '#ffc3a0',
            backgroundColor: '#ffffff',
            textColor: '#1f2937'
          },
          font: {
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '16px',
            fontWeight: '400'
          },
          layout: {
            padding: '64px 0',
            margin: '0',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        },
        callout: {
          theme: {
            primaryColor: '#ff8ba7',
            secondaryColor: '#ffc3a0',
            backgroundColor: '#fef3c7',
            textColor: '#1f2937'
          },
          font: {
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '18px',
            fontWeight: '700'
          },
          layout: {
            padding: '64px 0',
            margin: '0',
            borderRadius: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  }
];

// 导出单例实例
export const userStorage = new UserStorage();
export const bookingStorage = new BookingStorage();
export const configStorage = new ConfigStorage();

// 初始化默认配置数据（仅在配置为空时执行）
export function initializeDefaultConfigs(): void {
  const existingConfigs = configStorage.getAll();
  if (existingConfigs.length === 0) {
    console.log('初始化默认配置数据...');
    initialConfigs.forEach(config => {
      configStorage.createConfig(config);
    });
    console.log(`已初始化 ${initialConfigs.length} 个默认配置项`);
  } else {
    console.log(`配置数据已存在，跳过初始化。当前配置数量: ${existingConfigs.length}`);
  }
}
