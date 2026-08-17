import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp'
import { siteConfig } from '@/config/site'
import { listServicesForNavigation } from '@/lib/servicesRepository'

/**
 * قوقعة الموقع العام.
 *
 * سبب وجود مجموعة المسارات (site): كان شريط التنقل والتذييل في الـ layout
 * الجذري، فكانت لوحة التحكم ترثهما وتظهر بواجهة الموقع العام، مع وسم
 * <main> داخل <main> وهو HTML غير صالح.
 *
 * الأقواس لا تظهر في الرابط — كل المسارات تبقى كما هي حرفياً.
 */
export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // كتالوج الخدمات في البيانات المنظّمة يُبنى من القاعدة: كان يُبنى من
  // مصفوفة ثابتة فينشر لجوجل روابط خدمات غير موجودة
  const services = await listServicesForNavigation()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness', 'Contractor'],
    name: siteConfig.companyName,
    alternateName: siteConfig.companyNameEn,
    url: siteConfig.domain,
    logo: `${siteConfig.domain}/logo.png`,
    image: `${siteConfig.domain}/images/hero/sandwich-panel-1.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'جدة',
      addressRegion: 'منطقة مكة المكرمة',
      addressCountry: 'SA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.5433,
      longitude: 39.1728,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
        ],
        opens: '08:00',
        closes: '22:00',
      },
    ],
    serviceArea: [
      { '@type': 'Place', name: 'جدة' },
      { '@type': 'Place', name: 'مكة المكرمة' },
      { '@type': 'Place', name: 'الرياض' },
      { '@type': 'Place', name: 'المدينة المنورة' },
      { '@type': 'Place', name: 'المملكة العربية السعودية' },
    ],
    sameAs: [siteConfig.whatsappUrl],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات المقاولات والساندوتش بانل',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          url: `${siteConfig.domain}/services/${s.slug}`,
          provider: {
            '@type': 'LocalBusiness',
            name: siteConfig.companyName,
          },
        },
      })),
    },
  }

  return (
    <>
      {/* بيانات منظّمة للموقع العام فقط — لا معنى لها في لوحة التحكم */}
      <script
        key="ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
