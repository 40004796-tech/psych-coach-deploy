import { ApiResponse, withErrorHandler, validators, validateFields } from "@/lib/api-utils";
import { userStorage } from "@/lib/base-storage";

// 用户登录
export const POST = withErrorHandler(async (request: Request) => {
  const { email, password } = await request.json();

  // 验证字段
  const validationErrors = validateFields(
    { email, password },
    {
      email: [validators.required, validators.email],
      password: [validators.required, (p: string) => validators.minLength(p, 6)]
    }
  );

  if (validationErrors) {
    return ApiResponse.validationError(Object.values(validationErrors)[0]);
  }

  // 验证密码（内部会检查用户是否存在）
  const user = await userStorage.verifyPassword(email, password);
  if (!user) {
    // 检查是否是用户不存在还是密码错误
    const allUsers = userStorage.getAll();
    const userExists = allUsers.some(u => u.email === email);
    if (!userExists) {
      return ApiResponse.error('用户不存在，请先注册', 404);
    } else {
      return ApiResponse.error('密码错误', 401);
    }
  }

  // 更新最后登录时间
  userStorage.update(user.id, { 
    lastLogin: new Date().toISOString().split('T')[0] 
  });

  // 不输出敏感信息到控制台
  console.log('用户登录:', { id: user.id, name: user.name, email: user.email });

  const response = ApiResponse.success(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    '登录成功'
  );

  // 设置用户Cookie
  const userCookie = encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone
  }));
  
  response.headers.set('Set-Cookie', `user=${userCookie}; Path=/; HttpOnly; Max-Age=7200`); // 2小时
  
  return response;
});
