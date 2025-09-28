"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import { isAuthValid, getCurrentUser, logoutUser } from "@/lib/auth";
import { useSectionSettings } from "@/hooks/useSectionSettings";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 获取导航栏设置
  const { settings: navbarSettings, getThemeColor, getFontSetting, getLayoutSetting } = useSectionSettings('navbar');

  // 检查登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = isAuthValid();
      const user = getCurrentUser();
      setIsLoggedIn(loggedIn);
      setCurrentUser(user);
    };

    checkAuthStatus();
    
    // 监听存储变化
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    // 监听自定义事件（用于同页面内的状态更新）
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  // 获取样式设置
  const backgroundColor = getThemeColor('backgroundColor') || '#fef7ed';
  const textColor = getThemeColor('textColor') || '#1f2937';
  const primaryColor = getThemeColor('primaryColor') || '#ff8ba7';
  const fontSize = getFontSetting('fontSize') || '16px';
  const fontWeight = getFontSetting('fontWeight') || '500';
  const padding = getLayoutSetting('padding') || '16px 0';
  const boxShadow = getLayoutSetting('boxShadow') || '0 1px 3px 0 rgba(0, 0, 0, 0.1)';

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur border-b border-border"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
        padding: padding,
        boxShadow: boxShadow
      }}
    >
      <div className="container flex h-11 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span 
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            心
          </span>
          <span 
            className="text-lg font-bold"
            style={{ color: textColor }}
          >
            心青心理教练
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/#services" 
            className="hover:opacity-80 transition-opacity"
            style={{ 
              color: textColor,
              fontSize: fontSize,
              fontWeight: fontWeight
            }}
          >
            服务
          </Link>
          <Link 
            href="/#team" 
            className="hover:opacity-80 transition-opacity"
            style={{ 
              color: textColor,
              fontSize: fontSize,
              fontWeight: fontWeight
            }}
          >
            团队
          </Link>
          <Link 
            href="/#process" 
            className="hover:opacity-80 transition-opacity"
            style={{ 
              color: textColor,
              fontSize: fontSize,
              fontWeight: fontWeight
            }}
          >
            流程
          </Link>
          <Link 
            href="/#articles" 
            className="hover:opacity-80 transition-opacity"
            style={{ 
              color: textColor,
              fontSize: fontSize,
              fontWeight: fontWeight
            }}
          >
            文章
          </Link>
          
          {isLoggedIn ? (
            <>
              <span 
                className="hover:opacity-80 transition-opacity"
                style={{ 
                  color: textColor,
                  fontSize: fontSize,
                  fontWeight: fontWeight
                }}
              >
                欢迎，{currentUser?.name}
              </span>
              <Link 
                href="/my-bookings" 
                className="hover:opacity-80 transition-opacity"
                style={{ 
                  color: textColor,
                  fontSize: fontSize,
                  fontWeight: fontWeight
                }}
              >
                我的预约
              </Link>
              <button 
                onClick={handleLogout}
                className="hover:opacity-80 transition-opacity"
                style={{ 
                  color: textColor,
                  fontSize: fontSize,
                  fontWeight: fontWeight
                }}
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/register" 
                className="hover:opacity-80 transition-opacity"
                style={{ 
                  color: textColor,
                  fontSize: fontSize,
                  fontWeight: fontWeight
                }}
              >
                注册
              </Link>
              <Link 
                href="/login" 
                className="hover:opacity-80 transition-opacity"
                style={{ 
                  color: textColor,
                  fontSize: fontSize,
                  fontWeight: fontWeight
                }}
              >
                登录
              </Link>
            </>
          )}
          
          <Link 
            href="/#book" 
            className="inline-flex rounded-full px-4 py-2 text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            预约
          </Link>
        </nav>
        <button aria-label="Menu" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border" onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
      {open && (
        <div 
          className="md:hidden border-t border-border"
          style={{ backgroundColor: backgroundColor }}
        >
          <div className="container py-3 flex flex-col gap-2">
            <Link 
              href="/#services" 
              onClick={() => setOpen(false)} 
              className="py-2 hover:opacity-80 transition-opacity"
              style={{ 
                color: textColor,
                fontSize: fontSize,
                fontWeight: fontWeight
              }}
            >
              服务
            </Link>
            <Link 
              href="/#team" 
              onClick={() => setOpen(false)} 
              className="py-2 hover:opacity-80 transition-opacity"
              style={{ 
                color: textColor,
                fontSize: fontSize,
                fontWeight: fontWeight
              }}
            >
              团队
            </Link>
            <Link 
              href="/#process" 
              onClick={() => setOpen(false)} 
              className="py-2 hover:opacity-80 transition-opacity"
              style={{ 
                color: textColor,
                fontSize: fontSize,
                fontWeight: fontWeight
              }}
            >
              流程
            </Link>
            <Link 
              href="/#articles" 
              onClick={() => setOpen(false)} 
              className="py-2 hover:opacity-80 transition-opacity"
              style={{ 
                color: textColor,
                fontSize: fontSize,
                fontWeight: fontWeight
              }}
            >
              文章
            </Link>
            
            {isLoggedIn ? (
              <>
                <span 
                  className="py-2"
                  style={{ 
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight
                  }}
                >
                  欢迎，{currentUser?.name}
                </span>
                <Link 
                  href="/my-bookings" 
                  onClick={() => setOpen(false)} 
                  className="py-2 hover:opacity-80 transition-opacity"
                  style={{ 
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight
                  }}
                >
                  我的预约
                </Link>
                <button 
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="py-2 text-left hover:opacity-80 transition-opacity"
                  style={{ 
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight
                  }}
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/register" 
                  onClick={() => setOpen(false)} 
                  className="py-2 hover:opacity-80 transition-opacity"
                  style={{ 
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight
                  }}
                >
                  注册
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setOpen(false)} 
                  className="py-2 hover:opacity-80 transition-opacity"
                  style={{ 
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: fontWeight
                  }}
                >
                  登录
                </Link>
              </>
            )}
            
            <Link 
              href="/#book" 
              onClick={() => setOpen(false)} 
              className="py-2 inline-flex rounded-full px-4 text-white font-semibold w-max hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              预约
            </Link>
          </div>
        </div>
      )}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
}


