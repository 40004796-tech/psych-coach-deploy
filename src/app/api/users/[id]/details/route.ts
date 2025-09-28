import { ApiResponse, withErrorHandler } from "@/lib/api-utils";
import { userStorage, bookingStorage } from "@/lib/base-storage";

// 获取用户详情（包括预约记录）
export const GET = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return ApiResponse.validationError('用户ID不能为空');
  }

  const user = userStorage.getById(id);
  if (!user) {
    return ApiResponse.notFound('用户不存在');
  }

  // 获取该用户的所有预约记录（优化查询）
  const allBookings = bookingStorage.getAll();
  const userBookings = allBookings.filter(booking => {
    // 使用更精确的匹配条件
    return booking.name === user.name || 
           booking.contact === user.phone ||
           booking.contact === user.email;
  });

  // 按时间排序（最新的在前）- 使用更高效的排序
  userBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 计算统计信息（优化计算）
  const totalBookings = userBookings.length;
  const totalSpent = userBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  const lastBookingDate = totalBookings > 0 ? userBookings[0].createdAt : null;
  const averageSpent = totalBookings > 0 ? Math.round(totalSpent / totalBookings) : 0;

  const userDetails = {
    ...user,
    bookingRecords: userBookings, // 使用更清晰的命名
    stats: {
      totalBookings,
      totalSpent,
      lastBookingDate,
      averageSpent
    }
  };

  return ApiResponse.success({ userDetails });
});
