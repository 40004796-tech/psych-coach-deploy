"use client";
import { useState } from "react";
import { ServicePackage, getAllServicePackages, formatPrice, formatDuration } from "@/lib/services";

interface ServicePackageSelectorProps {
  selectedPackage: ServicePackage | null;
  onSelectPackage: (pkg: ServicePackage) => void;
  onContinue: () => void;
}

export default function ServicePackageSelector({
  selectedPackage,
  onSelectPackage,
  onContinue
}: ServicePackageSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const packages = getAllServicePackages();

  const filteredPackages = selectedCategory === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.category === selectedCategory);

  const categories = [
    { id: 'all', name: '全部套餐', icon: '📋' },
    { id: 'individual', name: '个人咨询', icon: '👤' },
    { id: 'group', name: '团体咨询', icon: '👥' },
    { id: 'online', name: '在线咨询', icon: '💻' }
  ];

  return (
    <div className="space-y-6">
      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category?.id || Math.random()}
            onClick={() => setSelectedCategory(category?.id || '')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category?.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category?.icon || ''}</span>
            {category?.name || ''}
          </button>
        ))}
      </div>

      {/* 套餐列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg?.id || Math.random()}
            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPackage?.id === pkg?.id
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onSelectPackage(pkg)}
          >
            {/* 热门标签 */}
            {pkg?.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                  最受欢迎
                </span>
              </div>
            )}

            {/* 套餐信息 */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg?.name || ''}</h3>
              <p className="text-gray-600 text-sm mb-4">{pkg?.description || ''}</p>
              
              {/* 价格 */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(pkg?.price || 0)}</span>
                <span className="text-gray-500 ml-2">/{formatDuration(pkg?.duration || 0)}</span>
              </div>
            </div>

            {/* 功能特点 */}
            <div className="space-y-2 mb-6">
              {(pkg?.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            {/* 选择按钮 */}
            <button
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                selectedPackage?.id === pkg?.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selectedPackage?.id === pkg?.id ? '已选择' : '选择此套餐'}
            </button>
          </div>
        ))}
      </div>

      {/* 继续按钮 */}
      {selectedPackage && (
        <div className="text-center pt-6 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-gray-600">已选择套餐：</p>
            <p className="text-lg font-semibold text-gray-900">
              {selectedPackage.name} - {formatPrice(selectedPackage.price)}
            </p>
          </div>
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            <span>继续填写预约信息</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
