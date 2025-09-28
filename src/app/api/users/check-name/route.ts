import { ApiResponse, withErrorHandler, validators, validateFields } from "@/lib/api-utils";
import { userStorage } from "@/lib/base-storage";

// 检查用户名是否可用
export const POST = withErrorHandler(async (request: Request) => {
  const { name } = await request.json();

  // 验证字段
  const validationErrors = validateFields(
    { name },
    {
      name: [validators.required, (n: string) => validators.minLength(n, 2)]
    }
  );

  if (validationErrors) {
    return ApiResponse.validationError(Object.values(validationErrors)[0]);
  }

  // 检查用户名是否已存在
  const exists = userStorage.nameExists(name);
  
  return ApiResponse.success({
    available: !exists,
    message: exists ? '该用户名已被使用' : '用户名可用'
  });
});

