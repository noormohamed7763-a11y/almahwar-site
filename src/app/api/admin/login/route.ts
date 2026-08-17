import { NextResponse } from 'next/server'
import {
  createSignedSessionToken,
  setAuthCookie,
  clearAuthCookie,
  verifySessionToken,
} from '@/lib/auth'
import { getAdminPasscode } from '@/lib/env'
import { timingSafeEqual } from '@/lib/security/timing-safe'
import {
  checkRateLimit,
  recordFailure,
  resetLimit,
  getClientIp,
} from '@/lib/security/rate-limit'

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
  const clientIp = getClientIp(request)
  const rateLimitKey = `admin-login:${clientIp}`

  // الحجب أولاً — قبل أي عمل، وقبل قراءة جسم الطلب
  const limit = checkRateLimit(rateLimitKey)
  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60)
    console.warn(`[أمان] حجب محاولات دخول متكررة من ${clientIp}`)

    return NextResponse.json(
      {
        success: false,
        message: `تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة بعد ${minutes} دقيقة.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      }
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const passcode = String(body.passcode || '').trim()

    // يرفع استثناءً في الإنتاج إن كان الرمز ناقصاً أو ضعيفاً
    const configuredPasscode = getAdminPasscode()

    // مقارنة ثابتة الزمن: لا تسرّب طول الرمز الصحيحة عبر زمن الاستجابة
    const isMatch = passcode.length > 0 && (await timingSafeEqual(passcode, configuredPasscode))

    if (!isMatch) {
      recordFailure(rateLimitKey)
      const remaining = Math.max(0, limit.remaining - 1)

      return NextResponse.json(
        {
          success: false,
          message:
            remaining > 0
              ? `رمز المرور غير صحيح. المحاولات المتبقية: ${remaining}`
              : 'رمز المرور غير صحيح. تم تجاوز عدد المحاولات المسموح بها.',
        },
        { status: 401 }
      )
    }

    // نجاح: يُصفَّر السجل حتى لا تُحسب محاولات سابقة على المسؤول الحقيقي
    resetLimit(rateLimitKey)

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