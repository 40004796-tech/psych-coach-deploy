# Psych Coach - 生产环境部署包

## 部署说明

这是 psych-coach 应用的生产环境部署包，包含了所有必要的文件和配置。

### 文件结构

- `.next/` - Next.js 构建输出
- `src/` - 源代码
- `public/` - 静态资源
- `data/` - 数据文件
- `package.json` - 生产环境依赖配置
- `next.config.ts` - Next.js 配置
- `vercel.json` - Vercel 部署配置

### 部署选项

#### 1. Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel --prod
```

#### 2. 自托管部署
```bash
# 安装依赖
npm install --production

# 启动服务
npm start
```

#### 3. Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量

确保在生产环境中设置以下环境变量（如果需要）：
- `NODE_ENV=production`
- `CUSTOM_KEY` (根据配置需要)

### 系统要求

- Node.js >= 18.0.0
- 内存: 最少 512MB
- 存储: 最少 100MB

### 性能优化

此部署包已包含以下优化：
- 静态资源压缩
- 图片优化
- CSS 优化
- 安全头部配置
- 独立输出模式 (standalone)

### 构建信息

- 构建时间: $(date)
- Next.js 版本: 15.5.3
- React 版本: 19.1.0
- 构建模式: 生产环境
- 优化器: Turbopack

### 注意事项

1. 确保 `data/` 目录有适当的读写权限
2. 生产环境建议使用 HTTPS
3. 定期备份 `data/` 目录中的数据文件
4. 监控应用性能和错误日志
