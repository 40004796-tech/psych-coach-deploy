"use client";
import { useState } from "react";
import { useConfig } from "@/hooks/useConfig";
import { formatPrice, formatDuration } from "@/lib/services";

export default function ConfigServicePackageSelector({ 
  selectedPackage, 
  onSelectPackage,
  onContinue,
  isUserLoggedIn = false
}: {
  selectedPackage?: any;
  onSelectPackage: (pkg: any) => void;
  onContinue?: () => void;
  isUserLoggedIn?: boolean;
}) {
  const { configs: packages } = useConfig('service_package');

  // 按分类分组套餐
  const categories = [
    { id: 'all', name: '全部套餐', icon: '🌟' },
    { id: 'individual', name: '个人咨询', icon: '👤' },
    { id: 'group', name: '团体咨询', icon: '👥' },
    { id: 'online', name: '在线咨询', icon: '💻' },
    { id: 'offline', name: '线下咨询', icon: '🏢' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPackages = selectedCategory === 'all' 
    ? packages.filter(pkg => pkg.isActive)
    : packages.filter(pkg => pkg.isActive && pkg.extra?.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 分类选择 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* 套餐列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPackage?.id === pkg.extra?.packageId
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => {
              const packageData = {
                id: pkg.extra?.packageId,
                name: pkg.title,
                description: pkg.description,
                price: pkg.extra?.price || 0,
                duration: pkg.extra?.duration || 0,
                features: pkg.extra?.features || [],
                popular: pkg.extra?.popular || false,
                category: pkg.extra?.category
              };
              onSelectPackage(packageData);
              
              // 如果用户已登录，选择套餐后直接进入表单
              if (isUserLoggedIn && onContinue) {
                onContinue();
              }
            }}
          >
            {/* 热门标签 */}
            {pkg.extra?.popular && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                热门
              </div>
            )}

            {/* 套餐信息 */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
              
              {/* 价格 */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(pkg.extra?.price || 0)}</span>
                <span className="text-gray-500 ml-2">/{formatDuration(pkg.extra?.duration || 0)}</span>
              </div>

              {/* 功能特性 */}
              <ul className="text-sm text-gray-600 space-y-1 mb-6">
                {(pkg.extra?.features || []).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* 选择按钮 */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedPackage?.id === pkg.extra?.packageId
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPackage?.id === pkg.extra?.packageId ? '已选择' : '选择此套餐'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 如果没有套餐 */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📦</div>
          <p>暂无{selectedCategory === 'all' ? '可用' : categories.find(c => c.id === selectedCategory)?.name}套餐</p>
        </div>
      )}

      {/* 继续按钮 */}
      {selectedPackage && onContinue && (
        <div className="mt-8 text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span>继续填写详细信息</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
