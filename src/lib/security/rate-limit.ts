/**
 * محدّد معدل الطلبات — نافذة منزلقة في الذاكرة.
 *
 * قيد معروف ومقصود: الذاكرة محلية لكل نسخة من الخادم (instance).
 * على منصة serverless مثل Vercel قد تتوزع المحاولات على عدة نسخ،
 * فيصبح الحد الفعلي = الحد × عدد النسخ النشطة.
 *
 * هذا مقبول تماماً لحماية صفحة دخول واحدة: يحوّل التجربة الشاملة
 * من دقائق إلى سنوات. عند الحاجة لضمان صارم، تُستبدل خريطة الذاكرة
 * بـ Upstash Redis بنفس الواجهة تماماً ودون تغيير في المستدعي.
 */

interface Attempt {
  /** توقيتات المحاولات الفاشلة داخل النافذة الحالية */
  failures: number[]
  /** آخر نشاط — يُستخدم للتنظيف */
  lastSeen: number
}

export interface RateLimitConfig {
  /** أقصى عدد محاولات فاشلة مسموح بها داخل النافذة */
  maxFailures: number
  /** طول النافذة بالمللي ثانية */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  /** عدد المحاولات المتبقية قبل الحجب */
  remaining: number
  /** كم ثانية يجب الانتظار قبل المحاولة التالية (0 إذا مسموح) */
  retryAfterSeconds: number
}

export const LOGIN_RATE_LIMIT: RateLimitConfig = {
  maxFailures: 5,
  windowMs: 15 * 60 * 1000, // 15 دقيقة
}

export const PUBLIC_FORM_RATE_LIMIT: RateLimitConfig = {
  maxFailures: 3,
  windowMs: 10 * 60 * 1000, // 10 دقائق (3 طلبات أقصى خلال 10 دقائق)
}

/** سقف حجم الخريطة — يمنع استنزاف الذاكرة عبر ترويسات IP مزيّفة */
const MAX_TRACKED_KEYS = 10_000

const attempts = new Map<string, Attempt>()

/**
 * حذف السجلات المنتهية. يُنفَّذ عند كل فحص — الخريطة صغيرة
 * فالتكلفة مهملة، والبديل (مؤقّت دوري) لا يعمل في بيئة serverless.
 */
function prune(now: number, windowMs: number): void {
  for (const [key, entry] of attempts) {
    if (now - entry.lastSeen > windowMs) {
      attempts.delete(key)
    }
  }

  // إذا بقيت الخريطة متضخمة بعد التنظيف، نُسقط الأقدم نشاطاً
  if (attempts.size > MAX_TRACKED_KEYS) {
    const sorted = [...attempts.entries()].sort((a, b) => a[1].lastSeen - b[1].lastSeen)
    const excess = attempts.size - MAX_TRACKED_KEYS
    for (let i = 0; i < excess; i++) {
      attempts.delete(sorted[i][0])
    }
  }
}

/**
 * فحص ما إذا كان المفتاح مسموحاً له بمحاولة جديدة.
 * لا يسجل شيئاً — التسجيل يحدث في recordFailure عند الفشل فقط،
 * حتى لا تُعاقَب المحاولات الناجحة.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = LOGIN_RATE_LIMIT
): RateLimitResult {
  const now = Date.now()
  prune(now, config.windowMs)

  const entry = attempts.get(key)
  if (!entry) {
    return { allowed: true, remaining: config.maxFailures, retryAfterSeconds: 0 }
  }

  const windowStart = now - config.windowMs
  const recent = entry.failures.filter((t) => t > windowStart)
  entry.failures = recent
  entry.lastSeen = now

  if (recent.length < config.maxFailures) {
    return {
      allowed: true,
      remaining: config.maxFailures - recent.length,
      retryAfterSeconds: 0,
    }
  }

  // محجوب: الانتظار حتى تخرج أقدم محاولة من النافذة
  const oldest = Math.min(...recent)
  const retryAfterMs = oldest + config.windowMs - now

  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
  }
}

/** تسجيل محاولة فاشلة */
export function recordFailure(key: string, config: RateLimitConfig = LOGIN_RATE_LIMIT): void {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry) {
    attempts.set(key, { failures: [now], lastSeen: now })
    return
  }

  const windowStart = now - config.windowMs
  entry.failures = [...entry.failures.filter((t) => t > windowStart), now]
  entry.lastSeen = now
}

/** مسح السجل بعد نجاح المصادقة */
export function resetLimit(key: string): void {
  attempts.delete(key)
}

/**
 * استخراج عنوان العميل من ترويسات الوكيل العكسي.
 *
 * تحذير: هذه الترويسات قابلة للتزييف إذا لم يكن التطبيق خلف وكيل
 * يعيد كتابتها. على Vercel و Cloudflare يُعاد كتابة x-forwarded-for
 * فالقيمة الأولى فيه موثوقة.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
