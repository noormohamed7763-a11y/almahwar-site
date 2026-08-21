import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `تواصل معنا | ${siteConfig.companyName}`,
  description:
    'تواصل مع شركة المحور الهندسي للمقاولات العامة بجدة — طلب عرض سعر، استشارة هندسية، أو معاينة ميدانية مجانية عبر الهاتف أو الواتساب.',
  alternates: {
    canonical: `${siteConfig.domain}/contact`,
  },
  openGraph: {
    title: `تواصل معنا | ${siteConfig.companyName}`,
    description:
      'احصل على استشارة هندسية مجانية وعرض سعر تفصيلي لمشروعك — تواصل مباشرة مع فريقنا.',
    url: `${siteConfig.domain}/contact`,
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
