import { cookies } from 'next/headers'
import { getAuthSecret, EnvConfigError } from '@/lib/env'

export const AUTH_COOKIE_NAME = 'almahwar_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 ساعة بالثواني

function getSecretKey(): string {
  return getAuthSecret()
}

/**
 * توليد مفتاح التشفير من الـ Secret
 */
async function getCryptoKey(secret: string) {
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

/**
 * إنشاء توكن مشفر وموقع رقمياً (Signed HMAC Token)
 */
export async function createSignedSessionToken(): Promise<string> {
  const secret = getSecretKey()
  const payload = `admin:${Date.now()}`
  const encoder = new TextEncoder()
  const key = await getCryptoKey(secret)

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  )

  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return `${payload}.${signatureHex}`
}

/**
 * التحقق من صحة التوقيع وصلاحية الجلسة
 * تقبل التوكن كمعامل (لـ Middleware) أو تجلبه تلقائياً من الكوكيز (لـ Route Handlers)
 */
export async function verifySessionToken(token?: string): Promise<boolean> {
  let tokenToVerify = token

  // إذا لم يُمرر التوكن، نحاول قراءته تلقائياً من cookies()
  if (!tokenToVerify) {
    try {
      const cookieStore = await cookies()
      tokenToVerify = cookieStore.get(AUTH_COOKIE_NAME)?.value
    } catch {
      return false
    }
  }

  if (!tokenToVerify || !tokenToVerify.includes('.')) return false

  try {
    const [payload, signatureHex] = tokenToVerify.split('.')
    if (!payload || !signatureHex) return false

    // فحص مدة صلاحية الجلسة (24 ساعة)
    const timestampStr = payload.split(':')[1]
    const timestamp = parseInt(timestampStr, 10)
    if (isNaN(timestamp)) return false

    const now = Date.now()
    const maxAgeMs = SESSION_MAX_AGE * 1000
    if (now - timestamp > maxAgeMs) {
      return false // انتهت صلاحية الجلسة
    }

    const secret = getSecretKey()
    const key = await getCryptoKey(secret)
    const encoder = new TextEncoder()

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
    // الفشل مغلق: أي خطأ يعني «غير مصرَّح».
    // لكن خطأ الإعدادات يُسجَّل صراحةً وإلا صار نشرٌ ناقص الإعداد
    // يبدو كجلسة منتهية ولا يمكن تشخيصه.
    if (error instanceof EnvConfigError) {
      console.error('[أمان] لا يمكن التحقق من الجلسات — إعداد ناقص:', error.message)
    }
    return false
  }
}

/**
 * ضبط كوكي الجلسة المشفر في المتصفح
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * حذف الكوكي عند تسجيل الخروج
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

/**
 * حارس الصلاحيات لكل عملية كتابة على الخادم.
 *
 * ضروري لأن الـ Server Actions في Next.js هي نقاط HTTP عامة مُعرَّفة
 * عالمياً: تُستدعى بـ POST إلى أي مسار عبر ترويسة Next-Action، ولا يمرّ
 * عليها الـ middleware. لذلك كل دالة كتابة يجب أن تتحقق من الجلسة بنفسها،
 * ولا يجوز الاعتماد على حماية المسار /admin إطلاقاً.
 *
 * يرجع true عند وجود جلسة صالحة، و false في كل الحالات الأخرى
 * (بما فيها غياب مفتاح التوقيع) — أي أن الفشل مغلق دائماً.
 */
export async function requireAdmin(): Promise<boolean> {
  try {
    return await verifySessionToken()
  } catch (error) {
    console.error('[أمان] تعذّر التحقق من صلاحية الجلسة:', error)
    return false
  }
}
