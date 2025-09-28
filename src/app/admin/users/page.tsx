"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import UserDetailsModal from "@/components/UserDetailsModal";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: any | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    user: null,
    isLoading: false
  });
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    userId: string | null;
  }>({
    isOpen: false,
    userId: null
  });
  const router = useRouter();

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data?.users || []);
      }
    } catch (error) {
      console.error("获取用户数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  const handleDeleteUser = (user: any) => {
    setDeleteModal({
      isOpen: true,
      user,
      isLoading: false
    });
  };

  const handleViewDetails = (userId: string) => {
    setDetailsModal({
      isOpen: true,
      userId
    });
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.user) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`/api/users/${deleteModal.user?.id || ''}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 从本地状态中移除用户
        setUsers(prev => prev.filter(user => user?.id !== deleteModal.user?.id));
        
        // 关闭模态框
        setDeleteModal({
          isOpen: false,
          user: null,
          isLoading: false
        });
        
        // 显示成功提示
        alert(`用户 ${deleteModal.user?.name || '未知'} 已成功删除`);
      } else {
        const data = await response.json();
        alert(data.message || "删除用户失败，请重试");
        setDeleteModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("删除用户失败:", error);
      alert("网络错误，请重试");
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const closeDeleteModal = () => {
    if (!deleteModal.isLoading) {
      setDeleteModal({
        isOpen: false,
        user: null,
        isLoading: false
      });
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
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="mt-2 text-gray-600">查看和管理注册用户账号</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">总用户数</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">活跃用户</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">非活跃用户</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {users.filter(u => u.status === 'inactive').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">总预约数</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {users.reduce((sum, user) => sum + user.bookings, 0)}
            </p>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索用户姓名、邮箱或手机号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
              </select>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">用户列表</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-900">用户信息</th>
                  <th className="p-4 font-semibold text-gray-900">联系方式</th>
                  <th className="p-4 font-semibold text-gray-900">注册时间</th>
                  <th className="p-4 font-semibold text-gray-900">最后登录</th>
                  <th className="p-4 font-semibold text-gray-900">预约次数</th>
                  <th className="p-4 font-semibold text-gray-900">状态</th>
                  <th className="p-4 font-semibold text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      没有找到匹配的用户
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user?.id || Math.random()} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{user?.name || ''}</div>
                          <div className="text-sm text-gray-500">ID: {user?.id || ''}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-gray-700">{user?.email || ''}</div>
                          <div className="text-sm text-gray-500">{user?.phone || ''}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        {user?.registerDate ? new Date(user.registerDate).toLocaleDateString() : ''}
                      </td>
                      <td className="p-4 text-gray-700">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : ''}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {user?.bookings || 0} 次
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user?.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {user?.status === 'active' ? '活跃' : '非活跃'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDetails(user?.id || '')}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition"
                          >
                            查看详情
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition"
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

      {/* 删除确认模态框 */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        title="确认删除用户"
        message="您确定要删除这个用户吗？删除后该用户的所有数据将被永久移除。"
        itemName={deleteModal.user ? `${deleteModal.user.name} (${deleteModal.user.email})` : ""}
        isLoading={deleteModal.isLoading}
      />

      {/* 用户详情模态框 */}
      <UserDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, userId: null })}
        userId={detailsModal.userId}
      />
    </div>
  );
}
