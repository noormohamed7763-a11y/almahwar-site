import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifySessionToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value

  // حماية لوحة التحكم
  if (pathname.startsWith('/admin')) {
    const isValidSession = await verifySessionToken(sessionCookie)

    // إذا كان في صفحة تسجيل الدخول وهو مسجل بالفعل بجلسة صحيحة
    if (pathname === '/admin/login') {
      if (isValidSession) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    // إذا حاول الدخول لأي صفحة إدارية بدون توكن صالح
    if (!isValidSession) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      // حذف الكوكي إذا كان مزوراً أو منتهي الصلاحية
      if (sessionCookie) {
        response.cookies.delete(AUTH_COOKIE_NAME)
      }
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}