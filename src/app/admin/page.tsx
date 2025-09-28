"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingBooking, setProcessingBooking] = useState<any>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    totalRevenue: 0,
    topics: {} as Record<string, number>,
    modes: {} as Record<string, number>
  });
  const router = useRouter();

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }

    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/book");
      if (response.ok) {
        const data = await response.json();
        const bookings = data.data?.bookings || [];
        setBookings(bookings);

        // 计算统计信息
        const total = bookings.length;
        const pending = bookings.filter((b: any) => b.status === 'PENDING').length;
        // 只计算有效状态的预约营收（排除已取消的预约）
        const totalRevenue = bookings
          .filter((b: any) => b.status !== 'CANCELLED')
          .reduce((sum: number, booking: any) => 
            sum + (booking.totalPrice || booking.servicePackage?.price || 0), 0
          );

        const topics: Record<string, number> = {};
        const modes: Record<string, number> = {};

        bookings.forEach((booking: any) => {
          topics[booking.topic] = (topics[booking.topic] || 0) + 1;
          modes[booking.mode] = (modes[booking.mode] || 0) + 1;
        });

        setStats({ total, pending, totalRevenue, topics, modes });
      }
    } catch (error) {
      console.error("获取预约数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  const handleProcessBooking = (booking: any) => {
    setProcessingBooking(booking);
    setShowProcessingModal(true);
  };

  const handleUpdateBookingStatus = async (status: string, adminNotes?: string) => {
    if (!processingBooking) return;

    try {
      const response = await fetch(`/api/bookings/${processingBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: processingBooking.id,
          status,
          adminNotes
        }),
      });

      if (response.ok) {
        await fetchBookings(); // 重新获取数据
        setShowProcessingModal(false);
        setProcessingBooking(null);
        alert('预约状态更新成功');
      } else {
        alert('更新失败，请重试');
      }
    } catch (error) {
      console.error('更新预约状态失败:', error);
      alert('更新失败，请重试');
    }
  };

  const handleSetScheduledTime = async (scheduledTime: string, adminNotes?: string) => {
    if (!processingBooking) return;

    try {
      const response = await fetch(`/api/bookings/${processingBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: processingBooking.id,
          scheduledTime,
          adminNotes
        }),
      });

      if (response.ok) {
        await fetchBookings(); // 重新获取数据
        setShowProcessingModal(false);
        setProcessingBooking(null);
        alert('预约时间设置成功');
      } else {
        alert('设置失败，请重试');
      }
    } catch (error) {
      console.error('设置预约时间失败:', error);
      alert('设置失败，请重试');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('确定要删除这个预约吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBookings(); // 重新获取数据
        alert('预约删除成功');
      } else {
        alert('删除失败，请重试');
      }
    } catch (error) {
      console.error('删除预约失败:', error);
      alert('删除失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container py-16 md:py-24">
          <div className="text-center">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">预约管理</h1>
          <p className="mt-2 text-gray-600">预约数据统计与管理</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">总预约数</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">待处理</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
          </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">总营收</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ¥{stats.totalRevenue}
                    </p>
                  </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">热门主题</h3>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              {Object.keys(stats.topics).length > 0
                ? Object.entries(stats.topics).sort(([,a], [,b]) => b - a)[0][0]
                : "暂无数据"
              }
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">偏好形式</h3>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              {Object.keys(stats.modes).length > 0
                ? Object.entries(stats.modes).sort(([,a], [,b]) => b - a)[0][0]
                : "暂无数据"
              }
            </p>
          </div>
        </div>

        {/* 预约列表 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">预约列表</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-900">时间</th>
                  <th className="p-4 font-semibold text-gray-900">姓名</th>
                  <th className="p-4 font-semibold text-gray-900">联系方式</th>
                  <th className="p-4 font-semibold text-gray-900">服务套餐</th>
                  <th className="p-4 font-semibold text-gray-900">价格</th>
                  <th className="p-4 font-semibold text-gray-900">关注主题</th>
                  <th className="p-4 font-semibold text-gray-900">偏好形式</th>
                  <th className="p-4 font-semibold text-gray-900">状态</th>
                  <th className="p-4 font-semibold text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      暂无预约数据
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => (
                    <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4 text-gray-700">
                        {new Date(booking.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-medium text-gray-900">{booking.name}</td>
                      <td className="p-4 text-gray-700">{booking.contact}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.servicePackage?.name || '未知套餐'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.servicePackage?.duration ? `${booking.servicePackage.duration}分钟` : ''}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-600">
                          ¥{booking.totalPrice || booking.servicePackage?.price || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {booking.topic}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          {booking.mode}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'PENDING'
                            ? 'bg-orange-100 text-orange-800'
                            : booking.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'PENDING' ? '待处理' : 
                           booking.status === 'CONFIRMED' ? '已确认' :
                           booking.status === 'COMPLETED' ? '已完成' : '已取消'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleProcessBooking(booking)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                          >
                            处理
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 预约处理模态框 */}
      {showProcessingModal && processingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">处理预约</h3>
              <button
                onClick={() => setShowProcessingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* 预约信息 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">预约信息</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">姓名:</span> {processingBooking.name}</div>
                  <div><span className="text-gray-600">联系方式:</span> {processingBooking.contact}</div>
                  <div><span className="text-gray-600">服务套餐:</span> {processingBooking.servicePackage?.name}</div>
                  <div><span className="text-gray-600">价格:</span> ¥{processingBooking.totalPrice}</div>
                  <div><span className="text-gray-600">关注主题:</span> {processingBooking.topic}</div>
                  <div><span className="text-gray-600">偏好形式:</span> {processingBooking.mode}</div>
                  <div className="col-span-2"><span className="text-gray-600">备注:</span> {processingBooking.note}</div>
                </div>
              </div>

              {/* 状态更新 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">更新状态</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateBookingStatus('CONFIRMED')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    确认预约
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus('COMPLETED')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    标记完成
                  </button>
                  <button
                    onClick={() => handleUpdateBookingStatus('CANCELLED')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    取消预约
                  </button>
                  <button
                    onClick={() => {
                      const scheduledTime = prompt('请输入预约时间 (格式: YYYY-MM-DD HH:mm):');
                      if (scheduledTime) {
                        handleSetScheduledTime(scheduledTime);
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    设置时间
                  </button>
                </div>
              </div>

              {/* 管理员备注 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">添加备注</h4>
                <textarea
                  id="adminNotes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入管理员备注..."
                />
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => {
                      const notes = (document.getElementById('adminNotes') as HTMLTextAreaElement).value;
                      handleUpdateBookingStatus(processingBooking.status, notes);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    保存备注
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}