'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser } from '@/lib/auth';

interface ServicePackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

interface Booking {
  id: string;
  name: string;
  contact: string;
  topic: string;
  mode: string;
  note?: string;
  servicePackage: ServicePackage;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
  scheduledTime?: string;
  adminNotes?: string;
  userNotes?: string;
  cancelledAt?: string;
  completedAt?: string;
}

const statusMap = {
  PENDING: { text: '待确认', color: 'text-yellow-600 bg-yellow-100' },
  CONFIRMED: { text: '已确认', color: 'text-blue-600 bg-blue-100' },
  COMPLETED: { text: '已完成', color: 'text-green-600 bg-green-100' },
  CANCELLED: { text: '已取消', color: 'text-red-600 bg-red-100' }
};

const formatPrice = (price: number) => `¥${price}`;

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function MyBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-bookings');
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      } else {
        setError(data.message || '获取预约记录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('确定要取消这个预约吗？取消后无法恢复。')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const response = await fetch('/api/user-bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 刷新预约列表
        await fetchBookings();
        alert('预约已成功取消');
      } else {
        alert(data.message || '取消预约失败');
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
    } finally {
      setCancellingId(null);
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24 && booking.status === 'PENDING';
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">我的预约</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎，{user?.name}</span>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                返回首页
              </button>
              <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预约记录</h3>
            <p className="text-gray-500 mb-6">您还没有任何预约记录，快来预约您的第一次心理咨询吧！</p>
            <button
              onClick={() => {
                router.push('/');
                // 等待页面跳转完成后滚动到预约区域
                setTimeout(() => {
                  const element = document.getElementById('book');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // 如果元素还没加载，再等待一下
                    setTimeout(() => {
                      const retryElement = document.getElementById('book');
                      if (retryElement) {
                        retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 500);
                  }
                }, 300);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              立即预约
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">我的预约记录</h2>
              <span className="text-gray-600">共 {bookings.length} 条记录</span>
            </div>

            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {booking.servicePackage.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>预约时间：{formatDateTime(booking.createdAt)}</span>
                        <span>•</span>
                        <span>价格：{formatPrice(booking.totalPrice)}</span>
                        <span>•</span>
                        <span>时长：{booking.servicePackage.duration}分钟</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[booking.status].color}`}>
                      {statusMap[booking.status].text}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">预约详情</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">咨询主题：</span>{booking.topic}</p>
                        <p><span className="font-medium">咨询方式：</span>{booking.mode}</p>
                        <p><span className="font-medium">联系方式：</span>{booking.contact}</p>
                        {booking.note && (
                          <p><span className="font-medium">备注：</span>{booking.note}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">服务内容</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {booking.servicePackage.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {booking.scheduledTime && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">预约时间：</span>
                        {formatDateTime(booking.scheduledTime)}
                      </p>
                    </div>
                  )}

                  {booking.adminNotes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">管理员备注：</span>
                        {booking.adminNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      预约ID: {booking.id}
                    </div>
                    <div className="flex space-x-2">
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? '取消中...' : '取消预约'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}