import { NextRequest, NextResponse } from 'next/server';
import { bookingStorage } from '@/lib/base-storage';

// 从Cookie中获取用户信息
function getUserFromCookie(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const userCookie = cookies['user'];
    if (!userCookie) return null;
    
    const userData = JSON.parse(decodeURIComponent(userCookie));
    return userData;
  } catch (error) {
    console.error('解析用户Cookie失败:', error);
    return null;
  }
}

// 获取当前用户的预约记录
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromCookie(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: '请先登录'
      }, { status: 401 });
    }

    console.log('获取用户预约记录:', user.name);

    // 获取该用户的所有预约记录
    const userBookings = bookingStorage.getByUser(user.phone);
    
    // 按时间排序（最新的在前）
    userBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(`找到 ${userBookings.length} 条预约记录`);
    
    return NextResponse.json({ 
      success: true,
      bookings: userBookings 
    });
  } catch (error) {
    console.error('获取用户预约记录失败:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}

// 取消预约（24小时内）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    const user = getUserFromCookie(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: '请先登录'
      }, { status: 401 });
    }

    if (!bookingId) {
      return NextResponse.json({
        success: false,
        message: '预约ID不能为空'
      }, { status: 400 });
    }

    console.log('用户取消预约请求:', { bookingId, userName: user.name });

    // 先获取预约对象
    const booking = bookingStorage.getById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        message: '预约不存在'
      }, { status: 404 });
    }

    // 检查是否可以取消
    const canCancel = bookingStorage.canCancel(booking);
    if (!canCancel) {
      return NextResponse.json({
        success: false,
        message: '预约创建超过24小时，无法取消'
      }, { status: 400 });
    }

    // 更新预约状态为已取消
    const updatedBooking = bookingStorage.updateStatus(bookingId, 'CANCELLED', '用户主动取消');
    
    if (!updatedBooking) {
      return NextResponse.json({
        success: false,
        message: '预约不存在'
      }, { status: 404 });
    }

    console.log(`预约取消成功: ${bookingId}`);
    
    return NextResponse.json({ 
      success: true,
      message: '预约已成功取消',
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('取消预约失败:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}