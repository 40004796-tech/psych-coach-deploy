"use client";
import Image from "next/image";
import { useConfig } from "@/hooks/useConfig";
import { ConfigItem } from "@/lib/base-storage";

interface ConfigSectionProps {
  type: ConfigItem['type'];
  title: string;
  className?: string;
}

export default function ConfigSection({ type, title, className = "" }: ConfigSectionProps) {
  const { configs, loading, error } = useConfig(type);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-red-500">
          <p>加载失败: {error}</p>
        </div>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>暂无{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 relative">
            {title}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
          </h2>
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        <div className="grid gap-4 md:gap-6 max-w-4xl mx-auto">
          {configs.map((config, index) => {
            // 根据类型和索引选择不同的温馨背景色
            const getBackgroundClass = (type: string, index: number) => {
              const backgrounds = {
                service: [
                  'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200',
                  'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
                  'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
                  'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                ],
                team: [
                  'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
                  'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
                  'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200',
                  'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200'
                ],
                process: [
                  'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
                  'bg-gradient-to-br from-lime-50 to-green-50 border-lime-200',
                  'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200',
                  'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                ],
                article: [
                  'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
                  'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200',
                  'bg-gradient-to-br from-yellow-50 to-lime-50 border-yellow-200',
                  'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                ]
              };
              const typeBackgrounds = backgrounds[type as keyof typeof backgrounds] || backgrounds.service;
              return typeBackgrounds[index % typeBackgrounds.length];
            };

            return (
              <div key={config.id} className={`group rounded-2xl border-2 ${getBackgroundClass(type, index)} p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/30`}>
                <div className="flex items-start gap-3 md:gap-4">
                  {config.image && (
                    <div className="flex-shrink-0">
                      <Image
                        src={config.image}
                        alt={config.title}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300 shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                      <span className="text-xs md:text-sm font-medium text-primary bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{config.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-3 font-medium">{config.description}</p>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{config.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 服务配置组件
export function ServicesSection() {
  return (
    <ConfigSection
      type="service"
      title="我们的服务"
      className="py-8 md:py-10"
    />
  );
}

// 团队配置组件
export function TeamSection() {
  return (
    <ConfigSection
      type="team"
      title="专业团队"
      className="py-8 md:py-10"
    />
  );
}

// 流程配置组件
export function ProcessSection() {
  return (
    <ConfigSection
      type="process"
      title="服务流程"
      className="py-8 md:py-10"
    />
  );
}

// 文章配置组件
export function ArticlesSection() {
  return (
    <ConfigSection
      type="article"
      title="心理知识"
      className="py-8 md:py-10"
    />
  );
}
