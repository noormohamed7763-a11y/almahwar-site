import { siteConfig } from '@/config/site'

/**
 * إنشاء رابط محادثة واتساب مباشر بنص مخصص
 */
export function createWhatsAppUrl(message: string): string {
  return `${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
}

/**
 * تنسيق أرقام الهواتف للعرض
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\s+/g, ' ')
}

/**
 * التحقق من صحة رقم الجوال السعودي
 */
export function isValidSaudiPhone(phone: string): boolean {
  const saudiPhoneRegex = /^(05|5)(0|1|3|4|5|6|7|8|9)[0-9]{7}$/
  return saudiPhoneRegex.test(phone.replace(/\s+/g, ''))
}