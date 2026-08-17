/**
 * حساب زمن قراءة المقال من متنه.
 *
 * كان زمن القراءة رقماً مكتوباً يدوياً في بيانات كل مقال، فكان يتقادم
 * مع أي تعديل على المتن ويظهر «٦ دقائق» لمقال صار ضعف طوله.
 *
 * 180 كلمة في الدقيقة معدّل معتاد للقراءة بالعربية، والحد الأدنى
 * دقيقة واحدة حتى لا يظهر «0 دقيقة» لمقال قصير.
 */
const WORDS_PER_MINUTE = 180

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** صيغة عربية سليمة للعرض: دقيقة / دقيقتان / 3 دقائق */
export function readingTimeLabel(content: string): string {
  const minutes = readingMinutes(content)
  if (minutes === 0) return ''
  if (minutes === 1) return 'دقيقة قراءة'
  if (minutes === 2) return 'دقيقتان قراءة'
  if (minutes <= 10) return `${minutes} دقائق قراءة`
  return `${minutes} دقيقة قراءة`
}
