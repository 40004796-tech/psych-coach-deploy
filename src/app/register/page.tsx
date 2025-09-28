"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthValid, setAuthState } from "@/lib/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [nameValidation, setNameValidation] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    if (isAuthValid()) {
      router.push("/");
    }
  }, [router]);

  // 用户名校验函数
  const checkNameAvailability = async (name: string) => {
    if (name.length < 2) {
      setNameValidation({ checking: false, available: null, message: "" });
      return;
    }

    setNameValidation({ checking: true, available: null, message: "检查中..." });

    try {
      const response = await fetch("/api/users/check-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (response.ok) {
        setNameValidation({
          checking: false,
          available: data.data?.available,
          message: data.data?.message || ""
        });
      } else {
        setNameValidation({
          checking: false,
          available: false,
          message: "检查失败，请重试"
        });
      }
    } catch (error) {
      setNameValidation({
        checking: false,
        available: false,
        message: "网络错误"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // 清除错误信息

    // 如果是用户名输入，进行实时校验
    if (name === "name") {
      // 防抖处理，避免频繁请求
      const timeoutId = setTimeout(() => {
        checkNameAvailability(value);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 验证用户名是否可用
    if (nameValidation.available === false) {
      setError("用户名不可用，请选择其他用户名");
      setIsLoading(false);
      return;
    }

    // 验证密码确认
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 注册成功后自动登录
        const userInfo = {
          id: data.data?.id || '',
          name: data.data?.name || '',
          email: data.data?.email || '',
          phone: data.data?.phone || ''
        };
        setAuthState(userInfo);
        
        setSuccess(true);
        // 3秒后跳转到首页
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setError(data.message || "注册失败，请重试");
      }
    } catch (error) {
      console.error("注册请求失败:", error);
      setError("网络错误，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">注册成功！</h2>
            <p className="text-green-700 mb-6">
              欢迎加入心理教练平台，3秒后自动跳转到首页...
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              立即体验
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            用户注册
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            创建您的心理教练账号
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                姓名
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                  nameValidation.available === false 
                    ? 'border-red-300 bg-red-50' 
                    : nameValidation.available === true 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-border'
                }`}
                placeholder="请输入您的姓名"
              />
              {nameValidation.message && (
                <div className={`mt-1 text-xs ${
                  nameValidation.available === false 
                    ? 'text-red-600' 
                    : nameValidation.available === true 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                }`}>
                  {nameValidation.checking && <span className="animate-pulse">⏳</span>}
                  {nameValidation.available === true && <span className="text-green-600">✅</span>}
                  {nameValidation.available === false && <span className="text-red-600">❌</span>}
                  {nameValidation.message}
                </div>
              )}
            </div>
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
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                手机号
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="请输入您的手机号"
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
                placeholder="请输入密码（至少6位）"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                确认密码
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="请再次输入密码"
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
              disabled={isLoading || nameValidation.checking || nameValidation.available === false}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "注册中..." : nameValidation.checking ? "检查用户名..." : "注册"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-foreground/70">已有账号？</span>
            <Link href="/login" className="text-primary hover:text-primary-600 font-medium">
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
