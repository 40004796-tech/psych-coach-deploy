#!/bin/bash

# Psych Coach 生产环境部署脚本

echo "🚀 开始部署 Psych Coach 应用..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ 错误: 需要 Node.js >= $REQUIRED_VERSION，当前版本: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $NODE_VERSION"

# 安装依赖
echo "📦 安装生产环境依赖..."
npm install --production

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 启动服务
echo "🌐 启动应用服务..."
echo "应用将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务"

npm start
