"use client";
import { useState, useEffect } from "react";
import { loginUser } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        onClose();
        // 刷新页面以更新导航栏状态
        window.location.reload();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('登录失败:', error);
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeChatLogin = () => {
    alert("微信登录功能开发中");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div 
        className="relative w-full max-w-lg mx-4 bg-card rounded-2xl shadow-xl border border-border animate-in zoom-in-95 duration-300"
      >
        {/* 关闭按钮 - 确保在最顶层 */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-full transition-all duration-200 group z-50 shadow-lg"
          aria-label="关闭登录窗口"
          title="关闭"
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

        <div className="p-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {isRegister ? "注册账号" : "登录"}
            </h2>
            <p className="mt-2 text-foreground/70">
              {isRegister ? "创建您的心理教练账号" : "欢迎回来"}
            </p>
          </div>

          {/* 微信登录按钮 */}
          <button
            onClick={handleWeChatLogin}
            className="w-full flex items-center justify-center gap-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 transition-colors mb-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 12.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5 1.5-.7 1.5-1.5zm7 0c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5 1.5-.7 1.5-1.5z"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
            </svg>
            微信登录
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-foreground/60">或</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱地址"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-foreground/60 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-foreground/60 focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-600 transition"
            >
              {isRegister ? "注册" : "登录"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:text-primary-600 transition-colors"
            >
              {isRegister ? "已有账号？去登录" : "没有账号？立即注册"}
            </button>
          </div>


          <div className="mt-4 text-center text-xs text-foreground/60">
            登录即表示您同意我们的
            <a href="#" className="text-primary hover:underline">服务条款</a>
            和
            <a href="#" className="text-primary hover:underline">隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  );
}
