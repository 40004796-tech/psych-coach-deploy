// 认证工具函数

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  expiresAt: number;
}

// 登录状态存储键
const AUTH_STORAGE_KEY = 'userAuthState';

// 登录状态有效期（2小时）
const AUTH_DURATION = 2 * 60 * 60 * 1000; // 2小时

// 检查登录状态是否有效
export function isAuthValid(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return false;
    
    const authState: AuthState = JSON.parse(authData);
    const now = Date.now();
    
    // 检查是否过期
    if (now > authState.expiresAt) {
      // 过期了，清除登录状态
      clearAuthState();
      return false;
    }
    
    return authState.isLoggedIn && !!authState.user;
  } catch (error) {
    console.error('检查登录状态失败:', error);
    clearAuthState();
    return false;
  }
}

// 获取当前登录用户
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return null;
    
    const authState: AuthState = JSON.parse(authData);
    const now = Date.now();
    
    // 检查是否过期
    if (now > authState.expiresAt) {
      clearAuthState();
      return null;
    }
    
    return authState.user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    clearAuthState();
    return null;
  }
}

// 设置登录状态
export function setAuthState(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    const expiresAt = Date.now() + AUTH_DURATION;
    const authState: AuthState = {
      isLoggedIn: true,
      user,
      expiresAt
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    
    // 触发自定义事件，通知其他组件状态已更新
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  } catch (error) {
    console.error('设置登录状态失败:', error);
  }
}

// 清除登录状态
export function clearAuthState(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    
    // 触发自定义事件，通知其他组件状态已更新
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  } catch (error) {
    console.error('清除登录状态失败:', error);
  }
}

// 检查用户是否已注册
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const response = await fetch('/api/users');
    if (response.ok) {
      const data = await response.json();
      const users = data.data?.users || [];
      return users.some((user: any) => user.email === email);
    }
    return false;
  } catch (error) {
    console.error('检查用户是否存在失败:', error);
    return false;
  }
}

// 用户登录
export async function loginUser(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const userInfo: User = {
        id: data.data?.id || '',
        name: data.data?.name || '',
        email: data.data?.email || '',
        phone: data.data?.phone || ''
      };
      
      setAuthState(userInfo);
      
      // 设置Cookie以便API使用
      const userCookie = encodeURIComponent(JSON.stringify(userInfo));
      document.cookie = `user=${userCookie}; Path=/; Max-Age=7200`; // 2小时
      
      return { success: true, message: data.message, user: userInfo };
    } else {
      return { success: false, message: data.message || '登录失败' };
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    return { success: false, message: '网络错误，请重试' };
  }
}

// 用户登出
export function logoutUser(): void {
  clearAuthState();
  
  // 清除Cookie
  document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // 刷新页面以清除所有状态
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
