"use client";
import Image from "next/image";
import { useEffect } from "react";
import CoachGrid from "@/components/CoachGrid";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import BookingCTA from "@/components/BookingCTA";
import { ServicesSection, TeamSection, ProcessSection, ArticlesSection } from "@/components/ConfigSections";
import ConfigFooter from "@/components/ConfigFooter";
import { useSystemSettings } from "@/hooks/useSystemSettings";

// Hero组件
const Hero = () => {
  const { getThemeColor, getFontSetting, getLayoutSetting } = useSystemSettings();
    
    // 获取配置
    const primaryColor = getThemeColor('primaryColor') || '#ff8ba7';
    const textColor = getThemeColor('textColor') || '#1f2937';
    const heroPadding = getLayoutSetting('heroPadding') || 'py-16 md:py-20';
    const heroFontSize = getFontSetting('heroFontSize') || 'text-4xl md:text-6xl';
    const heroSubtitleSize = getFontSetting('heroSubtitleSize') || 'text-lg md:text-xl';
    const heroButtonSize = getFontSetting('heroButtonSize') || 'px-7 py-3.5';

    // 使用useEffect动态添加事件监听器
    useEffect(() => {
      const handleHeroButtonClick = () => {
        console.log('Hero button clicked!');
        const bookElement = document.getElementById('book');
        if (bookElement) {
          bookElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.log('Book element not found');
        }
      };

      const heroButton = document.getElementById('hero-button');
      if (heroButton) {
        heroButton.addEventListener('click', handleHeroButtonClick);
        return () => {
          heroButton.removeEventListener('click', handleHeroButtonClick);
        };
      }
    }, []);
    
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block pointer-events-none select-none" aria-hidden>
          <Image src="/cover/hero-shapes.svg" alt="" width={800} height={600} className="h-full w-full object-cover opacity-80" />
        </div>
        <div className={`container ${heroPadding}`}>
          <div className="max-w-3xl">
            <span 
              className="inline-block rounded-full bg-primary/20 text-primary px-3 py-1 text-sm font-medium"
              style={{ 
                backgroundColor: `${primaryColor}20`,
                color: primaryColor 
              }}
            >
              心理教练 · 心理成长
            </span>
            <h1 
              className={`heading-hero mt-6 ${heroFontSize} tracking-tight`}
              style={{ color: textColor }}
            >
              连接专业心理教练，开启更好的自己
            </h1>
            <p 
              className={`mt-5 ${heroSubtitleSize} text-foreground/70`}
              style={{ color: `${textColor}70` }}
            >
              为青春、积极、正能量的你，提供温暖、可靠的心理支持与成长陪伴。
            </p>
            <div className="mt-9 flex gap-4">
              <button 
                id="hero-button"
                type="button"
                className={`inline-flex items-center justify-center rounded-full bg-primary text-white font-semibold shadow-sm hover:bg-[color:var(--primary-600)] transition-all duration-300 focus:ring-4 focus:ring-primary/30 hover:shadow-lg hover:scale-105 ${heroButtonSize}`}
                style={{ 
                  backgroundColor: primaryColor,
                  padding: heroButtonSize.includes('px-7') ? '0.875rem 1.75rem' : heroButtonSize.includes('px-6') ? '0.75rem 1.5rem' : '0.625rem 1.25rem'
                }}
              >
                预约体验
              </button>
            </div>
          </div>
        </div>
      </section>
    );
};

// 定义各个板块组件
const sectionComponents = {
  Hero: Hero,

  features: () => (
    <section id="how" className="container py-16 md:py-24">
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {[
          { title: "严选教练", desc: "专业资质与经验审核，持续督导与成长。", icon: "/icons/heart.svg" },
          { title: "隐私保障", desc: "全程加密与隐私保护，安全可信赖。", icon: "/icons/shield.svg" },
          { title: "灵活预约", desc: "多时段可选，线上线下均可，支持随时改期。", icon: "/icons/calendar.svg" },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <Image src={f.icon} alt="" width={24} height={24} aria-hidden className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">{f.title}</h3>
            </div>
            <p className="mt-3 text-foreground/70">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  ),

  callout: () => {
    const CalloutComponent = () => {
      // 使用useEffect动态添加事件监听器
      useEffect(() => {
        const handleCalloutButtonClick = () => {
          console.log('Callout button clicked!');
          const bookElement = document.getElementById('book');
          if (bookElement) {
            bookElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          } else {
            console.log('Book element not found');
          }
        };

        const calloutButton = document.getElementById('callout-button');
        if (calloutButton) {
          calloutButton.addEventListener('click', handleCalloutButtonClick);
          return () => {
            calloutButton.removeEventListener('click', handleCalloutButtonClick);
          };
        }
      }, []);

      return (
        <section className="container py-16 md:py-24">
          <div className="rounded-3xl bg-secondary/20 border border-border p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">让我们一起，走向更有力量的明天</h2>
            <p className="mt-3 text-foreground/70 max-w-3xl">适合情绪压力、关系困扰、自我探索、职业发展等多种主题。年轻、温暖、具备实效的心理教练服务。</p>
            <button 
              id="callout-button"
              type="button"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-[color:var(--primary-600)] transition-all duration-300 focus:ring-4 focus:ring-primary/30 hover:shadow-lg hover:scale-105"
            >
              立即预约
            </button>
          </div>
        </section>
      );
    };

    return <CalloutComponent />;
  },

  services: () => <div id="services"><ServicesSection /></div>,
  team: () => <div id="team"><TeamSection /></div>,
  process: () => <div id="process"><ProcessSection /></div>,
  articles: () => <div id="articles"><ArticlesSection /></div>,
  
  coaches: () => (
    <div className="bg-card/50 border-t border-border">
      <CoachGrid />
    </div>
  ),

  testimonials: () => (
    <div className="bg-background">
      <Testimonials />
    </div>
  ),

  faq: () => (
    <div className="bg-card/50">
      <FAQ />
    </div>
  ),

  booking: () => (
    <div className="bg-background">
      <BookingCTA />
    </div>
  )
};

export default function DynamicHomePage() {
  const { getSectionVisibility, getSectionOrder, loading } = useSystemSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground/70">加载中...</p>
        </div>
      </div>
    );
  }

  const sectionOrder = getSectionOrder();

  return (
    <div 
      id="main" 
      className="min-h-screen" 
      role="main"
      style={{
        background: 'linear-gradient(135deg, #fef7f0 0%, #fce7e6 50%, #f8e8e8 100%)'
      }}
    >
      {sectionOrder.map((sectionKey) => {
        // 检查板块是否应该显示
        const isVisible = getSectionVisibility(`show${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}`);
        
        if (!isVisible) {
          return null;
        }

        // 获取对应的组件
        const SectionComponent = sectionComponents[sectionKey as keyof typeof sectionComponents];
        
        if (!SectionComponent) {
          return null;
        }

        return (
          <div key={sectionKey} className="section-spacing">
            <SectionComponent />
          </div>
        );
      })}
      
      {/* 动态底部 */}
      <ConfigFooter />
    </div>
  );
}
