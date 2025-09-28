import { ApiResponse, withErrorHandler, validators, validateFields } from "@/lib/api-utils";
import { userStorage, bookingStorage } from "@/lib/base-storage";

// 用户注册
export const POST = withErrorHandler(async (request: Request) => {
  const { name, email, phone, password } = await request.json();

  // 验证字段
  const validationErrors = validateFields(
    { name, email, phone, password },
    {
      name: [validators.required],
      email: [validators.required, validators.email],
      phone: [validators.required, validators.phone],
      password: [validators.required, (p: string) => validators.minLength(p, 6)]
    }
  );

  if (validationErrors) {
    return ApiResponse.validationError(Object.values(validationErrors)[0]);
  }

  // 检查重复
  if (userStorage.nameExists(name)) {
    return ApiResponse.conflict('该用户名已被使用');
  }

  if (userStorage.emailExists(email)) {
    return ApiResponse.conflict('该邮箱已被注册');
  }

  if (userStorage.phoneExists(phone)) {
    return ApiResponse.conflict('该手机号已被注册');
  }

  // 创建用户（使用安全的密码哈希）
  const newUser = await userStorage.createUser({ name, email, phone }, password);
  
  // 不输出敏感信息到控制台
  console.log('新用户注册:', { id: newUser.id, name: newUser.name, email: newUser.email });

  return ApiResponse.success(
    {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    },
    '注册成功',
    201
  );
});

// 获取所有用户数据（用于后台管理）
export const GET = withErrorHandler(async () => {
  const users = userStorage.getAll();
  const bookings = bookingStorage.getAll();
  
  // 为每个用户动态计算预约次数
  const usersWithBookingCount = users.map(user => {
    // 通过用户名和手机号匹配预约记录
    const userBookings = bookings.filter(booking => 
      booking.name === user.name && booking.contact === user.phone
    );
    
    return {
      ...user,
      bookings: userBookings.length
    };
  });
  
  return ApiResponse.success({ users: usersWithBookingCount });
});
