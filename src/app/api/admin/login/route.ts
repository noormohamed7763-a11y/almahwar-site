import { NextResponse } from 'next/server'
import {
  createSignedSessionToken,
  setAuthCookie,
  clearAuthCookie,
  verifySessionToken,
} from '@/lib/auth'

// 1. التحقق من حالة تسجيل الدخول الحالية (فحص الجلسة)
export async function GET() {
  try {
    const isValid = await verifySessionToken()
    if (!isValid) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      message: 'الجلسة نشطة ومصرح بها',
    })
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}

// 2. تسجيل الدخول والتحقق من رمز المرور
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const passcode = String(body.passcode || '').trim()

    const configuredPasscode = (process.env.ADMIN_PASSCODE || '123456').trim()

    // التحقق من صحة الرمز وعدم تركه فارغاً
    if (!passcode || passcode !== configuredPasscode) {
      return NextResponse.json(
        { success: false, message: 'رمز المرور غير صحيح' },
        { status: 401 }
      )
    }

    // إنشاء التوكن وتعيين الكوكي المحمي
    const token = await createSignedSessionToken()
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
    })
  } catch (error) {
    console.error('Auth POST error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في معالجة طلب تسجيل الدخول' },
      { status: 500 }
    )
  }
}

// 3. تسجيل الخروج ومسح الجلسة
export async function DELETE() {
  try {
    await clearAuthCookie()
    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    })
  } catch (error) {
    console.error('Auth DELETE error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    )
  }
}