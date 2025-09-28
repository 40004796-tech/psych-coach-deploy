"use client";
import { useState, useEffect } from "react";
import { ConfigItem } from "@/lib/base-storage";

interface SystemSettings {
  theme?: ConfigItem;
  font?: ConfigItem;
  layout?: ConfigItem;
  sections?: ConfigItem;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [loading, setLoading] = useState(false); // 初始设为false，避免水合错误
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/config?type=system_settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch system settings');
        }
        
        const data = await response.json();
        const configs = data.data?.configs || [];
        
        const settingsMap: SystemSettings = {};
        configs.forEach((config: ConfigItem) => {
          switch (config.extra?.settingType) {
            case 'theme':
              settingsMap.theme = config;
              break;
            case 'font':
              settingsMap.font = config;
              break;
            case 'layout':
              settingsMap.layout = config;
              break;
            case 'section_order':
              settingsMap.sections = config;
              break;
          }
        });
        
        setSettings(settingsMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching system settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 应用主题到CSS变量
  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    if (settings.theme?.extra) {
      const root = document.documentElement;
      const theme = settings.theme.extra;
      
      if (theme.primaryColor) {
        root.style.setProperty('--primary-color', theme.primaryColor);
      }
      if (theme.secondaryColor) {
        root.style.setProperty('--secondary-color', theme.secondaryColor);
      }
      if (theme.backgroundColor) {
        root.style.setProperty('--background-color', theme.backgroundColor);
      }
      if (theme.textColor) {
        root.style.setProperty('--text-color', theme.textColor);
      }
    }
  }, [settings.theme]);

  // 应用字体设置
  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    if (settings.font?.extra) {
      const root = document.documentElement;
      const font = settings.font.extra;
      
      if (font.fontFamily) {
        root.style.setProperty('--font-family', font.fontFamily);
      }
      if (font.fontSize) {
        root.style.setProperty('--font-size', font.fontSize);
      }
      if (font.fontWeight) {
        root.style.setProperty('--font-weight', font.fontWeight);
      }
    }
  }, [settings.font]);

  // 应用布局设置
  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    if (settings.layout?.extra) {
      const root = document.documentElement;
      const layout = settings.layout.extra;
      
      if (layout.containerWidth) {
        root.style.setProperty('--container-width', layout.containerWidth);
      }
      if (layout.sectionSpacing !== undefined) {
        root.style.setProperty('--section-spacing', `${layout.sectionSpacing}px`);
      }
      if (layout.heroPadding) {
        root.style.setProperty('--hero-padding', layout.heroPadding);
      }
    }
  }, [settings.layout]);

  return {
    settings,
    loading,
    error,
    // 便捷方法
    getSectionVisibility: (sectionKey: string) => {
      return settings.sections?.extra?.[sectionKey as keyof typeof settings.sections.extra] ?? true;
    },
    getSectionOrder: () => {
      return settings.sections?.extra?.sectionOrder || ['Hero', 'features', 'callout', 'services', 'team', 'process', 'articles', 'coaches', 'testimonials', 'faq', 'booking'];
    },
    getThemeColor: (colorKey: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor') => {
      return settings.theme?.extra?.[colorKey];
    },
    getFontSetting: (fontKey: 'fontFamily' | 'fontSize' | 'fontWeight' | 'heroFontSize' | 'heroSubtitleSize' | 'heroButtonSize') => {
      return settings.font?.extra?.[fontKey];
    },
    getLayoutSetting: (layoutKey: 'containerWidth' | 'sectionSpacing' | 'heroPadding') => {
      return settings.layout?.extra?.[layoutKey];
    }
  };
}
