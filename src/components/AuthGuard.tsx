"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthValid, getCurrentUser, checkUserExists } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  onAuthRequired?: () => void;
}

export default function AuthGuard({ children, onAuthRequired }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 检查是否已登录
      if (isAuthValid()) {
        setIsChecking(false);
        return;
      }

      // 如果没有登录，显示认证模态框
      setShowAuthModal(true);
      setIsChecking(false);
    } catch (error) {
      console.error('检查认证状态失败:', error);
      setIsChecking(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 检查用户是否已注册
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        setAuthType('login');
        setError('');
      } else {
        setAuthType('register');
        setError('该邮箱未注册，请先注册账号');
      }
    } catch (error) {
      setError('检查用户状态失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (authType === 'login') {
        // 模拟登录验证
        if (password.length < 6) {
          setError('密码错误');
          return;
        }

        // 设置登录状态（模拟）
        const user = getCurrentUser();
        if (user) {
          setShowAuthModal(false);
          onAuthRequired?.();
        }
      } else {
        // 跳转到注册页面
        router.push('/register');
      }
    } catch (error) {
      setError('认证失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setError('');
    setEmail('');
    setPassword('');
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">检查登录状态...</p>
        </div>
      </div>
    );
  }

  if (showAuthModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-md mx-4 bg-card rounded-2xl shadow-xl border border-border">
          {/* 关闭按钮 */}
          <button
            onClick={handleCloseModal}
            className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-full transition-all duration-200 group z-50 shadow-lg"
            aria-label="关闭"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="group-hover:scale-110 transition-transform duration-200 mx-auto"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                预约前需要登录
              </h2>
              <p className="mt-2 text-foreground/70">
                请先登录您的账号以继续预约
              </p>
            </div>

            {!authType ? (
              // 邮箱输入步骤
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-foreground/60 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="请输入您的邮箱"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSubmitting ? "检查中..." : "继续"}
                </button>
              </form>
            ) : (
              // 登录/注册步骤
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label htmlFor="auth-email" className="block text-sm font-medium text-foreground mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    id="auth-email"
                    value={email}
                    readOnly
                    className="w-full rounded-xl border border-border bg-gray-50 px-4 py-3 text-foreground/60"
                  />
                </div>

                {authType === 'login' && (
                  <div>
                    <label htmlFor="auth-password" className="block text-sm font-medium text-foreground mb-2">
                      密码
                    </label>
                    <input
                      type="password"
                      id="auth-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-foreground/60 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="请输入密码"
                      required
                    />
                  </div>
                )}

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {isSubmitting ? "处理中..." : authType === 'login' ? "登录" : "去注册"}
                  </button>

                  {authType === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthType('register');
                        setError('');
                      }}
                      className="w-full text-center text-primary hover:text-primary-600 transition-colors"
                    >
                      没有账号？立即注册
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
