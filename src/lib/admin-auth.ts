import { NextRequest } from 'next/server';

// 检查管理员认证
export function checkAdminAuth(request: NextRequest): boolean {
  // 在生产环境中，这里应该检查JWT token或session
  // 目前使用简单的localStorage检查（仅用于演示）
  const authHeader = request.headers.get('authorization');
  
  // 简单的认证检查（实际项目中应该使用更安全的方法）
  if (authHeader === 'Bearer admin-token') {
    return true;
  }
  
  // 检查cookie中的认证信息
  const adminToken = request.cookies.get('adminToken');
  if (adminToken?.value === 'admin-logged-in') {
    return true;
  }
  
  return false;
}

// 管理API认证中间件
export function withAdminAuth<T extends (...args: any[]) => any>(handler: T): T {
  return (async (request: NextRequest, ...args: any[]) => {
    if (!checkAdminAuth(request)) {
      return new Response(
        JSON.stringify({ success: false, message: '未授权访问' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, ...args);
  }) as T;
}
