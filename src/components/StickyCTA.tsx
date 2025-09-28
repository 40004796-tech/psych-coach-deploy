"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

export default function StickyCTA() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isFloating, setIsFloating] = useState(false); // 是否处于浮动状态
  const dialogRef = useRef<HTMLDivElement>(null);

  // 修复hydration错误 - 确保客户端渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 监听滚动，当滚动到预约区域时隐藏（仅在非浮动状态下）
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      // 如果处于浮动状态，始终保持可见，不执行任何隐藏逻辑
      if (isFloating) {
        return; // 直接返回，不改变isVisible状态
      }
      
      const bookingElement = document.getElementById('book');
      if (bookingElement) {
        const rect = bookingElement.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(!isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted, isFloating]); // 添加isFloating依赖

  // 确保浮动状态下始终可见
  useEffect(() => {
    if (isFloating) {
      setIsVisible(true);
    }
  }, [isFloating]);

  // 监听窗口大小变化，调整浮动位置
  useEffect(() => {
    if (!isFloating) return;
    
    const handleResize = () => {
      if (dialogRef.current) {
        const maxX = window.innerWidth - dialogRef.current.offsetWidth;
        const maxY = window.innerHeight - dialogRef.current.offsetHeight;
        
        setPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY))
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFloating]);

  // 拖拽功能
  const handleMouseDown = (e: React.MouseEvent) => {
    // 避免在按钮和链接上触发拖拽
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    
    if (dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
      // 开始拖拽时进入浮动状态
      setIsFloating(true);
      // 确保浮动状态下始终可见
      setIsVisible(true);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // 限制在视窗内
      const maxX = window.innerWidth - (dialogRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (dialogRef.current?.offsetHeight || 0);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = () => {
    setIsDragging(false);
    // 拖拽结束后保持浮动状态
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, handleMouseMove]);

  const openAIChat = () => {
    window.open('https://lmarena.ai/', '_blank');
  };

  // 重置到原始位置
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setIsFloating(false);
    setIsExpanded(false);
    setIsMinimized(false);
  };

  // 关闭弹框
  const handleClose = () => {
    setIsClosed(true);
  };

  // 最小化弹框
  const handleMinimize = () => {
    setIsMinimized(true);
    setIsExpanded(false);
  };

  // 展开弹框
  const handleExpand = () => {
    setIsMinimized(false);
    setIsExpanded(true);
  };

  // 修复hydration错误 - 确保客户端渲染完成后再显示
  // 浮动状态下始终可见，非浮动状态下根据isVisible决定
  if (!isMounted || isClosed) return null;
  if (!isFloating && !isVisible) return null;

  return (
    <div className={`${isFloating ? 'fixed' : 'fixed inset-x-0 bottom-4'} z-50`}>
      {isFloating ? (
        // 浮动模式
        <div 
          ref={dialogRef}
          className={`max-w-sm rounded-2xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg transition-all duration-300 ease-out ${
            isExpanded ? 'scale-105 shadow-2xl' : 'scale-100'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isMinimized ? 'min-w-[200px]' : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
          }}
          onMouseDown={handleMouseDown}
        >
          {/* 控制按钮区域 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={resetPosition}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="重置位置"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={isMinimized ? handleExpand : handleMinimize}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title={isMinimized ? "展开" : "最小化"}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" : "M20 12H4"} />
                </svg>
              </button>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-red-200 transition-colors"
              title="关闭"
            >
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isMinimized && (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 text-center flex-1' : 'opacity-80'}`}>
                  <p className="text-sm text-foreground/80">
                    {isExpanded ? '准备好开始了吗？预约一次体验，和教练聊聊你的目标。' : '准备好开始了吗？'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold transition-all duration-300 ${
                      isExpanded 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'border border-border text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <svg 
                      className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <Link 
                    href="#book" 
                    className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-[color:var(--primary-600)] transition-all duration-300 hover:scale-105"
                  >
                    预约
                  </Link>
                </div>
              </div>
              
              {/* 展开内容 */}
              <div className={`overflow-hidden transition-all duration-500 ease-out ${
                isExpanded ? 'max-h-[400px] opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}>
                <div className="border-t border-border/50 pt-3">
                  {/* 特色卡片 */}
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="text-lg mb-1">🎯</div>
                      <h4 className="font-semibold text-xs text-foreground">明确目标</h4>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="text-lg mb-1">💬</div>
                      <h4 className="font-semibold text-xs text-foreground">专业指导</h4>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <div className="text-lg mb-1">✨</div>
                      <h4 className="font-semibold text-xs text-foreground">持续成长</h4>
                    </div>
                  </div>

                  {/* AI对话按钮 */}
                  <div className="mb-3 flex justify-center">
                    <button
                      onClick={openAIChat}
                      className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                      style={{ maxWidth: '400px', width: '100%' }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>AI 智能对话</span>
                    </button>
                  </div>

                  {/* 预约按钮 */}
                  <div className="text-center">
                    <Link 
                      href="#book" 
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-xs font-semibold text-white hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <span>开始预约</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        // 原始模式
        <div className="container">
          <div 
            ref={dialogRef}
            className={`mx-auto max-w-3xl rounded-full border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-lg transition-all duration-500 ease-out ${
              isExpanded ? 'scale-105 shadow-2xl' : 'scale-100'
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              position: isDragging ? 'fixed' : 'relative',
              top: isDragging ? 0 : 'auto',
              left: isDragging ? 0 : 'auto',
              zIndex: isDragging ? 9999 : 50
            }}
            onMouseDown={handleMouseDown}
          >
            <div className={`flex items-center justify-between gap-3 ${isExpanded ? 'flex-col' : ''}`}>
              <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 text-center w-full' : 'opacity-80'}`}>
                <p className="hidden sm:block text-sm text-foreground/80">
                  {isExpanded ? '准备好开始了吗？预约一次体验，和教练聊聊你的目标。' : '准备好开始了吗？预约一次体验，和教练聊聊你的目标。'}
                </p>
              </div>
              <div className={`flex items-center gap-3 ${isExpanded ? 'justify-center w-full' : ''}`}>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'border border-border text-foreground hover:bg-foreground/5'
                  }`}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {!isExpanded && (
                  <Link 
                    href="#book" 
                    className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-[color:var(--primary-600)] transition-all duration-300 hover:scale-105"
                  >
                    立即预约
                  </Link>
                )}
              </div>
            </div>
            
            {/* 展开内容 - 美化布局 */}
            <div className={`overflow-hidden transition-all duration-500 ease-out ${
              isExpanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}>
              <div className="border-t border-border/50 pt-4">
                {/* 特色卡片 - 优化布局 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="text-xl mb-2">🎯</div>
                    <h4 className="font-semibold text-xs text-foreground">明确目标</h4>
                    <p className="text-xs text-foreground/70 mt-1">清晰成长方向</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="text-xl mb-2">💬</div>
                    <h4 className="font-semibold text-xs text-foreground">专业指导</h4>
                    <p className="text-xs text-foreground/70 mt-1">获得心理支持</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="text-xl mb-2">✨</div>
                    <h4 className="font-semibold text-xs text-foreground">持续成长</h4>
                    <p className="text-xs text-foreground/70 mt-1">开启更好自己</p>
                  </div>
                </div>

                {/* AI对话按钮 - 缩窄标题框 */}
                <div className="mb-3 flex justify-center">
                  <button
                    onClick={openAIChat}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                    style={{ maxWidth: '500px', width: '100%' }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>AI 智能对话</span>
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>

                {/* 预约按钮 */}
                <div className="text-center">
                  <Link 
                    href="#book" 
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-xs font-semibold text-white hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <span>开始预约</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


