import { NextResponse } from 'next/server'
import { createSignedSessionToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { passcode } = body

    const validPasscode = process.env.ADMIN_PASSCODE || '123456'

    if (!passcode || passcode !== validPasscode) {
      return NextResponse.json(
        { success: false, message: 'رمز المرور غير صحيح' },
        { status: 401 }
      )
    }

    // إنشاء التوكن الموقع وتخزينه في كوكي آمن
    const token = await createSignedSessionToken()
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في معالجة الطلب' },
      { status: 500 }
    )
  }
}