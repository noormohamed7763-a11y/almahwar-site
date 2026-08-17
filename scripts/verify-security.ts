/**
 * تحقق سريع من منطق الأمان — يُنفَّذ بـ: npx tsx scripts/verify-security.ts
 * ملف مؤقت للتحقق من المرحلة 0، يُحذف بعد المراجعة.
 */
import { validateImageFile, MAX_IMAGE_BYTES } from '../src/lib/validation/image'
import { timingSafeEqual } from '../src/lib/security/timing-safe'
import { checkRateLimit, recordFailure, resetLimit } from '../src/lib/security/rate-limit'

let pass = 0
let fail = 0

function check(name: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓ ${name}`)
    pass++
  } else {
    console.log(`  ✗ ${name}`)
    fail++
  }
}

function fileFrom(bytes: number[], name: string, type: string, padTo = 200): File {
  const padded = [...bytes, ...new Array(Math.max(0, padTo - bytes.length)).fill(0)]
  return new File([new Uint8Array(padded)], name, { type })
}

async function main() {
  console.log('\n── التحقق من الصور (البايتات السحرية) ──')

  const realPng = fileFrom([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 'a.png', 'image/png')
  const r1 = await validateImageFile(realPng)
  check('صورة PNG حقيقية تُقبل', r1.ok && r1.value.contentType === 'image/png')

  const realJpeg = fileFrom([0xff, 0xd8, 0xff, 0xe0], 'a.jpg', 'image/jpeg')
  const r2 = await validateImageFile(realJpeg)
  check('صورة JPEG حقيقية تُقبل', r2.ok && r2.value.extension === 'jpg')

  // الهجوم الأساسي: ملف HTML يدّعي أنه صورة
  const fakeHtml = fileFrom(
    [...Buffer.from('<html><script>alert(1)</script></html>')],
    'evil.png',
    'image/png'
  )
  const r3 = await validateImageFile(fakeHtml)
  check('ملف HTML متنكّر كـ image/png يُرفض', !r3.ok)

  // امتداد مزدوج + نوع مزيّف
  const svgPayload = fileFrom([...Buffer.from('<svg onload="alert(1)">')], 'x.jpg.svg', 'image/jpeg')
  const r4 = await validateImageFile(svgPayload)
  check('حمولة SVG بامتداد مزدوج تُرفض', !r4.ok)

  // النوع المُستنتج يتجاوز ادعاء العميل
  const pngClaimingJpeg = fileFrom(
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    'x.jpg',
    'image/jpeg'
  )
  const r5 = await validateImageFile(pngClaimingJpeg)
  check('النوع الحقيقي يتجاوز ادعاء العميل', r5.ok && r5.value.contentType === 'image/png')

  const oversized = new File(
    [new Uint8Array(MAX_IMAGE_BYTES + 1024)],
    'big.png',
    { type: 'image/png' }
  )
  const r6 = await validateImageFile(oversized)
  check('ملف يتجاوز 5 ميجابايت يُرفض', !r6.ok)

  const empty = new File([], 'e.png', { type: 'image/png' })
  const r7 = await validateImageFile(empty)
  check('ملف فارغ يُرفض', !r7.ok)

  const notAFile = await validateImageFile('نص عادي')
  check('مدخل ليس ملفاً يُرفض', !notAFile.ok)

  console.log('\n── المقارنة ثابتة الزمن ──')
  check('نصّان متطابقان', await timingSafeEqual('SecretPass123', 'SecretPass123'))
  check('نصّان مختلفان', !(await timingSafeEqual('SecretPass123', 'SecretPass124')))
  check('بادئة صحيحة لا تكفي', !(await timingSafeEqual('Secret', 'SecretPass123')))
  check('نص فارغ لا يطابق', !(await timingSafeEqual('', 'SecretPass123')))

  console.log('\n── محدّد المعدل ──')
  const key = 'test:1.2.3.4'
  resetLimit(key)

  check('المحاولة الأولى مسموحة', checkRateLimit(key).allowed)
  for (let i = 0; i < 4; i++) recordFailure(key)
  const after4 = checkRateLimit(key)
  check('4 محاولات فاشلة: لا يزال مسموحاً', after4.allowed && after4.remaining === 1)

  recordFailure(key)
  const after5 = checkRateLimit(key)
  check('5 محاولات فاشلة: محجوب', !after5.allowed)
  check('يعيد مدة انتظار موجبة', after5.retryAfterSeconds > 0)

  resetLimit(key)
  check('النجاح يصفّر السجل', checkRateLimit(key).allowed)

  const other = 'test:9.9.9.9'
  resetLimit(other)
  for (let i = 0; i < 6; i++) recordFailure(other)
  check('عنوان آخر لا يتأثر بحجب غيره', checkRateLimit(key).allowed)
  check('العنوان المخالف محجوب', !checkRateLimit(other).allowed)

  console.log(`\n════ ناجح: ${pass} | فاشل: ${fail} ════\n`)
  process.exit(fail === 0 ? 0 : 1)
}

main()
