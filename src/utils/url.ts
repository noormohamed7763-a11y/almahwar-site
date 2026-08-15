import { siteConfig } from '@/config/site'

/**
 * تحويل أي مسار نسبي أو رابط خارجي إلى URL مطلق صحيح للـ SEO و Schema
 */
export function getAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return siteConfig.domain
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  return new URL(pathOrUrl, siteConfig.domain).toString()
}