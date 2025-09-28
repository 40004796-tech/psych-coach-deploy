import { NextRequest, NextResponse } from 'next/server';
import { bookingStorage } from '@/lib/base-storage';

// 更新预约状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    console.log('更新预约状态请求:', { id, status, adminNotes });

    if (!id || !status) {
      return NextResponse.json({
        success: false,
        message: 'ID和状态不能为空'
      }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        message: '无效的预约状态'
      }, { status: 400 });
    }

    const updatedBooking = bookingStorage.updateStatus(id, status, adminNotes);
    
    if (!updatedBooking) {
      return NextResponse.json({
        success: false,
        message: '预约不存在'
      }, { status: 404 });
    }

    console.log(`预约状态更新成功: ${id} -> ${status}`);
    
    return NextResponse.json({ 
      success: true,
      message: '预约状态更新成功',
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('更新预约状态失败:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}

// 设置预约时间
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, scheduledTime, adminNotes } = body;

    console.log('设置预约时间请求:', { id, scheduledTime, adminNotes });

    if (!id || !scheduledTime) {
      return NextResponse.json({
        success: false,
        message: 'ID和预约时间不能为空'
      }, { status: 400 });
    }

    const updatedBooking = bookingStorage.setScheduledTime(id, scheduledTime, adminNotes);
    
    if (!updatedBooking) {
      return NextResponse.json({
        success: false,
        message: '预约不存在'
      }, { status: 404 });
    }

    console.log(`预约时间设置成功: ${id} -> ${scheduledTime}`);
    
    return NextResponse.json({ 
      success: true,
      message: '预约时间设置成功',
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('设置预约时间失败:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}

// 删除预约
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    console.log('删除预约请求:', { id });

    if (!id) {
      return NextResponse.json({
        success: false,
        message: '预约ID不能为空'
      }, { status: 400 });
    }

    const deletedBooking = bookingStorage.deleteBooking(id);
    
    if (!deletedBooking) {
      return NextResponse.json({
        success: false,
        message: '预约不存在'
      }, { status: 404 });
    }

    console.log(`预约删除成功: ${id}`);
    
    return NextResponse.json({ 
      success: true,
      message: '预约删除成功',
      booking: deletedBooking 
    });
  } catch (error) {
    console.error('删除预约失败:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}
