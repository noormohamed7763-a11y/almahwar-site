/**
 * مقارنة نصّين بزمن ثابت لا يتأثر بمحتواهما.
 *
 * المقارنة العادية (a !== b) تتوقف عند أول حرف مختلف، فيصبح زمن
 * التنفيذ دالةً على طول البادئة الصحيحة. هذا يسمح نظرياً باستنتاج
 * رمز المرور حرفاً بحرف من قياس زمن الاستجابة.
 *
 * الحل: نقارن بصمتَي SHA-256 بطول ثابت (32 بايت) عبر XOR تراكمي.
 * فلا الطول ولا المحتوى يؤثران على عدد العمليات.
 */
export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder()

  const [digestA, digestB] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ])

  const bytesA = new Uint8Array(digestA)
  const bytesB = new Uint8Array(digestB)

  // البصمتان دائماً 32 بايت، فالحلقة ثابتة الطول
  let diff = 0
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i]
  }

  return diff === 0
}
