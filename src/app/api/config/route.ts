import { ApiResponse, withErrorHandler, validators, validateFields } from "@/lib/api-utils";
import { configStorage, ConfigItem } from "@/lib/base-storage";

// 获取所有配置
export const GET = withErrorHandler(async (request: Request) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') as ConfigItem['type'] | null;
  
  if (type) {
    const configs = configStorage.getByType(type);
    return ApiResponse.success({ configs });
  }
  
  const allConfigs = configStorage.getAll();
  return ApiResponse.success({ configs: allConfigs });
});

// 创建配置
export const POST = withErrorHandler(async (request: Request) => {
  const { type, title, description, content, image, order, isActive } = await request.json();

  // 验证字段
  const validationErrors = validateFields(
    { type, title, description, content },
    {
      type: [validators.required],
      title: [validators.required, (t: string) => validators.minLength(t, 2)],
      description: [validators.required, (d: string) => validators.minLength(d, 5)],
      content: [validators.required, (c: string) => validators.minLength(c, 10)]
    }
  );

  if (validationErrors) {
    return ApiResponse.validationError(Object.values(validationErrors)[0]);
  }

  // 验证类型
  const validTypes: ConfigItem['type'][] = ['service', 'team', 'process', 'article'];
  if (!validTypes.includes(type)) {
    return ApiResponse.validationError('无效的配置类型');
  }

  // 创建配置
  const newConfig = configStorage.createConfig({
    type,
    title,
    description,
    content,
    image: image || '',
    order: order || 0,
    isActive: isActive !== false
  });

  console.log('新配置创建:', { id: newConfig.id, type: newConfig.type, title: newConfig.title });

  return ApiResponse.success(newConfig, '配置创建成功', 201);
});

// 更新配置
export const PUT = withErrorHandler(async (request: Request) => {
  const { id, title, description, content, image, order, isActive } = await request.json();

  if (!id) {
    return ApiResponse.validationError('配置ID不能为空');
  }

  // 验证字段
  const validationErrors = validateFields(
    { title, description, content },
    {
      title: [validators.required, (t: string) => validators.minLength(t, 2)],
      description: [validators.required, (d: string) => validators.minLength(d, 5)],
      content: [validators.required, (c: string) => validators.minLength(c, 10)]
    }
  );

  if (validationErrors) {
    return ApiResponse.validationError(Object.values(validationErrors)[0]);
  }

  // 更新配置
  const updatedConfig = configStorage.updateConfig(id, {
    title,
    description,
    content,
    image: image || '',
    order: order || 0,
    isActive: isActive !== false
  });

  if (!updatedConfig) {
    return ApiResponse.notFound('配置不存在');
  }

  console.log('配置更新:', { id: updatedConfig.id, type: updatedConfig.type, title: updatedConfig.title });

  return ApiResponse.success(updatedConfig, '配置更新成功');
});

// 删除配置
export const DELETE = withErrorHandler(async (request: Request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return ApiResponse.validationError('配置ID不能为空');
  }

  const deletedConfig = configStorage.delete(id);
  if (!deletedConfig) {
    return ApiResponse.notFound('配置不存在');
  }

  console.log('配置删除:', { id: deletedConfig.id, type: deletedConfig.type, title: deletedConfig.title });

  return ApiResponse.success({ id }, '配置删除成功');
});

