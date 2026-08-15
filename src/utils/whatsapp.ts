import { siteConfig } from '@/config/site'

export function formatSaudiPhoneNumber(rawPhone?: string): string {
  const digits = (rawPhone ?? '').replace(/\D/g, '')

  if (digits.startsWith('966')) return digits
  if (digits.startsWith('05')) return `966${digits.slice(1)}`
  if (digits.startsWith('5')) return `966${digits}`

  throw new Error(`[Configuration Error]: Invalid Saudi phone number: "${rawPhone}"`)
}

export function generateProjectWhatsAppUrl(
  projectTitle: string,
  category?: string,
  location?: string
): string {
  const phone = formatSaudiPhoneNumber(siteConfig.phone)

  const message = `السلام عليكم،

أرغب في الاستفسار عن تنفيذ المشروع التالي:

📌 *المشروع:* ${projectTitle}
🏷️ *التصنيف:* ${category || 'مقاولات عامة'}
📍 *الموقع المطلوب:* ${location || siteConfig.mainCity}

أرغب في معرفة المواصفات والتكلفة ومدة التنفيذ المتاحة.
وشكراً لكم.`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}