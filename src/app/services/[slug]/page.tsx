import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageCircle,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  ChevronLeft,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { services, getServiceBySlug } from '@/data/siteData'
import QuoteForm from '@/components/common/QuoteForm'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: `الخدمة غير موجودة | ${siteConfig.companyName}`,
    }
  }

  const title = `${service.title} | ${siteConfig.companyName}`
  const description = service.shortDescription
  const pageUrl = `${siteConfig.domain}/services/${service.slug}`

  return {
    title,
    description,
    keywords: [service.title, 'مقاولات عامة', 'إنشاءات هندسية', siteConfig.companyName, 'جدة'],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      locale: 'ar_SA',
      type: 'website',
      siteName: siteConfig.companyName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const Icon = service.icon

  const whatsappUrl = `${siteConfig.whatsapp}?text=${encodeURIComponent(
    `السلام عليكم، أرغب في الاستفسار عن خدمة ${service.title} وطلب معاينة هندسية وعرض سعر.`,
  )}`

  // بيانات Schema.org المهيكلة لتحسين ظهور الصفحة في نتائج بحث Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: siteConfig.domain,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'الخدمات',
            item: `${siteConfig.domain}/services`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.title,
            item: `${siteConfig.domain}/services/${service.slug}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: service.title,
        description: service.shortDescription,
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          name: siteConfig.companyName,
          telephone: siteConfig.phone,
          url: siteConfig.domain,
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.address,
            addressLocality: siteConfig.mainCity,
            addressCountry: 'SA',
          },
        },
        areaServed: {
          '@type': 'Country',
          name: 'المملكة العربية السعودية',
        },
      },
    ],
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden bg-[#f8fafc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* قسم الهيدر والمسار التوجيهي */}
      <section className="bg-[#1a233a] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="مسار التنقل"
            className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-400"
          >
            <Link href="/" className="transition hover:text-[#c5a059]">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <Link href="/services" className="transition hover:text-[#c5a059]">
              الخدمات
            </Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="text-[#c5a059]">{service.title}</span>
          </nav>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {Icon && (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#d9b87a] text-[#1a233a] shadow-lg shadow-[#c5a059]/20">
                <Icon className="h-10 w-10" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                {service.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
                {service.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المحتوى الأساسي والنموذج الجانبي */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* العمود الرئيسي لتفاصيل الخدمة */}
          <div className="space-y-8 lg:col-span-8">
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 sm:p-8">
              <h2 className="text-xl font-bold text-[#1a233a] sm:text-2xl">
                نطاق وتفاصيل تنفيذ خدمة {service.title}
              </h2>
              <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
              <p className="mt-6 text-sm leading-8 text-gray-700 whitespace-pre-line sm:text-base">
                {service.fullDescription}
              </p>

              {service.features && service.features.length > 0 && (
                <div className="mt-10 border-t border-gray-100 pt-8">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[#1a233a]">
                    <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                    معايير الجودة والمميزات الهندسية
                  </h3>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 text-xs font-semibold text-gray-700 sm:text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" />
                        <span className="leading-6">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* بطاقة الخدمات ذات الصلة */}
            <div className="rounded-3xl bg-[#1a233a] p-6 text-white shadow-xl sm:p-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#c5a059]">
                    خدمات هندسية وإنشائية أخرى
                  </h3>
                  <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                    استكشف بقية خدماتنا المنفذة وفق أعلى المواصفات الفنية المعتمدة.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-5 py-2.5 text-xs font-bold text-[#1a233a] transition hover:brightness-105"
                >
                  <span>كافة الخدمات</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services
                  .filter((item) => item.id !== service.id)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/services/${item.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#c5a059]/50 hover:bg-white/10"
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 shrink-0 text-[#c5a059] transition group-hover:scale-110" />
                      )}
                      <span className="text-xs font-medium text-gray-200 transition group-hover:text-white sm:text-sm">
                        {item.title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* العمود الجانبي: الاستفسار ونموذج عرض السعر */}
          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            {/* بطاقة الاتصال والواتساب السريع */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#1a233a]">
                استشارة ومعاينة ميدانية
              </h3>
              <p className="mt-2 text-xs leading-6 text-gray-600 sm:text-sm">
                تواصل مع الفريق الهندسي لمناقشة متطلبات مشروعك والحصول على تسعير فوري.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-98"
              >
                <MessageCircle className="h-4 w-4" />
                <span>واتساب مباشر</span>
              </a>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-5 text-xs sm:text-sm">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-3 text-gray-600 transition hover:text-[#c5a059]"
                >
                  <Phone className="h-4 w-4 text-[#c5a059]" />
                  <span dir="ltr">{siteConfig.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-gray-600 transition hover:text-[#c5a059]"
                >
                  <Mail className="h-4 w-4 text-[#c5a059]" />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>

            {/* بطاقة نموذج طلب عرض السعر */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
              <h3 className="flex items-center gap-2 text-base font-bold text-[#1a233a]">
                <FileText className="h-5 w-5 text-[#c5a059]" />
                طلب عرض سعر رسمي
              </h3>
              <p className="mt-1 text-xs leading-6 text-gray-500">
                املأ البيانات وسيتم التواصل معك خلال وقت قصير بعرض سعر تفصيلي.
              </p>
              <div className="mt-5">
                <QuoteForm serviceName={service.title} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}