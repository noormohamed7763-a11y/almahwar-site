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
  title: {
    default: 'المحور الهندسي للمقاولات | ساندوتش بانل وهياكل حديدية بجدة والسعودية',
    template: '%s | المحور الهندسي للمقاولات',
  },
  description:
    'شركة المحور الهندسي للمقاولات العامة بجدة والمملكة - توريد وتركيب ساندوتش بانل، بناء هناجر ومستودعات، مظلات وسواتر، وترميم بأعلى مواصفات الجودة.',
  keywords: [
    'ساندوتش بانل جدة',
    'توريد وتركيب ساندوتش بانل',
    'بناء هناجر ومستودعات',
    'مقاول ساندوتش بانل السعودية',
    'مظلات وسواتر جدة',
    'شركة مقاولات جدة',
    'ترميم مباني ومستودعات',
    'المحور الهندسي للمقاولات',
  ],
  metadataBase: new URL(siteConfig.domain),
  alternates: {
    canonical: siteConfig.domain,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'المحور الهندسي للمقاولات | ساندوتش بانل وهياكل حديدية بجدة والسعودية',
    description:
      'شركة المحور الهندسي للمقاولات العامة - توريد وتركيب ساندوتش بانل، بناء هناجر ومستودعات، مظلات وسواتر، وترميم بنظام كود البناء السعودي.',
    url: siteConfig.domain,
    siteName: siteConfig.companyName,
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: `${siteConfig.domain}/images/hero/sandwich-panel-1.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.companyName} - ساندوتش بانل ومقاولات عامة`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المحور الهندسي للمقاولات | ساندوتش بانل وهياكل حديدية بجدة والسعودية',
    description:
      'شركة المحور الهندسي للمقاولات العامة - توريد وتركيب ساندوتش بانل، بناء هناجر ومستودعات، مظلات وسواتر.',
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
