import { siteConfig } from '@/config/site'

/**
 * تنظيف وتجهيز رقم الهاتف بالصيغة الدولية المعتمدة للمملكة العربية السعودية (966XXXXXXXXX)
 */
export function formatSaudiPhoneNumber(rawPhone?: string): string {
  const digits = (rawPhone ?? '').replace(/\D/g, '')

  if (digits.startsWith('966')) return digits
  if (digits.startsWith('05')) return `966${digits.slice(1)}`
  if (digits.startsWith('5')) return `966${digits}`

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
  const message = `السلام عليكم ورحمة الله وبركاته 🏗️
أود الاستفسار عن خدمات المقاولات والحلول الإنشائية الهندسية التي تقدمونها عبر الموقع:

🌐 *موقع الشركة:* ${siteConfig.domain}

أرغب في الحصول على استشارة هندسية مجانية وتفاصيل التوريد والتركيب والأسعار التقديرية.
وشكراً لكم.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * توليد رابط استفسار مخصص لخدمة معينة مع الرابط والمواصفات
 */
export function getServiceInquiryUrl(serviceTitle: string, slug?: string): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)
  const serviceUrl = slug
    ? `${siteConfig.domain}/services/${slug}`
    : siteConfig.domain

  const message = `السلام عليكم ورحمة الله وبركاته 🏗️
أود الاستفسار عن تفاصيل وأسعار الخدمة الموضحة بالموقع:

🛠️ *الخدمة:* ${serviceTitle.trim()}
🔗 *رابط الخدمة:* ${serviceUrl}

📌 *الاستفسارات المطلوبة:*
• المواصفات الفنية المعتمدة وكود البناء
• التكلفة التقديرية للمتر المربع
• مدة التنفيذ وشروط الضمان المعتمد

أرغب في الحصول على استشارة هندسية وعرض سعر تفصيلي، وشكراً لكم.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * توليد رابط استفسار مخصص لمشروع معين مع الرابط والمواصفات
 */
export function generateProjectWhatsAppUrl(
  projectTitle: string,
  category?: string,
  location?: string,
  slug?: string
): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)
  const projectUrl = slug
    ? `${siteConfig.domain}/projects/${slug}`
    : siteConfig.domain

  const message = `السلام عليكم ورحمة الله وبركاته 🏗️
أرغب في الاستفسار عن تفاصيل تنفيذ المشروع المعروض بالموقع:

📌 *المشروع:* ${projectTitle.trim()}
🏷️ *التصنيف:* ${category || 'مقاولات عامة'}
📍 *الموقع:* ${location || siteConfig.mainCity}
🔗 *رابط المشروع:* ${projectUrl}

📝 *الاستفسارات الفنية:*
• المواصفات الفنية والمواد المستخدمة في التنفيذ
• إمكانية تنفيذ مشروع مماثل في موقعنا
• التكلفة التقديرية والمدة المطلوبة

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

  const formattedMessage = `*طلب استفسار وعرض سعر جديد عبر الموقع* 🏗️
━━━━━━━━━━━━━━━━━━━━
👤 *اسم العميل:* ${name.trim()}
📱 *جوال العميل:* ${phoneInput.trim()}
🛠️ *الخدمة المطلوبة:* ${service.trim()}
📍 *تفاصيل الطلب والمواصفات:*
${messageText.trim()}
🌐 *مصدر الطلب:* ${siteConfig.domain}
━━━━━━━━━━━━━━━━━━━━`

  return `https://wa.me/${phone}?text=${encodeURIComponent(formattedMessage)}`
}