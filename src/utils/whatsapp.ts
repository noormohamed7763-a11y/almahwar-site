import { siteConfig } from '@/config/site'

/**
 * تنظيف وتجهيز رقم الهاتف بالصيغة الدولية المعتمدة للمملكة العربية السعودية (966XXXXXXXXX)
 */
export function formatSaudiPhoneNumber(rawPhone?: string): string {
  // إزالة أي أحرف غير رقمية مثل المسافات، الأقواس، علامة الزائد، إلخ.
  const digits = (rawPhone ?? '').replace(/\D/g, '')

  if (digits.startsWith('966')) return digits
  if (digits.startsWith('05')) return `966${digits.slice(1)}`
  if (digits.startsWith('5')) return `966${digits}`

  // إذا كان الرابط كاملاً للواتساب، نستخرج الرقم منه
  if (digits.includes('wa.me')) {
    const numOnly = digits.split('wa.me/')[1]?.replace(/\D/g, '')
    if (numOnly) return formatSaudiPhoneNumber(numOnly)
  }

  throw new Error(`[Configuration Error]: Invalid Saudi phone number: "${rawPhone}"`)
}

/**
 * توليد رابط استفسار عام للواتساب (للهيدر، التذييل، أو الزر العائم)
 */
export function getGeneralConsultationUrl(): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)
  const message = `السلام عليكم ورحمة الله وبركاته،
أود الاستفسار عن خدمات المقاولات والحلول الإنشائية التي تقدمونها، وأرغب في الحصول على استشارة هندسية.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * توليد رابط استفسار مخصص لخدمة معينة
 */
export function getServiceInquiryUrl(serviceTitle: string): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)
  const message = `السلام عليكم ورحمة الله وبركاته،
أود الاستفسار عن تفاصيل وأسعار خدمة: *${serviceTitle}*
وأرغب في معرفة المساحات والتكلفة التقديرية للتنفيذ.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * توليد رابط استفسار مخصص لمشروع معين
 */
export function generateProjectWhatsAppUrl(
  projectTitle: string,
  category?: string,
  location?: string
): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)

  const message = `السلام عليكم ورحمة الله وبركاته،

أرغب في الاستفسار عن تفاصيل تنفيذ المشروع المعروض بالموقع:

📌 *المشروع:* ${projectTitle}
🏷️ *التصنيف:* ${category || 'مقاولات عامة'}
📍 *الموقع المطلوب:* ${location || siteConfig.mainCity}

أرغب في معرفة المواصفات الفنية والتكلفة ومدة التنفيذ المقدرة.
وشكراً لكم.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * توليد رابط إرسال بيانات نموذج التواصل/عرض السعر عبر الواتساب
 */
export function getContactFormWhatsAppUrl(
  name: string,
  phoneInput: string,
  service: string,
  messageText: string
): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)

  const formattedMessage = `*طلب استفسار جديد عبر الموقع الإلكتروني* 🏗️
━━━━━━━━━━━━━━━━━━
👤 *الاسم:* ${name.trim()}
📱 *جوال العميل:* ${phoneInput.trim()}
🛠️ *الخدمة المطلوبة:* ${service.trim()}
📝 *تفاصيل الطلب:*
${messageText.trim()}
━━━━━━━━━━━━━━━━━━`

  return `https://wa.me/${phone}?text=${encodeURIComponent(formattedMessage)}`
}