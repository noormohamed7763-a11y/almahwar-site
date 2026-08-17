import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/config/site'

/**
 * الـ layout الجذري: يحتوي فقط ما هو مشترك بين الموقع العام ولوحة التحكم
 * — وسم html وbody والبيانات الوصفية الأساسية.
 *
 * شريط التنقل والتذييل والبيانات المنظّمة انتقلت إلى (site)/layout.tsx
 * حتى لا ترثها لوحة التحكم.
 */
export const metadata: Metadata = {
  title: 'المحور الهندسي للمقاولات | جودة وإتقان',
  description:
    'شركة المحور الهندسي للمقاولات العامة - سندوتش بانل، مظلات وسواتر، بناء عام، وترميم.',
  metadataBase: new URL(siteConfig.domain),
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'المحور الهندسي للمقاولات | جودة وإتقان',
    description:
      'شركة المحور الهندسي للمقاولات العامة - سندوتش بانل، مظلات وسواتر، بناء عام، وترميم.',
    url: siteConfig.domain,
    siteName: siteConfig.companyName,
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: `${siteConfig.domain}/images/hero/sandwich-panel-1.jpg`,
        alt: `${siteConfig.companyName} - معرض الأعمال`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المحور الهندسي للمقاولات | جودة وإتقان',
    description:
      'شركة المحور الهندسي للمقاولات العامة - سندوتش بانل، مظلات وسواتر، بناء عام، وترميم.',
    images: [`${siteConfig.domain}/images/hero/sandwich-panel-1.jpg`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
