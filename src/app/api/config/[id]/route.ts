import { ApiResponse, withErrorHandler } from "@/lib/api-utils";
import { configStorage } from "@/lib/base-storage";

// 获取单个配置
export const GET = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return ApiResponse.validationError('配置ID不能为空');
  }

  const config = configStorage.getById(id);
  if (!config) {
    return ApiResponse.notFound('配置不存在');
  }

  return ApiResponse.success({ config });
});

// 更新单个配置
export const PUT = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const updates = await request.json();

  if (!id) {
    return ApiResponse.validationError('配置ID不能为空');
  }

  const updatedConfig = configStorage.updateConfig(id, updates);
  if (!updatedConfig) {
    return ApiResponse.notFound('配置不存在');
  }

  console.log('配置更新:', { id: updatedConfig.id, type: updatedConfig.type, title: updatedConfig.title });

  return ApiResponse.success(updatedConfig, '配置更新成功');
});

// 删除单个配置
export const DELETE = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

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


