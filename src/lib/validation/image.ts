/**
 * التحقق من ملفات الصور المرفوعة.
 *
 * المبدأ: لا نثق بأي شيء يرسله العميل عن الملف.
 * لا file.type (ترويسة يكتبها العميل) ولا امتداد file.name.
 * النوع يُستنتج من البايتات الأولى للملف نفسه، وهي البيانات
 * الوحيدة التي لا يمكن تزييفها دون تزييف الملف فعلياً.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 ميجابايت
export const MIN_IMAGE_BYTES = 100 // أصغر من ذلك ليس صورة حقيقية

/** الأنواع المسموحة فقط — أي شيء آخر يُرفض */
const ALLOWED = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
} as const

export type AllowedMimeType = keyof typeof ALLOWED

export interface ValidatedImage {
  buffer: Buffer
  /** النوع المُستنتج من البايتات — يُمرَّر للتخزين بدل قيمة العميل */
  contentType: AllowedMimeType
  /** الامتداد المشتق من النوع المُستنتج — لا من اسم الملف الأصلي */
  extension: string
  bytes: number
}

export type ValidationResult =
  | { ok: true; value: ValidatedImage }
  | { ok: false; error: string }

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false
  return signature.every((byte, i) => bytes[offset + i] === byte)
}

function asciiAt(bytes: Uint8Array, offset: number, length: number): string {
  if (bytes.length < offset + length) return ''
  return String.fromCharCode(...bytes.subarray(offset, offset + length))
}

/**
 * استنتاج نوع الصورة من ترويسة الملف.
 * يرجع null إذا لم يطابق أي نوع مسموح.
 */
function sniffImageType(bytes: Uint8Array): AllowedMimeType | null {
  // JPEG: FF D8 FF
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg'
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png'
  }

  // WebP: "RIFF" ... "WEBP"
  if (asciiAt(bytes, 0, 4) === 'RIFF' && asciiAt(bytes, 8, 4) === 'WEBP') {
    return 'image/webp'
  }

  // AVIF: صيغة ISO-BMFF — "ftyp" عند البايت 4، ثم علامة الصيغة
  if (asciiAt(bytes, 4, 4) === 'ftyp') {
    const brand = asciiAt(bytes, 8, 4)
    if (brand === 'avif' || brand === 'avis') {
      return 'image/avif'
    }
  }

  return null
}

/**
 * التحقق الكامل من ملف مرفوع وإرجاع بياناته الموثوقة.
 * لا يرفع استثناءً — يرجع نتيجة صريحة ليعرضها المستدعي للمستخدم.
 */
export async function validateImageFile(file: unknown): Promise<ValidationResult> {
  if (!(file instanceof File)) {
    return { ok: false, error: 'لم يتم إرسال ملف صورة صالح' }
  }

  if (file.size === 0) {
    return { ok: false, error: 'الملف المرفوع فارغ' }
  }

  if (file.size < MIN_IMAGE_BYTES) {
    return { ok: false, error: 'الملف صغير جداً ولا يمثل صورة صالحة' }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    const limitMb = MAX_IMAGE_BYTES / (1024 * 1024)
    return {
      ok: false,
      error: `حجم الصورة ${sizeMb} ميجابايت ويتجاوز الحد المسموح (${limitMb} ميجابايت). يرجى ضغط الصورة أو اختيار صورة أصغر.`,
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // التحقق من التطابق بين الحجم المُعلن والمقروء فعلياً
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'حجم الصورة يتجاوز الحد المسموح' }
  }

  const detected = sniffImageType(new Uint8Array(buffer.subarray(0, 16)))

  if (!detected) {
    return {
      ok: false,
      error: 'صيغة الملف غير مدعومة. الصيغ المسموحة: JPG، PNG، WebP، AVIF',
    }
  }

  return {
    ok: true,
    value: {
      buffer,
      contentType: detected,
      extension: ALLOWED[detected],
      bytes: buffer.byteLength,
    },
  }
}

/**
 * توليد مسار تخزين آمن.
 * الاسم يُبنى بالكامل من قيم نثق بها — لا شيء منه يأتي من العميل،
 * فلا مجال لحروف خاصة أو مسارات نسبية أو امتدادات مزدوجة.
 */
export function buildStoragePath(image: ValidatedImage, prefix = 'projects'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}/${timestamp}-${random}.${image.extension}`
}
