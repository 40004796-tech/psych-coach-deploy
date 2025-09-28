import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生产环境优化
  //output: 'standalone',
  
  // 图片优化
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  
  // 压缩优化
  compress: true,
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
  
  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 重写规则
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
