import { ApiResponse, withErrorHandler } from "@/lib/api-utils";
import { userStorage, bookingStorage } from "@/lib/base-storage";

// 删除用户
export const DELETE = withErrorHandler(async (
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

  // 删除用户的所有预约
  const deletedBookings = bookingStorage.deleteByUser(user.phone);
  console.log(`删除用户 ${user.name} 的 ${deletedBookings.length} 条预约记录`);

  const deletedUser = userStorage.delete(id);
  if (!deletedUser) {
    return ApiResponse.serverError('用户删除失败');
  }

  console.log('用户删除成功:', deletedUser);
  return ApiResponse.success({
    user: deletedUser,
    deletedBookingsCount: deletedBookings.length
  }, `用户删除成功，同时删除了 ${deletedBookings.length} 条预约记录`);
});

// 获取单个用户信息
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

  return ApiResponse.success({ user });
});

// 更新用户信息
export const PUT = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const updates = await request.json();

  if (!id) {
    return ApiResponse.validationError('用户ID不能为空');
  }

  const user = userStorage.getById(id);
  if (!user) {
    return ApiResponse.notFound('用户不存在');
  }

  const updatedUser = userStorage.update(id, updates);
  if (!updatedUser) {
    return ApiResponse.serverError('用户更新失败');
  }

  console.log('用户更新成功:', updatedUser);
  return ApiResponse.success(updatedUser, '用户更新成功');
});
