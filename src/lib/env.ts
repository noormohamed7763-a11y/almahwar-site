/**
 * قراءة متغيرات البيئة الحساسة بتحقق صارم.
 *
 * القاعدة الأساسية: لا توجد قيم افتراضية إطلاقاً للأسرار.
 * الفشل الصريح والمُشخَّص أفضل بما لا يقاس من موقع يعمل وهو مفتوح بصمت.
 *
 * هذا الملف يجب أن يبقى خالياً من أي import حتى يعمل في بيئة Edge
 * (الـ middleware) وبيئة Node (الـ Server Actions و Route Handlers) معاً.
 */

const MIN_SECRET_LENGTH = 32
const MIN_PASSCODE_LENGTH = 8

/** قيم شائعة يستخدمها المهاجمون في أول محاولة — تُحجب في الإنتاج دائماً */
const WEAK_PASSCODES = new Set([
  '123456',
  '1234',
  '12345',
  '1234567',
  '12345678',
  '000000',
  '111111',
  '123123',
  '654321',
  'admin',
  'admin123',
  'password',
  'passcode',
  'qwerty',
  'abc123',
  'changeme',
  'secret',
  'almahwar',
  'test',
])

/** أسرار كانت مكتوبة في الكود سابقاً — مكشوفة في تاريخ المستودع، تُحجب نهائياً */
const COMPROMISED_SECRETS = new Set([
  'almahwar_secure_auth_secret_key_2026_default',
])

export class EnvConfigError extends Error {
  constructor(variable: string, reason: string) {
    super(
      `[خطأ في إعدادات البيئة] المتغير "${variable}": ${reason}\n` +
        `راجع ملف .env.example ثم اضبط القيمة في .env.local محلياً، ` +
        `وفي إعدادات البيئة على منصة الاستضافة للإنتاج.`
    )
    this.name = 'EnvConfigError'
  }
}

const isProduction = process.env.NODE_ENV === 'production'

/** لمنع تكرار نفس التحذير في كل طلب */
const warnedOnce = new Set<string>()

function warn(key: string, message: string): void {
  if (warnedOnce.has(key)) return
  warnedOnce.add(key)
  console.warn(`[تحذير أمني] ${message}`)
}

/**
 * مفتاح توقيع جلسات الإدارة (HMAC-SHA256).
 * مطلوب في كل البيئات — بدونه لا يمكن التحقق من أي جلسة.
 */
export function getAuthSecret(): string {
  const value = process.env.AUTH_SECRET?.trim()

  if (!value) {
    throw new EnvConfigError('AUTH_SECRET', 'غير معرَّف. لا توجد قيمة افتراضية.')
  }

  if (COMPROMISED_SECRETS.has(value)) {
    throw new EnvConfigError(
      'AUTH_SECRET',
      'هذه القيمة كانت مكتوبة داخل الكود سابقاً وأصبحت مكشوفة. ولّد مفتاحاً جديداً: openssl rand -base64 48'
    )
  }

  if (value.length < MIN_SECRET_LENGTH) {
    const reason = `طوله ${value.length} حرفاً، والحد الأدنى ${MIN_SECRET_LENGTH}.`
    if (isProduction) {
      throw new EnvConfigError('AUTH_SECRET', reason)
    }
    warn('AUTH_SECRET_SHORT', `AUTH_SECRET ${reason} سيمنع تشغيل الإنتاج.`)
  }

  return value
}

/**
 * رمز مرور لوحة التحكم.
 * ملاحظة معمارية: هذا حل مرحلي — يُستبدل بجدول User + كلمة مرور مشفّرة
 * في المرحلة الثانية من خطة إعادة الهيكلة.
 */
export function getAdminPasscode(): string {
  const value = process.env.ADMIN_PASSCODE?.trim()

  if (!value) {
    throw new EnvConfigError('ADMIN_PASSCODE', 'غير معرَّف. لا توجد قيمة افتراضية.')
  }

  const isWeak = WEAK_PASSCODES.has(value.toLowerCase())
  const isTooShort = value.length < MIN_PASSCODE_LENGTH

  if (isWeak) {
    const reason = 'قيمة ضعيفة معروفة تُجرَّب في أول ثانية من أي هجوم.'
    if (isProduction) {
      throw new EnvConfigError('ADMIN_PASSCODE', reason)
    }
    warn('ADMIN_PASSCODE_WEAK', `ADMIN_PASSCODE ${reason} سيمنع تشغيل الإنتاج.`)
  } else if (isTooShort) {
    const reason = `طوله ${value.length} أحرف، والموصى به ${MIN_PASSCODE_LENGTH} على الأقل.`
    if (isProduction) {
      throw new EnvConfigError('ADMIN_PASSCODE', reason)
    }
    warn('ADMIN_PASSCODE_SHORT', `ADMIN_PASSCODE ${reason}`)
  }

  return value
}

/** رابط مشروع Supabase — مطلوب لرفع صور المشاريع */
export function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!value) {
    throw new EnvConfigError('NEXT_PUBLIC_SUPABASE_URL', 'غير معرَّف.')
  }
  return value
}

/**
 * مفتاح الخدمة لـ Supabase — يتجاوز كل قواعد RLS.
 * لا يُستخدم إلا في كود الخادم، ولا يُمرَّر للمتصفح أبداً.
 */
export function getSupabaseServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!value) {
    throw new EnvConfigError('SUPABASE_SERVICE_ROLE_KEY', 'غير معرَّف.')
  }
  return value
}
