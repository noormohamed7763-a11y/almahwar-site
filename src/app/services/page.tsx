import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, MessageSquare } from 'lucide-react'
import { services } from '@/data/siteData'
import { siteConfig } from '@/config/site'

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

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* شريط التنقل الفرعي */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="transition hover:text-[#c5a059]">
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

        {/* شبكة عرض الخدمات */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-[#c5a059]/40"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a233a] text-[#c5a059] shadow-sm transition duration-300 group-hover:bg-[#c5a059] group-hover:text-[#1a233a]">
                    {Icon && <Icon className="h-7 w-7" />}
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-[#1a233a]">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
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
              href={`https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن خدماتكم الإنشائية وطلب معاينة هندسية.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#c5a059] to-[#d9b87a] px-6 py-3.5 text-sm font-bold text-[#1a233a] shadow-md transition hover:brightness-105 active:scale-98"
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