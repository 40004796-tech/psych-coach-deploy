"use client";
import { useState, useEffect } from "react";
import { ConfigItem } from "@/lib/base-storage";

interface SectionSettings {
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
    textAlign?: string;
    titleAlign?: string;
    copyrightAlign?: string;
    gap?: string;
    sectionGap?: string;
  };
}

export function useSectionSettings(sectionKey: string) {
  // 提供默认设置以避免水合错误
  const getDefaultSettings = (): SectionSettings => {
    const defaults: Record<string, SectionSettings> = {
      navbar: {
        theme: {
          primaryColor: '#ff8ba7',
          secondaryColor: '#ffc3a0',
          backgroundColor: '#fef7ed',
          textColor: '#1f2937'
        },
        font: {
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '16px',
          fontWeight: '500'
        },
        layout: {
          padding: '16px 0',
          margin: '0',
          borderRadius: '0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }
      },
      footer: {
        theme: {
          primaryColor: '#ff8ba7',
          secondaryColor: '#ffc3a0',
          backgroundColor: '#e5d4c0',
          textColor: '#2d1b0e',
          borderColor: '#d4c4b0',
          linkColor: '#8b5a3c',
          hoverColor: '#ff8ba7',
          copyrightColor: '#2d1b0e'
        },
        font: {
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '14px',
          fontWeight: '400',
          titleFontSize: '16px',
          titleFontWeight: '600',
          copyrightFontSize: '12px',
          copyrightFontWeight: '300'
        },
        layout: {
          padding: '48px 0',
          margin: '0',
          borderRadius: '0',
          boxShadow: '0 -2px 8px 0 rgba(0, 0, 0, 0.15)',
          borderWidth: '1px',
          borderStyle: 'solid',
          textAlign: 'left',
          titleAlign: 'left',
          copyrightAlign: 'center',
          gap: '32px',
          sectionGap: '24px'
        }
      }
    };
    return defaults[sectionKey] || {};
  };

  const [settings, setSettings] = useState<SectionSettings>(getDefaultSettings());
  const [loading, setLoading] = useState(false); // 初始设为false，因为已经有默认值

  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    const fetchSectionSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/config?type=system_settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch section settings');
        }
        
        const data = await response.json();
        const configs = data.data?.configs || [];
        
        const sectionSettingsConfig = configs.find(
          (config: ConfigItem) => config.extra?.settingType === 'section_settings'
        );
        
        if (sectionSettingsConfig?.extra?.sectionSettings?.[sectionKey]) {
          setSettings(sectionSettingsConfig.extra.sectionSettings[sectionKey]);
        }
      } catch (err) {
        console.error('Error fetching section settings:', err);
        // 保持默认设置
      } finally {
        setLoading(false);
      }
    };

    fetchSectionSettings();
  }, [sectionKey]);

  // 应用设置到CSS变量
  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    if (settings.theme || settings.font || settings.layout) {
      const root = document.documentElement;
      
      // 应用主题设置
      if (settings.theme) {
        if (settings.theme.primaryColor) {
          root.style.setProperty(`--${sectionKey}-primary-color`, settings.theme.primaryColor);
        }
        if (settings.theme.secondaryColor) {
          root.style.setProperty(`--${sectionKey}-secondary-color`, settings.theme.secondaryColor);
        }
        if (settings.theme.backgroundColor) {
          root.style.setProperty(`--${sectionKey}-background-color`, settings.theme.backgroundColor);
        }
        if (settings.theme.textColor) {
          root.style.setProperty(`--${sectionKey}-text-color`, settings.theme.textColor);
        }
        if (settings.theme.borderColor) {
          root.style.setProperty(`--${sectionKey}-border-color`, settings.theme.borderColor);
        }
        if (settings.theme.linkColor) {
          root.style.setProperty(`--${sectionKey}-link-color`, settings.theme.linkColor);
        }
        if (settings.theme.hoverColor) {
          root.style.setProperty(`--${sectionKey}-hover-color`, settings.theme.hoverColor);
        }
        if (settings.theme.copyrightColor) {
          root.style.setProperty(`--${sectionKey}-copyright-color`, settings.theme.copyrightColor);
        }
      }
      
      // 应用字体设置
      if (settings.font) {
        if (settings.font.fontFamily) {
          root.style.setProperty(`--${sectionKey}-font-family`, settings.font.fontFamily);
        }
        if (settings.font.fontSize) {
          root.style.setProperty(`--${sectionKey}-font-size`, settings.font.fontSize);
        }
        if (settings.font.fontWeight) {
          root.style.setProperty(`--${sectionKey}-font-weight`, settings.font.fontWeight);
        }
        if (settings.font.titleFontSize) {
          root.style.setProperty(`--${sectionKey}-title-font-size`, settings.font.titleFontSize);
        }
        if (settings.font.titleFontWeight) {
          root.style.setProperty(`--${sectionKey}-title-font-weight`, settings.font.titleFontWeight);
        }
        if (settings.font.copyrightFontSize) {
          root.style.setProperty(`--${sectionKey}-copyright-font-size`, settings.font.copyrightFontSize);
        }
        if (settings.font.copyrightFontWeight) {
          root.style.setProperty(`--${sectionKey}-copyright-font-weight`, settings.font.copyrightFontWeight);
        }
      }
      
      // 应用布局设置
      if (settings.layout) {
        if (settings.layout.padding) {
          root.style.setProperty(`--${sectionKey}-padding`, settings.layout.padding);
        }
        if (settings.layout.margin) {
          root.style.setProperty(`--${sectionKey}-margin`, settings.layout.margin);
        }
        if (settings.layout.borderRadius) {
          root.style.setProperty(`--${sectionKey}-border-radius`, settings.layout.borderRadius);
        }
        if (settings.layout.boxShadow) {
          root.style.setProperty(`--${sectionKey}-box-shadow`, settings.layout.boxShadow);
        }
        if (settings.layout.borderWidth) {
          root.style.setProperty(`--${sectionKey}-border-width`, settings.layout.borderWidth);
        }
        if (settings.layout.borderStyle) {
          root.style.setProperty(`--${sectionKey}-border-style`, settings.layout.borderStyle);
        }
        if (settings.layout.textAlign) {
          root.style.setProperty(`--${sectionKey}-text-align`, settings.layout.textAlign);
        }
        if (settings.layout.titleAlign) {
          root.style.setProperty(`--${sectionKey}-title-align`, settings.layout.titleAlign);
        }
        if (settings.layout.copyrightAlign) {
          root.style.setProperty(`--${sectionKey}-copyright-align`, settings.layout.copyrightAlign);
        }
        if (settings.layout.gap) {
          root.style.setProperty(`--${sectionKey}-gap`, settings.layout.gap);
        }
        if (settings.layout.sectionGap) {
          root.style.setProperty(`--${sectionKey}-section-gap`, settings.layout.sectionGap);
        }
      }
    }
  }, [settings, sectionKey]);

  return {
    settings,
    loading,
    // 便捷方法
    getThemeColor: (colorKey: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor' | 'borderColor' | 'linkColor' | 'hoverColor' | 'copyrightColor') => {
      return settings.theme?.[colorKey];
    },
    getFontSetting: (fontKey: 'fontFamily' | 'fontSize' | 'fontWeight' | 'titleFontSize' | 'titleFontWeight' | 'copyrightFontSize' | 'copyrightFontWeight') => {
      return settings.font?.[fontKey];
    },
    getLayoutSetting: (layoutKey: 'padding' | 'margin' | 'borderRadius' | 'boxShadow' | 'borderWidth' | 'borderStyle' | 'textAlign' | 'titleAlign' | 'copyrightAlign' | 'gap' | 'sectionGap') => {
      return settings.layout?.[layoutKey];
    }
  };
}
