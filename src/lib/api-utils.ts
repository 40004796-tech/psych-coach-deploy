import { NextResponse } from "next/server";

// 统一的API响应处理
export class ApiResponse {
  static success(data: any, message?: string, status = 200) {
    return NextResponse.json({
      success: true,
      message,
      data
    }, { status });
  }

  static error(message: string, status = 500, details?: any) {
    return NextResponse.json({
      success: false,
      message,
      details
    }, { status });
  }

  static validationError(message: string, details?: any) {
    return this.error(message, 400, details);
  }

  static notFound(message = "资源不存在") {
    return this.error(message, 404);
  }

  static conflict(message: string) {
    return this.error(message, 409);
  }

  static serverError(message = "服务器内部错误") {
    return this.error(message, 500);
  }
}

// 统一的错误处理包装器
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      return ApiResponse.serverError();
    }
  }) as T;
}

// 验证工具
export const validators = {
  email: (email: string) => Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  phone: (phone: string) => Boolean(phone && /^1[3-9]\d{9}$/.test(phone)),
  required: (value: any) => Boolean(value && value.toString().trim().length > 0),
  minLength: (value: string, min: number) => Boolean(value && value.length >= min)
};

// 统一的验证函数
export function validateFields(data: Record<string, any>, rules: Record<string, ((value: any) => boolean)[]>) {
  const errors: Record<string, string> = {};
  
  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];
    
    for (const validator of validators) {
      if (!validator(value)) {
        errors[field] = getValidationMessage(field, validator);
        break;
      }
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

function getValidationMessage(field: string, validator: (value: any) => boolean): string {
  const messages: Record<string, string> = {
    'email': '请输入有效的邮箱地址',
    'phone': '请输入有效的手机号码',
    'required': `${field}是必填项`,
    'minLength': `${field}长度不足`
  };
  
  return messages[validator.name] || `${field}验证失败`;
}
