import { ApiResponse, withErrorHandler, validators, validateFields } from "@/lib/api-utils";
import { bookingStorage } from "@/lib/base-storage";

export const POST = withErrorHandler(async (request: Request) => {
  const { name, contact, topic, mode, note, servicePackage, totalPrice } = await request.json();

  // 验证字段
  const validationErrors = validateFields(
    { name, contact, topic, mode, servicePackage },
    {
      name: [validators.required],
      contact: [validators.required],
      topic: [validators.required],
      mode: [validators.required],
      servicePackage: [validators.required]
    }
  );

  if (validationErrors) {
    return ApiResponse.validationError(Object.values(validationErrors)[0]);
  }

  const newBooking = bookingStorage.add({
    name,
    contact,
    topic,
    mode,
    note: note || '',
    servicePackage: {
      id: servicePackage?.id || '',
      name: servicePackage?.name || '',
      price: servicePackage?.price || 0,
      duration: servicePackage?.duration || 0,
      features: servicePackage?.features || []
    },
    totalPrice: totalPrice || servicePackage?.price || 0
  });

  console.log('新预约提交:', newBooking);
  return ApiResponse.success(newBooking, '预约提交成功');
});

// 获取所有预约数据（用于后台管理）
export const GET = withErrorHandler(async () => {
  const bookings = bookingStorage.getAll();
  return ApiResponse.success({ bookings });
});


