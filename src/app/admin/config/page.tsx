"use client";
import { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { ConfigItem } from "@/lib/base-storage";

export default function ConfigPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState<ConfigItem['type']>('service');
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfigItem | null>(null);
  const [formData, setFormData] = useState({
    type: 'service' as ConfigItem['type'],
    title: '',
    description: '',
    content: '',
    image: '',
    order: 0,
    isActive: true,
    extra: {
      tags: [] as string[],
      role: '',
      bio: '',
      question: '',
      answer: '',
      icon: '',
      buttonText: '',
      buttonLink: '',
      // 底部配置字段
      logo: '',
      companyName: '',
      companyDescription: '',
      sectionTitle: '',
      links: [] as Array<{text: string; url: string}>,
      socialLinks: [] as Array<{platform: string; url: string; icon: string}>,
      copyright: '',
      // 服务套餐配置字段
      packageId: '',
      price: 0,
      duration: 0,
      features: [] as string[],
      popular: false,
      category: 'individual' as 'individual' | 'group' | 'online' | 'offline'
    }
  });

  const configTypes = [
    { value: 'service', label: '服务配置', color: 'bg-blue-100 text-blue-800' },
    { value: 'team', label: '团队配置', color: 'bg-green-100 text-green-800' },
    { value: 'process', label: '流程配置', color: 'bg-purple-100 text-purple-800' },
    { value: 'article', label: '文章配置', color: 'bg-orange-100 text-orange-800' },
    { value: 'coach', label: '教练配置', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'testimonial', label: '用户评价', color: 'bg-pink-100 text-pink-800' },
    { value: 'faq', label: '常见问题', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'hero', label: '首页横幅', color: 'bg-red-100 text-red-800' },
    { value: 'feature', label: '特性介绍', color: 'bg-teal-100 text-teal-800' },
    { value: 'callout', label: '行动号召', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'footer', label: '底部信息', color: 'bg-gray-100 text-gray-800' },
    { value: 'footer_section', label: '底部区块', color: 'bg-slate-100 text-slate-800' },
    { value: 'footer_social', label: '社交媒体', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'service_package', label: '服务套餐', color: 'bg-violet-100 text-violet-800' },
    { value: 'system_settings', label: '系统设置', color: 'bg-amber-100 text-amber-800' }
  ];

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/config?type=${selectedType}`);
      if (response.ok) {
        const data = await response.json();
        setConfigs(data.data?.configs || []);
      } else {
        setError('获取配置失败');
      }
    } catch (err) {
      console.error('获取配置失败:', err);
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [selectedType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = () => {
    setEditingConfig(null);
    setFormData({
      type: selectedType,
      title: '',
      description: '',
      content: '',
      image: '',
      order: configs.length + 1,
      isActive: true,
      extra: {
        tags: [],
        role: '',
        bio: '',
        question: '',
        answer: '',
        icon: '',
        buttonText: '',
        buttonLink: '',
        // 底部配置字段
        logo: '',
        companyName: '',
        companyDescription: '',
        sectionTitle: '',
        links: [],
        socialLinks: [],
        copyright: '',
        // 服务套餐配置字段
        packageId: '',
        price: 0,
        duration: 0,
        features: [],
        popular: false,
        category: 'individual'
      }
    });
    setShowModal(true);
  };

  const handleEdit = (config: ConfigItem) => {
    setEditingConfig(config);
    setFormData({
      type: config.type,
      title: config.title,
      description: config.description,
      content: config.content,
      image: config.image || '',
      order: config.order,
      isActive: config.isActive,
      extra: {
        tags: config.extra?.tags || [],
        role: config.extra?.role || '',
        bio: config.extra?.bio || '',
        question: config.extra?.question || '',
        answer: config.extra?.answer || '',
        icon: config.extra?.icon || '',
        buttonText: config.extra?.buttonText || '',
        buttonLink: config.extra?.buttonLink || '',
        // 底部配置字段
        logo: config.extra?.logo || '',
        companyName: config.extra?.companyName || '',
        companyDescription: config.extra?.companyDescription || '',
        sectionTitle: config.extra?.sectionTitle || '',
        links: config.extra?.links || [],
        socialLinks: config.extra?.socialLinks || [],
        copyright: config.extra?.copyright || '',
        // 服务套餐配置字段
        packageId: config.extra?.packageId || '',
        price: config.extra?.price || 0,
        duration: config.extra?.duration || 0,
        features: config.extra?.features || [],
        popular: config.extra?.popular || false,
        category: config.extra?.category || 'individual'
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个配置吗？')) return;

    try {
      const response = await fetch(`/api/config/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchConfigs();
        alert('配置删除成功');
      } else {
        alert('删除失败');
      }
    } catch (err) {
      console.error('删除失败:', err);
      alert('网络错误');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingConfig ? `/api/config/${editingConfig.id}` : '/api/config';
      const method = editingConfig ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchConfigs();
        setShowModal(false);
        alert(editingConfig ? '配置更新成功' : '配置创建成功');
      } else {
        const data = await response.json();
        alert(data.message || '操作失败');
      }
    } catch (err) {
      console.error('操作失败:', err);
      alert('网络错误');
    }
  };

  const filteredConfigs = configs.filter(config => config.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">配置管理</h1>
          <p className="mt-2 text-gray-600">管理网站的服务、团队、流程和文章配置</p>
        </div>

        {/* 类型选择 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {configTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as ConfigItem['type'])}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type.value
                    ? type.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            共 {filteredConfigs.length} 个{configTypes.find(t => t.value === selectedType)?.label}
          </div>
          <button
            onClick={handleCreate}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            添加{configTypes.find(t => t.value === selectedType)?.label}
          </button>
        </div>

        {/* 配置列表 */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredConfigs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>暂无{configTypes.find(t => t.value === selectedType)?.label}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredConfigs.map((config) => (
              <div key={config.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        config.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {config.isActive ? '启用' : '禁用'}
                      </span>
                      <span className="text-sm text-gray-500">排序: {config.order}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{config.description}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{config.content}</p>
                    
                    {/* 显示特殊字段信息 */}
                    {config.type === 'coach' && config.extra?.bio && (
                      <p className="text-sm text-blue-600 mt-2">简介: {config.extra.bio}</p>
                    )}
                    {config.type === 'coach' && config.extra?.tags && config.extra.tags.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">标签: </span>
                        {config.extra.tags.map((tag, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {config.type === 'testimonial' && config.extra?.role && (
                      <p className="text-sm text-pink-600 mt-2">角色: {config.extra.role}</p>
                    )}
                    {config.type === 'faq' && config.extra?.question && (
                      <p className="text-sm text-yellow-600 mt-2">问题: {config.extra.question}</p>
                    )}
                    {config.type === 'feature' && config.extra?.icon && (
                      <p className="text-sm text-teal-600 mt-2">图标: {config.extra.icon}</p>
                    )}
                    {config.type === 'callout' && config.extra?.buttonText && (
                      <p className="text-sm text-cyan-600 mt-2">按钮: {config.extra.buttonText}</p>
                    )}
                    {config.type === 'footer' && config.extra?.companyName && (
                      <p className="text-sm text-gray-600 mt-2">公司: {config.extra.companyName}</p>
                    )}
                    {config.type === 'footer_section' && config.extra?.sectionTitle && (
                      <p className="text-sm text-slate-600 mt-2">区块: {config.extra.sectionTitle}</p>
                    )}
                    {config.type === 'footer_section' && config.extra?.links && config.extra.links.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">链接: </span>
                        {config.extra.links.map((link, index) => (
                          <span key={index} className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded mr-1">
                            {link.text}
                          </span>
                        ))}
                      </div>
                    )}
                    {config.type === 'footer_social' && config.extra?.sectionTitle && (
                      <p className="text-sm text-emerald-600 mt-2">社交媒体: {config.extra.sectionTitle}</p>
                    )}
                    {config.type === 'footer_social' && config.extra?.socialLinks && config.extra.socialLinks.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">平台: </span>
                        {config.extra.socialLinks.map((social, index) => (
                          <span key={index} className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mr-1">
                            {social.platform}
                          </span>
                        ))}
                      </div>
                    )}
                    {config.type === 'service_package' && config.extra?.packageId && (
                      <p className="text-sm text-violet-600 mt-2">套餐ID: {config.extra.packageId}</p>
                    )}
                    {config.type === 'service_package' && config.extra?.price && (
                      <p className="text-sm text-violet-600 mt-2">价格: ¥{config.extra.price}</p>
                    )}
                    {config.type === 'service_package' && config.extra?.duration && (
                      <p className="text-sm text-violet-600 mt-2">时长: {config.extra.duration}分钟</p>
                    )}
                    {config.type === 'service_package' && config.extra?.category && (
                      <p className="text-sm text-violet-600 mt-2">分类: {config.extra.category}</p>
                    )}
                    {config.type === 'service_package' && config.extra?.popular && (
                      <span className="inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded mt-2">热门套餐</span>
                    )}
                    {config.type === 'service_package' && config.extra?.features && config.extra.features.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">特性: </span>
                        {config.extra.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded mr-1">
                            {feature}
                          </span>
                        ))}
                        {config.extra.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{config.extra.features.length - 3}更多</span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-400">
                      创建时间: {new Date(config.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(config)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 编辑模态框 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingConfig ? '编辑配置' : '添加配置'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* 教练配置特殊字段 */}
                {formData.type === 'coach' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                      <textarea
                        value={formData.extra.bio}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, bio: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="教练的简介信息"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">标签 (用逗号分隔)</label>
                      <input
                        type="text"
                        value={formData.extra.tags.join(', ')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="情绪管理, 自我探索, 关系沟通"
                      />
                    </div>
                  </>
                )}

                {/* 用户评价特殊字段 */}
                {formData.type === 'testimonial' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户角色</label>
                    <input
                      type="text"
                      value={formData.extra.role}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        extra: { ...formData.extra, role: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="大学生, 设计师, 产品经理"
                    />
                  </div>
                )}

                {/* FAQ特殊字段 */}
                {formData.type === 'faq' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">问题</label>
                      <input
                        type="text"
                        value={formData.extra.question}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, question: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="一次多长时间？"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">答案</label>
                      <textarea
                        value={formData.extra.answer}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, answer: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="单次约50分钟，首次会根据你的目标进行评估和计划制定。"
                      />
                    </div>
                  </>
                )}

                {/* 特性介绍特殊字段 */}
                {formData.type === 'feature' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">图标URL</label>
                    <input
                      type="url"
                      value={formData.extra.icon}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        extra: { ...formData.extra, icon: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="/icons/heart.svg"
                    />
                  </div>
                )}

                {/* 行动号召特殊字段 */}
                {formData.type === 'callout' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">按钮文本</label>
                      <input
                        type="text"
                        value={formData.extra.buttonText}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, buttonText: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="立即预约"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">按钮链接</label>
                      <input
                        type="text"
                        value={formData.extra.buttonLink}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, buttonLink: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="#book"
                      />
                    </div>
                  </>
                )}

                {/* 底部信息特殊字段 */}
                {formData.type === 'footer' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo文字</label>
                      <input
                        type="text"
                        value={formData.extra.logo}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, logo: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="心"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
                      <input
                        type="text"
                        value={formData.extra.companyName}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, companyName: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="心青心理教练"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">公司描述</label>
                      <textarea
                        value={formData.extra.companyDescription}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, companyDescription: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="温馨、青春、正能量的心理成长伙伴。"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">版权信息</label>
                      <input
                        type="text"
                        value={formData.extra.copyright}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, copyright: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="© 2025 心青心理教练 · All rights reserved."
                      />
                    </div>
                  </>
                )}

                {/* 底部区块特殊字段 */}
                {formData.type === 'footer_section' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">区块标题</label>
                      <input
                        type="text"
                        value={formData.extra.sectionTitle}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, sectionTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="服务"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">链接列表 (每行一个，格式：文本|链接)</label>
                      <textarea
                        value={formData.extra.links.map(link => `${link.text}|${link.url}`).join('\n')}
                        onChange={(e) => {
                          const links = e.target.value.split('\n')
                            .filter(line => line.trim())
                            .map(line => {
                              const [text, url] = line.split('|');
                              return { text: text?.trim() || '', url: url?.trim() || '#' };
                            });
                          setFormData({ 
                            ...formData, 
                            extra: { ...formData.extra, links }
                          });
                        }}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="个体教练|#services&#10;关系议题|#services&#10;职场发展|#services"
                      />
                    </div>
                  </>
                )}

                {/* 社交媒体特殊字段 */}
                {formData.type === 'footer_social' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">区块标题</label>
                      <input
                        type="text"
                        value={formData.extra.sectionTitle}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, sectionTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="关注我们"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">社交媒体链接 (每行一个，格式：平台|链接|图标)</label>
                      <textarea
                        value={formData.extra.socialLinks.map(social => `${social.platform}|${social.url}|${social.icon}`).join('\n')}
                        onChange={(e) => {
                          const socialLinks = e.target.value.split('\n')
                            .filter(line => line.trim())
                            .map(line => {
                              const [platform, url, icon] = line.split('|');
                              return { platform: platform?.trim() || '', url: url?.trim() || '#', icon: icon?.trim() || '' };
                            });
                          setFormData({ 
                            ...formData, 
                            extra: { ...formData.extra, socialLinks }
                          });
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="WeChat|#|微&#10;Weibo|#|博"
                      />
                    </div>
                  </>
                )}

                {/* 服务套餐特殊字段 */}
                {formData.type === 'service_package' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">套餐ID</label>
                      <input
                        type="text"
                        value={formData.extra.packageId}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, packageId: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="basic"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">价格 (元)</label>
                        <input
                          type="number"
                          value={formData.extra.price}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            extra: { ...formData.extra, price: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="299"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">时长 (分钟)</label>
                        <input
                          type="number"
                          value={formData.extra.duration}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            extra: { ...formData.extra, duration: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="50"
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">套餐分类</label>
                      <select
                        value={formData.extra.category}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, category: e.target.value as 'individual' | 'group' | 'online' | 'offline' }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="individual">个人咨询</option>
                        <option value="group">团体咨询</option>
                        <option value="online">在线咨询</option>
                        <option value="offline">线下咨询</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">功能特性 (每行一个)</label>
                      <textarea
                        value={formData.extra.features.join('\n')}
                        onChange={(e) => {
                          const features = e.target.value.split('\n')
                            .filter(line => line.trim())
                            .map(line => line.trim());
                          setFormData({ 
                            ...formData, 
                            extra: { ...formData.extra, features }
                          });
                        }}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="专业心理评估&#10;个性化成长建议&#10;基础情绪管理指导"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={formData.extra.popular}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          extra: { ...formData.extra, popular: e.target.checked }
                        })}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="popular" className="ml-2 text-sm font-medium text-gray-700">
                        设为热门套餐
                      </label>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                      启用
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    {editingConfig ? '更新' : '创建'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
