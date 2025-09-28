"use client";
import { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { ConfigItem } from "@/lib/base-storage";

export default function SettingsPage() {
  const [settings, setSettings] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('theme');
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'success' | 'error' }>({});

  const tabs = [
    { id: 'theme', label: '主题设置', icon: '🎨' },
    { id: 'font', label: '字体设置', icon: '📝' },
    { id: 'layout', label: '布局设置', icon: '📐' },
    { id: 'section_order', label: '板块顺序', icon: '📋' },
    { id: 'section_settings', label: '板块单独设置', icon: '🎯' }
  ];

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config?type=system_settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data?.configs || []);
      } else {
        setError('获取系统设置失败');
      }
    } catch (err) {
      console.error('获取系统设置失败:', err);
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingUpdate = async (settingId: string, newValue: any) => {
    try {
      setSaveStatus(prev => ({ ...prev, [settingId]: 'saving' }));
      
      const setting = settings.find(s => s.id === settingId);
      if (!setting) return;

      const response = await fetch(`/api/config/${settingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...setting,
          extra: {
            ...setting.extra,
            ...newValue
          }
        }),
      });

      if (response.ok) {
        await fetchSettings();
        setSaveStatus(prev => ({ ...prev, [settingId]: 'success' }));
        
        // 3秒后清除成功状态
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [settingId]: 'idle' }));
        }, 3000);
      } else {
        setSaveStatus(prev => ({ ...prev, [settingId]: 'error' }));
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [settingId]: 'idle' }));
        }, 3000);
      }
    } catch (err) {
      console.error('更新失败:', err);
      setSaveStatus(prev => ({ ...prev, [settingId]: 'error' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [settingId]: 'idle' }));
      }, 3000);
    }
  };

  const renderStatusIndicator = (settingId: string) => {
    const status = saveStatus[settingId] || 'idle';
    
    switch (status) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">保存中...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">保存成功</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm">保存失败</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderThemeSettings = () => {
    const themeSetting = settings.find(s => s.extra?.settingType === 'theme');
    if (!themeSetting) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">主题颜色设置</h3>
          {renderStatusIndicator(themeSetting.id)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">主色调</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeSetting.extra?.primaryColor || '#ff8ba7'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={themeSetting.extra?.primaryColor || '#ff8ba7'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="#ff8ba7"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">辅助色</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeSetting.extra?.secondaryColor || '#ffc3a0'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { secondaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={themeSetting.extra?.secondaryColor || '#ffc3a0'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { secondaryColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="#ffc3a0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">背景色</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeSetting.extra?.backgroundColor || '#ffffff'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { backgroundColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={themeSetting.extra?.backgroundColor || '#ffffff'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">文字颜色</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeSetting.extra?.textColor || '#1f2937'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { textColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={themeSetting.extra?.textColor || '#1f2937'}
                onChange={(e) => handleSettingUpdate(themeSetting.id, { textColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="#1f2937"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFontSettings = () => {
    const fontSetting = settings.find(s => s.extra?.settingType === 'font');
    if (!fontSetting) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">字体设置</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">字体族</label>
            <select
              value={fontSetting.extra?.fontFamily || 'Plus Jakarta Sans'}
              onChange={(e) => handleSettingUpdate(fontSetting.id, { fontFamily: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">字体大小</label>
            <select
              value={fontSetting.extra?.fontSize || '16px'}
              onChange={(e) => handleSettingUpdate(fontSetting.id, { fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="14px">14px (小)</option>
              <option value="16px">16px (中)</option>
              <option value="18px">18px (大)</option>
              <option value="20px">20px (特大)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">字体粗细</label>
            <select
              value={fontSetting.extra?.fontWeight || '400'}
              onChange={(e) => handleSettingUpdate(fontSetting.id, { fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="300">300 (细)</option>
              <option value="400">400 (正常)</option>
              <option value="500">500 (中等)</option>
              <option value="600">600 (半粗)</option>
              <option value="700">700 (粗)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">首页标题字体大小</label>
            <select
              value={fontSetting.extra?.heroFontSize || 'text-4xl md:text-6xl'}
              onChange={(e) => handleSettingUpdate(fontSetting.id, { heroFontSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="text-3xl md:text-5xl">较小</option>
              <option value="text-4xl md:text-6xl">默认</option>
              <option value="text-5xl md:text-7xl">较大</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">首页副标题字体大小</label>
            <select
              value={fontSetting.extra?.heroSubtitleSize || 'text-lg md:text-xl'}
              onChange={(e) => handleSettingUpdate(fontSetting.id, { heroSubtitleSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="text-base md:text-lg">较小</option>
              <option value="text-lg md:text-xl">默认</option>
              <option value="text-xl md:text-2xl">较大</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">首页按钮大小</label>
            <select
              value={fontSetting.extra?.heroButtonSize || 'px-7 py-3.5'}
              onChange={(e) => handleSettingUpdate(fontSetting.id, { heroButtonSize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="px-5 py-2.5">较小</option>
              <option value="px-6 py-3">中等</option>
              <option value="px-7 py-3.5">默认</option>
              <option value="px-8 py-4">较大</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutSettings = () => {
    const layoutSetting = settings.find(s => s.extra?.settingType === 'layout');
    if (!layoutSetting) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">布局设置</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">容器宽度</label>
            <select
              value={layoutSetting.extra?.containerWidth || '1200px'}
              onChange={(e) => handleSettingUpdate(layoutSetting.id, { containerWidth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="1024px">1024px (小)</option>
              <option value="1200px">1200px (中)</option>
              <option value="1400px">1400px (大)</option>
              <option value="100%">100% (全宽)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">板块间距 (px)</label>
            <input
              type="number"
              value={layoutSetting.extra?.sectionSpacing || 24}
              onChange={(e) => handleSettingUpdate(layoutSetting.id, { sectionSpacing: parseInt(e.target.value) || 24 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">首页顶部框上下间距</label>
            <select
              value={layoutSetting.extra?.heroPadding || 'py-16 md:py-20'}
              onChange={(e) => handleSettingUpdate(layoutSetting.id, { heroPadding: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="py-12 md:py-16">紧凑</option>
              <option value="py-16 md:py-20">默认</option>
              <option value="py-20 md:py-24">宽松</option>
              <option value="py-24 md:py-28">很宽松</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderSectionOrderSettings = () => {
    const sectionSetting = settings.find(s => s.extra?.settingType === 'section_order');
    if (!sectionSetting) return null;

    const sections = [
      { key: 'showHero', label: '首页横幅', description: '网站顶部的主要展示区域' },
      { key: 'showFeatures', label: '特性介绍', description: '展示网站的核心特性和优势' },
      { key: 'showCallout', label: '行动号召', description: '引导用户行动的重要区域' },
      { key: 'showServices', label: '服务展示', description: '展示提供的服务内容' },
      { key: 'showTeam', label: '团队介绍', description: '展示团队成员信息' },
      { key: 'showProcess', label: '服务流程', description: '展示服务的具体流程' },
      { key: 'showArticles', label: '文章推荐', description: '展示相关文章内容' },
      { key: 'showCoaches', label: '教练团队', description: '展示心理教练信息' },
      { key: 'showTestimonials', label: '用户评价', description: '展示用户的评价和反馈' },
      { key: 'showFAQ', label: '常见问题', description: '展示常见问题和解答' },
      { key: 'showBooking', label: '预约功能', description: '预约服务的功能区域' }
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">板块显示设置</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div key={section.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{section.label}</h4>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionSetting.extra?.[section.key as keyof typeof sectionSetting.extra] || false}
                  onChange={(e) => handleSettingUpdate(sectionSetting.id, { [section.key]: e.target.checked })}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sectionSetting.extra?.[section.key as keyof typeof sectionSetting.extra] ? 'bg-primary' : 'bg-gray-300'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sectionSetting.extra?.[section.key as keyof typeof sectionSetting.extra] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSectionSettings = () => {
    const sectionSetting = settings.find(s => s.extra?.settingType === 'section_settings');
    if (!sectionSetting) return null;

    const sections = [
      { key: 'hero', label: '首页横幅', description: '网站顶部的主要展示区域' },
      { key: 'features', label: '特性介绍', description: '展示网站的核心特性和优势' },
      { key: 'callout', label: '行动号召', description: '引导用户行动的重要区域' },
      { key: 'services', label: '服务展示', description: '展示提供的服务内容' },
      { key: 'team', label: '团队介绍', description: '展示团队成员信息' },
      { key: 'process', label: '服务流程', description: '展示服务的具体流程' },
      { key: 'articles', label: '文章推荐', description: '展示相关文章内容' },
      { key: 'coaches', label: '教练团队', description: '展示心理教练信息' },
      { key: 'testimonials', label: '用户评价', description: '展示用户的评价和反馈' },
      { key: 'faq', label: '常见问题', description: '展示常见问题和解答' },
      { key: 'booking', label: '预约功能', description: '预约服务的功能区域' },
      { key: 'navbar', label: '导航栏', description: '网站顶部导航栏的样式设置' },
      { key: 'footer', label: '底部信息', description: '网站底部信息、区块和社交媒体的样式设置' }
    ];

    const handleSectionSettingUpdate = async (sectionKey: string, settingType: 'theme' | 'font' | 'layout', field: string, value: any) => {
      const currentSettings = sectionSetting.extra?.sectionSettings || {};
      const sectionSettings = currentSettings[sectionKey] || {};
      
      const updatedSectionSettings = {
        ...sectionSettings,
        [settingType]: {
          ...sectionSettings[settingType],
          [field]: value
        }
      };

      const newSectionSettings = {
        ...currentSettings,
        [sectionKey]: updatedSectionSettings
      };

      await handleSettingUpdate(sectionSetting.id, { sectionSettings: newSectionSettings });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">板块单独设置</h3>
          {renderStatusIndicator(sectionSetting.id)}
        </div>
        
        <div className="space-y-8">
          {sections.map((section) => {
            const sectionData = sectionSetting.extra?.sectionSettings?.[section.key] || {};
            const themeData = sectionData.theme || {};
            const fontData = sectionData.font || {};
            const layoutData = sectionData.layout || {};

            return (
              <div key={section.key} className="border border-gray-200 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">{section.label}</h4>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 主题设置 */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-800">主题颜色</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">主色调</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeData.primaryColor || '#ff8ba7'}
                            onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'primaryColor', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={themeData.primaryColor || '#ff8ba7'}
                            onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'primaryColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">背景色</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeData.backgroundColor || '#ffffff'}
                            onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={themeData.backgroundColor || '#ffffff'}
                            onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'backgroundColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">文字颜色</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeData.textColor || '#1f2937'}
                            onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={themeData.textColor || '#1f2937'}
                            onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'textColor', e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      {/* 底部信息专用配置 */}
                      {section.key === 'footer' && (
                        <>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">边框颜色</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={themeData.borderColor || '#d4c4b0'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'borderColor', e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={themeData.borderColor || '#d4c4b0'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'borderColor', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">链接颜色</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={themeData.linkColor || '#8b5a3c'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'linkColor', e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={themeData.linkColor || '#8b5a3c'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'linkColor', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">悬停颜色</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={themeData.hoverColor || '#ff8ba7'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'hoverColor', e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={themeData.hoverColor || '#ff8ba7'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'hoverColor', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">版权字体颜色</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={themeData.copyrightColor || '#2d1b0e'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'copyrightColor', e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={themeData.copyrightColor || '#2d1b0e'}
                                onChange={(e) => handleSectionSettingUpdate(section.key, 'theme', 'copyrightColor', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 字体设置 */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-800">字体设置</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">字体族</label>
                        <select
                          value={fontData.fontFamily || 'Plus Jakarta Sans'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'fontFamily', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                          <option value="Inter">Inter</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Poppins">Poppins</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">字体大小</label>
                        <select
                          value={fontData.fontSize || '16px'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'fontSize', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="14px">14px (小)</option>
                          <option value="16px">16px (中)</option>
                          <option value="18px">18px (大)</option>
                          <option value="20px">20px (特大)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">字体粗细</label>
                        <select
                          value={fontData.fontWeight || '400'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'fontWeight', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="300">300 (细)</option>
                          <option value="400">400 (正常)</option>
                          <option value="500">500 (中等)</option>
                          <option value="600">600 (半粗)</option>
                          <option value="700">700 (粗)</option>
                        </select>
                      </div>
                      
                      {/* 底部信息专用字体配置 */}
                      {section.key === 'footer' && (
                        <>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">标题字体大小</label>
                            <select
                              value={fontData.titleFontSize || '16px'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'titleFontSize', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="14px">14px (小)</option>
                              <option value="16px">16px (中)</option>
                              <option value="18px">18px (大)</option>
                              <option value="20px">20px (特大)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">标题字体粗细</label>
                            <select
                              value={fontData.titleFontWeight || '600'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'titleFontWeight', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="400">400 (正常)</option>
                              <option value="500">500 (中等)</option>
                              <option value="600">600 (半粗)</option>
                              <option value="700">700 (粗)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">版权字体大小</label>
                            <select
                              value={fontData.copyrightFontSize || '12px'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'copyrightFontSize', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="10px">10px (很小)</option>
                              <option value="12px">12px (小)</option>
                              <option value="14px">14px (中)</option>
                              <option value="16px">16px (大)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">版权字体粗细</label>
                            <select
                              value={fontData.copyrightFontWeight || '300'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'font', 'copyrightFontWeight', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="300">300 (细)</option>
                              <option value="400">400 (正常)</option>
                              <option value="500">500 (中等)</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 布局设置 */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-800">布局设置</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">内边距</label>
                        <input
                          type="text"
                          value={layoutData.padding || '64px 0'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'padding', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="64px 0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">外边距</label>
                        <input
                          type="text"
                          value={layoutData.margin || '0'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'margin', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">圆角</label>
                        <input
                          type="text"
                          value={layoutData.borderRadius || '16px'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'borderRadius', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="16px"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">阴影</label>
                        <input
                          type="text"
                          value={layoutData.boxShadow || 'none'}
                          onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'boxShadow', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="none"
                        />
                      </div>
                      
                      {/* 底部信息专用布局配置 */}
                      {section.key === 'footer' && (
                        <>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">边框宽度</label>
                            <select
                              value={layoutData.borderWidth || '1px'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'borderWidth', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="0px">0px (无边框)</option>
                              <option value="1px">1px (细边框)</option>
                              <option value="2px">2px (中等边框)</option>
                              <option value="3px">3px (粗边框)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">边框样式</label>
                            <select
                              value={layoutData.borderStyle || 'solid'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'borderStyle', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="solid">实线</option>
                              <option value="dashed">虚线</option>
                              <option value="dotted">点线</option>
                              <option value="double">双线</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">文字对齐</label>
                            <select
                              value={layoutData.textAlign || 'left'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'textAlign', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="left">左对齐</option>
                              <option value="center">居中</option>
                              <option value="right">右对齐</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">标题对齐</label>
                            <select
                              value={layoutData.titleAlign || 'left'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'titleAlign', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="left">左对齐</option>
                              <option value="center">居中</option>
                              <option value="right">右对齐</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">版权对齐</label>
                            <select
                              value={layoutData.copyrightAlign || 'center'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'copyrightAlign', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="left">左对齐</option>
                              <option value="center">居中</option>
                              <option value="right">右对齐</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">区块间距</label>
                            <input
                              type="text"
                              value={layoutData.gap || '32px'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'gap', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="32px"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">内部元素间距</label>
                            <input
                              type="text"
                              value={layoutData.sectionGap || '24px'}
                              onChange={(e) => handleSectionSettingUpdate(section.key, 'layout', 'sectionGap', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="24px"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theme':
        return renderThemeSettings();
      case 'font':
        return renderFontSettings();
      case 'layout':
        return renderLayoutSettings();
      case 'section_order':
        return renderSectionOrderSettings();
      case 'section_settings':
        return renderSectionSettings();
      default:
        return renderThemeSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-2 text-gray-600">管理网站的主题、字体、布局和板块配置</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 标签导航 */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* 标签内容 */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
