import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Phone, MessageSquare, Wrench } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { listPublishedServices } from '@/lib/servicesRepository'
import { getServiceIcon } from '@/lib/serviceIcons'
import { getGeneralConsultationUrl } from '@/utils/whatsapp'

export const metadata = {
  title: `خدماتنا الهندسية والإنشائية | ${siteConfig.companyName}`,
  description:
    'استكشف خدمات شركة المحور الهندسي للمقاولات: مظلات، سواتر، ساندوتش بانل، ترميم، وإنشاءات معدنية متكاملة بأعلى معايير الجودة والمواصفات السعودية.',
  alternates: {
    canonical: `${siteConfig.domain}/services`,
  },
  openGraph: {
    title: `خدماتنا الهندسية والإنشائية | ${siteConfig.companyName}`,
    description:
      'حلول إنشائية وتشييد متكاملة ومبتكرة بإشراف هندسي وتنفيذ متقن في مختلف مناطق المملكة.',
    url: `${siteConfig.domain}/services`,
    type: 'website',
  },
}

export const revalidate = 3600

export default async function ServicesPage() {
  // الخدمات المنشورة فقط، مرتبة بـ sortOrder — لا بـ createdAt الذي كان
  // يعكس الترتيب ويتغير بين الطلبات عند تطابق الطوابع الزمنية
  const services = await listPublishedServices()

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* شريط التنقل الفرعي */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="tap-area transition hover:text-[#c5a059]">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-[#1a233a]">الخدمات</span>
        </nav>

        {/* رأس الصفحة */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#c5a059]">
            خدماتنا المتميزة
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1a233a] sm:text-4xl">
            حلول إنشائية متكاملة ومبتكرة
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-l from-[#c5a059] to-[#d9b87a]" />
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
            نقدم مجموعة متكاملة من خدمات المقاولات والإنشاءات بإشراف هندسي دقيق، مع الالتزام بأعلى معايير الجودة وسرعة الإنجاز.
          </p>
        </div>

        {/* شبكة عرض الخدمات المصورة */}
        {services.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => {
              const Icon = getServiceIcon(service.icon)
              const coverImage = service.image || '/images/hero/sandwich-panel-2.jpg'

              return (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-2 hover:ring-[#c5a059]/80"
                >
                  <div>
                    {/* صورة غلاف الخدمة التعبيرية */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1a233a]">
                      <Image
                        src={coverImage}
                        alt={service.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a233a]/90 via-[#1a233a]/30 to-transparent" />

                      {/* أيقونة الخدمة العائمة */}
                      <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c5a059] text-[#1a233a] shadow-md transition duration-300 group-hover:scale-110 group-hover:bg-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-base font-extrabold text-[#1a233a] transition group-hover:text-[#c5a059]">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-xs font-bold text-[#1a233a] transition group-hover:bg-[#c5a059] group-hover:text-[#1a233a]"
                    >
                      <span>تفاصيل الخدمة والمواصفات</span>
                      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-3 text-base font-bold text-[#1a233a]">
              لم تُنشر أي خدمة بعد
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              تواصل معنا مباشرة وسنوضح لك كل ما نقدمه من حلول إنشائية.
            </p>
          </div>
        )}

        {/* قسم الدعوة لاتخاذ إجراء (CTA) */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#1a233a] to-[#253252] p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="text-2xl font-extrabold text-[#c5a059] sm:text-3xl">
            هل تحتاج إلى استشارة هندسية أو تنفيذ خدمة خاصة؟
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-gray-300 sm:text-sm">
            فريقنا الهندسي جاهز لمعاينة موقعك، تقديم الحلول الفنية المناسبة، وإعداد عرض سعر تفصيلي مجاناً.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={getGeneralConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-6 py-3.5 text-sm font-bold text-[#1a233a] shadow-md transition hover:brightness-105"
            >
              <MessageSquare className="h-4 w-4" />
              <span>طلب استشارة عبر الواتساب</span>
            </a>

            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Phone className="h-4 w-4 text-[#c5a059]" />
              <span dir="ltr">{siteConfig.phone}</span>
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}