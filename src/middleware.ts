import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthSecret, EnvConfigError } from '@/lib/env'

export const AUTH_COOKIE_NAME = 'almahwar_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 ساعة

/**
 * نسخة من التحقق تعمل في بيئة Edge.
 *
 * التكرار مع lib/auth.ts مقصود مؤقتاً: ذلك الملف يستورد next/headers
 * وهو غير متاح في الـ middleware. مفتاح التوقيع أصبح يُقرأ الآن من
 * مصدر واحد (lib/env.ts) فلا يمكن أن يتباعد بين الملفين.
 *
 * التوحيد الكامل في دالة نقية مشتركة مؤجَّل إلى مرحلة تنظيف المصادقة.
 */
async function verifyToken(token?: string): Promise<boolean> {
  if (!token || !token.includes('.')) return false

  try {
    const [payload, signatureHex] = token.split('.')
    if (!payload || !signatureHex) return false

    const timestampStr = payload.split(':')[1]
    const timestamp = parseInt(timestampStr, 10)
    if (isNaN(timestamp) || Date.now() - timestamp > SESSION_MAX_AGE * 1000) {
      return false
    }

    const secret = getAuthSecret()
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const match = signatureHex.match(/.{1,2}/g)
    if (!match) return false
    const signatureBytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)))

    return await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(payload)
    )
  } catch (error) {
    // الفشل مغلق دائماً: بلا مفتاح توقيع لا توجد جلسة صالحة.
    // نسجّل خطأ الإعداد صراحةً، وإلا ظهر النشر الناقص كحلقة
    // إعادة توجيه للدخول بلا أي سبب ظاهر.
    if (error instanceof EnvConfigError) {
      console.error('[أمان] الـ middleware لا يستطيع التحقق من الجلسات:', error.message)
    }
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const isValidSession = await verifyToken(sessionCookie)

  // 1. إذا كان في صفحة الدخول ولديه جلسة صالحة -> توجيه للوحة التحكم
  if (pathname === '/admin/login') {
    if (isValidSession) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // 2. إذا حاول الدخول لأي مسار في الإدارة بدون جلسة -> تحويل إجباري للدخول
  if (pathname.startsWith('/admin')) {
    if (!isValidSession) {
      const loginUrl = new URL('/admin/login', request.url)
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('redirect', pathname)
      }
      const response = NextResponse.redirect(loginUrl)
      if (sessionCookie) {
        response.cookies.delete(AUTH_COOKIE_NAME)
      }
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}