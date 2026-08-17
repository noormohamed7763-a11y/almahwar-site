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
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          url: `${siteConfig.domain}/services/${s.slug}`,
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
