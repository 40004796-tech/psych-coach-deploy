import { NextRequest, NextResponse } from 'next/server';
import { initializeDefaultConfigs } from '@/lib/base-storage';

export async function POST(request: NextRequest) {
  try {
    // 初始化默认配置数据
    initializeDefaultConfigs();
    
    return NextResponse.json({
      success: true,
      message: '配置数据初始化完成'
    });
  } catch (error) {
    console.error('初始化配置数据失败:', error);
    return NextResponse.json({
      success: false,
      message: '初始化配置数据失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // 检查是否需要初始化
    const { configStorage } = await import('@/lib/base-storage');
    const existingConfigs = configStorage.getAll();
    
    return NextResponse.json({
      success: true,
      data: {
        needsInitialization: existingConfigs.length === 0,
        configCount: existingConfigs.length
      }
    });
  } catch (error) {
    console.error('检查配置状态失败:', error);
    return NextResponse.json({
      success: false,
      message: '检查配置状态失败'
    }, { status: 500 });
  }
}


