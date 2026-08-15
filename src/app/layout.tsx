import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { siteConfig } from '@/config/site'
import { services } from '@/data/siteData'

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    name: siteConfig.companyName,
    alternateName: siteConfig.companyNameEn,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/logo.png`,
    image: `${siteConfig.domain}/images/hero/sandwich-panel-1.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'جدة',
      addressCountry: 'SA',
    },
    serviceArea: [
      { '@type': 'Place', name: 'جدة' },
      { '@type': 'Place', name: 'مكة المكرمة' },
      { '@type': 'Place', name: 'الرياض' },
      { '@type': 'Place', name: 'المدينة المنورة' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات المقاولات',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: `${siteConfig.domain}/services/${s.slug}` },
      })),
    },
  }
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans overflow-x-hidden">
        <script
          key="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}