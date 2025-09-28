"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "预约管理", icon: "📅" },
    { href: "/admin/users", label: "用户管理", icon: "👥" },
    { href: "/admin/config", label: "配置管理", icon: "⚙️" },
    { href: "/admin/settings", label: "系统设置", icon: "🔧" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
            管
          </div>
          <div>
            <span className="text-xl font-bold text-white">心理教练后台</span>
            <p className="text-xs text-gray-400">管理控制台</p>
          </div>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧操作区 */}
        <div className="hidden md:flex items-center gap-4">
          {/* 返回前台 */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span>🌐</span>
            前台
          </Link>
          
          {/* 用户信息 */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              管
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">管理员</p>
              <p className="text-gray-400 text-xs">admin</p>
            </div>
          </div>

          {/* 退出按钮 */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span>🚪</span>
            退出
          </button>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          aria-label="Menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
          onClick={() => setOpen(!open)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <div className="md:hidden border-t border-gray-700 bg-gray-900">
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-700 pt-4 mt-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg"
              >
                <span>🌐</span>
                返回前台
              </Link>
              
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg text-left"
              >
                <span>🚪</span>
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
