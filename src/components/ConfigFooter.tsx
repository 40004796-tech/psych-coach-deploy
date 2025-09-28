"use client";
import Link from "next/link";
import { useConfig } from "@/hooks/useConfig";
import { useSectionSettings } from "@/hooks/useSectionSettings";

export default function ConfigFooter() {
  const { configs: footerConfigs } = useConfig('footer');
  const { configs: sectionConfigs } = useConfig('footer_section');
  const { configs: socialConfigs } = useConfig('footer_social');
  
  // 获取底部栏设置
  const { getThemeColor, getFontSetting, getLayoutSetting } = useSectionSettings('footer');

  // 获取底部基本信息
  const footerInfo = footerConfigs.find(config => config.isActive);
  
  // 获取底部区块
  const sections = sectionConfigs.filter(config => config.isActive).sort((a, b) => a.order - b.order);
  
  // 获取社交媒体
  const social = socialConfigs.find(config => config.isActive);

  // 获取样式设置
  const backgroundColor = getThemeColor('backgroundColor') || '#e5d4c0';
  const textColor = getThemeColor('textColor') || '#000000';
  const primaryColor = getThemeColor('primaryColor') || '#ff8ba7';
  const borderColor = getThemeColor('borderColor') || '#d4c4b0';
  const linkColor = getThemeColor('linkColor') || '#000000';
  const hoverColor = getThemeColor('hoverColor') || '#ff8ba7';
  const copyrightColor = getThemeColor('copyrightColor') || '#000000';
  
  const fontSize = getFontSetting('fontSize') || '14px';
  const fontWeight = getFontSetting('fontWeight') || '400';
  const titleFontSize = getFontSetting('titleFontSize') || '16px';
  const titleFontWeight = getFontSetting('titleFontWeight') || '600';
  const copyrightFontSize = getFontSetting('copyrightFontSize') || '12px';
  const copyrightFontWeight = getFontSetting('copyrightFontWeight') || '300';
  
  const padding = getLayoutSetting('padding') || '20px 0';
  const boxShadow = getLayoutSetting('boxShadow') || '0 -2px 8px 0 rgba(0, 0, 0, 0.15)';
  const borderWidth = getLayoutSetting('borderWidth') || '1px';
  const borderStyle = getLayoutSetting('borderStyle') || 'solid';
  const textAlign = getLayoutSetting('textAlign') || 'left';
  const titleAlign = getLayoutSetting('titleAlign') || 'left';
  const copyrightAlign = getLayoutSetting('copyrightAlign') || 'center';
  const gap = getLayoutSetting('gap') || '32px';
  const sectionGap = getLayoutSetting('sectionGap') || '24px';

  if (!footerInfo) {
    return null;
  }

  return (
    <footer 
      className="mt-4"
      style={{
        backgroundColor: 'transparent',
        color: '#000000',
        padding: padding
      }}
    >
      <div 
        className="container py-4 grid md:grid-cols-4 gap-8"
      >
        {/* 公司信息 */}
        <div style={{ textAlign: titleAlign as 'left' | 'center' | 'right' }}>
          <div className="flex items-center gap-2">
            <span 
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              {footerInfo.extra?.logo || '心'}
            </span>
            <span 
              className="font-bold"
              style={{ 
                color: '#000000',
                fontSize: titleFontSize,
                fontWeight: titleFontWeight
              }}
            >
              {footerInfo.extra?.companyName || footerInfo.title}
            </span>
          </div>
          <p 
            className="mt-3"
            style={{ 
              color: '#000000',
              fontSize: fontSize,
              fontWeight: fontWeight,
              opacity: 0.7,
              textAlign: textAlign as 'left' | 'center' | 'right'
            }}
          >
            {footerInfo.extra?.companyDescription || footerInfo.description}
          </p>
        </div>

        {/* 动态区块 */}
        {sections.map((section) => (
          <div key={section.id} style={{ textAlign: titleAlign as 'left' | 'center' | 'right' }}>
            <h4 
              className="font-semibold"
              style={{ 
                color: '#000000',
                fontSize: titleFontSize,
                fontWeight: titleFontWeight,
                textAlign: titleAlign as 'left' | 'center' | 'right'
              }}
            >
              {section.extra?.sectionTitle || section.title}
            </h4>
            <ul 
              className="mt-3"
              style={{ 
                opacity: 0.8,
                gap: sectionGap,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {section.extra?.links?.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.url}
                    style={{ 
                      color: '#000000',
                       fontSize: fontSize,
                       fontWeight: fontWeight,
                       textAlign: textAlign as 'left' | 'center' | 'right',
                      textDecoration: 'none'
                    }}
                    className="hover:opacity-80 transition-opacity"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = hoverColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = linkColor;
                    }}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* 社交媒体 */}
        {social && (
          <div style={{ textAlign: titleAlign as 'left' | 'center' | 'right' }}>
            <h4 
              className="font-semibold"
              style={{ 
                color: '#000000',
                fontSize: titleFontSize,
                fontWeight: titleFontWeight,
                textAlign: titleAlign as 'left' | 'center' | 'right'
              }}
            >
              {social.extra?.sectionTitle || social.title}
            </h4>
            <div 
              className="mt-3 flex gap-3" 
              style={{ 
                opacity: 0.8,
                justifyContent: titleAlign === 'center' ? 'center' : titleAlign === 'right' ? 'flex-end' : 'flex-start'
              }}
            >
              {social.extra?.socialLinks?.map((socialLink, index) => (
                <a 
                  key={index}
                  href={socialLink.url} 
                  aria-label={socialLink.platform} 
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:opacity-80 transition-opacity"
                  style={{ 
                    color: '#000000',
                    borderColor: '#000000',
                    borderWidth: borderWidth,
                    borderStyle: borderStyle
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.borderColor = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkColor;
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                >
                  {socialLink.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 版权信息 - 添加贯穿的横线 */}
      <div 
        style={{ 
          borderTop: `2px solid #000000`,
          marginTop: '12px'
        }}
      >
        <div 
          className="container py-2"
          style={{ 
            color: '#000000',
            fontSize: copyrightFontSize,
            fontWeight: copyrightFontWeight,
            textAlign: 'center'
          }}
        >
          {footerInfo.extra?.copyright || `© ${new Date().getFullYear()} ${footerInfo.extra?.companyName || footerInfo.title} · All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
