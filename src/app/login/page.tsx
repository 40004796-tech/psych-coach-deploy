"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthValid, loginUser } from "@/lib/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    if (isAuthValid()) {
      router.push("/");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // 清除错误信息
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        // 登录成功，刷新页面以更新导航栏状态
        window.location.href = "/";
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      setError("网络错误，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            用户登录
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            登录您的心理教练账号
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="请输入您的邮箱"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="请输入您的密码"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "登录中..." : "登录"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-foreground/70">还没有账号？</span>
            <Link href="/register" className="text-primary hover:text-primary-600 font-medium">
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
