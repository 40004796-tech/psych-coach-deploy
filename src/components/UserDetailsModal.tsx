"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/services";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  registerDate: string;
  lastLogin: string;
  status: 'active' | 'inactive';
  bookings: number;
  stats: {
    totalBookings: number;
    totalSpent: number;
    lastBookingDate: string | null;
    averageSpent: number;
  };
  bookingRecords: Array<{
    id: string;
    name: string;
    contact: string;
    topic: string;
    mode: string;
    note: string;
    servicePackage: {
      id: string;
      name: string;
      price: number;
      duration: number;
      features: string[];
    };
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
  }>;
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserDetails = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/users/${userId}/details`);
      const data = await response.json();
      
      if (response.ok) {
        setUserDetails(data.data?.userDetails);
      } else {
        setError(data.message || "获取用户详情失败");
      }
    } catch (error) {
      console.error("获取用户详情失败:", error);
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '待确认';
      case 'CONFIRMED': return '已确认';
      case 'COMPLETED': return '已完成';
      case 'CANCELLED': return '已取消';
      default: return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">用户详情</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">加载中...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchUserDetails}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  重试
                </button>
              </div>
            ) : userDetails ? (
              <div className="space-y-6">
                {/* 用户基本信息 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">姓名</label>
                      <p className="text-gray-900">{userDetails.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">邮箱</label>
                      <p className="text-gray-900">{userDetails.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">手机号</label>
                      <p className="text-gray-900">{userDetails.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">状态</label>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        userDetails.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {userDetails.status === 'active' ? '活跃' : '非活跃'}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">注册时间</label>
                      <p className="text-gray-900">{formatDate(userDetails.registerDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">最后登录</label>
                      <p className="text-gray-900">{formatDate(userDetails.lastLogin)}</p>
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">预约统计</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{userDetails.stats.totalBookings}</div>
                      <div className="text-sm text-gray-600">总预约次数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatPrice(userDetails.stats.totalSpent)}</div>
                      <div className="text-sm text-gray-600">总消费金额</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{formatPrice(userDetails.stats.averageSpent)}</div>
                      <div className="text-sm text-gray-600">平均消费</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {userDetails.stats.lastBookingDate ? '有' : '无'}
                      </div>
                      <div className="text-sm text-gray-600">最近预约</div>
                    </div>
                  </div>
                </div>

                {/* 预约记录 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">预约记录</h3>
                  {userDetails.bookingRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📅</div>
                      <p>暂无预约记录</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userDetails.bookingRecords.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{booking.topic}</h4>
                              <p className="text-sm text-gray-600">{booking.servicePackage.name}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">{formatDate(booking.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">预约方式：</span>
                              <span className="text-gray-900">{booking.mode}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">服务时长：</span>
                              <span className="text-gray-900">{booking.servicePackage.duration}分钟</span>
                            </div>
                            <div>
                              <span className="text-gray-500">服务价格：</span>
                              <span className="text-gray-900 font-semibold">{formatPrice(booking.totalPrice)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">联系方式：</span>
                              <span className="text-gray-900">{booking.contact}</span>
                            </div>
                          </div>
                          
                          {booking.note && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="text-gray-500 text-sm">备注：</span>
                              <p className="text-gray-900 text-sm mt-1">{booking.note}</p>
                            </div>
                          )}
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <span className="text-gray-500 text-sm">服务内容：</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {booking.servicePackage.features.map((feature, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* 底部 */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
