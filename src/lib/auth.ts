import { cookies } from 'next/headers'

export const AUTH_COOKIE_NAME = 'almahwar_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 ساعة بالثواني

function getSecretKey(): string {
  return process.env.AUTH_SECRET || 'almahwar_secure_auth_secret_key_2026_default'
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
 */
export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token || !token.includes('.')) return false

  try {
    const [payload, signatureHex] = token.split('.')
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
  } catch {
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